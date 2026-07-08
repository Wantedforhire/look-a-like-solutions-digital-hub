import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader, { StatCard } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/adminUtils";
import { Link } from "react-router-dom";
import {
  Inbox, TrendingUp, Newspaper, FolderKanban, Star, Briefcase,
  Building2, Users, ArrowRight, Mail, Clock
} from "lucide-react";

export default function Dashboard() {
  const { data: leads = [] } = useQuery({
    queryKey: ["admin-leads", "all"],
    queryFn: () => base44.entities.ContactSubmission.list("-created_date", 500),
  });
  const { data: talent = [] } = useQuery({
    queryKey: ["admin-talent", "all"],
    queryFn: () => base44.entities.TalentApplication.list("-created_date", 500),
  });
  const { data: posts = [] } = useQuery({
    queryKey: ["admin-blog", "all"],
    queryFn: () => base44.entities.BlogPost.list(),
  });
  const { data: studies = [] } = useQuery({
    queryKey: ["admin-case-studies", "all"],
    queryFn: () => base44.entities.CaseStudy.list(),
  });
  const { data: services = [] } = useQuery({
    queryKey: ["admin-services", "all"],
    queryFn: () => base44.entities.Service.list(),
  });
  const { data: industries = [] } = useQuery({
    queryKey: ["admin-industries", "all"],
    queryFn: () => base44.entities.Industry.list(),
  });
  const { data: testimonials = [] } = useQuery({
    queryKey: ["admin-testimonials", "all"],
    queryFn: () => base44.entities.Testimonial.list(),
  });

  const growthAudits = leads.filter((l) => l.serviceInterest === "Growth Audit");

  const recent = [
    ...leads.map((l) => ({ type: "lead", id: l.id, name: l.name, sub: l.serviceInterest || "Contact", date: l.created_date, email: l.email })),
    ...talent.map((t) => ({ type: "talent", id: t.id, name: t.name, sub: t.skillArea, date: t.created_date, email: t.email })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div>
      <AdminPageHeader title="Dashboard" subtitle="Overview of your website content and incoming activity." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Leads" value={leads.length} icon={Inbox} accent="indigo" />
        <StatCard label="Growth Audit Submissions" value={growthAudits.length} icon={TrendingUp} accent="emerald" />
        <StatCard label="Talent Applications" value={talent.length} icon={Users} accent="sky" />
        <StatCard label="Blog Posts" value={posts.length} icon={Newspaper} accent="amber" />
        <StatCard label="Case Studies" value={studies.length} icon={FolderKanban} accent="indigo" />
        <StatCard label="Services" value={services.length} icon={Briefcase} accent="emerald" />
        <StatCard label="Industries" value={industries.length} icon={Building2} accent="sky" />
        <StatCard label="Testimonials" value={testimonials.length} icon={Star} accent="amber" />
      </div>

      <div className="glass-cell rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <div className="flex gap-3 text-xs">
            <Link to="/admin/leads" className="text-indigo-accent hover:underline font-semibold">Leads →</Link>
            <Link to="/admin/talent" className="text-indigo-accent hover:underline font-semibold">Talent →</Link>
          </div>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No activity yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.type === "lead" ? "bg-indigo-50 text-indigo-accent" : "bg-sky-50 text-sky-500"}`}>
                  {item.type === "lead" ? <Mail className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mr-1.5 ${item.type === "lead" ? "bg-indigo-50 text-indigo-accent" : "bg-sky-50 text-sky-500"}`}>
                      {item.type === "lead" ? "LEAD" : "TALENT"}
                    </span>
                    {item.sub} · {item.email}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                  <Clock className="w-3 h-3" />
                  {formatDate(item.date, "MMM d, h:mm a")}
                </div>
                <Link
                  to={item.type === "lead" ? "/admin/leads" : "/admin/talent"}
                  className="text-slate-300 hover:text-indigo-accent shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}