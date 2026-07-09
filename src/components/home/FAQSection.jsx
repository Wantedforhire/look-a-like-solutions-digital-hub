import SectionHeading from "@/components/ui-custom/SectionHeading";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTAButton from "@/components/ui-custom/CTAButton";

const faqs = [
  { question: "How quickly can I see results from digital marketing?", answer: "Most clients see measurable movement — improved rankings, traffic, or lead flow — within 60-90 days, with compounding gains over 6-12 months depending on the service and competitive landscape." },
  { question: "Do you only work with businesses in Bangalore?", answer: "We're headquartered in Bengaluru and specialize in the local market, but we also serve clients across India with the same data-driven, growth-focused approach." },
  { question: "What makes Look A Like Solutions different from other Bangalore agencies?", answer: "A dedicated specialist team per account, radical reporting transparency, and a methodology built for both traditional SEO and AI/generative search discovery." },
  { question: "Can I get a free audit before committing?", answer: "Yes — we offer a free strategy session and digital audit covering SEO, paid ads, social, and website performance with no obligation." }
];

export default function FAQSection() {
  return (
    <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
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