import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Field, TextInput, TextArea, Select, Toggle, TagInput } from "@/components/admin/FormFields";
import Wysiwyg from "@/components/admin/Wysiwyg";
import MediaPicker from "@/components/admin/MediaPicker";
import { slugify } from "@/lib/adminUtils";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

export default function CaseStudyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !id || id === "new";

  const { data: existing } = useQuery({
    queryKey: ["admin-case-studies", id],
    queryFn: () => base44.entities.CaseStudy.get(id),
    enabled: !isNew,
  });
  const { data: services = [] } = useQuery({
    queryKey: ["admin-services", "all"],
    queryFn: () => base44.entities.Service.list(),
  });

  const [form, setForm] = useState({
    clientName: "", slug: "", industry: "", service: "", featured: false, thumbnail: "",
    heroMetricValue: "", heroMetricLabel: "", challenge: "", approach: "", results: [],
    testimonialQuote: "", testimonialAuthor: "", clientWebsite: "", metaTitle: "", metaDescription: "",
  });

  useEffect(() => { if (existing) setForm((f) => ({ ...f, ...existing })); }, [existing]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const saveMutation = useMutation({
    mutationFn: (data) => isNew ? base44.entities.CaseStudy.create(data) : base44.entities.CaseStudy.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-case-studies"] }); navigate("/admin/case-studies"); },
  });

  const submit = () => {
    if (!form.clientName) { alert("Client name is required"); return; }
    const data = { ...form, slug: form.slug || slugify(form.clientName) };
    saveMutation.mutate(data);
  };

  const addResult = () => set("results")([...(form.results || []), { value: "", label: "" }]);
  const updateResult = (i, field, val) => set("results")(form.results.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const removeResult = (i) => set("results")(form.results.filter((_, idx) => idx !== i));

  return (
    <div>
      <Link to="/admin/case-studies" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-accent mb-4"><ArrowLeft className="w-4 h-4" /> Back to Case Studies</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{isNew ? "New Case Study" : "Edit Case Study"}</h1>
        <button onClick={submit} disabled={saveMutation.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Client Name *"><TextInput value={form.clientName} onChange={set("clientName")} /></Field>
              <Field label="Slug"><TextInput value={form.slug} onChange={set("slug")} placeholder="auto-generated" /></Field>
              <Field label="Industry"><TextInput value={form.industry} onChange={set("industry")} placeholder="e.g. Healthcare" /></Field>
              <Field label="Service"><Select value={form.service} onChange={set("service")} options={services.map((s) => s.title)} placeholder="Select service" /></Field>
            </div>
            <Field label="Thumbnail"><MediaPicker value={form.thumbnail} onChange={set("thumbnail")} /></Field>
            <Field label="Client Website"><TextInput value={form.clientWebsite} onChange={set("clientWebsite")} placeholder="https://..." /></Field>
            <Toggle checked={form.featured} onChange={set("featured")} label="Featured (show on homepage)" />
          </div>

          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Hero Metric Value" hint="e.g. +320%"><TextInput value={form.heroMetricValue} onChange={set("heroMetricValue")} /></Field>
              <Field label="Hero Metric Label" hint="e.g. ROI Growth"><TextInput value={form.heroMetricLabel} onChange={set("heroMetricLabel")} /></Field>
            </div>
          </div>

          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <Field label="The Challenge"><Wysiwyg value={form.challenge} onChange={set("challenge")} /></Field>
          </div>
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <Field label="Our Approach"><Wysiwyg value={form.approach} onChange={set("approach")} /></Field>
          </div>

          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Results</p>
              <button onClick={addResult} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"><Plus className="w-3.5 h-3.5" /> Add Result</button>
            </div>
            {(form.results || []).map((r, i) => (
              <div key={i} className="flex gap-3 items-end">
                <Field label="Value" className="flex-1"><TextInput value={r.value} onChange={(v) => updateResult(i, "value", v)} placeholder="+320%" /></Field>
                <Field label="Label" className="flex-1"><TextInput value={r.label} onChange={(v) => updateResult(i, "label", v)} placeholder="ROI Growth" /></Field>
                <button onClick={() => removeResult(i)} className="text-slate-400 hover:text-rose-500 pb-2.5"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {(form.results || []).length === 0 && <p className="text-xs text-slate-400">No results added yet.</p>}
          </div>

          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">Client Testimonial</p>
            <Field label="Quote"><TextArea value={form.testimonialQuote} onChange={set("testimonialQuote")} rows={3} /></Field>
            <Field label="Author"><TextInput value={form.testimonialAuthor} onChange={set("testimonialAuthor")} placeholder="Name, Role at Company" /></Field>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">SEO Settings</p>
            <Field label="Meta Title"><TextInput value={form.metaTitle} onChange={set("metaTitle")} /></Field>
            <Field label="Meta Description"><TextArea value={form.metaDescription} onChange={set("metaDescription")} rows={2} /></Field>
          </div>
        </div>
      </div>
    </div>
  );
}