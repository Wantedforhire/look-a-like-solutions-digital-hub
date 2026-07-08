import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import { getIcon } from "@/lib/iconMap";

export default function IndustryCard({ industry, index = 0, compact = false, bare = false }) {
  const Icon = getIcon(industry.icon);
  const content = (
    <>
      <Icon className={`${compact ? "w-6 h-6 mb-2" : "w-8 h-8 mb-4"} text-emerald-accent`} />
      <h3 className={`${compact ? "text-sm mb-1" : "text-base mb-2"} font-bold text-slate-900`}>{industry.name}</h3>
      {!compact && <p className="text-sm text-slate-500 leading-relaxed">{industry.description}</p>}
      {compact && <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{industry.description}</p>}
    </>
  );

  if (bare) return content;

  return (
    <ScrollReveal delay={index * 0.05}>
      <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-accent/30 transition-all duration-300 h-full">
        {content}
      </div>
    </ScrollReveal>
  );
}