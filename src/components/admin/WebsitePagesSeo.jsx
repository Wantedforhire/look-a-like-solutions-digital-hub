import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { STATIC_PAGES } from "@/lib/staticPages";
import { Field, TextInput, TextArea } from "@/components/admin/FormFields";
import { ChevronDown, ChevronRight, Save, Loader2, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TITLE_MIN = 50;
const TITLE_MAX = 60;
const DESC_MIN = 150;
const DESC_MAX = 160;

function Counter({ value, min, max }) {
  const len = (value || "").length;
  const ok = len >= min && len <= max;
  const color = len === 0 ? "text-slate-400" : ok ? "text-emerald-accent" : "text-amber-600";
  return <span className={`text-xs font-mono ${color}`}>{len} / {min}–{max}</span>;
}

export default function WebsitePagesSeo({ open, onToggle }) {
  const [filter, setFilter] = useState("all");
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: metas = [], isLoading } = useQuery({
    queryKey: ["page-meta-all"],
    queryFn: () => base44.entities.PageMeta.list(),
    staleTime: 60000,
  });

  const metaByPath = {};
  metas.forEach((m) => {
    if (m.path) metaByPath[m.path] = m;
  });

  const upsert = useMutation({
    mutationFn: async ({ path, pageName, data, existing }) => {
      if (existing) return base44.entities.PageMeta.update(existing.id, data);
      return base44.entities.PageMeta.create({ path, pageName, ...data });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["page-meta-all"] });
      qc.invalidateQueries({ queryKey: ["page-meta"] });
      toast({ title: "Page metadata saved", description: "Public page title and description updated." });
    },
    onError: () => toast({ title: "Failed to save metadata", variant: "destructive" }),
  });

  const pages = STATIC_PAGES.map((p) => {
    const meta = metaByPath[p.path];
    const hasTitle = !!(meta?.metaTitle && meta.metaTitle.trim());
    const hasDesc = !!(meta?.metaDescription && meta.metaDescription.trim());
    const status = hasTitle && hasDesc ? "complete" : hasTitle || hasDesc ? "partial" : "missing";
    return { ...p, meta, hasTitle, hasDesc, status };
  });

  const counts = {
    all: pages.length,
    missing: pages.filter((p) => p.status !== "complete").length,
    complete: pages.filter((p) => p.status === "complete").length,
  };

  const filtered = pages.filter((p) => {
    if (filter === "missing") return p.status !== "complete";
    if (filter === "complete") return p.status === "complete";
    return true;
  });

  const tabs = [
    { key: "all", label: `All Pages (${counts.all})` },
    { key: "missing", label: `Missing Metadata (${counts.missing})` },
    { key: "complete", label: `SEO Complete (${counts.complete})` },
  ];

  return (
    <div className="glass-cell rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
        <span className="font-bold text-slate-900 text-sm">
          Website Pages <span className="text-slate-400 font-normal">({pages.length})</span>
        </span>
        {open ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {open && (
        <div className="border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  filter === t.key ? "bg-indigo-accent text-white" : "text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <p className="px-5 py-6 text-sm text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading pages...
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-5 py-6 text-sm text-slate-400">No pages match this filter.</p>
            ) : (
              filtered.map((p) => (
                <PageRow
                  key={p.path}
                  page={p}
                  saving={upsert.isPending}
                  onSave={(data) => upsert.mutate({ path: p.path, pageName: p.name, data, existing: p.meta })}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PageRow({ page, onSave, saving }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ metaTitle: "", metaDescription: "" });

  const startEdit = () => {
    setForm({
      metaTitle: page.meta?.metaTitle || "",
      metaDescription: page.meta?.metaDescription || "",
    });
    setEditing(true);
  };

  const save = () => {
    onSave({
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
    });
    setEditing(false);
  };

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 text-sm">{page.name}</p>
          <a
            href={page.path}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-accent mt-0.5"
          >
            {page.path} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {page.status === "complete" ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-accent">
              <CheckCircle2 className="w-3.5 h-3.5" /> SEO Complete
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" /> Missing SEO Metadata
            </span>
          )}
          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-accent text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50"
              >
                <Save className="w-3 h-3" /> Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={startEdit}
              className="px-3 py-1 rounded-md text-xs font-semibold text-indigo-accent hover:bg-indigo-50"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div className="grid gap-3 mt-3">
          <Field label="Meta Title">
            <TextInput
              value={form.metaTitle}
              onChange={(v) => setForm((f) => ({ ...f, metaTitle: v }))}
              placeholder="Recommended 50–60 characters"
            />
            <div className="flex justify-end mt-1">
              <Counter value={form.metaTitle} min={TITLE_MIN} max={TITLE_MAX} />
            </div>
          </Field>
          <Field label="Meta Description">
            <TextArea
              value={form.metaDescription}
              onChange={(v) => setForm((f) => ({ ...f, metaDescription: v }))}
              rows={3}
              placeholder="Recommended 150–160 characters"
            />
            <div className="flex justify-end mt-1">
              <Counter value={form.metaDescription} min={DESC_MIN} max={DESC_MAX} />
            </div>
          </Field>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold w-24 shrink-0">Meta Title:</span>
            <span className="text-slate-600 truncate">{page.meta?.metaTitle || "—"}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold w-24 shrink-0">Meta Desc:</span>
            <span className="text-slate-600 truncate">{page.meta?.metaDescription || "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
}