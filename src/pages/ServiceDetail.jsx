import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
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
  const { data: allServices = [] } = useQuery({
    queryKey: ["services", "related", slug],
    queryFn: () => base44.entities.Service.list("order")
  });

  const service = services?.[0];
  const Icon = getIcon(service?.icon);
  const related = service ? allServices.filter((s) => s.id !== service.id).slice(0, 3) : [];

  if (isLoading) {
    return <div className="pt-40 pb-24 text-center text-slate-500 min-h-screen bg-white">Loading service details...</div>;
  }

  if (!service) {
    return (
      <div className="pt-40 pb-24 text-center min-h-screen bg-white px-6">
        <MetaTags noindex />
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
        image={service.heroImage}
      />
      <SchemaMarkup schema={serviceSchema(service)} id="schema-service" />
      {service.faqs?.length > 0 && <SchemaMarkup schema={faqSchema(service.faqs)} id="schema-faq" />}
      <SchemaMarkup
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/services/${service.slug}` }])}
        id="schema-breadcrumb"
      />

      <nav aria-label="Breadcrumb" className="pt-28 px-6 max-w-6xl mx-auto text-xs text-slate-400 flex items-center gap-2">
        <Link to="/" className="hover:text-indigo-accent">Home</Link><ChevronRight className="w-3 h-3" aria-hidden="true" />
        <Link to="/services" className="hover:text-indigo-accent">Services</Link><ChevronRight className="w-3 h-3" aria-hidden="true" />
        <span className="text-slate-900">{service.title}</span>
      </nav>

      <section className="pt-8 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
              <Icon className="w-7 h-7 text-indigo-accent" aria-hidden="true" />
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
              <img src={service.heroImage} alt={`${service.title} — Look A Like Solutions`} loading="lazy" className="rounded-3xl w-full object-cover glass-cell p-2" />
            </ScrollReveal>
          )}
        </div>
      </section>

      {service.whoItsFor && (
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
          <div className="max-w-3xl mx-auto">
            <SectionHeading eyebrow="Who It's For" title={`Is ${service.title} Right for You?`} align="left" />
            <p className="text-slate-600 leading-relaxed text-lg">{service.whoItsFor}</p>
          </div>
        </section>
      )}

      {service.deliverables?.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="What's Included" title="Key Deliverables" align="left" />
            <div className="grid sm:grid-cols-2 gap-4">
              {service.deliverables.map((d, i) => (
                <ScrollReveal key={i} delay={i * 0.05} className="flex items-start gap-3 glass-cell rounded-xl p-5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-slate-700">{d}</span>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.businessOutcomes?.length > 0 && (
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="Business Outcomes" title="What You Can Expect" align="left" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.businessOutcomes.map((o, i) => (
                <ScrollReveal key={i} delay={i * 0.06} className="glass-cell rounded-2xl p-6">
                  <p className="text-base font-semibold text-slate-900 leading-snug">{o}</p>
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

      {related.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="Explore More" title="Related Services" align="left" />
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((s, i) => {
                const RelIcon = getIcon(s.icon);
                return (
                  <ScrollReveal key={s.id} delay={i * 0.06}>
                    <Link
                      to={`/services/${s.slug}`}
                      className="group block h-full p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-accent/30 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                        <RelIcon className="w-5 h-5 text-indigo-accent" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">{s.shortDescription}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-accent group-hover:gap-2.5 transition-all">
                        Explore <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-2xl mx-auto">
          <SectionHeading eyebrow="Get Started" title="Request a Proposal" subtitle={`Tell us about your ${service.title.toLowerCase()} goals and we'll get back within one business day.`} />
          <ContactForm defaultService={service.title} />
        </div>
      </section>
    </div>
  );
}