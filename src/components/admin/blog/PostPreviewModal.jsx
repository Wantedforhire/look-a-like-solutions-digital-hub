import SafeHtml from "@/components/ui-custom/SafeHtml";
import { X } from "lucide-react";

export default function PostPreviewModal({ form, onClose }) {
  const serpTitle = form.metaTitle || form.title || "Post title";
  const serpDescription = form.metaDescription || form.excerpt || "";

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <p className="font-bold text-slate-900">Preview</p>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Google result</p>
            <p className="text-xs text-slate-500 truncate">lookalikesolutions.com/blog/{form.slug || "post-slug"}</p>
            <p className="text-base text-indigo-accent truncate">{serpTitle}</p>
            <p className="text-xs text-slate-600 line-clamp-2">{serpDescription}</p>
          </div>

          <article>
            {form.category || form.categories?.[0] ? (
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-accent">{form.categories?.[0] || form.category}</span>
            ) : null}
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 mb-2">{form.title || "Untitled post"}</h1>
            <p className="text-sm text-slate-500 mb-4">
              {form.author || "Look A Like Solutions"}
              {form.authorRole ? ` · ${form.authorRole}` : ""}
            </p>
            {form.coverImage && (
              <img src={form.coverImage} alt={form.coverImageAlt || form.title} className="rounded-xl w-full object-cover mb-6" />
            )}
            <SafeHtml
              html={form.content || "<p class='text-slate-400'>No content yet.</p>"}
              className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-heading prose-p:text-slate-600 prose-li:text-slate-600 prose-a:text-indigo-accent"
            />
          </article>
        </div>
      </div>
    </div>
  );
}