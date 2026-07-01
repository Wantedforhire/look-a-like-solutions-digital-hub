import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import { getIcon } from "@/lib/iconMap";

export default function ServiceCard({ service, index = 0 }) {
  const Icon = getIcon(service.icon);
  return (
    <ScrollReveal delay={index * 0.06}>
      <Link
        to={`/services/${service.slug}`}
        className="group relative block h-full p-7 rounded-2xl glass-cell hover:border-indigo-accent/50 transition-all duration-300 hover:-translate-y-1"
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-accent/10 flex items-center justify-center mb-5 group-hover:bg-indigo-accent/20 transition-colors">
          <Icon className="w-6 h-6 text-indigo-accent" />
        </div>
        <h3 className="text-lg font-bold text-pearl mb-2">{service.title}</h3>
        <p className="text-sm text-slate-sub leading-relaxed mb-4">{service.shortDescription}</p>
        {service.metricLabel && (
          <p className="text-xs font-semibold text-emerald-accent mb-4">✓ {service.metricLabel}</p>
        )}
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-accent group-hover:gap-2.5 transition-all">
          Learn More <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </ScrollReveal>
  );
}