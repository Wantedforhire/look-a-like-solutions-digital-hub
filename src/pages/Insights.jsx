import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import InsightCard from "@/components/shared/InsightCard";
import CTABand from "@/components/ui-custom/CTABand";

export default function Insights() {
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ["insights", "published"],
    queryFn: () => base44.entities.Insight.filter({ status: "published" }, "-publishDate"),
  });

  return (
    <div>
      <MetaTags
        title="Marketing Insights"
        description="Data-driven marketing insights, trend analysis, and growth strategies from Look A Like Solutions — Bengaluru's performance marketing agency."
        path="/insights"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-4">Marketing Insights</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Insights That <span className="text-indigo-accent">Drive Decisions</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
              Deep dives into performance marketing, SEO, AI-search, and growth strategy — from the trenches.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <p className="text-center text-slate-400 py-20">Loading insights...</p>
          ) : insights.length === 0 ? (
            <p className="text-center text-slate-400 py-20">No insights published yet. Check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
              {insights.map((ins, i) => <InsightCard key={ins.id} insight={ins} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <CTABand />
    </div>
  );
}