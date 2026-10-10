import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const APP_ROLES = ["super_admin", "admin", "manager", "staff"];

function resolveAppRole(siteUser) {
  if (!siteUser) return null;
  if (siteUser.active === false) return null;
  if (!APP_ROLES.includes(siteUser.role)) return null;
  return siteUser.role;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    // Resolve caller's app role from SiteUser record (server-side, not client claims)
    const callerSiteUsers = await base44.asServiceRole.entities.SiteUser.filter({ email: user.email });
    const callerRole = resolveAppRole(callerSiteUsers?.[0]);
    if (!callerRole) {
      return Response.json({ error: "Forbidden — no app role assigned to your account" }, { status: 403 });
    }

    const canManageUsers = callerRole === "super_admin" || callerRole === "admin";
    const canManageRoles = callerRole === "super_admin";

    // --- LIST: merge Base44 Users with SiteUser records ---
    if (action === "list") {
      if (!canManageUsers) return Response.json({ error: "Forbidden" }, { status: 403 });

      const [users, siteUsers] = await Promise.all([
        base44.asServiceRole.entities.User.list().catch(() => []),
        base44.asServiceRole.entities.SiteUser.list()
      ]);

      const suMap = new Map();
      for (const su of siteUsers) suMap.set(su.email.toLowerCase(), su);

      const merged = (users || []).map((u) => {
        const su = suMap.get(u.email.toLowerCase());
        suMap.delete(u.email.toLowerCase());
        const hasSiteUser = !!su;
        const isActive = su ? su.active !== false : false;
        return {
          userId: u.id,
          email: u.email,
          fullName: u.full_name || su?.name || null,
          platformRole: u.role || null,
          platformCreatedDate: u.created_date || null,
          siteUserId: su?.id || null,
          appRole: su?.role || null,
          active: isActive,
          invitedAt: su?.invitedAt || null,
          invitedByEmail: su?.invitedByEmail || null,
          revokedAt: su?.revokedAt || null,
          name: su?.name || null,
          status: !hasSiteUser ? "no_role" : isActive ? "active" : "revoked",
        };
      });

      // Invited-but-not-yet-registered SiteUsers (no matching Base44 User)
      for (const [, su] of suMap) {
        merged.push({
          userId: null,
          email: su.email,
          fullName: su.name || null,
          platformRole: null,
          platformCreatedDate: null,
          siteUserId: su.id,
          appRole: su.role,
          active: su.active !== false,
          invitedAt: su.invitedAt || null,
          invitedByEmail: su.invitedByEmail || null,
          revokedAt: su.revokedAt || null,
          name: su.name || null,
          status: su.active === false ? "revoked" : "invited",
        });
      }

      return Response.json({ users: merged });
    }

    // --- INVITE: create SiteUser + attempt platform invite ---
    if (action === "invite") {
      if (!canManageUsers) return Response.json({ error: "Forbidden — admin access required to invite users" }, { status: 403 });

      const { email, name, role, message } = body;
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json({ error: "A valid email address is required" }, { status: 400 });
      }
      if (!APP_ROLES.includes(role)) {
        return Response.json({ error: "Invalid role selection" }, { status: 400 });
      }

      const existing = await base44.asServiceRole.entities.SiteUser.filter({ email });
      if (existing?.length > 0) {
        return Response.json({ error: "A user record already exists for this email. Edit the existing user instead." }, { status: 409 });
      }

      const su = await base44.asServiceRole.entities.SiteUser.create({
        email,
        name: name || null,
        role,
        active: true,
        invitedAt: new Date().toISOString(),
        invitedByEmail: user.email,
        invitationMessage: message || null,
      });

      await base44.asServiceRole.entities.AuditLog.create({
        action: "invite",
        targetEmail: email,
        performedByEmail: user.email,
        details: `Role assigned: ${role}${message ? `. Message: ${message}` : ""}`,
      });

      // Attempt platform invitation (creates Base44 account + sends invite email)
      let platformInvited = false;
      let platformError = null;
      try {
        if (typeof base44.users?.inviteUser === "function") {
          await base44.users.inviteUser(email, "user");
          platformInvited = true;
        }
      } catch (e) {
        platformError = e.message || String(e);
      }

      return Response.json({ success: true, siteUserId: su.id, platformInvited, platformError });
    }

    // --- UPDATE ROLE ---
    if (action === "updateRole") {
      if (!canManageRoles) return Response.json({ error: "Forbidden — Super Admin access required to change roles" }, { status: 403 });

      const { email, role } = body;
      if (!APP_ROLES.includes(role)) return Response.json({ error: "Invalid role" }, { status: 400 });

      const existing = await base44.asServiceRole.entities.SiteUser.filter({ email });
      const su = existing?.[0];
      if (!su) return Response.json({ error: "User not found" }, { status: 404 });

      // Block self-demotion
      if (su.role === "super_admin" && role !== "super_admin" && email.toLowerCase() === user.email.toLowerCase()) {
        return Response.json({ error: "You cannot change your own role" }, { status: 400 });
      }
      // Block demoting the last active super admin
      if (su.role === "super_admin" && role !== "super_admin") {
        const activeSuperAdmins = await base44.asServiceRole.entities.SiteUser.filter({ role: "super_admin", active: true });
        if (activeSuperAdmins.length <= 1) {
          return Response.json({ error: "Cannot demote the last active Super Admin" }, { status: 400 });
        }
      }

      const oldRole = su.role;
      await base44.asServiceRole.entities.SiteUser.update(su.id, { role });

      await base44.asServiceRole.entities.AuditLog.create({
        action: "role_change",
        targetEmail: email,
        performedByEmail: user.email,
        details: `${oldRole} → ${role}`,
      });

      return Response.json({ success: true });
    }

    // --- REVOKE ACCESS ---
    if (action === "revoke") {
      if (!canManageRoles) return Response.json({ error: "Forbidden — Super Admin access required to revoke access" }, { status: 403 });

      const { email } = body;
      const existing = await base44.asServiceRole.entities.SiteUser.filter({ email });
      const su = existing?.[0];
      if (!su) return Response.json({ error: "User not found" }, { status: 404 });

      if (email.toLowerCase() === user.email.toLowerCase()) {
        return Response.json({ error: "You cannot revoke your own access" }, { status: 400 });
      }
      if (su.role === "super_admin" && su.active !== false) {
        const activeSuperAdmins = await base44.asServiceRole.entities.SiteUser.filter({ role: "super_admin", active: true });
        if (activeSuperAdmins.length <= 1) {
          return Response.json({ error: "Cannot revoke the last active Super Admin" }, { status: 400 });
        }
      }

      await base44.asServiceRole.entities.SiteUser.update(su.id, {
        active: false,
        revokedAt: new Date().toISOString(),
        revokedByEmail: user.email,
      });

      await base44.asServiceRole.entities.AuditLog.create({
        action: "revoke",
        targetEmail: email,
        performedByEmail: user.email,
        details: `Access revoked`,
      });

      return Response.json({ success: true });
    }

    // --- RESTORE ACCESS ---
    if (action === "restore") {
      if (!canManageRoles) return Response.json({ error: "Forbidden — Super Admin access required" }, { status: 403 });

      const { email } = body;
      const existing = await base44.asServiceRole.entities.SiteUser.filter({ email });
      const su = existing?.[0];
      if (!su) return Response.json({ error: "User not found" }, { status: 404 });

      await base44.asServiceRole.entities.SiteUser.update(su.id, {
        active: true,
        revokedAt: null,
        revokedByEmail: null,
      });

      await base44.asServiceRole.entities.AuditLog.create({
        action: "restore",
        targetEmail: email,
        performedByEmail: user.email,
        details: `Access restored`,
      });

      return Response.json({ success: true });
    }

    // --- RESEND INVITATION ---
    if (action === "resendInvite") {
      if (!canManageUsers) return Response.json({ error: "Forbidden — admin access required" }, { status: 403 });

      const { email } = body;
      let platformInvited = false;
      let platformError = null;
      try {
        if (typeof base44.users?.inviteUser === "function") {
          await base44.users.inviteUser(email, "user");
          platformInvited = true;
        }
      } catch (e) {
        platformError = e.message || String(e);
      }

      await base44.asServiceRole.entities.AuditLog.create({
        action: "resend_invite",
        targetEmail: email,
        performedByEmail: user.email,
        details: `Resent platform invitation${platformError ? ` (error: ${platformError})` : ""}`,
      });

      return Response.json({ success: true, platformInvited, platformError });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}