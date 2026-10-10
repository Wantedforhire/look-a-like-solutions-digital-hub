// App-level role definitions and access control.
// The source of truth for a user's app role is their SiteUser record (entity).
// Base44 platform role (User.role = "admin"/"user") is separate and is NOT used
// to infer app-level permissions. Access is never granted by email matching.

export const APP_ROLES = ["super_admin", "admin", "manager", "staff"];

export const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
};

// Resolve concrete app role from a SiteUser record.
// Returns null if no record, inactive, or unknown role.
export function resolveRole(siteUser) {
  if (!siteUser) return null;
  if (siteUser.active === false) return null;
  if (!APP_ROLES.includes(siteUser.role)) return null;
  return siteUser.role;
}

// Super-admin-only paths. SiteConfig & SiteUser writes are enforced server-side
// via backend functions (userManagement, superAdminGuard) using asServiceRole.
const SUPER_ADMIN_ONLY_PATHS = [
  "/admin/roles",
  "/admin/settings",
  "/admin/navigation",
];

const MANAGER_ALLOWED_PATHS = [
  "/admin/pages", "/admin/blog", "/admin/insights", "/admin/resources",
  "/admin/gallery", "/admin/services", "/admin/case-studies", "/admin/industries",
  "/admin/testimonials", "/admin/team", "/admin/methodology", "/admin/media",
  "/admin/leads", "/admin/strategy-calls", "/admin/newsletter", "/admin/talent",
  "/admin/careers",
];

const STAFF_ALLOWED_PATHS = [
  "/admin/blog", "/admin/insights", "/admin/leads", "/admin/strategy-calls",
];

export function canAccessPath(role, pathname) {
  if (role === "super_admin") return true;
  if (pathname === "/admin") return true;
  if (role === "admin") {
    return !SUPER_ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p));
  }
  if (role === "manager") {
    return MANAGER_ALLOWED_PATHS.some((p) => pathname.startsWith(p));
  }
  if (role === "staff") {
    return STAFF_ALLOWED_PATHS.some((p) => pathname.startsWith(p));
  }
  return false;
}