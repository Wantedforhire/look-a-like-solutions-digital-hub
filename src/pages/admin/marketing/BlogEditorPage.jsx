import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Field, TextInput, TextArea, TagInput } from "@/components/admin/FormFields";
import MediaPicker from "@/components/admin/MediaPicker";
import ContentEditor from "@/components/admin/blog/ContentEditor";
import PublishCard from "@/components/admin/blog/PublishCard";
import SeoCard from "@/components/admin/blog/SeoCard";
import AiPanel from "@/components/admin/blog/AiPanel";
import PostPreviewModal from "@/components/admin/blog/PostPreviewModal";
import { slugify } from "@/lib/adminUtils";
import { istInputToUtc, utcToIstInput } from "@/lib/ist";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Eye, Loader2, Save, Send, UploadCloud, ExternalLink } from "lucide-react";

const EMPTY = {
  title: "", slug: "", excerpt: "", content: "", category: "", categories: [], tags: [],
  coverImage: "", coverImageAlt: "", author: "", authorRole: "", authorBio: "",
  lastReviewedDate: "", publishDate: "", publishedAt: null, scheduledDate: "", scheduledIst: "",
  status: "draft", metaTitle: "", metaDescription: "", focusKeyword: "", secondaryKeywords: [],
  canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "", noindex: false,
  aiAssisted: false, aiApproved: false, previousSlugs: [],
};

const SAVE_MESSAGES = {
  draft: "Draft saved",
  review: "Submitted for review",
  scheduled: "Post scheduled (IST)",
  published: "Post published",
  archived: "Post archived",
};

export default function BlogEditorPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();
  const { role } = useOutletContext() || {};
  const isApprover = role === "super_admin" || role === "admin";

  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [showPreview, setShowPreview] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const loadedRef = useRef(false);
  const formRef = useRef(form);
  const lastSnapshotRef = useRef("");

  useEffect(() => { formRef.current = form; }, [form]);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["blog-post-admin", id],
    queryFn: async () => {
      const rows = await base44.entities.BlogPost.filter({ id });
      return rows[0] || null;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (!existing || loadedRef.current) return;
    loadedRef.current = true;
    setForm({
      ...EMPTY,
      ...existing,
      categories: existing.categories?.length ? existing.categories : existing.category ? [existing.category] : [],
      secondaryKeywords: existing.secondaryKeywords || [],
      tags: existing.tags || [],
      scheduledIst: utcToIstInput(existing.scheduledDate),
    });
    lastSnapshotRef.current = JSON.stringify(existing);
  }, [existing]);

  useEffect(() => {
    if (!slugTouched && form.title) setForm((f) => ({ ...f, slug: slugify(f.title) }));
  }, [form.title, slugTouched]);

  // Local autosave — protects unsaved work if the tab closes.
  useEffect(() => {
    if (isLoading) return;
    if (!form.title && !form.content) return;
    setSaveState("unsaved");
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`blog-autosave-${id || "new"}`, JSON.stringify(form));
        setSaveState((s) => (s === "saving" ? s : "local"));
      } catch {
        /* storage full — ignore */
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [form, id, isLoading]);

  // Server autosave every 30s for drafts in progress.
  useEffect(() => {
    if (isNew) return;
    const timer = setInterval(() => {
      const f = formRef.current;
      if (!["draft", "review"].includes(f.status)) return;
      const snapshot = JSON.stringify(f);
      if (snapshot === lastSnapshotRef.current) return;
      persist(f.status, { silent: true });
    }, 30000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, id]);

  // Restore an unsaved new post after a reload.
  useEffect(() => {
    if (!isNew) return;
    try {
      const raw = localStorage.getItem("blog-autosave-new");
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.title || saved?.content) {
        setForm((f) => ({ ...f, ...saved }));
        toast({ title: "Unsaved draft restored" });
      }
    } catch {
      /* ignore corrupt draft */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const [seoGenerating, setSeoGenerating] = useState(false);
  const generateSeo = async () => {
    if (!form.title && !form.content) {
      toast({ title: "Add a title or content first", variant: "destructive" });
      return;
    }
    setSeoGenerating(true);
    try {
      const res = await base44.functions.invoke("blogAI", {
        action: "seo",
        title: form.title,
        content: form.content,
        keyword: form.focusKeyword,
      });
      const d = res.data.result || {};
      setForm((f) => ({
        ...f,
        metaTitle: d.metaTitle || f.metaTitle,
        metaDescription: d.metaDescription || f.metaDescription,
        focusKeyword: d.focusKeyword || f.focusKeyword,
        secondaryKeywords: d.secondaryKeywords?.length ? d.secondaryKeywords : f.secondaryKeywords,
      }));
      toast({ title: "SEO suggestions applied", description: "Review them before publishing." });
    } catch (e) {
      toast({ title: e.response?.data?.error || "AI request failed", variant: "destructive" });
    } finally {
      setSeoGenerating(false);
    }
  };

  const buildPayload = (status, source = formRef.current) => {
    const payload = {
      ...source,
      status: status || source.status,
      category: source.categories?.[0] || source.category || "",
      scheduledDate: source.scheduledIst ? istInputToUtc(source.scheduledIst) : "",
    };
    delete payload.scheduledIst;
    return payload;
  };

  const persist = async (status, { silent = false } = {}) => {
    const nextStatus = status || formRef.current.status;
    const current = formRef.current;

    if (!current.title.trim()) {
      if (!silent) toast({ title: "Add a post title before saving", variant: "destructive" });
      return;
    }
    if (nextStatus === "scheduled" && !current.scheduledIst) {
      toast({ title: "Choose a schedule date and time (IST)", variant: "destructive" });
      return;
    }
    if (nextStatus === "published" && !current.content.trim()) {
      toast({ title: "Add article content before publishing", variant: "destructive" });
      return;
    }
    if (nextStatus === "published" && current.aiAssisted && !current.aiApproved && !isApprover) {
      toast({ title: "AI-assisted content needs administrator approval before publishing", variant: "destructive" });
      return;
    }

    setSaving(true);
    setSaveState("saving");
    try {
      const res = await base44.functions.invoke("blogAdmin", {
        action: "save",
        id: isNew ? undefined : id,
        data: buildPayload(nextStatus, current),
      });
      const saved = res.data.post;
      const next = { ...formRef.current, ...saved, scheduledIst: utcToIstInput(saved.scheduledDate) };
      setForm(next);
      lastSnapshotRef.current = JSON.stringify(next);
      setSaveState("saved");
      try { localStorage.removeItem(`blog-autosave-${id || "new"}`); } catch { /* ignore */ }

      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blog-counts"] });
      qc.invalidateQueries({ queryKey: ["blog-recent"] });
      qc.invalidateQueries({ queryKey: ["blog-categories"] });

      if (isNew) navigate(`/super-admin/marketing/blogs/${saved.id}/edit`, { replace: true });
      if (!silent) toast({ title: SAVE_MESSAGES[saved.status] || "Saved" });
    } catch (e) {
      setSaveState("unsaved");
      if (!silent) toast({ title: e.response?.data?.error || "Could not save the post", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const applyAi = (patch, aiAssisted = true) =>
    setForm((f) => ({
      ...f,
      ...patch,
      ...(aiAssisted ? { aiAssisted: true, aiApproved: false } : {}),
    }));

  const saveLabel = useMemo(() => {
    if (saving || saveState === "saving") return "Saving…";
    if (saveState === "saved") return "All changes saved";
    if (saveState === "local") return "Saved locally";
    if (saveState === "unsaved") return "Unsaved changes";
    return "";
  }, [saving, saveState]);

  if (!isNew && isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading post…
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <Link to="/super-admin/marketing/blogs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-accent">
            <ArrowLeft className="w-4 h-4" /> Blog Management
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            {isNew ? "New Blog Post" : form.title || "Edit Post"}
          </h1>
          {saveLabel && <p className="text-[11px] text-slate-400 mt-1">{saveLabel}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {form.status === "published" && form.slug && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ExternalLink className="w-4 h-4" /> View live
            </a>
          )}
          <button onClick={() => setShowPreview(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button onClick={() => persist("draft")} disabled={saving} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          {form.status !== "published" && (
            <button onClick={() => persist("review")} disabled={saving} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60">
              <UploadCloud className="w-4 h-4" /> Submit for Review
            </button>
          )}
          <button
            onClick={() => persist(["scheduled", "archived"].includes(form.status) ? form.status : "published")}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {form.status === "published" ? "Update Post" : form.status === "scheduled" ? "Schedule Post" : form.status === "archived" ? "Save as Archived" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <Field label="Blog Title *">
              <TextInput value={form.title} onChange={set("title")} placeholder="How to grow leads with performance marketing" />
            </Field>
            <Field label="URL Slug" hint={`/blog/${form.slug || "post-slug"}`}>
              <TextInput
                value={form.slug}
                onChange={(v) => { setSlugTouched(true); set("slug")(v); }}
                placeholder="post-slug"
              />
            </Field>
            <Field label="Short Excerpt" hint="Used in listings, search results, and social cards.">
              <TextArea value={form.excerpt} onChange={set("excerpt")} rows={3} placeholder="One or two sentences summarising the article…" />
            </Field>
          </div>

          <ContentEditor value={form.content} onChange={set("content")} />

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="glass-cell rounded-2xl p-5 space-y-4">
              <p className="text-sm font-bold text-slate-900">Featured Image</p>
              <MediaPicker value={form.coverImage} onChange={set("coverImage")} label="" />
              <Field label="Image Alt Text" hint="Describe the image for accessibility and AI search.">
                <TextInput value={form.coverImageAlt} onChange={set("coverImageAlt")} placeholder="Team reviewing campaign results" />
              </Field>
            </div>

            <div className="glass-cell rounded-2xl p-5 space-y-4">
              <p className="text-sm font-bold text-slate-900">Categories & Tags</p>
              <Field label="Categories">
                <TagInput value={form.categories} onChange={set("categories")} placeholder="Add category" />
              </Field>
              <Field label="Tags">
                <TagInput value={form.tags} onChange={set("tags")} placeholder="Add tag" />
              </Field>
            </div>
          </div>

          <div className="glass-cell rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-900">Author</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Author Name"><TextInput value={form.author} onChange={set("author")} placeholder="Author name" /></Field>
              <Field label="Role / Expertise"><TextInput value={form.authorRole} onChange={set("authorRole")} placeholder="e.g. Head of SEO" /></Field>
            </div>
            <Field label="Author Bio"><TextArea value={form.authorBio} onChange={set("authorBio")} rows={2} placeholder="One or two lines about the author's experience." /></Field>
            <Field label="Last Reviewed Date"><TextInput type="date" value={form.lastReviewedDate} onChange={set("lastReviewedDate")} /></Field>
          </div>
        </div>

        <div className="space-y-5">
          <PublishCard
            form={form}
            set={set}
            isApprover={isApprover}
            onApprove={() => setForm((f) => ({ ...f, aiApproved: true }))}
          />
          <SeoCard form={form} set={set} generating={seoGenerating} onGenerateSeo={generateSeo} />
          <div id="ai-panel">
            <AiPanel form={form} onApply={applyAi} />
          </div>
        </div>
      </div>

      {showPreview && <PostPreviewModal form={form} onClose={() => setShowPreview(false)} />}
    </div>
  );
}