import SectionHeading from "@/components/ui-custom/SectionHeading";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import AnimatedCounter from "@/components/ui-custom/AnimatedCounter";

const metrics = [
  { value: 100, suffix: "+", label: "Businesses Worked With", color: "text-indigo-accent" },
  { value: 15, suffix: "+", label: "Years Hands-On Experience", color: "text-emerald-accent" },
  { value: 3, suffix: "x", label: "Avg Lead Growth", color: "text-indigo-accent" },
  { value: 50, suffix: "%", label: "Cost Per Lead Reduced", color: "text-emerald-accent", prefix: "40-60" },
  { value: 10, suffix: "K+", label: "YouTube Subscribers Generated", color: "text-indigo-accent" },
  { value: 0, suffix: "+", label: "Multi-Industry Campaign Experience", color: "text-emerald-accent", staticText: "8+" }
];

export default function ResultsSection() {
  return (
    <section className="py-24 px-6 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Validated Outcomes"
          title="Results That Matter To Business Owners"
          subtitle="Not vanity metrics. These are the numbers that actually impact your bottom line."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <ScrollReveal key={m.label} delay={i * 0.06}>
              <div className="glass-cell rounded-2xl p-7 h-full hover:shadow-md transition-shadow duration-300">
                <p className={`text-4xl font-extrabold tracking-tight ${m.color}`}>
                  {m.staticText || (m.prefix ? m.prefix : <AnimatedCounter value={m.value} suffix={m.suffix} />)}
                </p>
                <p className="text-sm text-slate-500 mt-3 leading-relaxed">{m.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-slate-400 italic">
          Results vary by industry, budget, and campaign type.
        </p>
      </div>
    </section>
  );
}