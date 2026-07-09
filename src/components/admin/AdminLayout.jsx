import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { setMeta } from "@/components/seo/MetaTags";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, FileText, Newspaper, FolderKanban, Briefcase, Building2,
  Inbox, Users, Star, UserSquare2, Image as ImageIcon, Search, Menu,
  Navigation, Settings, LogOut, ChevronLeft, ChevronDown, X,
  Lightbulb, Download, Image, PhoneCall, Mail, UserCog, Layers, GraduationCap
} from "lucide-react";

const groups = [
  {
    label: null,
    items: [{ label: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { label: "Pages", path: "/admin/pages", icon: FileText },
      { label: "Blog", path: "/admin/blog", icon: Newspaper },
      { label: "Insights", path: "/admin/insights", icon: Lightbulb },
      { label: "Resources", path: "/admin/resources", icon: Download },
      { label: "Gallery", path: "/admin/gallery", icon: Image },
      { label: "Services", path: "/admin/services", icon: Briefcase },
      { label: "Case Studies", path: "/admin/case-studies", icon: FolderKanban },
      { label: "Industries", path: "/admin/industries", icon: Building2 },
      { label: "Testimonials", path: "/admin/testimonials", icon: Star },
      { label: "Team", path: "/admin/team", icon: UserSquare2 },
      { label: "Methodology", path: "/admin/methodology", icon: Layers },
      { label: "Media Library", path: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "Leads",
    items: [
      { label: "Leads", path: "/admin/leads", icon: Inbox },
      { label: "Strategy Calls", path: "/admin/strategy-calls", icon: PhoneCall },
      { label: "Newsletter", path: "/admin/newsletter", icon: Mail },
      { label: "Talent", path: "/admin/talent", icon: Users },
      { label: "Careers", path: "/admin/careers", icon: GraduationCap },
    ],
  },
  {
    label: "Settings",
    superAdminOnly: true,
    items: [
      { label: "Navigation & Footer", path: "/admin/navigation", icon: Navigation },
      { label: "SEO", path: "/admin/seo", icon: Search },
      { label: "Roles & Users", path: "/admin/roles", icon: UserCog },
      { label: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { role } = useOutletContext() || { role: "editor" };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({ Content: true, Leads: true, Settings: true });

  useEffect(() => {
    setMeta("robots", "noindex,nofollow");
  }, []);

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const toggleGroup = (label) => setOpenGroups((g) => ({ ...g, [label]: !g[label] }));

  const visibleGroups = groups.filter((g) => !g.superAdminOnly || role === "super_admin");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800 shrink-0">
          <Link to="/admin" className="text-lg font-extrabold text-white tracking-tight font-heading">
            Look A Like <span className="text-indigo-accent">Admin</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleGroups.map((group, gi) => (
            <div key={gi} className="space-y-1">
              {group.label && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {group.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openGroups[group.label] ? "" : "-rotate-90"}`} />
                </button>
              )}
              {(!group.label || openGroups[group.label]) &&
                group.items.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active ? "bg-indigo-accent text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 shrink-0">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Website
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">Content Management</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-indigo-50 text-indigo-accent capitalize hidden sm:inline">{role.replace("_", " ")}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.full_name || user?.email}</p>
              <p className="text-[11px] text-slate-400 leading-tight">{role === "super_admin" ? "Super Admin" : "Editor"}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-accent font-bold text-sm shrink-0">
              {(user?.full_name || user?.email || "A").charAt(0).toUpperCase()}
            </div>
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
}