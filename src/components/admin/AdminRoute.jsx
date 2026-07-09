import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { resolveRole, canAccessPath } from "@/lib/adminConfig";
import { ShieldAlert, LogOut, Loader2 } from "lucide-react";

export default function AdminRoute() {
  const { user, isAuthenticated, isLoadingAuth, authChecked, checkUserAuth, navigateToLogin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) checkUserAuth();
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  useEffect(() => {
    if (authChecked && (!isAuthenticated || !user)) navigateToLogin();
  }, [authChecked, isAuthenticated, user, navigateToLogin]);

  const { data: siteUser, isLoading: roleLoading } = useQuery({
    queryKey: ["site-user", user?.email],
    queryFn: () => base44.entities.SiteUser.filter({ email: user.email }),
    enabled: !!user?.email,
  });

  const su = siteUser?.[0];
  const role = resolveRole(su, user?.email);

  if (isLoadingAuth || !authChecked || (isAuthenticated && user && roleLoading && !role)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-indigo-accent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-indigo-accent animate-spin" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full glass-cell rounded-2xl p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">403 — Unauthorized</h1>
          <p className="text-sm text-slate-500 mb-2">
            You're logged in as <span className="font-semibold text-slate-700">{user.email}</span>
          </p>
          <p className="text-sm text-slate-500 mb-8">
            This admin dashboard is restricted to authorized accounts only.
          </p>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </div>
    );
  }

  if (!canAccessPath(role, location.pathname)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full glass-cell rounded-2xl p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Super Admin Only</h1>
          <p className="text-sm text-slate-500 mb-8">
            This section is restricted to Super Admin accounts. You're signed in as an Editor.
          </p>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet context={{ role }} />;
}