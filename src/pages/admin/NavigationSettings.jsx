import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Field, TextInput } from "@/components/admin/FormFields";
import { Save, Loader2, Plus, Trash2, Instagram, Linkedin, Youtube, Facebook } from "lucide-react";

export default function NavigationSettings() {
  const qc = useQueryClient();
  const { data: config, isLoading } = useQuery({
    queryKey: ["admin-siteconfig"],
    queryFn: async () => {
      const list = await base44.entities.SiteConfig.filter({ configKey: "main" });
      return list[0];
    },
  });

  const [form, setForm] = useState(null);
  useEffect(() => {
    if (config) { setForm(config); return; }
    if (!isLoading && !config) {
      setForm({
        configKey: "main",
        navLinks: [{ label: "Home", url: "/" }, { label: "Services", url: "/services" }, { label: "About", url: "/about" }, { label: "Case Studies", url: "/case-studies" }, { label: "Blog", url: "/blog" }, { label: "Contact", url: "/contact" }],
        serviceLinks: [{ label: "SEO Services", url: "/services/seo-services" }, { label: "Performance Marketing", url: "/services/performance-marketing" }],
        footerColumns: [{ title: "Services", links: [{ label: "SEO Services", url: "/services/seo-services" }] }],
        socialLinks: { instagram: "", linkedin: "", youtube: "", whatsapp: "", facebook: "" },
        ctaButtonLabel: "Get A Free Growth Audit",
        ctaButtonUrl: "/growth-audit",
        clientLoginUrl: "/login",
      });
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: (data) => data.id ? base44.entities.SiteConfig.update(data.id, data) : base44.entities.SiteConfig.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-siteconfig"] }),
  });

  if (!form) return <p className="text-slate-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading settings...</p>;

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const updateLink = (key, i, field, val) => set(key)(form[key].map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const addLink = (key) => set(key)([...(form[key] || []), { label: "", url: "" }]);
  const removeLink = (key, i) => set(key)(form[key].filter((_, idx) => idx !== i));

  return (
    <div>
      <AdminPageHeader title="Navigation & Footer" subtitle="Edit header navigation, footer links, and CTA buttons."
        actions={<button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save Changes</button>} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Header Nav */}
        <div className="glass-cell rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-900">Header Navigation Links</p>
            <button onClick={() => addLink("navLinks")} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"><Plus className="w-3 h-3" /> Add</button>
          </div>
          <div className="space-y-2">
            {(form.navLinks || []).map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <TextInput value={link.label} onChange={(v) => updateLink("navLinks", i, "label", v)} placeholder="Label" />
                <TextInput value={link.url} onChange={(v) => updateLink("navLinks", i, "url", v)} placeholder="/path" />
                <button onClick={() => removeLink("navLinks", i)} className="text-slate-400 hover:text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Service Dropdown */}
        <div className="glass-cell rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-900">Services Dropdown Links</p>
            <button onClick={() => addLink("serviceLinks")} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"><Plus className="w-3 h-3" /> Add</button>
          </div>
          <div className="space-y-2">
            {(form.serviceLinks || []).map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <TextInput value={link.label} onChange={(v) => updateLink("serviceLinks", i, "label", v)} placeholder="Label" />
                <TextInput value={link.url} onChange={(v) => updateLink("serviceLinks", i, "url", v)} placeholder="/services/..." />
                <button onClick={() => removeLink("serviceLinks", i)} className="text-slate-400 hover:text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-cell rounded-2xl p-6 space-y-4">
          <p className="text-sm font-bold text-slate-900">CTA Button</p>
          <Field label="Label"><TextInput value={form.ctaButtonLabel} onChange={set("ctaButtonLabel")} /></Field>
          <Field label="URL"><TextInput value={form.ctaButtonUrl} onChange={set("ctaButtonUrl")} /></Field>
        </div>

        {/* Client Login */}
        <div className="glass-cell rounded-2xl p-6 space-y-4">
          <p className="text-sm font-bold text-slate-900">Client Login</p>
          <Field label="Client Login URL"><TextInput value={form.clientLoginUrl} onChange={set("clientLoginUrl")} /></Field>
        </div>

        {/* Social Links */}
        <div className="glass-cell rounded-2xl p-6 space-y-4 lg:col-span-2">
          <p className="text-sm font-bold text-slate-900">Social Media Links</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Instagram"><TextInput value={form.socialLinks?.instagram || ""} onChange={(v) => set("socialLinks")({ ...form.socialLinks, instagram: v })} placeholder="https://..." /></Field>
            <Field label="LinkedIn"><TextInput value={form.socialLinks?.linkedin || ""} onChange={(v) => set("socialLinks")({ ...form.socialLinks, linkedin: v })} placeholder="https://..." /></Field>
            <Field label="YouTube"><TextInput value={form.socialLinks?.youtube || ""} onChange={(v) => set("socialLinks")({ ...form.socialLinks, youtube: v })} placeholder="https://..." /></Field>
            <Field label="WhatsApp"><TextInput value={form.socialLinks?.whatsapp || ""} onChange={(v) => set("socialLinks")({ ...form.socialLinks, whatsapp: v })} placeholder="https://..." /></Field>
            <Field label="Facebook"><TextInput value={form.socialLinks?.facebook || ""} onChange={(v) => set("socialLinks")({ ...form.socialLinks, facebook: v })} placeholder="https://..." /></Field>
          </div>
        </div>
      </div>
    </div>
  );
}