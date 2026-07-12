import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Field, TextInput, TextArea, Toggle } from "@/components/admin/FormFields";
import { ChevronDown, ChevronRight, Save, Loader2, Tag } from "lucide-react";
import { GTM_FALLBACK_ID } from "@/components/GtmInjector";

function GtmStatusCard() {
  const { data: config, isLoading } = useQuery({
    queryKey: ["site-config", "gtm"],
    queryFn: () => base44.entities.SiteConfig.filter({ configKey: "main" }),
    staleTime: 300000,
  });
  const stored = config?.[0]?.gtmContainerId;
  const activeId = stored && /^GTM-[A-Z0-9]{6,}$/.test(stored) ? stored : GTM_FALLBACK_ID;
  const usingFallback = !stored;

  return (
    <div className="glass-cell rounded-2xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
        <Tag className="w-5 h-5 text-indigo-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm">Google Tag Manager</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {isLoading ? "Loading..." : usingFallback ? "Using hardcoded fallback (not yet saved to SiteConfig)." : "Configured in SiteConfig."}
        </p>
      </div>
      <code className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-mono tracking-wider">{activeId}</code>
    </div>
  );
}

export default function SeoSettings() {
  const [open, setOpen] = useState("blog");

  const sections = [
    { key: "blog", label: "Blog Posts", entity: "BlogPost", fields: ["metaTitle", "metaDescription", "slug", "ogImage", "noindex"], titleKey: "title" },
    { key: "services", label: "Services", entity: "Service", fields: ["metaTitle", "metaDescription", "slug"], titleKey: "title" },
    { key: "case-studies", label: "Case Studies", entity: "CaseStudy", fields: ["metaTitle", "metaDescription", "slug"], titleKey: "clientName" },
    { key: "industries", label: "Industries", entity: "Industry", fields: ["description"], titleKey: "name" },
  ];

  return (
    <div>
      <AdminPageHeader title="SEO Settings" subtitle="Edit meta tags, slugs, and indexing for your content." />
      <GtmStatusCard />
      <div className="space-y-3">
        {sections.map((sec) => (
          <SeoSection key={sec.key} section={sec} open={open === sec.key} onToggle={() => setOpen(open === sec.key ? null : sec.key)} />
        ))}
      </div>
    </div>
  );
}

function SeoSection({ section, open, onToggle }) {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-seo", section.key],
    queryFn: () => base44.entities[section.entity].list(),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities[section.entity].update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-seo", section.key] }),
  });

  return (
    <div className="glass-cell rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
        <span className="font-bold text-slate-900 text-sm">{section.label} <span className="text-slate-400 font-normal">({rows.length})</span></span>
        {open ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {open && (
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {isLoading ? (
            <p className="px-5 py-6 text-sm text-slate-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</p>
          ) : rows.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">No records.</p>
          ) : (
            rows.map((row) => <SeoRow key={row.id} row={row} section={section} onSave={(data) => saveMutation.mutate({ id: row.id, data })} saving={saveMutation.isPending} />)
          )}
        </div>
      )}
    </div>
  );
}

function SeoRow({ row, section, onSave, saving }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = () => {
    const initial = {};
    section.fields.forEach((f) => (initial[f] = row[f]));
    setForm(initial);
    setEditing(true);
  };

  const fieldLabels = { metaTitle: "Meta Title", metaDescription: "Meta Description", slug: "Slug", ogImage: "OG Image URL", noindex: "Noindex", description: "Meta Description" };

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-slate-900 text-sm">{row[section.titleKey]}</p>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="px-3 py-1 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-100">Cancel</button>
            <button onClick={() => { onSave(form); setEditing(false); }} disabled={saving} className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-accent text-white text-xs font-semibold hover:bg-indigo-500"><Save className="w-3 h-3" /> Save</button>
          </div>
        ) : (
          <button onClick={startEdit} className="px-3 py-1 rounded-md text-xs font-semibold text-indigo-accent hover:bg-indigo-50">Edit</button>
        )}
      </div>
      {editing ? (
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {section.fields.map((f) => f === "noindex" ? (
            <div key={f}><Toggle checked={form[f]} onChange={set(f)} label="Noindex" /></div>
          ) : f === "metaDescription" || f === "description" ? (
            <Field key={f} label={fieldLabels[f]} className="sm:col-span-2"><TextArea value={form[f] || ""} onChange={set(f)} rows={2} /></Field>
          ) : (
            <Field key={f} label={fieldLabels[f]}><TextInput value={form[f] || ""} onChange={set(f)} /></Field>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
          {section.fields.map((f) => (
            <div key={f} className="flex gap-2">
              <span className="text-slate-400 font-semibold w-24 shrink-0">{fieldLabels[f]}:</span>
              <span className="text-slate-600 truncate">{f === "noindex" ? (row[f] ? "Yes" : "No") : (row[f] || "—")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}