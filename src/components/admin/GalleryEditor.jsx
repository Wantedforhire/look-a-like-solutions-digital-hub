import { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import MediaPicker from "@/components/admin/MediaPicker";
import { Upload, Trash2, Loader2 } from "lucide-react";

export default function GalleryEditor({ value, onChange }) {
  const images = Array.isArray(value) ? value : [];
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const add = (url) => { if (url) onChange([...images, { url, alt: "" }]); };
  const setAlt = (i, alt) => onChange(images.map((img, idx) => (idx === i ? { ...img, alt } : img)));
  const remove = (i) => onChange(images.filter((_, idx) => idx !== i));

  const upload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const next = [...images];
      for (const file of files) {
        const res = await base44.integrations.Core.UploadFile({ file });
        await base44.entities.MediaImage.create({
          url: res.file_url, filename: file.name, size: file.size,
          contentType: file.type, uploadedAt: new Date().toISOString(),
        });
        next.push({ url: res.file_url, alt: "" });
      }
      onChange(next);
    } catch (err) {
      alert("Upload failed: " + (err.message || "unknown error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
        <div className="min-w-[140px]">
          <MediaPicker value="" onChange={add} label="" />
        </div>
        <span className="text-[11px] text-slate-400">Recommended 1200 × 800 px, max 300 KB each.</span>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={upload} className="hidden" />

      {images.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {images.map((img, i) => (
            <div key={`${img.url}-${i}`} className="rounded-xl border border-slate-200 p-2.5 space-y-2">
              <div className="relative">
                <img src={img.url} alt={img.alt || "Gallery image"} className="w-full h-32 object-cover rounded-lg bg-slate-50" />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-white/90 text-slate-500 hover:text-red-600 shadow"
                  aria-label="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                value={img.alt || ""}
                onChange={(e) => setAlt(i, e.target.value)}
                placeholder="Alt text (describe the image)"
                aria-label="Alt text"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 outline-none focus:border-indigo-accent focus:ring-2 focus:ring-indigo-accent/20"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}