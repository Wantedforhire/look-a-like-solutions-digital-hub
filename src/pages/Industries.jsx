import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import IndustryCard from "@/components/shared/IndustryCard";
import CTABand from "@/components/ui-custom/CTABand";

export default function Industries() {
  const { data: industries = [], isLoading } = useQuery({
    queryKey: ["industries", "all"],
    queryFn: () => base44.entities.Industry.list()
  });

  return (
    <div>
      <MetaTags
        title="Industries We Serve"
        description="Look A Like Solutions delivers tailored digital marketing strategies across healthcare, education, real estate, e-commerce, hospitality and more — for Bengaluru businesses."
        path="/industries"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-ink text-center">
        <ScrollReveal className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-pearl">
            Industries We <span className="text-indigo-accent">Serve</span>
          </h1>
          <p className="mt-6 text-lg text-slate-sub leading-relaxed">
            We speak the language of your sector — tailored growth strategies built on industry-specific insight.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-24 px-6 bg-ink">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <p className="text-center text-slate-sub">Loading industries...</p>
          ) : industries.length === 0 ? (
            <p className="text-center text-slate-sub">Industry pages coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((ind, i) => <IndustryCard key={ind.id} industry={ind} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <CTABand title="Don't See Your Industry?" subtitle="We tailor strategies for any vertical — reach out and let's talk about your specific growth goals." primaryLabel="Get A Free Growth Audit" primaryTo="/growth-audit" />
    </div>
  );
}