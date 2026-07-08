import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { bytesToSize, formatDate } from "@/lib/adminUtils";
import { Upload, Copy, Trash2, X, Check, Loader2 } from "lucide-react";

export default function MediaLibrary() {
  const qc = useQueryClient();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState("");

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["admin-media", "all"],
    queryFn: () => base44.entities.MediaImage.list("-uploadedAt"),
  });

  const delMutation = useMutation({
    mutationFn: (id) => base44.entities.MediaImage.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="glass-cell rounded-xl overflow-hidden group">
              <button onClick={() => setPreview(img)} className="block w-full aspect-square overflow-hidden bg-slate-100">
                <img src={img.url} alt={img.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </button>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-slate-700 truncate">{img.filename}</p>
                <p className="text-[10px] text-slate-400">{bytesToSize(img.size)} · {formatDate(img.uploadedAt)}</p>
                <div className="flex gap-1.5 mt-2">
                  <button onClick={() => copyUrl(img.url)} className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold hover:bg-slate-200">
                    {copied === img.url ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />} Copy
                  </button>
                  <button onClick={() => confirm(`Delete ${img.filename}?`) && delMutation.mutate(img.id)} className="px-2 py-1 rounded-md text-rose-500 hover:bg-rose-50"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <p className="font-semibold text-slate-900 text-sm truncate">{preview.filename}</p>
              <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <img src={preview.url} alt={preview.filename} className="w-full max-h-[60vh] object-contain bg-slate-50" />
            <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <input value={preview.url} readOnly className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 bg-slate-50" />
              <button onClick={() => copyUrl(preview.url)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500">
                {copied === preview.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}