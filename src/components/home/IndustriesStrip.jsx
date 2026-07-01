import SectionHeading from "@/components/ui-custom/SectionHeading";
import IndustryCard from "@/components/shared/IndustryCard";
import CTAButton from "@/components/ui-custom/CTAButton";

export default function IndustriesStrip({ industries = [] }) {
  if (!industries.length) return null;
  return (
    <section className="py-24 px-6 bg-ink">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Industries Served"
          title="Growth Strategies Tailored to Your Sector"
          subtitle="From healthcare to real estate, we speak the language of your industry."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.slice(0, 8).map((ind, i) => (
            <IndustryCard key={ind.id} industry={ind} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <CTAButton to="/industries" variant="secondary">See All Industries</CTAButton>
        </div>
      </div>
    </section>
  );
}