import { Link } from "react-router-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { FileText, ArrowRight } from "lucide-react";

const pages = [
  { label: "Home", path: "/", desc: "Main landing page" },
  { label: "About Us", path: "/about", desc: "Agency story, values, team" },
  { label: "Services", path: "/services", desc: "All services listing" },
  { label: "Case Studies", path: "/case-studies", desc: "Client success stories" },
  { label: "Industries", path: "/industries", desc: "Industries served" },
  { label: "Blog", path: "/blog", desc: "Insights & articles" },
  { label: "Contact", path: "/contact", desc: "Contact form" },
  { label: "Free Growth Audit", path: "/growth-audit", desc: "Audit funnel page" },
  { label: "Work With Us", path: "/work-with-us", desc: "Talent application page" },
  { label: "Privacy Policy", path: "/privacy-policy", desc: "Legal page" },
  { label: "Terms & Conditions", path: "/terms", desc: "Legal page" },
];

export default function PagesManagement() {
  return (
    <div>
      <AdminPageHeader title="Pages" subtitle="Public website pages. Click to preview, or edit their content via the relevant section." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((p) => (
          <div key={p.path} className="glass-cell rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-indigo-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm">{p.label}</p>
              <p className="text-xs text-slate-400 mb-3">{p.desc}</p>
              <Link to={p.path} target="_blank" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-accent hover:underline">
                View Page <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}