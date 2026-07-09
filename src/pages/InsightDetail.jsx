import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ChevronRight } from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import ReactMarkdown from "react-markdown";
import CTABand from "@/components/ui-custom/CTABand";

export default function InsightDetail() {
  const { slug } = useParams();
  const { data: results, isLoading } = useQuery({
    queryKey: ["insight", slug],
    queryFn: () => base44.entities.Insight.filter({ slug, status: "published" }),
  });
  const insight = results?.[0];

  if (isLoading) {
    return <div className="pt-40 pb-24 text-center text-slate-500 min-h-screen bg-white">Loading...</div>;
  }

  if (!insight) {
    return (
      <div className="pt-40 pb-24 text-center min-h-screen bg-white px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Insight Not Found</h1>
        <Link to="/insights" className="text-indigo-accent font-semibold hover:underline">Browse All Insights</Link>
      </div>
    );
  }

  return (
    <div>
      <MetaTags title={insight.metaTitle || insight.title} description={insight.metaDescription || insight.excerpt} path={`/insights/${insight.slug}`} image={insight.coverImage} />
      <SchemaMarkup
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }, { name: insight.title, path: `/insights/${insight.slug}` }])}
        id="schema-breadcrumb"
      />

      <nav aria-label="Breadcrumb" className="pt-28 px-6 max-w-4xl mx-auto text-xs text-slate-400 flex items-center gap-2">
        <Link to="/" className="hover:text-indigo-accent">Home</Link><ChevronRight className="w-3 h-3" />
        <Link to="/insights" className="hover:text-indigo-accent">Insights</Link><ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">{insight.title}</span>
      </nav>

      <article className="py-10 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            {insight.category && <p className="text-xs uppercase tracking-wider text-emerald-accent font-semibold mb-3">{insight.category}</p>}
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{insight.title}</h1>
            <p className="text-sm text-slate-400 mb-8">{insight.author || "Look A Like Solutions"} · {insight.publishDate || ""}</p>
            {insight.coverImage && (
              <img src={insight.coverImage} alt={insight.title} className="rounded-2xl w-full object-cover mb-10" />
            )}
            <div className="prose prose-slate prose-lg max-w-none">
              <ReactMarkdown>{insight.content || ""}</ReactMarkdown>
            </div>
          </ScrollReveal>
        </div>
      </article>

      <CTABand />
    </div>
  );
}