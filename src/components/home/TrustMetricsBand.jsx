import AnimatedCounter from "@/components/ui-custom/AnimatedCounter";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

const metrics = [
  { value: 500, suffix: "+", label: "Businesses Served" },
  { value: 150, suffix: "+", label: "Projects Completed" },
  { value: 250, suffix: "%", label: "Avg Traffic Growth" },
  { value: 320, suffix: "%", label: "Avg PPC ROI" },
  { value: 98, suffix: "%", label: "Client Satisfaction" }
];

export default function TrustMetricsBand() {
  return (
    <section className="border-y border-white/10 bg-black/40 py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
        {metrics.map((m, i) => (
          <ScrollReveal key={m.label} delay={i * 0.05} className="text-center">
            <p className="text-3xl md:text-4xl font-extrabold text-pearl">
              <AnimatedCounter value={m.value} suffix={m.suffix} />
            </p>
            <p className="text-xs md:text-sm text-slate-sub mt-2">{m.label}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}