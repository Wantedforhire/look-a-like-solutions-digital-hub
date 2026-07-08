import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import EyebrowLabel from "@/components/ui-custom/EyebrowLabel";
import GrowthAuditForm from "@/components/forms/GrowthAuditForm";
import { Link } from "react-router-dom";

export default function GrowthAuditSection() {
  return (
    <section className="py-24 px-6 bg-indigo-50/40 border-y border-slate-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <ScrollReveal>
          <EyebrowLabel className="mb-4">Free Growth Audit</EyebrowLabel>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-5">
            Find Out Where Your Marketing Is Losing Money
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Get a practical review of your current website, advertising, SEO, tracking, and conversion funnel — free, no obligation.
          </p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2"><span className="text-emerald-accent mt-0.5">✓</span> Where your ad spend is being wasted</li>
            <li className="flex items-start gap-2"><span className="text-emerald-accent mt-0.5">✓</span> SEO gaps blocking organic traffic</li>
            <li className="flex items-start gap-2"><span className="text-emerald-accent mt-0.5">✓</span> Tracking issues hiding real performance</li>
            <li className="flex items-start gap-2"><span className="text-emerald-accent mt-0.5">✓</span> Conversion funnel leaks losing leads</li>
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <GrowthAuditForm compact />
          <p className="mt-4 text-center text-sm">
            <Link to="/growth-audit" className="text-indigo-accent hover:underline font-medium">
              Prefer a full page? View the dedicated Growth Audit page →
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}