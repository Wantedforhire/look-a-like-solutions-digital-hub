import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Field, TextInput } from "@/components/admin/FormFields";
import { Save, Loader2, Plus, Trash2, Navigation, Check } from "lucide-react";

const DEFAULT_NAV = [
  { label: "Home", url: "/" },
  { label: "Services", url: "/services" },
  { label: "About", url: "/about" },
  { label: "Blog", url: "/blog" },
  { label: "Insights", url: "/insights" },
  { label: "Contact", url: "/contact" },
];

export default function NavigationFooterSettings() {
  const qc = useQueryClient();
  const { data: config, isLoading } = useQuery({
    queryKey: ["admin-siteconfig"],
    queryFn: async () => {
      const list = await base44.entities.SiteConfig.filter({ configKey: "main" });
      return list[0];
    },
  });

  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) { setForm(config); return; }
    if (!isLoading && !config) {
      setForm({
        configKey: "main",
        navLinks: DEFAULT_NAV,
        serviceLinks: [{ label: "SEO Services", url: "/services/seo-services" }, { label: "Performance Marketing", url: "/services/performance-marketing" }],
        socialLinks: { instagram: "", linkedin: "", youtube: "", whatsapp: "", facebook: "" },
        ctaButtonLabel: "Get A Free Growth Audit",
        ctaButtonUrl: "/growth-audit",
        clientLoginUrl: "/login",
      });
    }
  }, [config, isLoading]);

  const saveMutation = useMutation({
    mutationFn: (data) => data.id
      ? base44.functions.invoke("superAdminGuard", { entity: "SiteConfig", operation: "update", id: data.id, data })
      : base44.functions.invoke("superAdminGuard", { entity: "SiteConfig", operation: "create", data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-siteconfig"] });
      qc.invalidateQueries({ queryKey: ["site-config"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (!form) return <div className="glass-cell rounded-2xl p-6 lg:col-span-2"><p className="text-slate-400 flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading navigation...</p></div>;

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const updateLink = (key, i, field, val) => set(key)(form[key].map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const addLink = (key) => set(key)([...(form[key] || []), { label: "", url: "" }]);
  const removeLink = (key, i) => set(key)(form[key].filter((_, idx) => idx !== i));
  const social = (k) => (v) => set("socialLinks")({ ...form.socialLinks, [k]: v });

  const linkList = (key, placeholder) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-600">{key === "navLinks" ? "Header Navigation Links" : "Services Dropdown Links"}</p>
        <button type="button" onClick={() => addLink(key)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"><Plus className="w-3 h-3" /> Add</button>
      </div>
      {(form[key] || []).map((link, i) => (
        <div key={i} className="flex gap-2 items-center">
          <TextInput value={link.label} onChange={(v) => updateLink(key, i, "label", v)} placeholder="Label" />
          <TextInput value={link.url} onChange={(v) => updateLink(key, i, "url", v)} placeholder={placeholder} />
          <button type="button" onClick={() => removeLink(key, i)} className="text-slate-400 hover:text-rose-500 p-1 shrink-0"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="glass-cell rounded-2xl p-6 space-y-5 lg:col-span-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center"><Navigation className="w-5 h-5 text-indigo-accent" /></div>
          <div>
            <p className="font-bold text-slate-900 text-sm">Navigation &amp; Footer</p>
            <p className="text-xs text-slate-400">Header links, services dropdown, CTA, client login and social links</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60 shrink-0"
        >
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved" : "Save Navigation"}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {linkList("navLinks", "/path")}
        {linkList("serviceLinks", "/services/...")}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="CTA Button Label"><TextInput value={form.ctaButtonLabel} onChange={set("ctaButtonLabel")} /></Field>
        <Field label="CTA Button URL"><TextInput value={form.ctaButtonUrl} onChange={set("ctaButtonUrl")} /></Field>
        <Field label="Client Login URL"><TextInput value={form.clientLoginUrl} onChange={set("clientLoginUrl")} /></Field>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-600 mb-2">Social Media Links</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Instagram"><TextInput value={form.socialLinks?.instagram || ""} onChange={social("instagram")} placeholder="https://..." /></Field>
          <Field label="LinkedIn"><TextInput value={form.socialLinks?.linkedin || ""} onChange={social("linkedin")} placeholder="https://..." /></Field>
          <Field label="YouTube"><TextInput value={form.socialLinks?.youtube || ""} onChange={social("youtube")} placeholder="https://..." /></Field>
          <Field label="WhatsApp"><TextInput value={form.socialLinks?.whatsapp || ""} onChange={social("whatsapp")} placeholder="https://..." /></Field>
          <Field label="Facebook"><TextInput value={form.socialLinks?.facebook || ""} onChange={social("facebook")} placeholder="https://..." /></Field>
        </div>
      </div>

      {saveMutation.isError && <p className="text-xs font-semibold text-red-500">Could not save navigation: {saveMutation.error?.message}</p>}
    </div>
  );
}