import { Field, TextInput, TextArea, TagInput, Toggle } from "@/components/admin/FormFields";
import MediaPicker from "@/components/admin/MediaPicker";
import { Sparkles } from "lucide-react";

function Counter({ value, min, max }) {
  const len = (value || "").length;
  const color = len === 0 ? "text-slate-400" : len >= min && len <= max ? "text-emerald-accent" : "text-amber-600";
  return <span className={`text-[11px] font-mono ${color}`}>{len}/{max}</span>;
}

export default function SeoCard({ form, set, onGenerateSeo, generating }) {
  return (
    <div className="glass-cell rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">SEO & Social</p>
        <button
          type="button"
          onClick={onGenerateSeo}
          disabled={generating}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-indigo-accent hover:bg-indigo-50 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" /> {generating ? "Working…" : "AI suggest"}
        </button>
      </div>

      <Field label="SEO Title">
        <TextInput value={form.metaTitle || ""} onChange={set("metaTitle")} placeholder="Defaults to the post title" />
        <div className="flex justify-end mt-1"><Counter value={form.metaTitle || form.title} min={40} max={60} /></div>
      </Field>

      <Field label="Meta Description">
        <TextArea value={form.metaDescription || ""} onChange={set("metaDescription")} rows={2} placeholder="Defaults to the excerpt" />
        <div className="flex justify-end mt-1"><Counter value={form.metaDescription || form.excerpt} min={120} max={160} /></div>
      </Field>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Focus Keyword">
          <TextInput value={form.focusKeyword || ""} onChange={set("focusKeyword")} placeholder="e.g. performance marketing agency" />
        </Field>
        <Field label="Canonical URL" hint="Leave blank to use this post's own URL">
          <TextInput value={form.canonicalUrl || ""} onChange={set("canonicalUrl")} placeholder={`/blog/${form.slug || "post-slug"}`} />
        </Field>
      </div>

      <Field label="Secondary Keywords">
        <TagInput value={form.secondaryKeywords || []} onChange={set("secondaryKeywords")} placeholder="Add keyword" />
      </Field>

      <div className="pt-2 border-t border-slate-100 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Open Graph</p>
        <Field label="OG Title">
          <TextInput value={form.ogTitle || ""} onChange={set("ogTitle")} placeholder="Defaults to the SEO title" />
        </Field>
        <Field label="OG Description">
          <TextArea value={form.ogDescription || ""} onChange={set("ogDescription")} rows={2} placeholder="Defaults to the meta description" />
        </Field>
        <Field label="OG Image">
          <MediaPicker value={form.ogImage || ""} onChange={set("ogImage")} label="" />
        </Field>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <Toggle checked={!!form.noindex} onChange={set("noindex")} label="Noindex — keep out of Google and the sitemap" />
        <p className="text-[11px] text-slate-400 mt-2">
          Article (BlogPosting) structured data is generated automatically from these fields.
        </p>
      </div>
    </div>
  );
}