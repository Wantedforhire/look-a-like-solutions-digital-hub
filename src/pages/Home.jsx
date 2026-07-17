import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { organizationSchema, localBusinessSchema, websiteSchema } from "@/components/seo/SchemaMarkup";
import Hero from "@/components/home/Hero";
import ResultsSection from "@/components/home/ResultsSection";
import ClientLogoMarquee from "@/components/home/ClientLogoMarquee";
import ServicesGrid from "@/components/home/ServicesGrid";
import FounderSection from "@/components/home/FounderSection";
import WhyUs from "@/components/home/WhyUs";
import HowWeWork from "@/components/home/HowWeWork";
import IndustriesStrip from "@/components/home/IndustriesStrip";
import GrowthAuditSection from "@/components/home/GrowthAuditSection";
import FAQSection from "@/components/home/FAQSection";
import CTABand from "@/components/ui-custom/CTABand";

const ProcessTimeline = lazy(() => import("@/components/home/ProcessTimeline"));
const CaseStudyStrip = lazy(() => import("@/components/home/CaseStudyStrip"));
const GeoReadiness = lazy(() => import("@/components/home/GeoReadiness"));

const SectionSkeleton = () => (
  <div className="py-24 px-6">
    <div className="max-w-7xl mx-auto h-64 rounded-2xl bg-slate-100 animate-pulse" />
  </div>
);

export default function Home() {
  const { data: caseStudies = [] } = useQuery({
    queryKey: ["caseStudies", "home"],
    queryFn: () => base44.entities.CaseStudy.filter({ featured: true }, "-created_date", 3)
  });
  const { data: industries = [] } = useQuery({
    queryKey: ["industries", "home"],
    queryFn: () => base44.entities.Industry.list("-created_date", 8)
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients", "home"],
    queryFn: () => base44.entities.Client.list()
  });
  return (
    <div>
      <MetaTags
        title="Performance Marketing Agency in Bangalore"
        description="Look A Like Solutions builds revenue engines — Google Ads, Meta Ads, SEO, conversion strategy, and AI-powered growth for businesses that want leads and measurable results."
        path="/"
      />
      <SchemaMarkup schema={organizationSchema()} id="schema-org" />
      <SchemaMarkup schema={websiteSchema()} id="schema-website" />
      <SchemaMarkup schema={localBusinessSchema()} id="schema-local" />
      <Hero />
      <ResultsSection />
      <ClientLogoMarquee clients={clients} />
      <ServicesGrid />
      <FounderSection />
      <WhyUs />
      <Suspense fallback={<SectionSkeleton />}>
        <ProcessTimeline />
      </Suspense>
      <HowWeWork />
      <Suspense fallback={<SectionSkeleton />}>
        <CaseStudyStrip caseStudies={caseStudies} />
      </Suspense>
      <IndustriesStrip industries={industries} />
      <GrowthAuditSection />
      <Suspense fallback={<SectionSkeleton />}>
        <GeoReadiness />
      </Suspense>
      <FAQSection />
      <CTABand />
    </div>
  );
}