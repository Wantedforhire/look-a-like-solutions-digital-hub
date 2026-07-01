import { Sparkles, Bot, Search, LineChart } from "lucide-react";
import SectionHeading from "@/components/ui-custom/SectionHeading";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

const pillars = [
  { icon: Bot, title: "AI Search Visibility", desc: "Structured content and schema built for ChatGPT, Gemini, and Perplexity citations." },
  { icon: Search, title: "Generative Engine Optimization", desc: "GEO-first content architecture so your brand surfaces in AI-generated answers." },
  { icon: LineChart, title: "Traditional SEO Foundation", desc: "Technical SEO, semantic HTML, and structured data as the base layer for both search paradigms." },
  { icon: Sparkles, title: "Future-Proof Strategy", desc: "Continuously adapted as AI search evolves — you stay visible as the landscape shifts." }
];

export default function GeoReadiness() {
  return (
    <section className="relative py-24 px-6 bg-ink overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-accent/10 rounded-full blur-[140px]" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="SEO + GEO + AI Search"
          title="Ready for the Next Era of Search"
          subtitle="We build for Google today and AI-driven discovery tomorrow — with Bangalore's first AI SEO / GEO-ready methodology."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <div className="glass-cell rounded-2xl p-7 h-full hover:border-indigo-accent/50 transition-colors">
                <p.icon className="w-8 h-8 text-indigo-accent mb-5" />
                <h3 className="text-base font-bold text-pearl mb-2">{p.title}</h3>
                <p className="text-sm text-slate-sub leading-relaxed">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}