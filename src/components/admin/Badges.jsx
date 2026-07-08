export function StatusBadge({ status }) {
  if (!status) return null;
  const map = {
    new: { c: "bg-slate-100 text-slate-600", l: "New" },
    New: { c: "bg-slate-100 text-slate-600", l: "New" },
    draft: { c: "bg-slate-100 text-slate-600", l: "Draft" },
    published: { c: "bg-emerald-50 text-emerald-600", l: "Published" },
    scheduled: { c: "bg-amber-50 text-amber-600", l: "Scheduled" },
    Contacted: { c: "bg-sky-50 text-sky-600", l: "Contacted" },
    Qualified: { c: "bg-indigo-50 text-indigo-accent", l: "Qualified" },
    "Proposal Sent": { c: "bg-violet-50 text-violet-600", l: "Proposal Sent" },
    Converted: { c: "bg-emerald-50 text-emerald-600", l: "Converted" },
    "Not Interested": { c: "bg-rose-50 text-rose-600", l: "Not Interested" },
    closed: { c: "bg-slate-100 text-slate-500", l: "Closed" },
    Shortlisted: { c: "bg-sky-50 text-sky-600", l: "Shortlisted" },
    "Interview Scheduled": { c: "bg-amber-50 text-amber-600", l: "Interview" },
    "Hired For Project": { c: "bg-emerald-50 text-emerald-600", l: "Hired" },
    Rejected: { c: "bg-rose-50 text-rose-600", l: "Rejected" },
    "Future Consideration": { c: "bg-slate-100 text-slate-600", l: "Future" },
  };
  const m = map[status] || { c: "bg-slate-100 text-slate-600", l: status };
  return <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${m.c}`}>{m.l}</span>;
}

export function PriorityBadge({ priority }) {
  if (!priority) return null;
  const map = {
    High: "bg-rose-50 text-rose-600",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-slate-100 text-slate-500",
  };
  return <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${map[priority] || "bg-slate-100 text-slate-500"}`}>{priority}</span>;
}