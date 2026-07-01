import SectionHeading from "@/components/ui-custom/SectionHeading";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

const steps = [
  { n: "01", title: "Audit", desc: "Deep-dive analysis of your digital presence, competitors, and growth gaps." },
  { n: "02", title: "Strategy", desc: "A custom roadmap with clear KPIs, channels, and measurable milestones." },
  { n: "03", title: "Build", desc: "Creative, technical, and content assets built for conversion and speed." },
  { n: "04", title: "Launch", desc: "Coordinated go-live across SEO, paid, social, and content channels." },
  { n: "05", title: "Optimize", desc: "Continuous testing and refinement driven by real performance data." },
  { n: "06", title: "Report", desc: "Transparent, real-time dashboards showing exactly what's working." }
];

export default function ProcessTimeline() {
  return (
    <section className="py-24 px-6 bg-ink">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Our Proven Process"
          title="From Audit to Reporting — Fully Transparent"
          subtitle="A systematic six-stage approach that ensures every engagement delivers exceptional, trackable results."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 0.06}>
              <div className="relative glass-cell rounded-2xl p-7 h-full vector-clip">
                <span className="text-4xl font-extrabold text-indigo-accent/30">{s.n}</span>
                <h3 className="text-lg font-bold text-pearl mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-sub leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}