// Registry of public static website pages that should be managed from /admin/seo.
// When a new public static page is added to the site (a route in src/App.jsx),
// add its entry here so admins can manage its meta title / meta description
// without developer support. Dynamic pages (services/:slug, blog/:slug, etc.)
// are managed via their own entities and are NOT listed here.
export const STATIC_PAGES = [
  { path: "/", name: "Home Page" },
  { path: "/about", name: "About" },
  { path: "/services", name: "Services" },
  { path: "/case-studies", name: "Results" },
  { path: "/industries", name: "Industries" },
  { path: "/blog", name: "Blog" },
  { path: "/insights", name: "Insights" },
  { path: "/contact", name: "Contact" },
  { path: "/growth-audit", name: "Growth Audit" },
  { path: "/strategy-call", name: "Strategy Call" },
  { path: "/resources", name: "Resources" },
  { path: "/gallery", name: "Gallery" },
  { path: "/methodology", name: "Methodology" },
  { path: "/careers", name: "Careers" },
  { path: "/work-with-us", name: "Work With Us" },
  { path: "/privacy-policy", name: "Privacy Policy" },
  { path: "/terms", name: "Terms" },
];