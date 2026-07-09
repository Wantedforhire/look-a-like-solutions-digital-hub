import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import CTAButton from "@/components/ui-custom/CTAButton";
import { Search, Map, Rocket, LineChart } from "lucide-react";

const steps = [
  { icon: Search, title: "Audit", desc: "Deep-dive into your current performance, competitors, and gaps to find quick wins and long-term opportunities." },
  { icon: Map, title: "Strategy", desc: "Build a data-backed roadmap with clear KPIs, channel mix, and budget allocation tailored to your goals." },
  { icon: Rocket, title: "Execute", desc: "Launch campaigns, landing pages, and content with precision — every asset optimized for conversion." },
  { icon: LineChart, title: "Optimise", desc: "Monitor, test, and refine relentlessly. We scale what works and cut what doesn't, weekly." },
];

export default function HowWeWork() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-3">How We Work</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            A Proven 4-Step Growth Engine
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            No guesswork. No vanity metrics. Just a systematic process built to deliver revenue.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.1}>
              <div className="relative glass-cell rounded-2xl p-7 h-full hover:border-indigo-accent/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-indigo-accent" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-200">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="text-center mt-12">
          <CTAButton to="/methodology" variant="secondary">See Our Full Methodology</CTAButton>
        </ScrollReveal>
      </div>
    </section>
  );
}