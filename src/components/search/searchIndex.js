import { base44 } from "@/api/base44Client";

/**
 * Single shared, cached search index for the whole site.
 * Both the header search (desktop + mobile) and the /search results page
 * read from this one in-memory index, so a query never triggers repeated
 * network calls or an empty dropdown while data is still loading.
 */

export const GROUP_ORDER = ["Services", "Industries", "Blog Posts", "Marketing Insights", "Resources"];

// The SDK returns an array for a plain list/filter, but a paged object when
// options are supplied — normalise both so a shape change can't empty the search.
const asArray = (res) => (Array.isArray(res) ? res : res?.items || []);

const safeList = (promise) => promise.then(asArray).catch(() => []);

const text = (value) => {
  if (Array.isArray(value)) return value.map((v) => (typeof v === "string" ? v : "")).join(" ");
  return typeof value === "string" ? value : "";
};

let cache = null;
let pending = null;

export function loadSearchIndex() {
  if (cache) return Promise.resolve(cache);
  if (pending) return pending;

  pending = Promise.all([
    safeList(base44.entities.Service.list("order", 200)),
    safeList(base44.entities.Industry.list()),
    safeList(base44.entities.BlogPost.filter({ status: "published" })),
    safeList(base44.entities.Insight.filter({ status: "published" })),
    safeList(base44.entities.Resource.list()),
  ])
    .then(([services, industries, posts, insights, resources]) => {
      const items = [
        ...services.map((s) => ({
          id: `service-${s.id}`,
          group: "Services",
          title: s.title,
          description: s.shortDescription,
          to: `/services/${s.slug}`,
          keywords: text([s.title, s.shortDescription, s.slug, s.category, s.heroHeadline, s.keywordTargets, s.deliverables]),
        })),
        ...industries.map((i) => ({
          id: `industry-${i.id}`,
          group: "Industries",
          title: i.name,
          description: i.description,
          to: "/industries",
          keywords: text([i.name, i.description, i.relevantServices]),
        })),
        ...posts.map((p) => ({
          id: `blog-${p.id}`,
          group: "Blog Posts",
          title: p.title,
          description: p.excerpt,
          to: `/blog/${p.slug}`,
          keywords: text([p.title, p.excerpt, p.slug, p.category, p.categories, p.tags, p.focusKeyword, p.secondaryKeywords]),
        })),
        ...insights.map((i) => ({
          id: `insight-${i.id}`,
          group: "Marketing Insights",
          title: i.title,
          description: i.excerpt,
          to: `/insights/${i.slug}`,
          keywords: text([i.title, i.excerpt, i.slug, i.category, i.author]),
        })),
        ...resources.map((r) => ({
          id: `resource-${r.id}`,
          group: "Resources",
          title: r.title,
          description: r.description,
          to: "/resources",
          keywords: text([r.title, r.description, r.category]),
        })),
      ]
        .filter((item) => item.title)
        .map((item) => ({ ...item, haystack: `${item.title} ${item.keywords}`.toLowerCase() }));

      cache = items;
      pending = null;
      return items;
    })
    .catch(() => {
      pending = null;
      return [];
    });

  return pending;
}

// Very short queries ("ai") must match whole words, otherwise they hit
// "email"/"paid" and bury the real results.
const matchesWords = (haystack, words) =>
  words.every((w) =>
    w.length <= 2
      ? new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`).test(haystack)
      : haystack.includes(w)
  );

const rankOf = (item, term) => {
  const title = item.title.toLowerCase();
  if (title.startsWith(term)) return 0;
  if (title.includes(term)) return 1;
  return 2;
};

/**
 * Returns grouped matches: [{ group, total, items: [...] }]
 * Every word in the query must appear somewhere, so multi-word queries
 * ("meta ads") stay relevant instead of matching nothing.
 */
export function searchIndex(items, query, perGroup = 4) {
  const term = (query || "").trim().toLowerCase();
  if (!term || !items?.length) return [];
  const words = term.split(/\s+/).filter(Boolean);
  const matched = items.filter((item) => matchesWords(item.haystack, words));

  return GROUP_ORDER.map((group) => {
    const all = matched
      .filter((item) => item.group === group)
      .sort((a, b) => rankOf(a, term) - rankOf(b, term) || a.title.length - b.title.length);
    return { group, total: all.length, items: all.slice(0, perGroup) };
  }).filter((g) => g.total > 0);
}