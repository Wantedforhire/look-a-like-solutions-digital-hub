import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

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
  { label: "Case Studies", to: "/case-studies" },
  { label: "Industries Served", to: "/industries" },
  { label: "Blog / Insights", to: "/blog" },
  { label: "Contact", to: "/contact" }
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-slate-sub">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <Link to="/" className="text-xl font-extrabold text-pearl tracking-tight">
            Look A Like <span className="text-indigo-accent">Solutions</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed max-w-xs">
            Bengaluru's growth-focused digital marketing agency — engineering measurable SEO, performance, and brand outcomes for 500+ businesses.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-indigo-accent transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-indigo-accent transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-indigo-accent transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h3 className="text-pearl font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
          <ul className="space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.to}><Link to={s.to} className="hover:text-indigo-accent transition-colors">{s.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-pearl font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
          <ul className="space-y-3 text-sm">
            {company.map((c) => (
              <li key={c.to}><Link to={c.to} className="hover:text-indigo-accent transition-colors">{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-pearl font-semibold mb-4 text-sm uppercase tracking-wider">Get in Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" /><a href="tel:+919731588244" className="hover:text-indigo-accent transition-colors">+91-9731588244</a></li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" /><a href="mailto:info@lookalikesolutions.com" className="hover:text-indigo-accent transition-colors break-all">info@lookalikesolutions.com</a></li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" />Bengaluru, Karnataka, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} Look A Like Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-indigo-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-accent transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}