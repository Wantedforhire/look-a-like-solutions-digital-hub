import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { hasAdminRole } from "@/lib/adminConfig";
import { ShieldAlert, LogOut, Loader2 } from "lucide-react";

export default function AdminRoute() {
  const { user, isAuthenticated, isLoadingAuth, authChecked, checkUserAuth, navigateToLogin, logout } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  useEffect(() => {
    if (authChecked && (!isAuthenticated || !user)) {
      navigateToLogin();
    }
  }, [authChecked, isAuthenticated, user, navigateToLogin]);

  if (isLoadingAuth || !authChecked) {
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

  if (!hasAdminRole(user)) {
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

  return <Outlet />;
}