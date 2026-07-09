import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

export default function InsightCard({ insight, index = 0 }) {
  return (
    <ScrollReveal delay={index * 0.06} className="h-full">
      <Link
        to={`/insights/${insight.slug}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-accent/30 transition-all duration-300"
      >
        <div className="relative h-48 overflow-hidden bg-slate-100">
          {insight.coverImage && (
            <img src={insight.coverImage} alt={insight.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          {insight.category && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-accent mb-2">{insight.category}</p>
          )}
          <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-accent transition-colors">{insight.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed flex-1">{insight.excerpt}</p>
          <p className="text-xs text-slate-400 mt-4">{insight.author || "Look A Like Solutions"}</p>
        </div>
      </Link>
    </ScrollReveal>
  );
}