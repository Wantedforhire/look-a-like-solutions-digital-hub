import ScrollReveal from "./ScrollReveal";
import EyebrowLabel from "./EyebrowLabel";

export default function SectionHeading({ eyebrow, title, subtitle, align = "center", light = true }) {
  return (
    <ScrollReveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : "text-left"} mb-14`}>
      {eyebrow && <EyebrowLabel className="mb-4">{eyebrow}</EyebrowLabel>}
      <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight ${light ? "text-pearl" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base md:text-lg ${light ? "text-slate-sub" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}