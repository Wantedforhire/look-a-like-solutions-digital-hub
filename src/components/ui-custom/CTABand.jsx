import ScrollReveal from "./ScrollReveal";
import CTAButton from "./CTAButton";

export default function CTABand({
  title = "Ready to Become Bengaluru's Next Growth Story?",
  subtitle = "Get a free strategy session and a personalized growth roadmap — no credit card, no obligation.",
  primaryLabel = "Get Free Strategy Session",
  primaryTo = "/contact"
}) {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-accent/20 via-transparent to-emerald-accent/10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-accent/20 rounded-full blur-3xl" />
      <ScrollReveal className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-pearl tracking-tight">{title}</h2>
        <p className="mt-5 text-lg text-slate-sub max-w-2xl mx-auto">{subtitle}</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTAButton to={primaryTo} variant="primary">
            {primaryLabel}
          </CTAButton>
          <CTAButton to="/case-studies" variant="secondary">
            View Case Studies
          </CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
}