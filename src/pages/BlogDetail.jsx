import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import CTAButton from "@/components/ui-custom/CTAButton";

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: results, isLoading } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: () => base44.entities.BlogPost.filter({ slug })
  });
  const post = results?.[0];

  if (isLoading) {
    return <div className="pt-40 pb-24 text-center text-slate-500 min-h-screen bg-white">Loading article...</div>;
  }

  if (!post) {
    return (
      <div className="pt-40 pb-24 text-center min-h-screen bg-white px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
        <CTAButton to="/blog" variant="primary">Browse All Articles</CTAButton>
      </div>
    );
  }

  return (
    <div>
      <MetaTags title={post.metaTitle || post.title} description={post.metaDescription || post.excerpt} path={`/blog/${post.slug}`} image={post.coverImage} />
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage,
          author: { "@type": "Person", name: post.author || "Look A Like Solutions" },
          datePublished: post.publishDate
        }}
        id="schema-article"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} id="schema-breadcrumb" />

      <nav aria-label="Breadcrumb" className="pt-28 px-6 max-w-3xl mx-auto text-xs text-slate-sub flex items-center gap-2">
        <Link to="/" className="hover:text-indigo-accent">Home</Link><ChevronRight className="w-3 h-3" />
        <Link to="/blog" className="hover:text-indigo-accent">Blog</Link><ChevronRight className="w-3 h-3" />
        <span className="text-pearl truncate">{post.title}</span>
      </nav>

      <article className="py-10 px-6 bg-ink">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            {post.category && <span className="text-xs font-semibold uppercase tracking-wider text-indigo-accent">{post.category}</span>}
            <h1 className="text-3xl md:text-5xl font-extrabold text-pearl tracking-tight mt-3 mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-sub mb-8">
              <span>{post.author || "Look A Like Solutions"}</span>
              {post.publishDate && <><span>&middot;</span><span>{format(new Date(post.publishDate), "MMM d, yyyy")}</span></>}
            </div>
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} loading="lazy" className="rounded-2xl w-full object-cover mb-10 glass-cell p-2" />
            )}
            <div className="prose prose-slate prose-p:text-slate-600 prose-headings:text-slate-900 prose-strong:text-slate-900 max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </ScrollReveal>

          <div className="mt-16 glass-cell rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Ready to Put This Into Action?</h3>
            <p className="text-slate-500 mb-6">Talk to our team about applying these strategies to your business.</p>
            <CTAButton to="/growth-audit" variant="primary">Get A Free Growth Audit</CTAButton>
          </div>
        </div>
      </article>
    </div>
  );
}