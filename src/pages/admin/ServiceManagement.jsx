import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getIcon } from "@/lib/iconMap";
import { Plus, Pencil, Trash2, ArrowRight } from "lucide-react";

const categories = ["Search & Discovery", "Social & Engagement", "Performance & Paid", "Creative & Brand", "Technical & Development", "Content & Strategy", "Reputation & Trust", "AI & Emerging"];

export default function ServiceManagement() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-services", "all"],
    queryFn: () => base44.entities.Service.list("order"),
  });
  const delMutation = useMutation({
    mutationFn: (id) => base44.entities.Service.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  return (
    <div>
      <AdminPageHeader title="Services" subtitle="Manage the services offered on your website."
        actions={<Link to="/admin/services/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Service</Link>} />
      {isLoading ? <p className="text-slate-400 text-sm">Loading...</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <div key={s.id} className="glass-cell rounded-2xl p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center"><Icon className="w-5 h-5 text-indigo-accent" /></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.category}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 flex-1 mb-4">{s.shortDescription}</p>
                {s.metricLabel && <p className="text-xs font-semibold text-emerald-600 mb-4">{s.metricLabel}</p>}
                <div className="flex gap-2 mt-auto">
                  <Link to={`/admin/services/edit/${s.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"><Pencil className="w-3.5 h-3.5" /> Edit</Link>
                  <button onClick={() => confirm(`Delete "${s.title}"?`) && delMutation.mutate(s.id)} className="px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && <p className="text-slate-400 text-sm col-span-full">No services yet.</p>}
        </div>
      )}
    </div>
  );
}