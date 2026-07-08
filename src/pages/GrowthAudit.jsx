import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import EyebrowLabel from "@/components/ui-custom/EyebrowLabel";
import GrowthAuditForm from "@/components/forms/GrowthAuditForm";

export default function GrowthAudit() {
  return (
    <div>
      <MetaTags
        title="Free Growth Audit"
        description="Get a free growth audit from Look A Like Solutions — a practical review of your website, ads, SEO, tracking, and conversion funnel. No obligation."
        path="/growth-audit"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Free Growth Audit", path: "/growth-audit" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-white text-center">
        <ScrollReveal className="max-w-3xl mx-auto text-center">
          <EyebrowLabel className="mb-4">No Cost · No Obligation</EyebrowLabel>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Get Your <span className="text-indigo-accent">Free Growth Audit</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            We'll review your website, advertising, SEO, tracking setup, and conversion funnel — then tell you exactly where you're losing money and what to fix first.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <GrowthAuditForm showChannels />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}