const STYLES = {
  published: "bg-emerald-50 text-emerald-600",
  draft: "bg-amber-50 text-amber-600",
  review: "bg-sky-50 text-sky-600",
  scheduled: "bg-indigo-50 text-indigo-accent",
  archived: "bg-rose-50 text-rose-500",
};

const LABELS = {
  published: "Published",
  draft: "Draft",
  review: "In Review",
  scheduled: "Scheduled",
  archived: "Archived",
};

export default function StatusPill({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${STYLES[status] || "bg-slate-100 text-slate-500"}`}>
      {LABELS[status] || "Draft"}
    </span>
  );
}