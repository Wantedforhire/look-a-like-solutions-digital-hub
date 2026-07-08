import ScrollReveal from "./ScrollReveal";
import EyebrowLabel from "./EyebrowLabel";

export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <ScrollReveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : "text-left"} mb-14`}>
      {eyebrow && <EyebrowLabel className="mb-4">{eyebrow}</EyebrowLabel>}
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base md:text-lg text-slate-500">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}