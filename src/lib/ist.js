// All scheduling in this CMS is entered and displayed in Indian Standard Time.
const IST_ZONE = "Asia/Kolkata";

// "2026-11-01T10:30" (IST wall clock) -> UTC ISO string
export function istInputToUtc(local) {
  if (!local) return "";
  const date = new Date(`${local}:00+05:30`);
  return isNaN(date.getTime()) ? "" : date.toISOString();
}

// UTC ISO string -> "2026-11-01T10:30" for a datetime-local input in IST
export function utcToIstInput(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}`;
}

export function formatIst(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date) + " IST";
}