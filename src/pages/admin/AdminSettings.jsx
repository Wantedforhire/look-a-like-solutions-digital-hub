import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useAuth } from "@/lib/AuthContext";
import { ADMIN_EMAILS } from "@/lib/adminConfig";
import { Shield, Mail, User } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  return (
    <div>
      <AdminPageHeader title="Settings" subtitle="Admin account and site configuration." />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-cell rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center"><User className="w-5 h-5 text-indigo-accent" /></div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Your Account</p>
              <p className="text-xs text-slate-400">Authenticated as administrator</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span className="text-slate-700">{user?.email}</span></div>
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /><span className="text-slate-700">{user?.full_name || "—"}</span></div>
          </div>
        </div>

        <div className="glass-cell rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center"><Shield className="w-5 h-5 text-emerald-accent" /></div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Admin Access</p>
              <p className="text-xs text-slate-400">Emails authorized to access /admin</p>
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            {ADMIN_EMAILS.map((email) => (
              <div key={email} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-700">{email}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
            To add more admins, update the ADMIN_EMAILS list in <code className="text-indigo-accent">src/lib/adminConfig.js</code>.
          </p>
        </div>
      </div>
    </div>
  );
}