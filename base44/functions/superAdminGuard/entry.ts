import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const ADMIN_EMAILS = [
  "ramkumar@lookalikesolutions.com",
  "admin@lookalikesolutions.com",
];

function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}

function resolveRole(siteUser, email) {
  if (isAdminEmail(email)) return "super_admin";
  if (!siteUser) return null;
  if (!siteUser.active) return null;
  if (siteUser.role === "super_admin") return "super_admin";
  if (siteUser.role === "editor") return "editor";
  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { entity, operation, id, data } = body;

    if (entity !== "SiteConfig" && entity !== "SiteUser") {
      return Response.json({ error: "Unsupported entity" }, { status: 400 });
    }

    // Resolve the caller's custom SiteUser role (server-side, not client-side)
    const siteUsers = await base44.asServiceRole.entities.SiteUser.filter({ email: user.email });
    const siteUser = siteUsers?.[0];
    const role = resolveRole(siteUser, user.email);

    if (role !== "super_admin") {
      return Response.json({ error: "Forbidden — Super Admin access required" }, { status: 403 });
    }

    let result;
    if (operation === "update" && id) {
      result = await base44.asServiceRole.entities[entity].update(id, data);
    } else if (operation === "create") {
      result = await base44.asServiceRole.entities[entity].create(data);
    } else if (operation === "delete" && id) {
      result = await base44.asServiceRole.entities[entity].delete(id);
    } else {
      return Response.json({ error: "Invalid operation" }, { status: 400 });
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});