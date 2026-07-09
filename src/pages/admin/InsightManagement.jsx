import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { ActionButton } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/Badges";
import { Plus } from "lucide-react";

export default function InsightManagement() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: insights = [] } = useQuery({
    queryKey: ["admin-insights"],
    queryFn: () => base44.entities.Insight.list("-publishDate"),
  });

  const delMut = useMutation({
    mutationFn: (id) => base44.entities.Insight.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-insights"] }),
  });

  const columns = [
    { key: "title", label: "Title", render: (r) => <Link to={`/admin/insights/edit/${r.id}`} className="font-semibold text-slate-900 hover:text-indigo-accent">{r.title}</Link> },
    { key: "category", label: "Category", render: (r) => r.category || "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "author", label: "Author" },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1">
        <ActionButton onClick={() => navigate(`/admin/insights/edit/${r.id}`)} variant="primary">Edit</ActionButton>
        <ActionButton onClick={() => { if (confirm("Delete this insight?")) delMut.mutate(r.id); }} variant="danger">Delete</ActionButton>
      </div>
    ) },
  ];

  return (
    <div>
      <AdminPageHeader title="Marketing Insights" subtitle="Manage insight articles." actions={
        <Link to="/admin/insights/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Insight</Link>
      } />
      <AdminTable columns={columns} rows={insights} searchKeys={["title", "category", "author"]} searchPlaceholder="Search insights..." />
    </div>
  );
}