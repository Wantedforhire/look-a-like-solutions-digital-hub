import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Search, X, Loader2 } from "lucide-react";
import { loadSearchIndex, searchIndex } from "@/components/search/searchIndex";
import SearchSuggestions from "@/components/search/SearchSuggestions";

const PER_GROUP = 4;

function PanelBody({ loading, groups, query, total, active, onSelect, onActive, onSeeAll }) {
  if (loading) {
    return (
      <p className="px-3 py-4 text-sm text-slate-400 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Searching…
      </p>
    );
  }
  if (!total) {
    return (
      <div className="px-3 py-4">
        <p className="text-sm text-slate-500">No matches for “{query}”.</p>
        <p className="text-xs text-slate-400 mt-1">Try a service name, industry, or topic such as “SEO” or “Meta Ads”.</p>
      </div>
    );
  }
  return (
    <div className="py-1">
      <SearchSuggestions groups={groups} active={active} onSelect={onSelect} onActive={onActive} />
      <button
        type="button"
        onClick={onSeeAll}
        className="w-full text-left px-3 py-3 mt-1 border-t border-slate-100 text-sm font-semibold text-indigo-accent hover:bg-slate-50 rounded-b-lg transition-colors"
      >
        See all {total} result{total === 1 ? "" : "s"} for “{query}” →
      </button>
    </div>
  );
}

export default function SiteSearch({ placeholder = "Search services, industries, blogs…", onNavigate, variant = "desktop" }) {
  const isMobile = variant === "mobile";
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(null);
  const [active, setActive] = useState(-1);
  const [rect, setRect] = useState(null);

  // The index loads once and is shared with the results page.
  useEffect(() => {
    let alive = true;
    loadSearchIndex().then((list) => {
      if (alive) setItems(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  const { groups, flat, total } = useMemo(() => {
    const grouped = searchIndex(items, q, PER_GROUP);
    const flatItems = [];
    const indexed = grouped.map((g) => ({
      group: g.group,
      total: g.total,
      items: g.items.map((item) => {
        const entry = { ...item, index: flatItems.length };
        flatItems.push(entry);
        return entry;
      }),
    }));
    return { groups: indexed, flat: flatItems, total: indexed.reduce((n, g) => n + g.total, 0) };
  }, [items, q]);

  useEffect(() => {
    setActive(-1);
  }, [q]);

  // Desktop panel is portalled and positioned from the input, so no ancestor
  // (header row, mobile menu, overflow container) can clip or shift it.
  useEffect(() => {
    if (!open || isMobile) return;
    const update = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (r) setRect({ top: r.bottom + 8, left: r.left, width: Math.max(r.width, 320) });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, isMobile]);

  // Close only on a real click outside both the input and the panel.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (wrapRef.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const goTo = (item) => {
    close();
    setQ("");
    navigate(item.to);
    onNavigate?.();
  };

  const seeAll = () => {
    const term = q.trim();
    if (!term) return;
    close();
    setQ("");
    navigate(`/search?q=${encodeURIComponent(term)}`);
    onNavigate?.();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" && flat.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp" && flat.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? flat.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && flat[active]) goTo(flat[active]);
      else seeAll();
    } else if (e.key === "Escape") {
      close();
      inputRef.current?.blur();
    }
  };

  const showPanel = open && !!q.trim();

  const panelProps = {
    loading: items === null,
    groups,
    query: q.trim(),
    total,
    active,
    onSelect: goTo,
    onActive: setActive,
    onSeeAll: seeAll,
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={`flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-indigo-accent focus-within:bg-white ${
          isMobile ? "px-4 py-3" : "px-3.5 py-2 w-56 focus-within:w-64"
        }`}
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="site-search-panel"
          aria-autocomplete="list"
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search the site"
          className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 min-w-0 [&::-webkit-search-cancel-button]:hidden"
        />
        {items === null && q.trim() && (
          <Loader2 className="w-4 h-4 text-slate-400 shrink-0 animate-spin" aria-hidden="true" />
        )}
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            className="text-slate-400 hover:text-slate-700 shrink-0 min-w-[20px] min-h-[20px] flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile / tablet: rendered in flow inside the menu, so nothing can clip it. */}
      {showPanel && isMobile && (
        <div
          ref={panelRef}
          id="site-search-panel"
          role="listbox"
          aria-label="Search results"
          className="mt-2 max-h-72 overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-sm"
        >
          <PanelBody {...panelProps} />
        </div>
      )}

      {/* Desktop: portalled to <body> with fixed positioning — never clipped, never behind content. */}
      {showPanel && !isMobile && rect && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={panelRef}
              id="site-search-panel"
              role="listbox"
              aria-label="Search results"
              style={{ position: "fixed", top: rect.top, left: rect.left, width: rect.width, zIndex: 9999 }}
              className="max-h-[70vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl"
            >
              <PanelBody {...panelProps} />
            </div>,
            document.body
          )
        : null}
    </div>
  );
}