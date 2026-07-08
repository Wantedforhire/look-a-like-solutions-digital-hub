import SectionHeading from "@/components/ui-custom/SectionHeading";
import CaseStudyCard from "@/components/shared/CaseStudyCard";
import CTAButton from "@/components/ui-custom/CTAButton";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

function SkeletonCard({ index }) {
  return (
    <ScrollReveal delay={index * 0.06} className="h-full">
      <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="h-48 bg-slate-100 animate-pulse" />
        <div className="p-6 space-y-3">
          <div className="h-8 w-20 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function CaseStudyStrip({ caseStudies = [] }) {
  return (
    <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Validated Client Results"
          title="Real Metrics. Real Businesses. Real Impact."
          subtitle="Each result is client-verified. No vanity metrics, no invented numbers."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.length > 0
            ? caseStudies.map((cs, i) => <CaseStudyCard key={cs.id} caseStudy={cs} index={i} />)
            : [0, 1, 2].map((i) => <SkeletonCard key={i} index={i} />)}
        </div>
        <div className="mt-12 text-center">
          <CTAButton to="/case-studies" variant="primary">See Real Results →</CTAButton>
        </div>
      </div>
    </section>
  );
}