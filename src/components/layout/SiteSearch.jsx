import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X, FileText, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SiteSearch({ placeholder = "Search services & blog posts…", onNavigate, variant = "desktop" }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef(null);

  const load = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const [s, p] = await Promise.all([
        base44.entities.Service.list("order", 100),
        base44.entities.BlogPost.filter({ status: "published" }),
      ]);
      setServices(s || []);
      setPosts(p || []);
      setLoaded(true);
    } catch (e) {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const term = q.trim().toLowerCase();
  const matches = term.length >= 1
    ? {
        services: services
          .filter((s) => `${s.title} ${s.shortDescription || ""} ${s.slug || ""}`.toLowerCase().includes(term))
          .slice(0, 5),
        posts: posts
          .filter((p) => `${p.title} ${p.excerpt || ""} ${p.slug || ""}`.toLowerCase().includes(term))
          .slice(0, 5),
      }
    : { services: [], posts: [] };
  const hasResults = matches.services.length > 0 || matches.posts.length > 0;

  const reset = () => { setQ(""); setOpen(false); onNavigate?.(); };

  const isMobile = variant === "mobile";

  return (
    <div ref={ref} className="relative w-full">
      <div
        className={`flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-indigo-accent focus-within:bg-white ${
          isMobile ? "px-4 py-3" : "px-3.5 py-2 w-56 focus-within:w-64"
        }`}
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => { setOpen(true); load(); }}
          placeholder={placeholder}
          aria-label="Search the site"
          className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 min-w-0"
        />
        {q && (
          <button
            type="button"
            onClick={() => { setQ(""); inputRef.current?.focus(); }}
            className="text-slate-400 hover:text-slate-700 shrink-0"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && term && (
        <div
          className={`absolute z-50 mt-2 ${isMobile ? "left-0 right-0" : "left-0 w-80"} max-h-80 overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl p-2`}
        >
          {loading && <p className="px-3 py-4 text-sm text-slate-400">Searching…</p>}
          {!loading && !hasResults && (
            <p className="px-3 py-4 text-sm text-slate-400">No matches for “{q}”. Try a different term.</p>
          )}
          {!loading && matches.services.length > 0 && (
            <div className="mb-1">
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Services</p>
              {matches.services.map((s) => (
                <Link
                  key={s.id}
                  to={`/services/${s.slug}`}
                  onClick={reset}
                  className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-accent mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900 truncate">{s.title}</span>
                    {s.shortDescription && <span className="block text-xs text-slate-500 truncate">{s.shortDescription}</span>}
                  </span>
                </Link>
              ))}
            </div>
          )}
          {!loading && matches.posts.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Blog Posts</p>
              {matches.posts.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  onClick={reset}
                  className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-accent mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900 truncate">{p.title}</span>
                    {p.excerpt && <span className="block text-xs text-slate-500 truncate">{p.excerpt}</span>}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}