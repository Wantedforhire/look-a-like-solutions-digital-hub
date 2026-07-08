import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Field, TextInput, TextArea, Select, TagInput, Toggle } from "@/components/admin/FormFields";
import Wysiwyg from "@/components/admin/Wysiwyg";
import MediaPicker from "@/components/admin/MediaPicker";
import { slugify } from "@/lib/adminUtils";
import { ArrowLeft, Save, Search } from "lucide-react";

const categories = ["SEO", "Performance Marketing", "Social Media", "Content", "Web Design", "AI & GEO", "Branding", "Industry News", "Guides"];

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !id || id === "new";

  const { data: existing } = useQuery({
    queryKey: ["admin-blog", id],
    queryFn: () => base44.entities.BlogPost.get(id),
    enabled: !isNew,
  });

  const [form, setForm] = useState({
    title: "", slug: "", category: "", tags: [], author: "", publishDate: "",
    coverImage: "", excerpt: "", content: "", metaTitle: "", metaDescription: "",
    ogImage: "", noindex: false, status: "draft", scheduledDate: "",
  });
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (existing) setForm((f) => ({ ...f, ...existing }));
  }, [existing]);

  useEffect(() => {
    if (!slugTouched && form.title) setForm((f) => ({ ...f, slug: slugify(f.title) }));
  }, [form.title, slugTouched]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const saveMutation = useMutation({
    mutationFn: (data) => isNew ? base44.entities.BlogPost.create(data) : base44.entities.BlogPost.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); navigate("/admin/blog"); },
  });

  const submit = (status) => {
    const data = { ...form, status: status || form.status };
    if (!data.title) { alert("Title is required"); return; }
    if (!data.slug) data.slug = slugify(data.title);
    saveMutation.mutate(data);
  };

  return (
    <div>
      <Link to="/admin/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-accent mb-4"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{isNew ? "New Blog Post" : "Edit Post"}</h1>
        <div className="flex gap-2">
          <button onClick={() => submit("draft")} disabled={saveMutation.isPending} className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 text-slate-600 hover:bg-slate-50">Save Draft</button>
          <button onClick={() => submit("published")} disabled={saveMutation.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Publish</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <Field label="Title *"><TextInput value={form.title} onChange={set("title")} placeholder="Post title" /></Field>
            <Field label="Slug" hint="URL-friendly identifier"><TextInput value={form.slug} onChange={(v) => { setSlugTouched(true); set("slug")(v); }} placeholder="post-slug" /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Category"><Select value={form.category} onChange={set("category")} options={categories} placeholder="Select category" /></Field>
              <Field label="Author"><TextInput value={form.author} onChange={set("author")} placeholder="Author name" /></Field>
            </div>
            <Field label="Tags"><TagInput value={form.tags || []} onChange={set("tags")} placeholder="Add tag" /></Field>
            <Field label="Excerpt"><TextArea value={form.excerpt} onChange={set("excerpt")} rows={2} placeholder="Short summary..." /></Field>
          </div>

          <div className="glass-cell rounded-2xl p-6">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Content</label>
            <Wysiwyg value={form.content} onChange={set("content")} />
          </div>

          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">SEO Settings</p>
            <Field label="Meta Title"><TextInput value={form.metaTitle} onChange={set("metaTitle")} placeholder="SEO title" /></Field>
            <Field label="Meta Description"><TextArea value={form.metaDescription} onChange={set("metaDescription")} rows={2} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Cover Image"><MediaPicker value={form.coverImage} onChange={set("coverImage")} /></Field>
              <Field label="OG Image"><MediaPicker value={form.ogImage} onChange={set("ogImage")} /></Field>
            </div>
            <Toggle checked={form.noindex} onChange={set("noindex")} label="Noindex (hide from search engines)" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">Publish Settings</p>
            <Field label="Publish Date"><TextInput type="date" value={form.publishDate} onChange={set("publishDate")} /></Field>
            <Field label="Status"><Select value={form.status} onChange={set("status")} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "scheduled", label: "Scheduled" }]} /></Field>
            {form.status === "scheduled" && <Field label="Schedule Date & Time"><TextInput type="datetime-local" value={form.scheduledDate} onChange={set("scheduledDate")} /></Field>}
          </div>

          <div className="glass-cell rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5"><Search className="w-3.5 h-3.5" /> Google Preview</p>
            <div className="rounded-lg overflow-hidden">
              <p className="text-xs text-slate-500 truncate">{`lookalikesolutions.com/blog/${form.slug || "..."}`}</p>
              <p className="text-base text-indigo-accent truncate hover:underline cursor-pointer">{form.metaTitle || form.title || "Post Title"}</p>
              <p className="text-xs text-slate-600 line-clamp-2">{form.metaDescription || form.excerpt || "Your meta description will appear here..."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}