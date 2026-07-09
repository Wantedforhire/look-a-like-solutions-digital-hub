import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useAuth } from "@/lib/AuthContext";
import { useOutletContext } from "react-router-dom";
import { ADMIN_EMAILS } from "@/lib/adminConfig";
import { Field, TextInput } from "@/components/admin/FormFields";
import { Shield, Mail, User, BarChart3, Info, Save } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  const { role } = useOutletContext() || { role: "editor" };
  const qc = useQueryClient();
  const [gtmId, setGtmId] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const { data: config } = useQuery({
    queryKey: ["site-config", "main"],
    queryFn: () => base44.entities.SiteConfig.filter({ configKey: "main" }),
  });
  const configRecord = config?.[0];

  useEffect(() => {
    if (configRecord) setGtmId(configRecord.gtmContainerId || "");
  }, [configRecord]);

  const saveGtm = useMutation({
    mutationFn: (val) =>
      configRecord
        ? base44.entities.SiteConfig.update(configRecord.id, { gtmContainerId: val })
        : base44.entities.SiteConfig.create({ configKey: "main", gtmContainerId: val }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-config"] });
      setSavedMsg("GTM Container ID saved.");
      setTimeout(() => setSavedMsg(""), 3000);
    },
  });

  return (
    <div>
      <AdminPageHeader title="Settings" subtitle="Admin account, analytics, and site configuration." />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-cell rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center"><User className="w-5 h-5 text-indigo-accent" /></div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Your Account</p>
              <p className="text-xs text-slate-400">Authenticated as {role === "super_admin" ? "Super Admin" : "Editor"}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span className="text-slate-700">{user?.email}</span></div>
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /><span className="text-slate-700">{user?.full_name || "—"}</span></div>
          </div>
        </div>

        <div className="glass-cell rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center"><Info className="w-5 h-5 text-sky-500" /></div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Admin Login</p>
              <p className="text-xs text-slate-400">How to access this dashboard</p>
            </div>
          </div>
          <div className="text-sm text-slate-600 space-y-2">
            <p>The admin panel is at <code className="text-indigo-accent font-semibold">/admin</code>. To log in, visit <code className="text-indigo-accent font-semibold">/login</code> with your Base44 account email.</p>
            <p className="text-xs text-slate-400">Super Admin emails:</p>
            <div className="space-y-1.5">
              {ADMIN_EMAILS.map((email) => (
                <div key={email} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-700">{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {role === "super_admin" && (
          <div className="glass-cell rounded-2xl p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-emerald-accent" /></div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Tracking &amp; Analytics</p>
                <p className="text-xs text-slate-400">Google Tag Manager container ID</p>
              </div>
            </div>
            <Field label="GTM Container ID" hint="Enter your GTM container ID (e.g. GTM-XXXXXX). The script will be injected site-wide.">
              <div className="flex items-center gap-3">
                <TextInput value={gtmId} onChange={setGtmId} placeholder="GTM-XXXXXX" />
                <button
                  onClick={() => saveGtm.mutate(gtmId.trim())}
                  disabled={saveGtm.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60 whitespace-nowrap"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </Field>
            {savedMsg && <p className="text-xs font-semibold text-emerald-600">{savedMsg}</p>}
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
              Once saved, the GTM script and noscript tags are automatically injected into the site head.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}