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
    const { entity, operation, id, data } = body;

    if (entity !== "SiteConfig") {
      return Response.json({ error: "Unsupported entity. Use userManagement for SiteUser operations." }, { status: 400 });
    }

    // Resolve the caller's app role from their SiteUser record (server-side)
    const siteUsers = await base44.asServiceRole.entities.SiteUser.filter({ email: user.email });
    const role = resolveAppRole(siteUsers?.[0]);

    if (role !== "super_admin") {
      return Response.json({ error: "Forbidden — Super Admin access required" }, { status: 403 });
    }

    let result;
    if (operation === "update" && id) {
      result = await base44.asServiceRole.entities[entity].update(id, data);
    } else if (operation === "create") {
      result = await base44.asServiceRole.entities[entity].create(data);
    } else {
      return Response.json({ error: "Invalid operation" }, { status: 400 });
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}