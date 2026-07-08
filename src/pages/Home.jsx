import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { organizationSchema, localBusinessSchema } from "@/components/seo/SchemaMarkup";
import Hero from "@/components/home/Hero";
import ResultsSection from "@/components/home/ResultsSection";
import ClientLogoMarquee from "@/components/home/ClientLogoMarquee";
import ServicesGrid from "@/components/home/ServicesGrid";
import FounderSection from "@/components/home/FounderSection";
import WhyUs from "@/components/home/WhyUs";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import CaseStudyStrip from "@/components/home/CaseStudyStrip";
import IndustriesStrip from "@/components/home/IndustriesStrip";
import GrowthAuditSection from "@/components/home/GrowthAuditSection";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import GeoReadiness from "@/components/home/GeoReadiness";
import FAQSection from "@/components/home/FAQSection";
import CTABand from "@/components/ui-custom/CTABand";

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
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials", "home"],
    queryFn: () => base44.entities.Testimonial.filter({ visible: true })
  });

  return (
    <div>
      <MetaTags
        title="Performance Marketing Agency in Bangalore"
        description="Look A Like Solutions builds revenue engines — Google Ads, Meta Ads, SEO, conversion strategy, and AI-powered growth for businesses that want leads and measurable results."
        path="/"
      />
      <SchemaMarkup schema={organizationSchema()} id="schema-org" />
      <SchemaMarkup schema={localBusinessSchema()} id="schema-local" />
      <Hero />
      <ResultsSection />
      <ClientLogoMarquee clients={clients} />
      <ServicesGrid />
      <FounderSection />
      <WhyUs />
      <ProcessTimeline />
      <CaseStudyStrip caseStudies={caseStudies} />
      <IndustriesStrip industries={industries} />
      <GrowthAuditSection />
      <TestimonialsCarousel testimonials={testimonials} />
      <GeoReadiness />
      <FAQSection />
      <CTABand />
    </div>
  );
}