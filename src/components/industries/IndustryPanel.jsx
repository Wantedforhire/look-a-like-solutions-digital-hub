import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import { getIcon } from "@/lib/iconMap";

export default function IndustryPanel({ industry, servicesByTitle = {}, index = 0 }) {
  const Icon = getIcon(industry.icon);
  const services = Array.isArray(industry.relevantServices) ? industry.relevantServices.filter(Boolean) : [];

  return (
    <ScrollReveal delay={index * 0.05} className="h-full">
      <div className="h-full flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg hover:border-indigo-accent/30 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-indigo-accent" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">{industry.name}</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{industry.description}</p>
          </div>
        </div>

        {services.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Services for this sector
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {services.map((name) => {
                const slug = servicesByTitle[name.trim().toLowerCase()];
                return slug ? (
                  <Link
                    key={name}
                    to={`/services/${slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-indigo-accent hover:text-indigo-accent transition-colors"
                  >
                    {name}
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                ) : (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <Link
          to="/contact"
          className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-accent hover:gap-2.5 transition-all"
        >
          Discuss your {industry.name.toLowerCase()} goals
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </ScrollReveal>
  );
}