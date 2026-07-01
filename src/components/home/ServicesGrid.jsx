import SectionHeading from "@/components/ui-custom/SectionHeading";
import ServiceCard from "@/components/shared/ServiceCard";
import CTAButton from "@/components/ui-custom/CTAButton";

export default function ServicesGrid({ services = [] }) {
  return (
    <section className="py-24 px-6 bg-ink">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Full-Spectrum Expertise"
          title="Proven Results Across Every Channel"
          subtitle="Each service is engineered to deliver measurable outcomes — rankings, leads, revenue, and retention."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <CTAButton to="/services" variant="secondary">Explore All Services</CTAButton>
        </div>
      </div>
    </section>
  );
}