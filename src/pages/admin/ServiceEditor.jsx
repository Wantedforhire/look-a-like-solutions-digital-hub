import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Field, TextInput, TextArea, Select, TagInput } from "@/components/admin/FormFields";
import MediaPicker from "@/components/admin/MediaPicker";
import { slugify } from "@/lib/adminUtils";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

const categories = ["Search & Discovery", "Social & Engagement", "Performance & Paid", "Creative & Brand", "Technical & Development", "Content & Strategy", "Reputation & Trust", "AI & Emerging"];
const iconOptions = ["Search", "TrendingUp", "Share2", "Palette", "Code2", "PenTool", "ShieldCheck", "Target", "Sparkles", "Megaphone", "BarChart3", "Mail", "Youtube", "ClipboardCheck", "Users"];

export default function ServiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !id || id === "new";

  const { data: existing } = useQuery({
    queryKey: ["admin-services", id],
    queryFn: () => base44.entities.Service.get(id),
    enabled: !isNew,
  });

  const [form, setForm] = useState({
    title: "", slug: "", category: "", icon: "TrendingUp", shortDescription: "",
    heroHeadline: "", heroSubtext: "", heroImage: "", metricLabel: "", deliverables: [],
    process: [], faqs: [], keywordTargets: [], metaTitle: "", metaDescription: "", order: 0,
  });

  useEffect(() => { if (existing) setForm((f) => ({ ...f, ...existing })); }, [existing]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const saveMutation = useMutation({
    mutationFn: (data) => isNew ? base44.entities.Service.create(data) : base44.entities.Service.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-services"] }); navigate("/admin/services"); },
  });

  const submit = () => {
    if (!form.title) { alert("Title is required"); return; }
    saveMutation.mutate({ ...form, slug: form.slug || slugify(form.title) });
  };

  // Process steps
  const addStep = () => set("process")([...(form.process || []), { step: "", description: "" }]);
  const updateStep = (i, field, val) => set("process")(form.process.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  const removeStep = (i) => set("process")(form.process.filter((_, idx) => idx !== i));
  // FAQs
  const addFaq = () => set("faqs")([...(form.faqs || []), { question: "", answer: "" }]);
  const updateFaq = (i, field, val) => set("faqs")(form.faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  const removeFaq = (i) => set("faqs")(form.faqs.filter((_, idx) => idx !== i));

  return (
    <div>
      <Link to="/admin/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-accent mb-4"><ArrowLeft className="w-4 h-4" /> Back to Services</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{isNew ? "New Service" : "Edit Service"}</h1>
        <button onClick={submit} disabled={saveMutation.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title *"><TextInput value={form.title} onChange={set("title")} /></Field>
              <Field label="Slug"><TextInput value={form.slug} onChange={set("slug")} placeholder="auto-generated" /></Field>
              <Field label="Category"><Select value={form.category} onChange={set("category")} options={categories} placeholder="Select category" /></Field>
              <Field label="Icon"><Select value={form.icon} onChange={set("icon")} options={iconOptions} /></Field>
            </div>
            <Field label="Short Description"><TextArea value={form.shortDescription} onChange={set("shortDescription")} rows={2} /></Field>
            <Field label="Deliverables"><TagInput value={form.deliverables || []} onChange={set("deliverables")} placeholder="Add a deliverable" /></Field>
            <Field label="Keyword Targets"><TagInput value={form.keywordTargets || []} onChange={set("keywordTargets")} placeholder="Add a keyword" /></Field>
          </div>

          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">Hero Section</p>
            <Field label="Hero Headline"><TextInput value={form.heroHeadline} onChange={set("heroHeadline")} /></Field>
            <Field label="Hero Subtext"><TextArea value={form.heroSubtext} onChange={set("heroSubtext")} rows={2} /></Field>
            <Field label="Hero Image"><MediaPicker value={form.heroImage} onChange={set("heroImage")} /></Field>
            <Field label="Metric Label" hint="e.g. 300% traffic growth"><TextInput value={form.metricLabel} onChange={set("metricLabel")} /></Field>
          </div>

          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Process Steps</p>
              <button onClick={addStep} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"><Plus className="w-3.5 h-3.5" /> Add Step</button>
            </div>
            {(form.process || []).map((p, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Field label="Step Name" className="flex-1"><TextInput value={p.step} onChange={(v) => updateStep(i, "step", v)} /></Field>
                <Field label="Description" className="flex-[2]"><TextInput value={p.description} onChange={(v) => updateStep(i, "description", v)} /></Field>
                <button onClick={() => removeStep(i)} className="text-slate-400 hover:text-rose-500 mt-7"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {(form.process || []).length === 0 && <p className="text-xs text-slate-400">No steps added yet.</p>}
          </div>

          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">FAQs</p>
              <button onClick={addFaq} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"><Plus className="w-3.5 h-3.5" /> Add FAQ</button>
            </div>
            {(form.faqs || []).map((f, i) => (
              <div key={i} className="space-y-2 p-4 bg-slate-50 rounded-xl">
                <Field label="Question"><TextInput value={f.question} onChange={(v) => updateFaq(i, "question", v)} /></Field>
                <Field label="Answer"><TextArea value={f.answer} onChange={(v) => updateFaq(i, "answer", v)} rows={2} /></Field>
                <button onClick={() => removeFaq(i)} className="text-xs font-semibold text-rose-500 hover:underline">Remove FAQ</button>
              </div>
            ))}
            {(form.faqs || []).length === 0 && <p className="text-xs text-slate-400">No FAQs added yet.</p>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">SEO Settings</p>
            <Field label="Meta Title"><TextInput value={form.metaTitle} onChange={set("metaTitle")} /></Field>
            <Field label="Meta Description"><TextArea value={form.metaDescription} onChange={set("metaDescription")} rows={2} /></Field>
            <Field label="Display Order" hint="Lower numbers appear first"><TextInput type="number" value={String(form.order || 0)} onChange={(v) => set("order")(Number(v))} /></Field>
          </div>
        </div>
      </div>
    </div>
  );
}