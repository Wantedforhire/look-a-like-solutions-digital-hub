import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Field, TextInput, TextArea, Select } from "@/components/admin/FormFields";
import MediaPicker from "@/components/admin/MediaPicker";
import Wysiwyg from "@/components/admin/Wysiwyg";
import { slugify } from "@/lib/adminUtils";
import { ArrowLeft, Save } from "lucide-react";

export default function InsightEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !id || id === "new";

  const { data: existing } = useQuery({
    queryKey: ["admin-insights", id],
    queryFn: () => base44.entities.Insight.get(id),
    enabled: !isNew,
  });

  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", coverImage: "", category: "",
    author: "", publishDate: "", status: "draft", metaTitle: "", metaDescription: "",
  });

  useEffect(() => { if (existing) setForm((f) => ({ ...f, ...existing })); }, [existing]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const saveMut = useMutation({
    mutationFn: (data) => isNew ? base44.entities.Insight.create(data) : base44.entities.Insight.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-insights"] }); navigate("/admin/insights"); },
  });

  const submit = () => {
    if (!form.title) { alert("Title is required"); return; }
    saveMut.mutate({ ...form, slug: form.slug || slugify(form.title) });
  };

  return (
    <div>
      <Link to="/admin/insights" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-accent mb-4"><ArrowLeft className="w-4 h-4" /> Back to Insights</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{isNew ? "New Insight" : "Edit Insight"}</h1>
        <button onClick={submit} disabled={saveMut.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title *"><TextInput value={form.title} onChange={set("title")} /></Field>
              <Field label="Slug"><TextInput value={form.slug} onChange={set("slug")} placeholder="auto-generated" /></Field>
              <Field label="Category"><TextInput value={form.category} onChange={set("category")} placeholder="e.g. SEO, Paid Ads" /></Field>
              <Field label="Author"><TextInput value={form.author} onChange={set("author")} /></Field>
            </div>
            <Field label="Excerpt"><TextArea value={form.excerpt} onChange={set("excerpt")} rows={2} /></Field>
          </div>
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">Content</p>
            <Wysiwyg value={form.content} onChange={set("content")} />
          </div>
        </div>
        <div className="space-y-5">
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">Publishing</p>
            <Field label="Status"><Select value={form.status} onChange={set("status")} options={["draft", "published"]} /></Field>
            <Field label="Publish Date"><TextInput type="date" value={form.publishDate || ""} onChange={set("publishDate")} /></Field>
          </div>
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">Cover Image</p>
            <MediaPicker value={form.coverImage} onChange={set("coverImage")} label="" />
          </div>
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">SEO</p>
            <Field label="Meta Title"><TextInput value={form.metaTitle} onChange={set("metaTitle")} /></Field>
            <Field label="Meta Description"><TextArea value={form.metaDescription} onChange={set("metaDescription")} rows={2} /></Field>
          </div>
        </div>
      </div>
    </div>
  );
}