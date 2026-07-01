import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import { getIcon } from "@/lib/iconMap";

export default function IndustryCard({ industry, index = 0 }) {
  const Icon = getIcon(industry.icon);
  return (
    <ScrollReveal delay={index * 0.05}>
      <div className="glass-cell rounded-2xl p-6 h-full hover:border-emerald-accent/50 transition-colors duration-300">
        <Icon className="w-8 h-8 text-emerald-accent mb-4" />
        <h3 className="text-base font-bold text-pearl mb-2">{industry.name}</h3>
        <p className="text-sm text-slate-sub leading-relaxed">{industry.description}</p>
      </div>
    </ScrollReveal>
  );
}