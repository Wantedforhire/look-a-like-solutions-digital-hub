import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Field, TextInput, Select, TagInput, Toggle } from "@/components/admin/FormFields";
import MediaPicker from "@/components/admin/MediaPicker";
import { Plus, X, Save, Trash2 } from "lucide-react";

const categories = ["Logo Design", "Social Media", "Website", "Ad Creative", "Other"];

export default function GalleryManagement() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const { data: items = [] } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: () => base44.entities.GalleryItem.list("order"),
  });

  const saveMut = useMutation({
    mutationFn: (data) => editing?.id ? base44.entities.GalleryItem.update(editing.id, data) : base44.entities.GalleryItem.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); setEditing(null); setForm(null); },
  });

  const delMut = useMutation({
    mutationFn: (id) => base44.entities.GalleryItem.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-gallery"] }),
  });

  const openNew = () => { setEditing({}); setForm({ title: "", imageUrl: "", category: "Other", tags: [], clientIndustry: "", featured: false, order: 0 }); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); };
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <AdminPageHeader title="Gallery" subtitle="Manage portfolio items." actions={
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Item</button>
      } />

      {items.length === 0 ? (
        <div className="glass-cell rounded-2xl p-12 text-center text-slate-400">No gallery items yet. Click "New Item" to add one.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass-cell rounded-xl overflow-hidden group">
              <div className="relative aspect-square bg-slate-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold">Edit</button>
                  <button onClick={() => { if (confirm("Delete this item?")) delMut.mutate(item.id); }} className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-semibold"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-bold uppercase text-emerald-accent">{item.category}</p>
                <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && form && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => { setEditing(null); setForm(null); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-bold text-slate-900">{editing.id ? "Edit Item" : "New Gallery Item"}</h3>
              <button onClick={() => { setEditing(null); setForm(null); }} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Title *"><TextInput value={form.title} onChange={set("title")} /></Field>
              <Field label="Image"><MediaPicker value={form.imageUrl} onChange={set("imageUrl")} label="" /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Category"><Select value={form.category} onChange={set("category")} options={categories} /></Field>
                <Field label="Client Industry"><TextInput value={form.clientIndustry} onChange={set("clientIndustry")} /></Field>
              </div>
              <Field label="Tags"><TagInput value={form.tags || []} onChange={set("tags")} placeholder="Add a tag" /></Field>
              <div className="flex items-center gap-6">
                <Toggle checked={!!form.featured} onChange={set("featured")} label="Featured" />
                <Field label="Order" className="flex-1"><TextInput type="number" value={String(form.order || 0)} onChange={(v) => set("order")(Number(v))} /></Field>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => { setEditing(null); setForm(null); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => { if (!form.title || !form.imageUrl) { alert("Title and image are required"); return; } saveMut.mutate(form); }} disabled={saveMut.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}