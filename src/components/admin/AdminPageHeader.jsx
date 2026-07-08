import { useMemo } from "react";

export default function AdminPageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, accent = "indigo", to }) {
  const colors = useMemo(
    () => ({
      indigo: { bg: "bg-indigo-50", text: "text-indigo-accent" },
      emerald: { bg: "bg-emerald-50", text: "text-emerald-accent" },
      amber: { bg: "bg-amber-50", text: "text-amber-500" },
      rose: { bg: "bg-rose-50", text: "text-rose-500" },
      sky: { bg: "bg-sky-50", text: "text-sky-500" },
    }),
    []
  );
  const c = colors[accent] || colors.indigo;
  return (
    <div className="glass-cell rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
        {Icon && <Icon className={`w-6 h-6 ${c.text}`} />}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-slate-900 leading-tight">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}