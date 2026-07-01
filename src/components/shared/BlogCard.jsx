import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import { format } from "date-fns";

export default function BlogCard({ post, index = 0 }) {
  return (
    <ScrollReveal delay={index * 0.06} className="h-full">
      <Link
        to={`/blog/${post.slug}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden glass-cell hover:border-indigo-accent/50 transition-all duration-300"
      >
        <div className="h-44 overflow-hidden bg-white/5">
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
          <h3 className="text-base font-bold text-pearl leading-snug mb-2">{post.title}</h3>
          <p className="text-sm text-slate-sub leading-relaxed line-clamp-3">{post.excerpt}</p>
          {post.publishDate && (
            <p className="text-xs text-slate-sub mt-4">{format(new Date(post.publishDate), "MMM d, yyyy")}</p>
          )}
        </div>
      </Link>
    </ScrollReveal>
  );
}