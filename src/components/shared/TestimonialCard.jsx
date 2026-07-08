import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="rounded-2xl p-7 bg-white border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-emerald-accent text-emerald-accent" />
        ))}
      </div>
      <p className="text-sm text-slate-700 leading-relaxed flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
        <p className="text-xs text-slate-500">{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ""}</p>
      </div>
    </div>
  );
}