const CARDS = [
  { key: "total", label: "Total Posts", color: "bg-slate-100 text-slate-600" },
  { key: "published", label: "Published", color: "bg-emerald-50 text-emerald-600" },
  { key: "draft", label: "Drafts", color: "bg-amber-50 text-amber-600" },
  { key: "review", label: "In Review", color: "bg-sky-50 text-sky-600" },
  { key: "scheduled", label: "Scheduled", color: "bg-indigo-50 text-indigo-accent" },
  { key: "archived", label: "Archived", color: "bg-rose-50 text-rose-500" },
];

export default function BlogStatCards({ counts = {}, loading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      {CARDS.map((c) => (
        <div key={c.key} className="glass-cell rounded-2xl p-4">
          <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center mb-3`}>
            <span className="text-xs font-extrabold">{loading ? "–" : counts[c.key] ?? 0}</span>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
        </div>
      ))}
    </div>
  );
}