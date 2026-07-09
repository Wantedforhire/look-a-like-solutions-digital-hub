import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import ServiceCard from "@/components/shared/ServiceCard";
import CTABand from "@/components/ui-custom/CTABand";

export default function Services() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services", "all"],
    queryFn: () => base44.entities.Service.list("order")
  });

  return (
    <div>
      <MetaTags
        title="Digital Marketing Services"
        description="Explore Look A Like Solutions' full suite of digital marketing services: SEO, performance marketing, social media, branding, web development, content, ORM, lead generation and AI SEO for businesses across India."
        path="/services"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-ink text-center">
        <ScrollReveal className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-pearl">
            Our Digital Marketing <span className="text-indigo-accent">Services</span>
          </h1>
          <p className="mt-6 text-lg text-slate-sub leading-relaxed">
            Comprehensive, outcome-focused solutions engineered to drive growth, visibility, and measurable ROI for businesses across India.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-24 px-6 bg-ink">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <p className="text-center text-slate-sub">Loading services...</p>
          ) : services.length === 0 ? (
            <p className="text-center text-slate-sub">Services coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <CTABand />
    </div>
  );
}