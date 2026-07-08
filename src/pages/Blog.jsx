import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import BlogCard from "@/components/shared/BlogCard";
import CTABand from "@/components/ui-custom/CTABand";

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blogPosts", "all"],
    queryFn: () => base44.entities.BlogPost.filter({ status: "published" }, "-publishDate")
  });

  return (
    <div>
      <MetaTags
        title="Blog &amp; Insights"
        description="Digital marketing insights, SEO tips, and growth strategies from Look A Like Solutions — Bengaluru's data-driven digital marketing agency."
        path="/blog"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-ink text-center">
        <ScrollReveal className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-pearl">
            Insights &amp; <span className="text-indigo-accent">Growth Strategy</span>
          </h1>
          <p className="mt-6 text-lg text-slate-sub leading-relaxed">
            Practical, data-backed marketing knowledge from our team of specialists.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-24 px-6 bg-ink">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <p className="text-center text-slate-sub">Loading articles...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-slate-sub">New articles coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p, i) => <BlogCard key={p.id} post={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <CTABand />
    </div>
  );
}