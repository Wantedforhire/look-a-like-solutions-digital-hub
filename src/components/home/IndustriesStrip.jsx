import SectionHeading from "@/components/ui-custom/SectionHeading";
import IndustryCard from "@/components/shared/IndustryCard";
import CTAButton from "@/components/ui-custom/CTAButton";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import { Sparkles } from "lucide-react";

const featuredNames = ["Healthcare Marketing", "Real Estate & Interiors", "B2B & Technical Products"];

export default function IndustriesStrip({ industries = [] }) {
  if (!industries.length) return null;
  const featured = industries.filter((ind) => featuredNames.some((fn) => ind.name && ind.name.toLowerCase().includes(fn.toLowerCase().split(" ")[0])));
  const remaining = industries.filter((ind) => !featured.includes(ind));

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Sector Expertise"
          title="Industries We Specialise In"
          subtitle="We speak the language of your sector — tailored growth strategies built on industry-specific insight."
        />

        {featured.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {featured.map((ind, i) => (
              <ScrollReveal key={ind.id} delay={i * 0.06}>
                <div className="relative rounded-2xl p-7 bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-accent bg-emerald-50 border border-emerald-accent/20">
                    <Sparkles className="w-3 h-3" /> FEATURED
                  </span>
                  <IndustryCard industry={ind} index={0} bare />
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {remaining.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {remaining.slice(0, 8).map((ind, i) => (
              <IndustryCard key={ind.id} industry={ind} index={i} compact />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <CTAButton to="/industries" variant="secondary">Discuss Your Industry →</CTAButton>
        </div>
      </div>
    </section>
  );
}