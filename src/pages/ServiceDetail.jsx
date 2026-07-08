import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, ChevronRight } from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema, serviceSchema, faqSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import SectionHeading from "@/components/ui-custom/SectionHeading";
import CTAButton from "@/components/ui-custom/CTAButton";
import FAQAccordion from "@/components/shared/FAQAccordion";
import ContactForm from "@/components/forms/ContactForm";
import { getIcon } from "@/lib/iconMap";

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: services, isLoading } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => base44.entities.Service.filter({ slug })
  });

  const service = services?.[0];
  const Icon = getIcon(service?.icon);

  if (isLoading) {
    return <div className="pt-40 pb-24 text-center text-slate-500 min-h-screen bg-white">Loading service details...</div>;
  }

  if (!service) {
    return (
      <div className="pt-40 pb-24 text-center min-h-screen bg-white px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Service Not Found</h1>
        <p className="text-slate-500 mb-8">This service page doesn't exist yet.</p>
        <CTAButton to="/services" variant="primary">Browse All Services</CTAButton>
      </div>
    );
  }

  return (
    <div>
      <MetaTags
        title={service.metaTitle || service.title}
        description={service.metaDescription || service.shortDescription}
        path={`/services/${service.slug}`}
      />
      <SchemaMarkup schema={serviceSchema(service)} id="schema-service" />
      {service.faqs?.length > 0 && <SchemaMarkup schema={faqSchema(service.faqs)} id="schema-faq" />}
      <SchemaMarkup
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/services/${service.slug}` }])}
        id="schema-breadcrumb"
      />

      <nav aria-label="Breadcrumb" className="pt-28 px-6 max-w-6xl mx-auto text-xs text-slate-400 flex items-center gap-2">
        <Link to="/" className="hover:text-indigo-accent">Home</Link><ChevronRight className="w-3 h-3" />
        <Link to="/services" className="hover:text-indigo-accent">Services</Link><ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">{service.title}</span>
      </nav>

      <section className="pt-8 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
              <Icon className="w-7 h-7 text-indigo-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-pearl leading-tight">
              {service.heroHeadline || service.title}
            </h1>
            <p className="mt-6 text-lg text-slate-500 leading-relaxed">{service.heroSubtext || service.shortDescription}</p>
            {service.metricLabel && <p className="mt-4 text-sm font-semibold text-emerald-accent">✓ {service.metricLabel}</p>}
            <div className="mt-8">
              <CTAButton to="/growth-audit" variant="primary">Get A Free Growth Audit</CTAButton>
            </div>
          </ScrollReveal>
          {service.heroImage && (
            <ScrollReveal delay={0.15}>
              <img src={service.heroImage} alt={`${service.title} illustration`} loading="lazy" className="rounded-3xl w-full object-cover glass-cell p-2" />
            </ScrollReveal>
          )}
        </div>
      </section>

      {service.deliverables?.length > 0 && (
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="What You Get" title="Key Deliverables" align="left" />
            <div className="grid sm:grid-cols-2 gap-4">
              {service.deliverables.map((d, i) => (
                <ScrollReveal key={i} delay={i * 0.05} className="flex items-start gap-3 glass-cell rounded-xl p-5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{d}</span>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.process?.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="Our Approach" title={`How We Deliver ${service.title}`} align="left" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.process.map((p, i) => (
                <ScrollReveal key={i} delay={i * 0.06} className="glass-cell rounded-2xl p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-2">{p.step}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.faqs?.length > 0 && (
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
          <div className="max-w-3xl mx-auto">
            <SectionHeading eyebrow="FAQs" title={`${service.title} — Common Questions`} />
            <FAQAccordion faqs={service.faqs} />
          </div>
        </section>
      )}

      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <SectionHeading eyebrow="Get Started" title="Request a Proposal" subtitle={`Tell us about your ${service.title.toLowerCase()} goals and we'll get back within one business day.`} />
          <ContactForm defaultService={service.title} />
        </div>
      </section>
    </div>
  );
}