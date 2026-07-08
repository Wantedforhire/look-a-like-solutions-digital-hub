import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { ActionButton } from "@/components/admin/AdminTable";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { formatDate } from "@/lib/adminUtils";

export default function CaseStudyManagement() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-case-studies", "all"],
    queryFn: () => base44.entities.CaseStudy.list("-created_date"),
  });
  const delMutation = useMutation({
    mutationFn: (id) => base44.entities.CaseStudy.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-case-studies"] }),
  });
  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }) => base44.entities.CaseStudy.update(id, { featured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-case-studies"] }),
  });

  const columns = [
    { key: "clientName", label: "Client", render: (r) => <span className="font-semibold text-slate-900">{r.clientName}<span className="block text-xs text-slate-400 font-normal">{r.industry} · {r.service}</span></span> },
    { key: "heroMetricValue", label: "Hero Metric", render: (r) => <span className="text-emerald-600 font-bold">{r.heroMetricValue}</span> },
    { key: "featured", label: "Featured", render: (r) => <button onClick={() => toggleFeatured.mutate({ id: r.id, featured: !r.featured })} className={r.featured ? "text-amber-400" : "text-slate-200 hover:text-slate-400"}><Star className={`w-4 h-4 ${r.featured ? "fill-amber-400" : ""}`} /></button> },
    { key: "created_date", label: "Created", render: (r) => <span className="text-xs text-slate-400">{formatDate(r.created_date)}</span> },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1 justify-end">
        <Link to={`/admin/case-studies/edit/${r.id}`}><ActionButton variant="primary"><Pencil className="w-3.5 h-3.5" /></ActionButton></Link>
        <ActionButton variant="danger" onClick={() => confirm(`Delete case study for ${r.clientName}?`) && delMutation.mutate(r.id)}><Trash2 className="w-3.5 h-3.5" /></ActionButton>
      </div>
    )},
  ];

  return (
    <div>
      <AdminPageHeader title="Case Studies" subtitle="Showcase client success stories and results."
        actions={<Link to="/admin/case-studies/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Case Study</Link>} />
      {isLoading ? <p className="text-slate-400 text-sm">Loading...</p> : <AdminTable columns={columns} rows={rows} searchKeys={["clientName", "industry", "service"]} searchPlaceholder="Search case studies..." />}
    </div>
  );
}