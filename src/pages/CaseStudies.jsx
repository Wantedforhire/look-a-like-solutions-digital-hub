import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import CaseStudyCard from "@/components/shared/CaseStudyCard";
import CTABand from "@/components/ui-custom/CTABand";

export default function CaseStudies() {
  const { data: caseStudies = [], isLoading } = useQuery({
    queryKey: ["caseStudies", "all"],
    queryFn: () => base44.entities.CaseStudy.list("-created_date")
  });

  return (
    <div>
      <MetaTags
        title="Case Studies &amp; Results"
        description="Real, verifiable results from businesses we've partnered with across India — SEO, PPC, social media, and web development case studies from Look A Like Solutions."
        path="/case-studies"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Case Studies", path: "/case-studies" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-ink text-center">
        <ScrollReveal className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-pearl">
            Validated <span className="text-emerald-accent">Results</span>, Not Vanity Metrics
          </h1>
          <p className="mt-6 text-lg text-slate-sub leading-relaxed">
            Every case study is backed by real, client-approved data — rankings, leads, revenue, and retention.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-24 px-6 bg-ink">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <p className="text-center text-slate-sub">Loading case studies...</p>
          ) : caseStudies.length === 0 ? (
            <p className="text-center text-slate-sub">New case studies coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((cs, i) => <CaseStudyCard key={cs.id} caseStudy={cs} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <CTABand title="Want Results Like These?" primaryLabel="Get A Free Growth Audit" primaryTo="/growth-audit" />
    </div>
  );
}