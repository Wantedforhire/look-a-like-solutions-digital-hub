import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MediaCard from "@/components/admin/MediaCard";
import { Upload, Copy, Trash2, X, Check, Loader2 } from "lucide-react";

export default function MediaLibrary() {
  const qc = useQueryClient();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewAlt, setPreviewAlt] = useState("");
  const [copied, setCopied] = useState("");

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["admin-media", "all"],
    queryFn: () => base44.entities.MediaImage.list("-uploadedAt"),
  });

  const delMutation = useMutation({
    mutationFn: (id) => base44.entities.MediaImage.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });

  const altMutation = useMutation({
    mutationFn: ({ id, alt }) => base44.entities.MediaImage.update(id, { alt }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });

  const openPreview = (img) => {
    setPreview(img);
    setPreviewAlt(img.alt || "");
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const res = await base44.integrations.Core.UploadFile({ file });
        await base44.entities.MediaImage.create({
          url: res.file_url, filename: file.name, size: file.size,
          contentType: file.type, uploadedAt: new Date().toISOString(),
        });
      }
      qc.invalidateQueries({ queryKey: ["admin-media"] });
    } catch (err) {
      alert("Upload failed: " + (err.message || "error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  };

  const savePreviewAlt = () => {
    const value = previewAlt.trim();
    if (value !== (preview.alt || "")) altMutation.mutate({ id: preview.id, alt: value });
    setPreview((p) => ({ ...p, alt: value }));
  };

  return (
    <div>
      <AdminPageHeader title="Media Library" subtitle="Upload and manage images used across your website."
        actions={
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        }
      />
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />

      {isLoading ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : images.length === 0 ? (
        <div className="glass-cell rounded-2xl p-16 text-center">
          <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">No images yet. Click "Upload Images" to get started.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-4">Add descriptive alt text to every image — it improves accessibility and image SEO. Alt text saves when you click outside the field.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <MediaCard
                key={img.id}
                img={img}
                copied={copied}
                onCopy={copyUrl}
                onPreview={openPreview}
                onDelete={(id) => delMutation.mutate(id)}
                onSaveAlt={(id, alt) => altMutation.mutate({ id, alt })}
              />
            ))}
          </div>
        </>
      )}

      {preview && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <p className="font-semibold text-slate-900 text-sm truncate">{preview.filename}</p>
              <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <img src={preview.url} alt={preview.alt || preview.filename} className="w-full max-h-[60vh] object-contain bg-slate-50" />
            <div className="px-5 py-4 border-t border-slate-200 space-y-3">
              <div className="flex gap-2 items-center">
                <input
                  value={previewAlt}
                  onChange={(e) => setPreviewAlt(e.target.value)}
                  placeholder="Alt text (describe the image)"
                  aria-label="Alt text"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-indigo-accent focus:ring-2 focus:ring-indigo-accent/20 outline-none"
                />
                <button onClick={savePreviewAlt} disabled={altMutation.isPending} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-60">
                  {altMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Save Alt
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input value={preview.url} readOnly className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 bg-slate-50" />
                <button onClick={() => copyUrl(preview.url)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500">
                  {copied === preview.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}