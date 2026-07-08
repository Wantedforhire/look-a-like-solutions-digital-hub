import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { ActionButton } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/Badges";
import { Field, TextInput, TextArea, Select, Toggle } from "@/components/admin/FormFields";
import MediaPicker from "@/components/admin/MediaPicker";
import { Plus, Pencil, Trash2, X, Save, Star, Eye, EyeOff } from "lucide-react";

export default function TestimonialManagement() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials", "all"],
    queryFn: () => base44.entities.Testimonial.list(),
  });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (data) => data.id ? base44.entities.Testimonial.update(data.id, data) : base44.entities.Testimonial.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); setShowForm(false); },
  });
  const delMutation = useMutation({
    mutationFn: (id) => base44.entities.Testimonial.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });
  const toggleVisible = useMutation({
    mutationFn: ({ id, visible }) => base44.entities.Testimonial.update(id, { visible }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  const columns = [
    { key: "name", label: "Name", render: (r) => <span className="font-semibold text-slate-900">{r.name}<span className="block text-xs text-slate-400 font-normal">{r.role} · {r.company}</span></span> },
    { key: "rating", label: "Rating", render: (r) => <span className="flex">{Array.from({ length: r.rating || 0 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</span> },
    { key: "quote", label: "Quote", render: (r) => <span className="text-slate-500 line-clamp-1 max-w-xs block italic">"{r.quote}"</span> },
    { key: "visible", label: "Visible", render: (r) => (
      <button onClick={() => toggleVisible.mutate({ id: r.id, visible: !r.visible })} className="text-slate-400 hover:text-indigo-accent">
        {r.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    )},
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1 justify-end">
        <ActionButton onClick={() => { setEditing({ ...r }); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></ActionButton>
        <ActionButton variant="danger" onClick={() => confirm(`Delete testimonial from ${r.name}?`) && delMutation.mutate(r.id)}><Trash2 className="w-3.5 h-3.5" /></ActionButton>
      </div>
    )},
  ];

  return (
    <div>
      <AdminPageHeader title="Testimonials" subtitle="Manage client testimonials displayed on your website."
        actions={<button onClick={() => { setEditing({ name: "", role: "", company: "", quote: "", rating: 5, avatar: "", relatedService: "", visible: true }); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Testimonial</button>} />
      {isLoading ? <p className="text-slate-400 text-sm">Loading...</p> : <AdminTable columns={columns} rows={rows} searchKeys={["name", "company", "quote"]} searchPlaceholder="Search testimonials..." />}
      {showForm && <TestimonialForm item={editing} onSave={(d) => saveMutation.mutate(d)} onClose={() => setShowForm(false)} saving={saveMutation.isPending} />}
    </div>
  );
}

function TestimonialForm({ item, onSave, onClose, saving }) {
  const [form, setForm] = useState(item);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h3 className="font-bold text-slate-900">{item.id ? "Edit Testimonial" : "New Testimonial"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name *"><TextInput value={form.name} onChange={set("name")} /></Field>
            <Field label="Role"><TextInput value={form.role} onChange={set("role")} /></Field>
            <Field label="Company"><TextInput value={form.company} onChange={set("company")} /></Field>
            <Field label="Rating"><Select value={String(form.rating)} onChange={(v) => set("rating")(Number(v))} options={[1,2,3,4,5].map(n => ({ value: String(n), label: `${n} Star${n>1?"s":""}` }))} /></Field>
          </div>
          <Field label="Quote *"><TextArea value={form.quote} onChange={set("quote")} rows={3} /></Field>
          <Field label="Related Service"><TextInput value={form.relatedService} onChange={set("relatedService")} placeholder="e.g. SEO Services" /></Field>
          <Field label="Avatar"><MediaPicker value={form.avatar} onChange={set("avatar")} /></Field>
          <Toggle checked={form.visible} onChange={set("visible")} label="Visible on public website" />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
        </div>
      </div>
    </div>
  );
}