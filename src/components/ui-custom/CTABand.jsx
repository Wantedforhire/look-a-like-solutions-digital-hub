import ScrollReveal from "./ScrollReveal";
import CTAButton from "./CTAButton";

export default function CTABand({
  title = "Ready to Build a Revenue Engine?",
  subtitle = "Get a free growth audit covering your ads, SEO, tracking, and conversion funnel — no obligation, no credit card.",
  primaryLabel = "Get A Free Growth Audit",
  primaryTo = "/growth-audit"
}) {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-accent/30 via-slate-900 to-emerald-accent/10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-accent/20 rounded-full blur-3xl" />
      <ScrollReveal className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">{title}</h2>
        <p className="mt-5 text-lg text-slate-300 max-w-2xl mx-auto">{subtitle}</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTAButton to={primaryTo} variant="primary">
            {primaryLabel}
          </CTAButton>
          <CTAButton to="/case-studies" variant="secondary">
            See Real Results
          </CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
}