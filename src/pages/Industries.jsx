import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import CTAButton from "@/components/ui-custom/CTAButton";
import IndustryPanel from "@/components/industries/IndustryPanel";
import CTABand from "@/components/ui-custom/CTABand";

export default function Industries() {
  const { data: industries = [], isLoading } = useQuery({
    queryKey: ["industries", "all"],
    queryFn: () => base44.entities.Industry.list()
  });
  const { data: services = [] } = useQuery({
    queryKey: ["services", "industries-page"],
    queryFn: () => base44.entities.Service.list("order")
  });

  const servicesByTitle = services.reduce((acc, s) => {
    if (s.title && s.slug) acc[s.title.trim().toLowerCase()] = s.slug;
    return acc;
  }, {});

  return (
    <div>
      <MetaTags
        title="Industries We Serve"
        description="Look A Like Solutions delivers tailored digital marketing strategies across healthcare, education, real estate, e-commerce, hospitality and more — for businesses across India."
        path="/industries"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-14 px-6 bg-white">
        <ScrollReveal className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-accent">Industries</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Industries We <span className="text-indigo-accent">Serve</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            We speak the language of your sector — tailored growth strategies built on industry-specific insight.
            Start with your industry, then go straight to the services that move it.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CTAButton to="/growth-audit" variant="primary">Get A Free Growth Audit</CTAButton>
            <CTAButton to="/contact" variant="secondary">Talk To Us</CTAButton>
          </div>
        </ScrollReveal>
      </section>

      <section className="pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <p className="text-center text-slate-500">Loading industries...</p>
          ) : industries.length === 0 ? (
            <p className="text-center text-slate-500">Industry pages coming soon.</p>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {industries.map((ind, i) => (
                <IndustryPanel key={ind.id} industry={ind} servicesByTitle={servicesByTitle} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Not Sure Which Service Fits Your Sector?
          </h2>
          <p className="mt-4 text-slate-500 leading-relaxed">
            Share your growth goal and we'll tell you which programmes we would run first — and which we would hold back.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CTAButton to="/contact" variant="primary">Request A Proposal</CTAButton>
            <CTAButton to="/services" variant="secondary">Browse All Services</CTAButton>
          </div>
        </div>
      </section>

      <CTABand title="Don't See Your Industry?" subtitle="We tailor strategies for any vertical — reach out and let's talk about your specific growth goals." primaryLabel="Get A Free Growth Audit" primaryTo="/growth-audit" />
    </div>
  );
}