import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { ActionButton } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/Badges";
import { Field, TextInput, TextArea, Select, Toggle } from "@/components/admin/FormFields";
import MediaPicker from "@/components/admin/MediaPicker";
import { Plus, X, Save } from "lucide-react";

const categories = ["Guide", "Checklist", "Template", "Report"];

export default function ResourceManagement() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const { data: resources = [] } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: () => base44.entities.Resource.list("-publishDate"),
  });

  const saveMut = useMutation({
    mutationFn: (data) => editing?.id ? base44.entities.Resource.update(editing.id, data) : base44.entities.Resource.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-resources"] }); setEditing(null); setForm(null); },
  });

  const delMut = useMutation({
    mutationFn: (id) => base44.entities.Resource.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-resources"] }),
  });

  const openNew = () => { setEditing({}); setForm({ title: "", description: "", category: "Guide", fileUrl: "", coverImage: "", publishDate: "", featured: false, order: 0 }); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); };
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const columns = [
    { key: "title", label: "Title", render: (r) => <span className="font-semibold text-slate-900">{r.title}</span> },
    { key: "category", label: "Category", render: (r) => <StatusBadge status={r.category} /> },
    { key: "featured", label: "Featured", render: (r) => (r.featured ? <span className="text-emerald-600 text-xs font-bold">★ Yes</span> : "—") },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1">
        <ActionButton onClick={() => openEdit(r)} variant="primary">Edit</ActionButton>
        <ActionButton onClick={() => { if (confirm("Delete this resource?")) delMut.mutate(r.id); }} variant="danger">Delete</ActionButton>
      </div>
    ) },
  ];

  return (
    <div>
      <AdminPageHeader title="Resources" subtitle="Manage downloadable guides, checklists, and templates." actions={
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Resource</button>
      } />
      <AdminTable columns={columns} rows={resources} searchKeys={["title", "category"]} searchPlaceholder="Search resources..." />

      {editing && form && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => { setEditing(null); setForm(null); }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-bold text-slate-900">{editing.id ? "Edit Resource" : "New Resource"}</h3>
              <button onClick={() => { setEditing(null); setForm(null); }} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Title *"><TextInput value={form.title} onChange={set("title")} /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Category"><Select value={form.category} onChange={set("category")} options={categories} /></Field>
                <Field label="Publish Date"><TextInput type="date" value={form.publishDate || ""} onChange={set("publishDate")} /></Field>
              </div>
              <Field label="Description"><TextArea value={form.description} onChange={set("description")} rows={3} /></Field>
              <Field label="PDF / File URL"><TextInput value={form.fileUrl} onChange={set("fileUrl")} placeholder="https://..." /></Field>
              <Field label="Cover Image"><MediaPicker value={form.coverImage} onChange={set("coverImage")} /></Field>
              <div className="flex items-center gap-6">
                <Toggle checked={!!form.featured} onChange={set("featured")} label="Featured" />
                <Field label="Order" className="flex-1"><TextInput type="number" value={String(form.order || 0)} onChange={(v) => set("order")(Number(v))} /></Field>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => { setEditing(null); setForm(null); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => { if (!form.title) { alert("Title is required"); return; } saveMut.mutate(form); }} disabled={saveMut.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}