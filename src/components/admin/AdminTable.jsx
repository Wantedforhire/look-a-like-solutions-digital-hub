import { useState, useMemo } from "react";

export default function AdminTable({ columns, rows, searchKeys = [], searchPlaceholder = "Search...", toolbar, emptyMessage = "No records found." }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query || searchKeys.length === 0) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] || "").toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  return (
    <div className="glass-cell rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-100">
        {searchKeys.length > 0 ? (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm w-full sm:w-64 focus:border-indigo-accent focus:ring-2 focus:ring-indigo-accent/20 outline-none"
          />
        ) : (
          <div />
        )}
        {toolbar}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">{emptyMessage}</td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 text-slate-700 ${c.className || ""}`}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ActionButton({ onClick, children, variant = "default" }) {
  const variants = {
    default: "text-slate-600 hover:bg-slate-100",
    danger: "text-rose-500 hover:bg-rose-50",
    primary: "text-indigo-accent hover:bg-indigo-50",
  };
  return (
    <button onClick={onClick} className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${variants[variant]}`}>
      {children}
    </button>
  );
}