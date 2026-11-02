import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { loadSearchIndex, searchIndex } from "@/components/search/searchIndex";

const SUGGESTED_LINKS = [
  { label: "All Services", to: "/services" },
  { label: "Industries", to: "/industries" },
  { label: "Blog", to: "/blog" },
  { label: "Marketing Insights", to: "/insights" },
  { label: "Resources", to: "/resources" },
];

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [draft, setDraft] = useState(query);
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    loadSearchIndex().then((list) => {
      if (alive) setItems(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  const groups = useMemo(() => (items ? searchIndex(items, query, 50) : []), [items, query]);
  const total = groups.reduce((n, g) => n + g.total, 0);
  const loading = items === null;

  const onSubmit = (e) => {
    e.preventDefault();
    const term = draft.trim();
    if (term) setParams({ q: term });
  };

  return (
    <div>
      <MetaTags
        title={query ? `Search results for “${query}”` : "Search"}
        description="Search Look A Like Solutions across services, industries, blog posts, marketing insights, and resources."
        path="/search"
        noindex
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Search", path: "/search" }])} id="schema-breadcrumb" />

      <section className="pt-28 md:pt-40 pb-10 md:pb-14 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {query ? (
              <>
                Results for <span className="text-indigo-accent">“{query}”</span>
              </>
            ) : (
              "Search Look A Like Solutions"
            )}
          </h1>

          <form onSubmit={onSubmit} className="mt-7 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 pl-4 pr-2 py-2 focus-within:border-indigo-accent focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search services, industries, blogs…"
              aria-label="Search the site"
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 min-w-0 [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="submit"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-full bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
            >
              Search <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          {query && !loading && (
            <p className="mt-4 text-sm text-slate-400">
              {total} result{total === 1 ? "" : "s"} across {groups.length || 0} content type{groups.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </section>

      <section className="pb-16 md:pb-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          {loading && (
            <p className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Searching…
            </p>
          )}

          {!loading && !query && (
            <div>
              <p className="text-sm text-slate-500">Start typing above, or jump straight to a section:</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTED_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="inline-flex items-center min-h-[44px] px-4 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-indigo-accent hover:text-indigo-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && query && total === 0 && (
            <div>
              <p className="text-slate-600">
                No matches for “{query}”. Try a broader term, or explore these sections:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTED_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="inline-flex items-center min-h-[44px] px-4 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-indigo-accent hover:text-indigo-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading &&
            groups.map((g) => (
              <div key={g.group} className="mb-10 last:mb-0">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  {g.group} <span className="text-slate-300">({g.total})</span>
                </h2>
                <div className="space-y-2">
                  {g.items.map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      className="block rounded-2xl border border-slate-200 p-5 hover:border-indigo-accent/40 hover:shadow-sm transition-all"
                    >
                      <p className="text-base font-semibold text-slate-900">{item.title}</p>
                      {item.description && (
                        <p className="mt-1 text-sm text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}