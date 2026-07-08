import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { ActionButton } from "@/components/admin/AdminTable";
import { Field, TextInput, TextArea, Select } from "@/components/admin/FormFields";
import { getIcon } from "@/lib/iconMap";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { slugify } from "@/lib/adminUtils";

const iconOptions = ["Building2", "Stethoscope", "GraduationCap", "Home", "ShoppingCart", "Hotel", "Factory", "Landmark", "Store", "Briefcase"];

export default function IndustryManagement() {
  const qc = useQueryClient();
  const { data: industries = [], isLoading } = useQuery({
    queryKey: ["admin-industries", "all"],
    queryFn: () => base44.entities.Industry.list(),
  });
  const { data: services = [] } = useQuery({
    queryKey: ["admin-services", "all"],
    queryFn: () => base44.entities.Service.list(),
  });

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) return base44.entities.Industry.update(data.id, data);
      return base44.entities.Industry.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-industries"] });
      setShowForm(false);
    },
  });

  const delMutation = useMutation({
    mutationFn: (id) => base44.entities.Industry.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-industries"] }),
  });

  const openNew = () => { setEditing({ name: "", icon: "Building2", description: "", relevantServices: [] }); setShowForm(true); };
  const openEdit = (row) => { setEditing({ ...row }); setShowForm(true); };

  const columns = [
    { key: "name", label: "Name", render: (r) => <span className="font-semibold text-slate-900">{r.name}</span> },
    { key: "icon", label: "Icon", render: (r) => { const Icon = getIcon(r.icon); return <Icon className="w-5 h-5 text-indigo-accent" />; } },
    { key: "description", label: "Description", render: (r) => <span className="text-slate-500 line-clamp-1 max-w-md block">{r.description}</span> },
    { key: "relevantServices", label: "Services", render: (r) => <span className="text-xs text-slate-400">{r.relevantServices?.length || 0} linked</span> },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1 justify-end">
        <ActionButton onClick={() => openEdit(r)}><Pencil className="w-3.5 h-3.5" /></ActionButton>
        <ActionButton variant="danger" onClick={() => confirm(`Delete "${r.name}"?`) && delMutation.mutate(r.id)}><Trash2 className="w-3.5 h-3.5" /></ActionButton>
      </div>
    )},
  ];

  return (
    <div>
      <AdminPageHeader
        title="Industries"
        subtitle="Manage the industry sectors shown on your website."
        actions={<button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"><Plus className="w-4 h-4" /> New Industry</button>}
      />
      {isLoading ? <p className="text-slate-400 text-sm">Loading...</p> : (
        <AdminTable columns={columns} rows={industries} searchKeys={["name", "description"]} searchPlaceholder="Search industries..." />
      )}

      {showForm && (
        <IndustryForm
          item={editing}
          services={services}
          onSave={(data) => saveMutation.mutate(data)}
          onClose={() => setShowForm(false)}
          saving={saveMutation.isPending}
        />
      )}
    </div>
  );
}

function IndustryForm({ item, services, onSave, onClose, saving }) {
  const [form, setForm] = useState(item);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleService = (slug) => {
    const cur = form.relevantServices || [];
    set("relevantServices")(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h3 className="font-bold text-slate-900">{item.id ? "Edit Industry" : "New Industry"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Name *"><TextInput value={form.name} onChange={(v) => { set("name")(v); if (!item.id) set("icon")(form.icon); }} placeholder="e.g. Healthcare" /></Field>
          <Field label="Icon"><Select value={form.icon} onChange={set("icon")} options={iconOptions} /></Field>
          <Field label="Description"><TextArea value={form.description} onChange={set("description")} rows={3} /></Field>
          <Field label="Relevant Services">
            <div className="flex flex-wrap gap-2">
              {services.map((s) => {
                const active = form.relevantServices?.includes(s.slug);
                return (
                  <button key={s.id} type="button" onClick={() => toggleService(s.slug)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${active ? "bg-indigo-accent text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {s.title}
                  </button>
                );
              })}
              {services.length === 0 && <p className="text-xs text-slate-400">No services created yet.</p>}
            </div>
          </Field>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
        </div>
      </div>
    </div>
  );
}