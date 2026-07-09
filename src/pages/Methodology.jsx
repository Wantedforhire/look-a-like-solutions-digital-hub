import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import CTAButton from "@/components/ui-custom/CTAButton";
import { getIcon } from "@/lib/iconMap";

export default function Methodology() {
  const { data: phases = [], isLoading } = useQuery({
    queryKey: ["methodology", "public"],
    queryFn: () => base44.entities.MethodologyPhase.list("order"),
  });

  const fallback = [
    { title: "Discovery", description: "We immerse ourselves in your business, market, and customers to understand what makes you unique and where the gaps are.", deliverables: ["Competitor analysis", "Customer journey mapping", "Gap audit"], icon: "Search" },
    { title: "Strategy", description: "We build a comprehensive growth roadmap with clear KPIs, channel selection, and budget allocation aligned to your revenue goals.", deliverables: ["Growth roadmap", "Channel strategy", "KPI framework"], icon: "Map" },
    { title: "Creative", description: "Our team crafts compelling creative — ad copy, visuals, landing pages, and content — engineered to convert, not just to look pretty.", deliverables: ["Ad creative suite", "Landing page design", "Content assets"], icon: "Palette" },
    { title: "Launch", description: "We deploy campaigns with precision tracking, QA every funnel step, and ensure flawless execution across all channels.", deliverables: ["Campaign deployment", "Tracking setup", "Funnel QA"], icon: "Rocket" },
    { title: "Optimise", description: "We monitor performance daily, test relentlessly, and scale what works while cutting what doesn't — compounding your ROI over time.", deliverables: ["Weekly reporting", "A/B testing", "Scale playbook"], icon: "LineChart" },
  ];

  const display = phases.length > 0 ? phases : fallback;

  return (
    <div>
      <MetaTags
        title="Our Methodology"
        description="The proprietary 5-phase growth methodology at Look A Like Solutions: Discovery, Strategy, Creative, Launch, Optimise."
        path="/methodology"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Methodology", path: "/methodology" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-4">Methodology</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              The 5-Phase <span className="text-indigo-accent">Growth Engine</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
              A systematic, battle-tested approach that turns marketing spend into predictable revenue.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-6 pt-8">
          {isLoading ? (
            <p className="text-center text-slate-400 py-20">Loading...</p>
          ) : (
            display.map((phase, i) => {
              const Icon = getIcon(phase.icon);
              return (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="glass-cell rounded-2xl p-7 grid lg:grid-cols-[auto_1fr_1fr] gap-6 items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                        <Icon className="w-7 h-7 text-indigo-accent" />
                      </div>
                      <span className="text-4xl font-extrabold text-slate-200">0{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{phase.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{phase.description}</p>
                    </div>
                    {phase.deliverables?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Deliverables</p>
                        <ul className="space-y-1.5">
                          {phase.deliverables.map((d) => (
                            <li key={d} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent mt-1.5 shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })
          )}
        </div>

        <ScrollReveal delay={0.3} className="text-center mt-14">
          <CTAButton to="/strategy-call" variant="primary">Book a Strategy Call</CTAButton>
        </ScrollReveal>
      </section>
    </div>
  );
}