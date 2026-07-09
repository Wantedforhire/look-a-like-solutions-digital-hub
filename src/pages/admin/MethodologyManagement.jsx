import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Field, TextInput, TextArea, TagInput, Select } from "@/components/admin/FormFields";
import { Plus, X, Save, Trash2 } from "lucide-react";

const iconOptions = ["Search", "Map", "Palette", "Rocket", "LineChart", "Target", "Sparkles", "Code2", "PenTool", "Megaphone", "BarChart3", "ShieldCheck"];

export default function MethodologyManagement() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const { data: phases = [] } = useQuery({
    queryKey: ["admin-methodology"],
    queryFn: () => base44.entities.MethodologyPhase.list("order"),
  });

  const saveMut = useMutation({
    mutationFn: (data) => editing?.id ? base44.entities.MethodologyPhase.update(editing.id, data) : base44.entities.MethodologyPhase.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-methodology"] }); setEditing(null); setForm(null); },
  });

  const delMut = useMutation({
    mutationFn: (id) => base44.entities.MethodologyPhase.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-methodology"] }),
  });

  const openNew = () => { setEditing({}); setForm({ title: "", description: "", deliverables: [], icon: "Search", order: 0 }); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); };
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <AdminPageHeader title="Methodology" subtitle="Manage the 5-phase growth methodology phases." actions={
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Phase</button>
      } />

      <div className="space-y-3">
        {phases.length === 0 ? (
          <div className="glass-cell rounded-2xl p-12 text-center text-slate-400">
            No methodology phases yet. The public page will show default content until you add phases.
          </div>
        ) : (
          phases.map((p, i) => (
            <div key={p.id} className="glass-cell rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-extrabold text-slate-200">0{i + 1}</span>
                <div>
                  <h3 className="font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{p.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-accent hover:bg-indigo-50">Edit</button>
                <button onClick={() => { if (confirm("Delete this phase?")) delMut.mutate(p.id); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && form && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => { setEditing(null); setForm(null); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-bold text-slate-900">{editing.id ? "Edit Phase" : "New Phase"}</h3>
              <button onClick={() => { setEditing(null); setForm(null); }} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Title *"><TextInput value={form.title} onChange={set("title")} /></Field>
              <Field label="Description"><TextArea value={form.description} onChange={set("description")} rows={3} /></Field>
              <Field label="Deliverables"><TagInput value={form.deliverables || []} onChange={set("deliverables")} placeholder="Add a deliverable" /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Icon"><Select value={form.icon} onChange={set("icon")} options={iconOptions} /></Field>
                <Field label="Order"><TextInput type="number" value={String(form.order || 0)} onChange={(v) => set("order")(Number(v))} /></Field>
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