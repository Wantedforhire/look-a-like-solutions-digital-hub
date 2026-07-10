// Admin access control — ADMIN_EMAILS are Super Admins (Ramkumar).
export const ADMIN_EMAILS = [
  "ramkumar@lookalikesolutions.com",
  "admin@lookalikesolutions.com",
  "lookalike.digitalmarketing@gmail.com",
  "rammarketinghead@gmail.com",
];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}

// Legacy: any admin-level user (super_admin or editor)
export function hasAdminRole(user) {
  if (!user) return false;
  return isAdminEmail(user.email) || user.role === "admin";
}

// Resolve concrete role from SiteUser record + ADMIN_EMAILS fallback
export function resolveRole(siteUser, email) {
  if (isAdminEmail(email)) return "super_admin";
  if (!siteUser) return null;
  if (!siteUser.active) return null;
  if (siteUser.role === "super_admin") return "super_admin";
  if (siteUser.role === "editor") return "editor";
  return null;
}

// Super-admin-only paths. SiteConfig & SiteUser writes are enforced server-side
// via the superAdminGuard backend function (RLS = false on those entities).
const RESTRICTED_EDITOR_PATHS = [
  "/admin/settings",
  "/admin/roles",
  "/admin/navigation",
  "/admin/seo",
];

export function canAccessPath(role, pathname) {
  if (role === "super_admin") return true;
  if (role === "editor") {
    return !RESTRICTED_EDITOR_PATHS.some((p) => pathname.startsWith(p));
  }
  return false;
}