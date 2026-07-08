import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { ActionButton } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/Badges";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/adminUtils";

export default function BlogManagement() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-blog", "all"],
    queryFn: () => base44.entities.BlogPost.list("-created_date"),
  });

  const delMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog"] }),
  });
  const togglePublish = useMutation({
    mutationFn: ({ id, status }) => base44.entities.BlogPost.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog"] }),
  });

  const columns = [
    { key: "title", label: "Title", render: (r) => <span className="font-semibold text-slate-900">{r.title}<span className="block text-xs text-slate-400 font-normal">{r.category}</span></span> },
    { key: "author", label: "Author", render: (r) => <span className="text-slate-600">{r.author || "—"}</span> },
    { key: "publishDate", label: "Publish Date", render: (r) => <span className="text-xs text-slate-400">{formatDate(r.publishDate)}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1 justify-end items-center">
        <button onClick={() => togglePublish.mutate({ id: r.id, status: r.status === "published" ? "draft" : "published" })} className="text-slate-400 hover:text-indigo-accent px-2 py-1" title={r.status === "published" ? "Unpublish" : "Publish"}>
          {r.status === "published" ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
        <Link to={`/admin/blog/edit/${r.id}`}><ActionButton variant="primary"><Pencil className="w-3.5 h-3.5" /></ActionButton></Link>
        <ActionButton variant="danger" onClick={() => confirm(`Delete "${r.title}"?`) && delMutation.mutate(r.id)}><Trash2 className="w-3.5 h-3.5" /></ActionButton>
      </div>
    )},
  ];

  return (
    <div>
      <AdminPageHeader title="Blog" subtitle="Create and manage blog posts and articles."
        actions={<Link to="/admin/blog/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Post</Link>} />
      {isLoading ? <p className="text-slate-400 text-sm">Loading...</p> : <AdminTable columns={columns} rows={rows} searchKeys={["title", "category", "author"]} searchPlaceholder="Search posts..." />}
    </div>
  );
}