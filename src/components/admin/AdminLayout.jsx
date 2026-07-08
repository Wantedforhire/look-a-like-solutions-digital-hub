import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { hasAdminRole } from "@/lib/adminConfig";
import {
  LayoutDashboard, FileText, Newspaper, FolderKanban, Briefcase, Building2,
  Inbox, Users, Star, UserSquare2, Image as ImageIcon, Search, Menu,
  Navigation, Settings, LogOut, ChevronLeft, X
} from "lucide-react";

const menu = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Pages", path: "/admin/pages", icon: FileText },
  { label: "Blog", path: "/admin/blog", icon: Newspaper },
  { label: "Case Studies", path: "/admin/case-studies", icon: FolderKanban },
  { label: "Services", path: "/admin/services", icon: Briefcase },
  { label: "Industries", path: "/admin/industries", icon: Building2 },
  { label: "Leads", path: "/admin/leads", icon: Inbox },
  { label: "Talent Applications", path: "/admin/talent", icon: Users },
  { label: "Testimonials", path: "/admin/testimonials", icon: Star },
  { label: "Team", path: "/admin/team", icon: UserSquare2 },
  { label: "Media Library", path: "/admin/media", icon: ImageIcon },
  { label: "SEO", path: "/admin/seo", icon: Search },
  { label: "Navigation & Footer", path: "/admin/navigation", icon: Navigation },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
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
          {menu.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-accent text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {item.label}
              </Link>
            );
          })}
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">Content Management</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.full_name || user?.email}</p>
              <p className="text-[11px] text-slate-400 leading-tight">{hasAdminRole(user) ? "Administrator" : "User"}</p>
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

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}