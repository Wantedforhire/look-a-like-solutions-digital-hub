import { BarChart3, Users, Zap, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/ui-custom/SectionHeading";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

const reasons = [
  { icon: BarChart3, title: "Data-Driven Strategies", desc: "Every decision backed by analytics, market insight, and real-time performance dashboards." },
  { icon: Users, title: "Dedicated Team", desc: "A team of specialists — SEO, paid, creative, dev — assigned to your account, not shared across dozens of clients." },
  { icon: Zap, title: "Agile Approach", desc: "Quick to adapt and optimize based on performance signals, not quarterly guesswork." },
  { icon: ShieldCheck, title: "Transparent Reporting", desc: "Clear communication, honest reporting, and no hidden surprises — ever." }
];

export default function WhyUs() {
  return (
    <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Why Look A Like Solutions"
          title="Your Strategic Growth Partner, Not Just a Vendor"
          subtitle="We don't just execute campaigns — we become embedded in your growth trajectory."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.08}>
              <div className="glass-cell rounded-2xl p-7 h-full hover:border-indigo-accent/50 transition-colors">
                <r.icon className="w-8 h-8 text-indigo-accent mb-5" />
                <h3 className="text-base font-bold text-pearl mb-2">{r.title}</h3>
                <p className="text-sm text-slate-sub leading-relaxed">{r.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}