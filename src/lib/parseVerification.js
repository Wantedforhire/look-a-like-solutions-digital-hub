/**
 * Normalizes a search-engine verification input.
 * Accepts either a raw verification key or a full `<meta ... content="KEY" ... />` tag
 * (single- or double-quoted, self-closing or not) and returns only the key.
 */
export function parseVerificationValue(input) {
  if (!input) return "";
  const raw = String(input).trim();
  if (!raw) return "";
  // Extract content="..." or content='...' from a full meta tag.
  const match = raw.match(/content\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  if (match) return (match[1] ?? match[2] ?? "").trim();
  return raw;
}