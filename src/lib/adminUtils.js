import { format } from "date-fns";

export function slugify(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function exportToCsv(filename, rows, columns) {
  const header = columns.map((c) => `"${(c.label || c.key).replace(/"/g, '""')}"`).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          let val = row[c.key];
          if (val && typeof val === "object") val = JSON.stringify(val);
          val = val == null ? "" : String(val);
          // CSV formula injection: prefix a single quote if the cell starts with a formula trigger.
          if (/^[=+\-@\t\r]/.test(val)) val = `'${val}`;
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");
  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatDate(value, fmt = "MMM d, yyyy") {
  if (!value) return "—";
  try {
    return format(new Date(value), fmt);
  } catch {
    return String(value);
  }
}

export function bytesToSize(bytes) {
  if (!bytes) return "—";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}