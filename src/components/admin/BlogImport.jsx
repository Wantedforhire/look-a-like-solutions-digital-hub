import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";

export default function BlogImport({ onClose, onImported }) {
  const [status, setStatus] = useState("idle"); // idle | uploading | extracting | importing | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setError("");
    try {
      const uploadRes = await base44.integrations.Core.UploadFile({ file });
      setStatus("extracting");

      const extractRes = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: uploadRes.file_url,
        json_schema: {
          type: "object",
          properties: {
            posts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  slug: { type: "string" },
                  category: { type: "string" },
                  excerpt: { type: "string" },
                  content: { type: "string" },
                  coverImage: { type: "string" },
                  author: { type: "string" },
                  publishDate: { type: "string" },
                  metaTitle: { type: "string" },
                  metaDescription: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                  status: { type: "string" },
                },
              },
            },
          },
        },
      });

      const posts = extractRes.output?.posts || (Array.isArray(extractRes.output) ? extractRes.output : []);
      if (!Array.isArray(posts) || posts.length === 0) {
        throw new Error("No blog posts found in the file. Make sure your columns include at least 'title' and 'content'.");
      }

      setStatus("importing");
      const slugify = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const postsToCreate = posts
        .filter((p) => p.title)
        .map((p) => ({
          ...p,
          slug: p.slug || slugify(p.title),
          excerpt: p.excerpt || "",
          content: p.content || "",
          status: p.status || "draft",
          tags: Array.isArray(p.tags) ? p.tags : [],
        }));

      if (postsToCreate.length === 0) {
        throw new Error("No valid posts found — each post needs at least a title.");
      }

      await base44.entities.BlogPost.bulkCreate(postsToCreate);
      setResult({ count: postsToCreate.length });
      setStatus("done");
      onImported?.();
    } catch (err) {
      setError(err.message || "Import failed.");
      setStatus("error");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Import Blog Posts from Excel</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {status === "idle" && (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Upload an Excel (.xlsx) or CSV file with your blog posts. Each row becomes a draft post.
                Columns can include: <span className="font-semibold">title, slug, category, excerpt, content, coverImage, author, publishDate, tags, status</span>.
              </p>
              <label className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-indigo-accent text-white text-sm font-semibold cursor-pointer hover:bg-indigo-500 transition-colors">
                <Upload className="w-4 h-4" /> Choose File
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
              </label>
            </div>
          )}

          {status !== "idle" && status !== "done" && status !== "error" && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-indigo-accent animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-600">
                {status === "uploading" && "Uploading file..."}
                {status === "extracting" && "Extracting blog posts..."}
                {status === "importing" && "Importing posts to database..."}
              </p>
            </div>
          )}

          {status === "done" && (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-accent mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-900 mb-2">Import Complete</p>
              <p className="text-sm text-slate-500">{result.count} blog posts imported as drafts.</p>
              <button onClick={onClose} className="mt-6 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
                Close
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-900 mb-2">Import Failed</p>
              <p className="text-sm text-red-500 mb-6">{error}</p>
              <button onClick={() => setStatus("idle")} className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}