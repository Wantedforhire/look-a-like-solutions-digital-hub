import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQAccordion({ faqs = [] }) {
  if (!faqs.length) return null;
  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {faqs.map((faq, idx) => (
        <AccordionItem
          key={idx}
          value={`item-${idx}`}
          className="glass-cell rounded-xl px-6 border-0"
        >
          <AccordionTrigger className="text-left text-pearl font-semibold hover:text-indigo-accent hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-slate-sub leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}