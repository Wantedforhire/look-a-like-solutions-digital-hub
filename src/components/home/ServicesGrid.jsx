import SectionHeading from "@/components/ui-custom/SectionHeading";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import { getIcon } from "@/lib/iconMap";
import { ArrowRight } from "lucide-react";
import CTAButton from "@/components/ui-custom/CTAButton";

const primaryServices = [
  {
    slug: "performance-marketing",
    icon: "Target",
    title: "Performance Marketing",
    items: "Google Ads, Meta Ads, YouTube Ads, Retargeting, Lead Generation",
    outcome: "More qualified leads at lower cost per acquisition."
  },
  {
    slug: "seo-services",
    icon: "Search",
    title: "Organic Growth",
    items: "SEO, Local SEO, Content Strategy, AI/LLM Visibility",
    outcome: "Rank higher, get found, reduce paid dependency."
  },
  {
    slug: "web-design-development",
    icon: "BarChart3",
    title: "Conversion Systems",
    items: "Landing Pages, GA4, GTM, CRO, Lead Funnels",
    outcome: "Turn existing traffic into paying customers."
  },
  {
    slug: "ai-seo-geo",
    icon: "Sparkles",
    title: "Growth Strategy",
    items: "Marketing Audits, Consulting, AI Integration, Business Planning",
    outcome: "A clear plan connecting every channel to revenue."
  }
];

const supportingServices = [
  { slug: "web-design-development", icon: "Code2", title: "Web Development", desc: "Fast, conversion-ready websites built to perform." },
  { slug: "social-media-marketing", icon: "Share2", title: "Social Media Management", desc: "Brand presence that builds trust and engagement." }
];

export default function ServicesGrid({ services = [] }) {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="What We Do"
          title="Four Pillars. One Revenue Engine."
          subtitle="Every service connects to a single goal: turning marketing spend into measurable revenue."
        />
        <div className="grid sm:grid-cols-2 gap-6">
          {primaryServices.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <ScrollReveal key={s.slug} delay={i * 0.06}>
                <a
                  href={`/services/${s.slug}`}
                  className="group block h-full p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-accent/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-indigo-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{s.items}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-4">{s.outcome}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-accent group-hover:gap-2.5 transition-all">
                    Explore Service <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {supportingServices.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <ScrollReveal key={s.slug} delay={i * 0.06}>
                <a
                  href={`/services/${s.slug}`}
                  className="group flex items-center gap-4 h-full p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-accent/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-accent transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                    <p className="text-sm text-slate-500">{s.desc}</p>
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <CTAButton to="/services" variant="secondary">Explore All Services</CTAButton>
        </div>
      </div>
    </section>
  );
}