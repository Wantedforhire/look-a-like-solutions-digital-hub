import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Upload, Check, X } from "lucide-react";
import { useState } from "react";

export default function MediaPicker({ value, onChange, label = "Image" }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: images = [], refetch } = useQuery({
    queryKey: ["admin-media", "all"],
    queryFn: () => base44.entities.MediaImage.list("-uploadedAt", 40),
    enabled: open,
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.MediaImage.create({
        url: res.file_url,
        filename: file.name,
        size: file.size,
        contentType: file.type,
        uploadedAt: new Date().toISOString(),
      });
      refetch();
    } catch (err) {
      alert("Upload failed: " + (err.message || "unknown error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      {label && <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>}
      <div className="flex items-center gap-3">
        {value && (
          <img src={value} alt="preview" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {value ? "Change Image" : "Select from Library"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-slate-400 hover:text-red-500">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Media Library</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-slate-200">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold cursor-pointer hover:bg-indigo-500 transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload New Image"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            <div className="overflow-y-auto p-4">
              {images.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-sm">No images yet. Upload one to get started.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        onChange(img.url);
                        setOpen(false);
                      }}
                      className="relative group rounded-lg overflow-hidden border border-slate-200 hover:border-indigo-accent transition-colors aspect-square"
                    >
                      <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}