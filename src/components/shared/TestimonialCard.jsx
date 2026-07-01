import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="glass-cell rounded-2xl p-7 h-full flex flex-col">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-emerald-accent text-emerald-accent" />
        ))}
      </div>
      <p className="text-sm text-pearl/90 leading-relaxed flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-6 pt-5 border-t border-white/10">
        <p className="text-sm font-semibold text-pearl">{testimonial.name}</p>
        <p className="text-xs text-slate-sub">{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ""}</p>
      </div>
    </div>
  );
}