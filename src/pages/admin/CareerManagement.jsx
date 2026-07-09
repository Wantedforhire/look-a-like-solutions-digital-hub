import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Field, TextInput, TextArea, Select, TagInput, Toggle } from "@/components/admin/FormFields";
import { Plus, X, Save, Trash2 } from "lucide-react";

const types = ["Full-time", "Part-time", "Freelance", "Internship"];

export default function CareerManagement() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const { data: jobs = [] } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () => base44.entities.JobListing.list("order"),
  });

  const saveMut = useMutation({
    mutationFn: (data) => editing?.id ? base44.entities.JobListing.update(editing.id, data) : base44.entities.JobListing.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-jobs"] }); setEditing(null); setForm(null); },
  });

  const delMut = useMutation({
    mutationFn: (id) => base44.entities.JobListing.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-jobs"] }),
  });

  const openNew = () => { setEditing({}); setForm({ title: "", department: "", location: "", type: "Full-time", description: "", requirements: [], isOpen: true, order: 0 }); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); };
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <AdminPageHeader title="Careers" subtitle="Manage job listings." actions={
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> New Role</button>
      } />

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="glass-cell rounded-2xl p-12 text-center text-slate-400">No job listings yet.</div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="glass-cell rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900">{job.title}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${job.isOpen ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {job.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{job.department} · {job.location || "Remote"} · {job.type}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(job)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-accent hover:bg-indigo-50">Edit</button>
                <button onClick={() => { if (confirm("Delete this role?")) delMut.mutate(job.id); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && form && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => { setEditing(null); setForm(null); }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-bold text-slate-900">{editing.id ? "Edit Role" : "New Role"}</h3>
              <button onClick={() => { setEditing(null); setForm(null); }} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Title *"><TextInput value={form.title} onChange={set("title")} /></Field>
                <Field label="Department *"><TextInput value={form.department} onChange={set("department")} /></Field>
                <Field label="Location"><TextInput value={form.location} onChange={set("location")} /></Field>
                <Field label="Type"><Select value={form.type} onChange={set("type")} options={types} /></Field>
              </div>
              <Field label="Description"><TextArea value={form.description} onChange={set("description")} rows={4} /></Field>
              <Field label="Requirements"><TagInput value={form.requirements || []} onChange={set("requirements")} placeholder="Add a requirement" /></Field>
              <div className="flex items-center gap-6">
                <Toggle checked={!!form.isOpen} onChange={set("isOpen")} label="Open / Accepting Applications" />
                <Field label="Order" className="flex-1"><TextInput type="number" value={String(form.order || 0)} onChange={(v) => set("order")(Number(v))} /></Field>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => { setEditing(null); setForm(null); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => { if (!form.title || !form.department) { alert("Title and department are required"); return; } saveMut.mutate(form); }} disabled={saveMut.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}