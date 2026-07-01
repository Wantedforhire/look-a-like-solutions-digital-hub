import SectionHeading from "@/components/ui-custom/SectionHeading";
import TestimonialCard from "@/components/shared/TestimonialCard";

export default function TestimonialsCarousel({ testimonials = [] }) {
  if (!testimonials.length) return null;
  return (
    <section className="py-24 px-6 bg-black/40 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Client Voices"
          title="What Our Clients Say"
          subtitle="Real feedback from real businesses we've helped grow."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}