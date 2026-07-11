import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, LogIn } from "lucide-react";

const services = [
  { label: "SEO Services", to: "/services/seo-services" },
  { label: "Performance Marketing", to: "/services/performance-marketing" },
  { label: "Social Media Marketing", to: "/services/social-media-marketing" },
  { label: "Branding & Creative", to: "/services/branding-creative" },
  { label: "Web Design & Development", to: "/services/web-design-development" },
  { label: "AI SEO / GEO", to: "/services/ai-seo-geo" }
];

const company = [
  { label: "About Us", to: "/about" },
  { label: "Our Methodology", to: "/methodology" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Industries Served", to: "/industries" },
  { label: "Blog", to: "/blog" },
  { label: "Marketing Insights", to: "/insights" },
  { label: "Resources", to: "/resources" },
  { label: "Design Gallery", to: "/gallery" },
  { label: "Book a Strategy Call", to: "/strategy-call" },
  { label: "Careers", to: "/careers" },
  { label: "Free Growth Audit", to: "/growth-audit" },
  { label: "Work With Us", to: "/work-with-us" },
  { label: "Contact", to: "/contact" }
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center">
            <img src="https://media.base44.com/images/public/6a45332a796cb5a887717912/54bfc626b_LookalikeSolutionsIconJPG.JPG" alt="Look A Like Solutions" className="h-8 w-8 object-contain mr-2" />
            <span className="text-xl font-extrabold text-white tracking-tight">
              Look A Like <span className="text-indigo-accent">Solutions</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed max-w-xs text-slate-400">
            Bengaluru's performance marketing agency — building revenue engines with Google Ads, Meta Ads, SEO, and AI-powered growth for 100+ businesses.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="https://www.facebook.com/lookalikesolutions" target="_blank" rel="noopener noreferrer" aria-label="Look A Like Solutions on Facebook" className="hover:text-indigo-accent transition-colors"><Facebook className="w-5 h-5" aria-hidden="true" /></a>
            <a href="https://www.instagram.com/lookalikesolutions" target="_blank" rel="noopener noreferrer" aria-label="Look A Like Solutions on Instagram" className="hover:text-indigo-accent transition-colors"><Instagram className="w-5 h-5" aria-hidden="true" /></a>
            <a href="https://www.youtube.com/@thelookalikesolutions" target="_blank" rel="noopener noreferrer" aria-label="Look A Like Solutions on YouTube" className="hover:text-indigo-accent transition-colors"><Youtube className="w-5 h-5" aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/company/lookalikesolutions" target="_blank" rel="noopener noreferrer" aria-label="Look A Like Solutions on LinkedIn" className="hover:text-indigo-accent transition-colors"><Linkedin className="w-5 h-5" aria-hidden="true" /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
          <ul className="space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.to}><Link to={s.to} className="hover:text-indigo-accent transition-colors">{s.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
          <ul className="space-y-3 text-sm">
            {company.map((c) => (
              <li key={c.to}><Link to={c.to} className="hover:text-indigo-accent transition-colors">{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get in Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /><a href="tel:+919731588244" className="hover:text-indigo-accent transition-colors">+91-9731588244</a></li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /><a href="mailto:info@lookalikesolutions.com" className="hover:text-indigo-accent transition-colors break-all">info@lookalikesolutions.com</a></li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />Bengaluru, Karnataka, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Look A Like Solutions. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <Link to="/privacy-policy" className="hover:text-indigo-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-accent transition-colors">Terms &amp; Conditions</Link>
            <Link to="/login" className="flex items-center gap-1 hover:text-indigo-accent transition-colors"><LogIn className="w-3 h-3" /> Client Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}