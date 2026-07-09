import { Link } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

export default function ResourceCard({ resource, index = 0 }) {
  const catColors = {
    Guide: "bg-indigo-50 text-indigo-accent",
    Checklist: "bg-emerald-50 text-emerald-600",
    Template: "bg-amber-50 text-amber-600",
    Report: "bg-sky-50 text-sky-600",
  };
  return (
    <ScrollReveal delay={index * 0.06} className="h-full">
      <div className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative h-40 overflow-hidden bg-slate-100">
          {resource.coverImage ? (
            <img src={resource.coverImage} alt={resource.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <FileText className="w-12 h-12 text-slate-300" />
            </div>
          )}
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold ${catColors[resource.category] || "bg-slate-100 text-slate-600"}`}>
            {resource.category}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-base font-bold text-slate-900 mb-2">{resource.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed flex-1">{resource.description}</p>
          {resource.fileUrl && (
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-accent hover:gap-2.5 transition-all"
            >
              <Download className="w-4 h-4" /> Download
            </a>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}