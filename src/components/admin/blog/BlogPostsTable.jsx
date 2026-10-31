import { Link } from "react-router-dom";
import { Pencil, ExternalLink, Loader2 } from "lucide-react";
import StatusPill from "./StatusPill";
import { formatDate } from "@/lib/adminUtils";

export default function BlogPostsTable({ posts, loading, selected, onToggle, onToggleAll, busy }) {
  const allSelected = posts.length > 0 && posts.every((p) => selected.has(p.id));

  if (loading) {
    return (
      <div className="px-5 py-14 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading posts…
      </div>
    );
  }

  if (posts.length === 0) {
    return <div className="px-5 py-14 text-center text-slate-400 text-sm">No posts match your filters.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            <th className="pl-5 pr-2 py-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onToggleAll(posts)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-accent focus:ring-indigo-accent"
              />
            </th>
            <th className="px-3 py-3">Post</th>
            <th className="px-3 py-3 hidden md:table-cell">Category</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3 hidden lg:table-cell">Published</th>
            <th className="px-3 py-3 hidden xl:table-cell">Updated</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {posts.map((post) => (
            <tr key={post.id} className={`hover:bg-slate-50/60 ${selected.has(post.id) ? "bg-indigo-50/40" : ""}`}>
              <td className="pl-5 pr-2 py-4">
                <input
                  type="checkbox"
                  checked={selected.has(post.id)}
                  onChange={() => onToggle(post.id)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-accent focus:ring-indigo-accent"
                />
              </td>
              <td className="px-3 py-4 max-w-[320px]">
                <Link to={`/super-admin/marketing/blogs/${post.id}/edit`} className="font-semibold text-slate-900 text-sm hover:text-indigo-accent line-clamp-1">
                  {post.title || "Untitled"}
                </Link>
                <p className="text-xs text-slate-400 truncate mt-0.5">/blog/{post.slug || "—"}</p>
              </td>
              <td className="px-3 py-4 hidden md:table-cell text-sm text-slate-600">{post.category || "—"}</td>
              <td className="px-3 py-4"><StatusPill status={post.status} /></td>
              <td className="px-3 py-4 hidden lg:table-cell text-xs text-slate-500">{formatDate(post.publishDate)}</td>
              <td className="px-3 py-4 hidden xl:table-cell text-xs text-slate-500">{formatDate(post.updated_date)}</td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  {post.status === "published" && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="View live post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <Link
                    to={`/super-admin/marketing/blogs/${post.id}/edit`}
                    className="p-2 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-accent"
                    title="Edit post"
                  >
                    {busy === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}