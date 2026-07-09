import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import SectionHeading from "@/components/ui-custom/SectionHeading";
import ResourceCard from "@/components/shared/ResourceCard";
import CTABand from "@/components/ui-custom/CTABand";

export default function Resources() {
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources", "public"],
    queryFn: () => base44.entities.Resource.list("-publishDate"),
  });

  return (
    <div>
      <MetaTags
        title="Free Marketing Resources"
        description="Download free guides, checklists, templates, and reports to level up your digital marketing. Built by Look A Like Solutions."
        path="/resources"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-4">Resources</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Free Tools to <span className="text-indigo-accent">Grow Faster</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
              Practical guides, checklists, and templates — no fluff, just stuff you can use today.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <p className="text-center text-slate-400 py-20">Loading resources...</p>
          ) : resources.length === 0 ? (
            <p className="text-center text-slate-400 py-20">No resources available yet. Check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
              {resources.map((r, i) => <ResourceCard key={r.id} resource={r} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <CTABand />
    </div>
  );
}