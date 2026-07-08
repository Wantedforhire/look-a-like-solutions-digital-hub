import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { ActionButton } from "@/components/admin/AdminTable";
import { Field, TextInput, TagInput } from "@/components/admin/FormFields";
import Wysiwyg from "@/components/admin/Wysiwyg";
import MediaPicker from "@/components/admin/MediaPicker";
import { Plus, Pencil, Trash2, X, Save, ArrowUp, ArrowDown } from "lucide-react";

export default function TeamManagement() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-team", "all"],
    queryFn: () => base44.entities.TeamMember.list("order"),
  });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (data) => data.id ? base44.entities.TeamMember.update(data.id, data) : base44.entities.TeamMember.create({ ...data, order: rows.length }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-team"] }); setShowForm(false); },
  });
  const delMutation = useMutation({
    mutationFn: (id) => base44.entities.TeamMember.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-team"] }),
  });
  const moveMutation = useMutation({
    mutationFn: ({ id, order }) => base44.entities.TeamMember.update(id, { order }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-team"] }),
  });

  const move = (index, dir) => {
    const swapIndex = index + dir;
    if (swapIndex < 0 || swapIndex >= rows.length) return;
    moveMutation.mutate({ id: rows[index].id, order: swapIndex });
    moveMutation.mutate({ id: rows[swapIndex].id, order: index });
  };

  const columns = [
    { key: "order", label: "", render: (r, i) => (
      <div className="flex flex-col">
        <button onClick={() => move(rows.findIndex(x => x.id === r.id), -1)} className="text-slate-300 hover:text-indigo-accent"><ArrowUp className="w-3.5 h-3.5" /></button>
        <button onClick={() => move(rows.findIndex(x => x.id === r.id), 1)} className="text-slate-300 hover:text-indigo-accent"><ArrowDown className="w-3.5 h-3.5" /></button>
      </div>
    )},
    { key: "photo", label: "", render: (r) => r.photo ? <img src={r.photo} alt={r.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-slate-100" /> },
    { key: "name", label: "Name", render: (r) => <span className="font-semibold text-slate-900">{r.name}<span className="block text-xs text-slate-400 font-normal">{r.role}</span></span> },
    { key: "specialisms", label: "Specialisms", render: (r) => <span className="text-xs text-slate-500">{(r.specialisms || []).join(", ")}</span> },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1 justify-end">
        <ActionButton onClick={() => { setEditing({ ...r }); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></ActionButton>
        <ActionButton variant="danger" onClick={() => confirm(`Delete ${r.name}?`) && delMutation.mutate(r.id)}><Trash2 className="w-3.5 h-3.5" /></ActionButton>
      </div>
    )},
  ];

  return (
    <div>
      <AdminPageHeader title="Team" subtitle="Manage team member profiles shown on your website."
        actions={<button onClick={() => { setEditing({ name: "", role: "", bio: "", specialisms: [], photo: "", linkedIn: "" }); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Member</button>} />
      {isLoading ? <p className="text-slate-400 text-sm">Loading...</p> : <AdminTable columns={columns} rows={rows} searchKeys={["name", "role"]} searchPlaceholder="Search team..." />}
      {showForm && <TeamForm item={editing} onSave={(d) => saveMutation.mutate(d)} onClose={() => setShowForm(false)} saving={saveMutation.isPending} />}
    </div>
  );
}

function TeamForm({ item, onSave, onClose, saving }) {
  const [form, setForm] = useState(item);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h3 className="font-bold text-slate-900">{item.id ? "Edit Member" : "New Member"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name *"><TextInput value={form.name} onChange={set("name")} /></Field>
            <Field label="Role *"><TextInput value={form.role} onChange={set("role")} /></Field>
          </div>
          <Field label="Photo"><MediaPicker value={form.photo} onChange={set("photo")} /></Field>
          <Field label="Bio"><Wysiwyg value={form.bio} onChange={set("bio")} /></Field>
          <Field label="Specialisms"><TagInput value={form.specialisms || []} onChange={set("specialisms")} placeholder="Add a specialism" /></Field>
          <Field label="LinkedIn URL"><TextInput value={form.linkedIn} onChange={set("linkedIn")} placeholder="https://linkedin.com/in/..." /></Field>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
        </div>
      </div>
    </div>
  );
}