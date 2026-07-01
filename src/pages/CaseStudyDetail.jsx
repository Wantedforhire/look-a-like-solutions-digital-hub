import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ChevronRight } from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import CTAButton from "@/components/ui-custom/CTAButton";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const { data: results, isLoading } = useQuery({
    queryKey: ["caseStudy", slug],
    queryFn: () => base44.entities.CaseStudy.filter({ slug })
  });
  const cs = results?.[0];

  if (isLoading) {
    return <div className="pt-40 pb-24 text-center text-slate-sub min-h-screen bg-ink">Loading case study...</div>;
  }

  if (!cs) {
    return (
      <div className="pt-40 pb-24 text-center min-h-screen bg-ink px-6">
        <h1 className="text-3xl font-bold text-pearl mb-4">Case Study Not Found</h1>
        <CTAButton to="/case-studies" variant="primary">Browse All Case Studies</CTAButton>
      </div>
    );
  }

  return (
    <div>
      <MetaTags title={`${cs.clientName} Case Study`} description={cs.challenge} path={`/case-studies/${cs.slug}`} image={cs.thumbnail} />
      <SchemaMarkup
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Case Studies", path: "/case-studies" }, { name: cs.clientName, path: `/case-studies/${cs.slug}` }])}
        id="schema-breadcrumb"
      />

      <nav aria-label="Breadcrumb" className="pt-28 px-6 max-w-6xl mx-auto text-xs text-slate-sub flex items-center gap-2">
        <Link to="/" className="hover:text-indigo-accent">Home</Link><ChevronRight className="w-3 h-3" />
        <Link to="/case-studies" className="hover:text-indigo-accent">Case Studies</Link><ChevronRight className="w-3 h-3" />
        <span className="text-pearl">{cs.clientName}</span>
      </nav>

      <section className="py-10 px-6 bg-ink">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-wider text-indigo-accent mb-3">{cs.industry} &middot; {cs.service}</p>
              <h1 className="text-3xl md:text-5xl font-extrabold text-pearl tracking-tight mb-8">{cs.clientName}</h1>
              {cs.thumbnail && (
                <img src={cs.thumbnail} alt={`${cs.clientName} results`} loading="lazy" className="rounded-2xl w-full object-cover mb-10 glass-cell p-2" />
              )}

              <h2 className="text-xl font-bold text-pearl mb-3">The Challenge</h2>
              <p className="text-slate-sub leading-relaxed mb-8">{cs.challenge}</p>

              <h2 className="text-xl font-bold text-pearl mb-3">Our Approach</h2>
              <p className="text-slate-sub leading-relaxed mb-8">{cs.approach}</p>

              {cs.testimonialQuote && (
                <blockquote className="glass-cell rounded-2xl p-7 border-l-4 border-emerald-accent">
                  <p className="text-pearl/90 italic leading-relaxed">&ldquo;{cs.testimonialQuote}&rdquo;</p>
                  {cs.testimonialAuthor && <p className="mt-4 text-sm font-semibold text-slate-sub">— {cs.testimonialAuthor}</p>}
                </blockquote>
              )}
            </ScrollReveal>
          </div>

          <div className="lg:sticky lg:top-28 h-fit">
            <ScrollReveal delay={0.1} className="glass-cell rounded-2xl p-7">
              <p className="text-4xl font-extrabold text-emerald-accent">{cs.heroMetricValue}</p>
              <p className="text-xs uppercase tracking-wider text-slate-sub mb-6">{cs.heroMetricLabel}</p>

              {cs.results?.length > 0 && (
                <div className="space-y-4 mb-8">
                  {cs.results.map((r, i) => (
                    <div key={i} className="flex items-center justify-between border-t border-white/10 pt-4 first:border-0 first:pt-0">
                      <span className="text-sm text-slate-sub">{r.label}</span>
                      <span className="text-lg font-bold text-pearl">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <CTAButton to="/contact" variant="primary" className="w-full">Contact Us</CTAButton>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}