import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BlogStatCards from "@/components/admin/blog/BlogStatCards";
import BlogPostsTable from "@/components/admin/blog/BlogPostsTable";
import BlogImport from "@/components/admin/BlogImport";
import { Select } from "@/components/admin/FormFields";
import { formatDate } from "@/lib/adminUtils";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Loader2, X, Archive, Trash2, Send, FileEdit, Upload } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "-updated_date", label: "Recently updated" },
  { value: "-created_date", label: "Newest first" },
  { value: "-publishDate", label: "Publish date" },
  { value: "title", label: "Title A–Z" },
];

export default function BlogsDashboard() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("-updated_date");
  const [selected, setSelected] = useState(new Set());
  const [busy, setBusy] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const { role } = useOutletContext() || {};
  const canImport = role === "super_admin" || role === "admin";

  const { data: counts, isLoading: countsLoading } = useQuery({
    queryKey: ["blog-counts"],
    queryFn: async () => {
      const [total, published, draft, review, scheduled, archived] = await Promise.all([
        base44.entities.BlogPost.count({}),
        base44.entities.BlogPost.count({ status: "published" }),
        base44.entities.BlogPost.count({ status: "draft" }),
        base44.entities.BlogPost.count({ status: "review" }),
        base44.entities.BlogPost.count({ status: "scheduled" }),
        base44.entities.BlogPost.count({ status: "archived" }),
      ]);
      return { total, published, draft, review, scheduled, archived };
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const res = await base44.entities.BlogPost.list({ distinct: "category" });
      return (res.items || []).filter(Boolean);
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["blog-recent"],
    queryFn: () => base44.entities.BlogPost.list({ sort: "-updated_date", limit: 4 }),
  });

  const postFilter = useMemo(() => {
    const filter = {};
    if (status !== "all") filter.status = status;
    if (category !== "all") filter.category = category;
    if (search.trim()) filter.title = { $regex: search.trim(), $options: "i" };
    return filter;
  }, [status, category, search]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["blog-posts", postFilter, sort],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      base44.entities.BlogPost.filter(postFilter, { sort, limit: 20, cursor: pageParam }),
    getNextPageParam: (last) => (last.has_more ? last.next_cursor : undefined),
  });

  const posts = data?.pages.flatMap((p) => p.items) || [];

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["blog-posts"] });
    qc.invalidateQueries({ queryKey: ["blog-counts"] });
    qc.invalidateQueries({ queryKey: ["blog-recent"] });
    qc.invalidateQueries({ queryKey: ["blog-categories"] });
  };

  const bulkMutation = useMutation({
    mutationFn: ({ ids, operation }) => base44.functions.invoke("blogAdmin", { action: "bulk", ids, operation }),
    onSuccess: (_res, vars) => {
      toast({ title: `${vars.ids.length} post${vars.ids.length === 1 ? "" : "s"} ${vars.operation === "delete" ? "deleted" : `${vars.operation}ed`}` });
      setSelected(new Set());
      refresh();
    },
    onError: (e) => toast({ title: e.response?.data?.error || "Bulk action failed", variant: "destructive" }),
  });

  const toggle = (id) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = (rows) =>
    setSelected((s) => (rows.every((r) => s.has(r.id)) ? new Set() : new Set(rows.map((r) => r.id))));

  const runBulk = (operation) => {
    if (operation === "delete" && !confirm(`Delete ${selected.size} post(s)? This cannot be undone.`)) return;
    bulkMutation.mutate({ ids: [...selected], operation });
  };

  return (
    <div>
      <AdminPageHeader
        title="Blog Management"
        subtitle="Write, review, and publish articles across the full content workflow."
        actions={
          <div className="flex gap-2">
            {canImport && (
              <button
                onClick={() => setShowImport(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                <Upload className="w-4 h-4" /> Import
              </button>
            )}
            <Link
              to="/super-admin/marketing/blogs/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"
            >
              <Plus className="w-4 h-4" /> New Post
            </Link>
          </div>
        }
      />

      <BlogStatCards counts={counts} loading={countsLoading} />

      {recent?.items?.length > 0 && (
        <div className="mt-4 glass-cell rounded-2xl px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Recently Updated</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {recent.items.map((r) => (
              <Link
                key={r.id}
                to={`/super-admin/marketing/blogs/${r.id}/edit`}
                className="text-sm text-slate-700 hover:text-indigo-accent truncate max-w-[260px]"
              >
                {r.title || "Untitled"}
                <span className="text-xs text-slate-400 ml-2">{formatDate(r.updated_date)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 glass-cell rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col xl:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts by title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-accent focus:ring-2 focus:ring-indigo-accent/20 outline-none"
            />
          </div>
          <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} className="xl:w-44" />
          <Select
            value={category}
            onChange={setCategory}
            options={[{ value: "all", label: "All Categories" }, ...categories.map((c) => ({ value: c, label: c }))]}
            className="xl:w-48"
          />
          <Select value={sort} onChange={setSort} options={SORT_OPTIONS} className="xl:w-44" />
        </div>

        {selected.size > 0 && (
          <div className="px-5 py-3 bg-indigo-50/70 border-b border-indigo-100 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-indigo-accent">{selected.size} selected</span>
            <div className="flex flex-wrap gap-2">
              <BulkButton icon={Send} label="Publish" onClick={() => runBulk("publish")} disabled={bulkMutation.isPending} />
              <BulkButton icon={FileEdit} label="Move to Draft" onClick={() => runBulk("draft")} disabled={bulkMutation.isPending} />
              <BulkButton icon={Archive} label="Archive" onClick={() => runBulk("archive")} disabled={bulkMutation.isPending} />
              <BulkButton icon={Trash2} label="Delete" danger onClick={() => runBulk("delete")} disabled={bulkMutation.isPending} />
            </div>
            <button onClick={() => setSelected(new Set())} className="ml-auto p-1.5 text-slate-400 hover:text-slate-700" title="Clear selection">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <BlogPostsTable
          posts={posts}
          loading={isLoading}
          selected={selected}
          onToggle={toggle}
          onToggleAll={toggleAll}
          busy={busy}
          onBusy={setBusy}
        />

        {hasNextPage && (
          <div className="px-5 py-4 border-t border-slate-100 text-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />} Load more
            </button>
          </div>
        )}
      </div>

      {showImport && (
        <BlogImport
          onClose={() => setShowImport(false)}
          onImported={() => {
            setShowImport(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function BulkButton({ icon: Icon, label, onClick, danger, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
        danger ? "bg-white text-rose-500 border border-rose-200 hover:bg-rose-50" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
      }`}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}