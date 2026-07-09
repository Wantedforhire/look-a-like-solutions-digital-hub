import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useAuth } from "@/lib/AuthContext";
import { useOutletContext } from "react-router-dom";
import { ADMIN_EMAILS } from "@/lib/adminConfig";
import { Field, TextInput, TextArea } from "@/components/admin/FormFields";
import { Mail, User, BarChart3, Info, Save, Search } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  const { role } = useOutletContext() || { role: "editor" };
  const qc = useQueryClient();
  const [gtmId, setGtmId] = useState("");
  const [gaId, setGaId] = useState("");
  const [siteName, setSiteName] = useState("");
  const [defaultMetaDescription, setDefaultMetaDescription] = useState("");
  const [defaultOgImage, setDefaultOgImage] = useState("");
  const [gscVerification, setGscVerification] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: config } = useQuery({
    queryKey: ["site-config", "main"],
    queryFn: () => base44.entities.SiteConfig.filter({ configKey: "main" }),
  });
  const configRecord = config?.[0];

  useEffect(() => {
    if (configRecord) {
      setGtmId(configRecord.gtmContainerId || "");
      setGaId(configRecord.gaId || "");
      setSiteName(configRecord.siteName || "");
      setDefaultMetaDescription(configRecord.defaultMetaDescription || "");
      setDefaultOgImage(configRecord.defaultOgImage || "");
      setGscVerification(configRecord.gscVerification || "");
    }
  }, [configRecord]);

  const saveTracking = useMutation({
    mutationFn: () => {
      const gtm = gtmId.trim();
      const ga = gaId.trim();
      if (gtm && !/^GTM-[A-Z0-9]{4,}$/.test(gtm)) throw new Error("GTM ID must match format GTM-XXXXXX");
      if (ga && !/^G-[A-Z0-9]+$/.test(ga)) throw new Error("GA4 ID must match format G-XXXXXXXX");
      return configRecord
        ? base44.entities.SiteConfig.update(configRecord.id, { gtmContainerId: gtm, gaId: ga })
        : base44.entities.SiteConfig.create({ configKey: "main", gtmContainerId: gtm, gaId: ga });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-config"] });
      setSavedMsg("Tracking settings saved.");
      setErrorMsg("");
      setTimeout(() => setSavedMsg(""), 3000);
    },
    onError: (err) => setErrorMsg(err.message),
  });

  const saveSeo = useMutation({
    mutationFn: () => {
      const payload = {
        siteName: siteName.trim(),
        defaultMetaDescription: defaultMetaDescription.trim(),
        defaultOgImage: defaultOgImage.trim(),
        gscVerification: gscVerification.trim(),
      };
      return configRecord
        ? base44.entities.SiteConfig.update(configRecord.id, payload)
        : base44.entities.SiteConfig.create({ configKey: "main", ...payload });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-config"] });
      setSavedMsg("SEO settings saved.");
      setErrorMsg("");
      setTimeout(() => setSavedMsg(""), 3000);
    },
    onError: (err) => setErrorMsg(err.message),
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
          <>
            <div className="glass-cell rounded-2xl p-6 space-y-4 lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-emerald-accent" /></div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Tracking &amp; Analytics</p>
                  <p className="text-xs text-slate-400">Google Tag Manager &amp; Google Analytics 4</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="GTM Container ID" hint="Format: GTM-XXXXXX">
                  <TextInput value={gtmId} onChange={setGtmId} placeholder="GTM-XXXXXX" />
                </Field>
                <Field label="Google Analytics 4 ID" hint="Format: G-XXXXXXXX">
                  <TextInput value={gaId} onChange={setGaId} placeholder="G-XXXXXXXX" />
                </Field>
              </div>
              {errorMsg && <p className="text-xs font-semibold text-red-500">{errorMsg}</p>}
              {savedMsg && <p className="text-xs font-semibold text-emerald-600">{savedMsg}</p>}
              <button
                onClick={() => saveTracking.mutate()}
                disabled={saveTracking.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> Save Tracking
              </button>
            </div>

            <div className="glass-cell rounded-2xl p-6 space-y-4 lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center"><Search className="w-5 h-5 text-indigo-accent" /></div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Global SEO Settings</p>
                  <p className="text-xs text-slate-400">Default metadata, OG image &amp; Search Console verification</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Site Name" hint="Brand name used as the title suffix across the site">
                  <TextInput value={siteName} onChange={setSiteName} placeholder="Look A Like Solutions" />
                </Field>
                <Field label="Default OG Image URL" hint="Fallback social share image">
                  <TextInput value={defaultOgImage} onChange={setDefaultOgImage} placeholder="https://..." />
                </Field>
              </div>
              <Field label="Default Meta Description" hint="Fallback description for pages without a custom one">
                <TextArea value={defaultMetaDescription} onChange={setDefaultMetaDescription} placeholder="Look A Like Solutions builds revenue engines..." rows={3} />
              </Field>
              <Field label="Google Search Console Verification" hint="Content value of the google-site-verification meta tag">
                <TextInput value={gscVerification} onChange={setGscVerification} placeholder="google-site-verification content value" />
              </Field>
              <button
                onClick={() => saveSeo.mutate()}
                disabled={saveSeo.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> Save SEO Settings
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}