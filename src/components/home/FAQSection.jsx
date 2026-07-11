import SectionHeading from "@/components/ui-custom/SectionHeading";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTAButton from "@/components/ui-custom/CTAButton";
import SchemaMarkup, { faqSchema } from "@/components/seo/SchemaMarkup";

const faqs = [
  { question: "What does Look A Like Solutions do?", answer: "Look A Like Solutions is a performance marketing agency that builds revenue engines for businesses. We manage Google Ads, Meta Ads, SEO, social media, web design, content, and AI SEO/GEO — all focused on generating leads, revenue, and measurable ROI rather than vanity metrics." },
  { question: "Is Look A Like Solutions a digital marketing agency in Bangalore?", answer: "Yes. We are headquartered in Bengaluru, Karnataka, and serve businesses across India and international markets. We combine deep local-market understanding with a data-driven, growth-focused approach honed over 15+ years." },
  { question: "What services does Look A Like Solutions offer?", answer: "We offer SEO Services, Performance Marketing (Google Ads & Meta Ads), Social Media Marketing, Branding & Creative, Web Design & Development, Content Marketing, Online Reputation Management, Lead Generation, and AI SEO / GEO — a full digital marketing stack under one roof." },
  { question: "What is AI SEO / GEO?", answer: "AI SEO (or Generative Engine Optimization / GEO) is the practice of optimising content and schema so your brand surfaces in AI-generated answers from tools like ChatGPT, Gemini, and Perplexity. It complements traditional SEO by making your business discoverable in the next era of AI-driven search." },
  { question: "How does the free growth audit work?", answer: "You submit your website and current challenge via our growth audit form. Our team reviews your ads, SEO, tracking setup, and conversion funnel, then delivers a clear, no-obligation breakdown of where you're losing money and what to fix first — typically within one business day." },
  { question: "How fast can businesses see results?", answer: "Most clients see measurable movement — improved rankings, traffic, or lead flow — within 60-90 days, with compounding gains over 6-12 months. Timeline depends on the service, industry, competition, and budget, and we never guarantee specific rankings or revenue." },
  { question: "Which industries does Look A Like Solutions serve?", answer: "We serve healthcare, education, real estate, e-commerce, hospitality, BFSI, SaaS, retail, and more. Every strategy is tailored to the sector's buying cycle, competition, and channels — we speak the language of your industry." },
  { question: "Can I get a free audit before committing?", answer: "Yes. We offer a free growth audit and a free 1-on-1 strategy call with founder Ramkumar — no obligation, no credit card. You walk away with a clear plan whether we work together or not." }
];

export default function FAQSection() {
  return (
    <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
      <SchemaMarkup schema={faqSchema(faqs)} id="schema-faq-home" />
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="Frequently Asked Questions" title="Answers Before You Ask" align="center" />
        <FAQAccordion faqs={faqs} />
        <div className="mt-10 text-center">
          <CTAButton to="/strategy-call" variant="primary">Book A Strategy Call</CTAButton>
        </div>
      </div>
    </section>
  );
}