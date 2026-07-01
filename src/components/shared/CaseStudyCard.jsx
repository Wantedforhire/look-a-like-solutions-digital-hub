import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

export default function CaseStudyCard({ caseStudy, index = 0 }) {
  return (
    <ScrollReveal delay={index * 0.06} className="h-full">
      <Link
        to={`/case-studies/${caseStudy.slug}`}
        className="group relative flex flex-col h-full rounded-2xl overflow-hidden glass-cell hover:border-emerald-accent/50 transition-all duration-300"
      >
        <div className="relative h-48 overflow-hidden bg-white/5">
          {caseStudy.thumbnail && (
            <img
              src={caseStudy.thumbnail}
              alt={`${caseStudy.clientName} case study result`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <p className="text-3xl font-extrabold text-emerald-accent tracking-tight">{caseStudy.heroMetricValue}</p>
          <p className="text-xs uppercase tracking-wider text-slate-sub mb-3">{caseStudy.heroMetricLabel}</p>
          <h3 className="text-base font-bold text-pearl">{caseStudy.clientName}</h3>
          <p className="text-sm text-slate-sub mt-1">{caseStudy.industry} &middot; {caseStudy.service}</p>
        </div>
      </Link>
    </ScrollReveal>
  );
}