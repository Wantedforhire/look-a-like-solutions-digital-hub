import { useState } from "react";
import { Copy, Trash2, Check } from "lucide-react";
import { bytesToSize, formatDate } from "@/lib/adminUtils";

export default function MediaCard({ img, copied, onCopy, onDelete, onPreview, onSaveAlt }) {
  const [alt, setAlt] = useState(img.alt || "");

  const commitAlt = () => {
    const value = alt.trim();
    if (value !== (img.alt || "")) onSaveAlt(img.id, value);
  };

  return (
    <div className="glass-cell rounded-xl overflow-hidden group">
      <button onClick={() => onPreview(img)} className="block w-full aspect-square overflow-hidden bg-slate-100">
        <img src={img.url} alt={img.alt || img.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </button>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-slate-700 truncate">{img.filename}</p>
        <p className="text-[10px] text-slate-400">{bytesToSize(img.size)} · {formatDate(img.uploadedAt)}</p>
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={commitAlt}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          placeholder="Alt text"
          aria-label={`Alt text for ${img.filename}`}
          className="mt-2 w-full px-2 py-1 rounded-md border border-slate-200 text-[11px] text-slate-700 focus:border-indigo-accent focus:ring-1 focus:ring-indigo-accent/20 outline-none"
        />
        <div className="flex gap-1.5 mt-2">
          <button onClick={() => onCopy(img.url)} className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold hover:bg-slate-200">
            {copied === img.url ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />} Copy
          </button>
          <button onClick={() => confirm(`Delete ${img.filename}?`) && onDelete(img.id)} className="px-2 py-1 rounded-md text-rose-500 hover:bg-rose-50"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  );
}