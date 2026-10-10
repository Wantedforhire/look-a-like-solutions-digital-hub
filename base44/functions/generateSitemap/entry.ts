import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const BASE_URL = "https://www.lookalikesolutions.com";

function xmlEscape(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function toDate(d) {
  if (!d) return new Date().toISOString().split("T")[0];
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return new Date().toISOString().split("T")[0];
    return dt.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

function urlEntry(loc, lastmod, changefreq, priority) {
  const lines = ["  <url>", `    <loc>${xmlEscape(loc)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  lines.push(`    <changefreq>${changefreq}</changefreq>`, `    <priority>${priority}</priority>`, "  </url>");
  return lines.join("\n");
}

async function buildSitemap(base44) {
  const sr = base44.asServiceRole;
  const [posts, insights, services, caseStudies] = await Promise.all([
    sr.entities.BlogPost.filter({ status: "published" }),
    sr.entities.Insight.filter({ status: "published" }),
    sr.entities.Service.list(),
    sr.entities.CaseStudy.list()
  ]);

  const urls = [];
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/about", changefreq: "monthly", priority: "0.5" },
    { path: "/services", changefreq: "weekly", priority: "0.9" },
    { path: "/case-studies", changefreq: "weekly", priority: "0.9" },
    { path: "/industries", changefreq: "monthly", priority: "0.5" },
    { path: "/blog", changefreq: "daily", priority: "0.9" },
    { path: "/insights", changefreq: "daily", priority: "0.9" },
    { path: "/gallery", changefreq: "monthly", priority: "0.5" },
    { path: "/methodology", changefreq: "monthly", priority: "0.5" },
    { path: "/careers", changefreq: "weekly", priority: "0.5" },
    { path: "/contact", changefreq: "monthly", priority: "0.5" },
    { path: "/growth-audit", changefreq: "monthly", priority: "0.7" },
    { path: "/strategy-call", changefreq: "monthly", priority: "0.7" },
    { path: "/resources", changefreq: "weekly", priority: "0.5" },
    { path: "/work-with-us", changefreq: "monthly", priority: "0.5" },
    { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" }
  ];
  staticPages.forEach((p) => urls.push(urlEntry(`${BASE_URL}${p.path}`, today, p.changefreq, p.priority)));

  posts.forEach((p) => { if (p.slug) urls.push(urlEntry(`${BASE_URL}/blog/${p.slug}`, toDate(p.publishDate || p.updated_date), "daily", "0.8")); });
  insights.forEach((i) => { if (i.slug) urls.push(urlEntry(`${BASE_URL}/insights/${i.slug}`, toDate(i.publishDate || i.updated_date), "daily", "0.8")); });
  services.forEach((s) => { if (s.slug) urls.push(urlEntry(`${BASE_URL}/services/${s.slug}`, toDate(s.updated_date), "weekly", "0.7")); });
  caseStudies.forEach((c) => { if (c.slug) urls.push(urlEntry(`${BASE_URL}/case-studies/${c.slug}`, toDate(c.updated_date), "weekly", "0.7")); });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return { xml, urlCount: urls.length };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Public GET (crawlers) serves the sitemap with no auth required.
    // Non-GET (SDK invoke from admin UI / workflows) regenerates and returns metadata.
    const isPublicGet = req.method === "GET";

    if (!isPublicGet) {
      let user = null;
      try { user = await base44.auth.me(); } catch {}
      if (user && user.role !== "admin") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const { xml, urlCount } = await buildSitemap(base44);

    // Best-effort write to public/sitemap.xml (refreshes dev-served file; no-op if FS unwritable).
    let written = false;
    const candidates = ["../../../public/sitemap.xml", "../../public/sitemap.xml", "./public/sitemap.xml"];
    for (const p of candidates) {
      try { await Deno.writeTextFile(p, xml); written = true; break; } catch {}
    }

    if (isPublicGet) {
      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    return Response.json({
      generated: true,
      urlCount,
      generatedAt: new Date().toISOString(),
      written
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}