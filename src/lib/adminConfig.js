// Admin access control — update ADMIN_EMAILS with Ramkumar's real Base44 account email(s).
export const ADMIN_EMAILS = [
  "ramkumar@lookalikesolutions.com",
  "admin@lookalikesolutions.com",
];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}

export function hasAdminRole(user) {
  if (!user) return false;
  return isAdminEmail(user.email) || user.role === "admin";
}