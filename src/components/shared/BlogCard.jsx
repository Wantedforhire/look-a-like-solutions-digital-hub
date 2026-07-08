import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import { format } from "date-fns";

export default function BlogCard({ post, index = 0 }) {
  return (
    <ScrollReveal delay={index * 0.06} className="h-full">
      <Link
        to={`/blog/${post.slug}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-accent/30 transition-all duration-300"
      >
        <div className="h-44 overflow-hidden bg-slate-100">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-accent mb-2">{post.category}</span>
          )}
          <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">{post.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
          {post.publishDate && (
            <p className="text-xs text-slate-400 mt-4">{format(new Date(post.publishDate), "MMM d, yyyy")}</p>
          )}
        </div>
      </Link>
    </ScrollReveal>
  );
}