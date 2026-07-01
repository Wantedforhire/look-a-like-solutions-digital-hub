import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { organizationSchema, localBusinessSchema } from "@/components/seo/SchemaMarkup";
import Hero from "@/components/home/Hero";
import TrustMetricsBand from "@/components/home/TrustMetricsBand";
import ServicesGrid from "@/components/home/ServicesGrid";
import WhyUs from "@/components/home/WhyUs";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import CaseStudyStrip from "@/components/home/CaseStudyStrip";
import IndustriesStrip from "@/components/home/IndustriesStrip";
import ClientLogoMarquee from "@/components/home/ClientLogoMarquee";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import GeoReadiness from "@/components/home/GeoReadiness";
import FAQSection from "@/components/home/FAQSection";
import CTABand from "@/components/ui-custom/CTABand";

export default function Home() {
  const { data: services = [] } = useQuery({
    queryKey: ["services", "home"],
    queryFn: () => base44.entities.Service.list("order", 6)
  });
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
    queryFn: () => base44.entities.Testimonial.list()
  });

  return (
    <div>
      <MetaTags
        title="Digital Marketing Agency in Bangalore"
        description="Look A Like Solutions is a premium digital marketing agency in Bangalore delivering SEO, performance marketing, social media, branding, web development and AI-search-ready growth strategies."
        path="/"
      />
      <SchemaMarkup schema={organizationSchema()} id="schema-org" />
      <SchemaMarkup schema={localBusinessSchema()} id="schema-local" />
      <Hero />
      <TrustMetricsBand />
      <ClientLogoMarquee clients={clients} />
      <ServicesGrid services={services} />
      <WhyUs />
      <ProcessTimeline />
      <CaseStudyStrip caseStudies={caseStudies} />
      <IndustriesStrip industries={industries} />
      <TestimonialsCarousel testimonials={testimonials} />
      <GeoReadiness />
      <FAQSection />
      <CTABand />
    </div>
  );
}