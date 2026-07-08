import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import CTAButton from "@/components/ui-custom/CTAButton";

const serviceLinks = [
  { label: "SEO Services", to: "/services/seo-services" },
  { label: "Performance Marketing / PPC", to: "/services/performance-marketing" },
  { label: "Social Media Marketing", to: "/services/social-media-marketing" },
  { label: "Branding / Creative", to: "/services/branding-creative" },
  { label: "Web Design & Development", to: "/services/web-design-development" },
  { label: "Content Marketing", to: "/services/content-marketing" },
  { label: "Online Reputation Management", to: "/services/online-reputation-management" },
  { label: "Lead Generation", to: "/services/lead-generation" },
  { label: "AI SEO / GEO", to: "/services/ai-seo-geo" }
];

const navLinks = [
  { label: "Industries", to: "/industries" },
  { label: "Results", to: "/case-studies" },
  { label: "About", to: "/about" },
  { label: "Insights", to: "/blog" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm" : "bg-white/95 backdrop-blur-xl border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center shrink-0">
          <img src="https://media.base44.com/images/public/6a45332a796cb5a887717912/54bfc626b_LookalikeSolutionsIconJPG.JPG" alt="Look A Like Solutions" className="h-8 w-8 object-contain mr-2" />
          <span className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
            Look A Like <span className="text-indigo-accent">Solutions</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-indigo-accent transition-colors">
              Services <ChevronDown className="w-4 h-4" />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[560px]">
                <div className="rounded-2xl p-6 grid grid-cols-2 gap-2 bg-white border border-slate-200 shadow-xl">
                  {serviceLinks.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      className="text-sm text-slate-600 hover:text-indigo-accent hover:bg-slate-50 rounded-lg px-3 py-2.5 transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    className="col-span-2 text-sm font-semibold text-emerald-accent hover:text-emerald-600 rounded-lg px-3 py-2.5 transition-colors border-t border-slate-100 mt-2 pt-3"
                  >
                    View All Services →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-slate-700 hover:text-indigo-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}

          <Link to="/contact" className="text-sm font-medium text-slate-700 hover:text-indigo-accent transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+919731588244" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <Phone className="w-4 h-4" /> +91-9731588244
          </a>
          <CTAButton to="/growth-audit" variant="primary" className="!py-3">
            Get A Free Growth Audit
          </CTAButton>
        </div>

        <button
          className="lg:hidden text-slate-900 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 max-h-[80vh] overflow-y-auto shadow-lg">
          <div className="px-6 py-6 space-y-1">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 mt-2">Services</p>
            {serviceLinks.map((s) => (
              <Link key={s.to} to={s.to} className="block py-2.5 text-sm text-slate-700">
                {s.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-3" />
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="block py-2.5 text-sm font-medium text-slate-900">
                {l.label}
              </Link>
            ))}
            <Link to="/contact" className="block py-2.5 text-sm font-medium text-slate-900">
              Contact
            </Link>
            <div className="pt-4">
              <CTAButton to="/growth-audit" variant="primary" className="w-full">
                Get A Free Growth Audit
              </CTAButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}