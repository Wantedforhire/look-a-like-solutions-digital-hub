import ScrollReveal from "@/components/ui-custom/ScrollReveal";

const metrics = [
  { value: 100, suffix: "+", label: "Businesses Worked With" },
  { value: 15, suffix: "+", label: "Years Hands-On Experience" },
  { value: 3, suffix: "x", label: "Avg Lead Growth" },
  { value: 50, suffix: "Cr+", label: "Ad Spend Managed", prefix: "₹" },
  { value: 9, suffix: "", label: "Core Services Offered" }
];

export default function TrustMetricsBand() {
  return (
    <section className="border-y border-slate-100 bg-slate-50 py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
        {metrics.map((m, i) => (
          <ScrollReveal key={m.label} delay={i * 0.05} className="text-center">
            <p className="text-3xl md:text-4xl font-extrabold text-pearl">
              {m.prefix}{m.value}{m.suffix}
            </p>
            <p className="text-xs md:text-sm text-slate-sub mt-2">{m.label}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}