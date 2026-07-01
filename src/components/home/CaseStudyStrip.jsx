import SectionHeading from "@/components/ui-custom/SectionHeading";
import CaseStudyCard from "@/components/shared/CaseStudyCard";
import CTAButton from "@/components/ui-custom/CTAButton";

export default function CaseStudyStrip({ caseStudies = [] }) {
  if (!caseStudies.length) return null;
  return (
    <section className="py-24 px-6 bg-black/40 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Validated Results"
          title="Real Metrics. Real Businesses. Real Growth."
          subtitle="No vanity metrics — every case study is backed by verifiable, client-approved numbers."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((cs, i) => (
            <CaseStudyCard key={cs.id} caseStudy={cs} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <CTAButton to="/case-studies" variant="secondary">View All Case Studies</CTAButton>
        </div>
      </div>
    </section>
  );
}