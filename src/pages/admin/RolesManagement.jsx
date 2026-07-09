import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useOutletContext } from "react-router-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Field, TextInput, Select, Toggle } from "@/components/admin/FormFields";
import { Plus, X, Save, Trash2, Shield, UserCog } from "lucide-react";

export default function RolesManagement() {
  const { role } = useOutletContext() || { role: "editor" };
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const { data: users = [] } = useQuery({
    queryKey: ["admin-site-users"],
    queryFn: () => base44.entities.SiteUser.list(),
  });

  const saveMut = useMutation({
    mutationFn: (data) => editing?.id ? base44.functions.invoke('superAdminGuard', { entity: "SiteUser", operation: "update", id: editing.id, data }) : base44.functions.invoke('superAdminGuard', { entity: "SiteUser", operation: "create", data }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-site-users"] }); setEditing(null); setForm(null); },
  });

  const delMut = useMutation({
    mutationFn: (id) => base44.functions.invoke('superAdminGuard', { entity: "SiteUser", operation: "delete", id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-site-users"] }),
  });

  const openNew = () => { setEditing({}); setForm({ email: "", name: "", role: "editor", active: true }); };
  const openEdit = (u) => { setEditing(u); setForm({ ...u }); };
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  if (role !== "super_admin") {
    return (
      <div>
        <AdminPageHeader title="Roles & Users" />
        <div className="glass-cell rounded-2xl p-10 text-center text-slate-400">Super Admin access required.</div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Roles & Users" subtitle="Manage admin access and roles." actions={
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Plus className="w-4 h-4" /> Add User</button>
      } />

      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="glass-cell rounded-2xl p-12 text-center text-slate-400">
            No site users yet. Super Admins are also defined in <code className="text-indigo-accent">adminConfig.js</code>.
          </div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="glass-cell rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.role === "super_admin" ? "bg-indigo-50" : "bg-emerald-50"}`}>
                  {u.role === "super_admin" ? <Shield className="w-5 h-5 text-indigo-accent" /> : <UserCog className="w-5 h-5 text-emerald-accent" />}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{u.name || u.email}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${u.role === "super_admin" ? "bg-indigo-50 text-indigo-accent" : "bg-emerald-50 text-emerald-600"}`}>
                  {u.role === "super_admin" ? "Super Admin" : "Editor"}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${u.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                  {u.active ? "Active" : "Inactive"}
                </span>
                <button onClick={() => openEdit(u)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-accent hover:bg-indigo-50">Edit</button>
                <button onClick={() => { if (confirm("Remove this user?")) delMut.mutate(u.id); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && form && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => { setEditing(null); setForm(null); }}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">{editing.id ? "Edit User" : "Add User"}</h3>
              <button onClick={() => { setEditing(null); setForm(null); }} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Email *"><TextInput value={form.email} onChange={set("email")} placeholder="user@email.com" /></Field>
              <Field label="Name"><TextInput value={form.name} onChange={set("name")} /></Field>
              <Field label="Role"><Select value={form.role} onChange={set("role")} options={[{ value: "editor", label: "Editor" }, { value: "super_admin", label: "Super Admin" }]} /></Field>
              <Toggle checked={!!form.active} onChange={set("active")} label="Active" />
              <p className="text-xs text-slate-400">
                Note: The user must register at <code className="text-indigo-accent">/login</code> with this email to access the admin panel.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => { setEditing(null); setForm(null); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => { if (!form.email) { alert("Email is required"); return; } saveMut.mutate(form); }} disabled={saveMut.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}