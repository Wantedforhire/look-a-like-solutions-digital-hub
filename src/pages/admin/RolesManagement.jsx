import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useOutletContext } from "react-router-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Select } from "@/components/admin/FormFields";
import { ROLE_LABELS, APP_ROLES } from "@/lib/adminConfig";
import { formatDate } from "@/lib/adminUtils";
import { useToast } from "@/components/ui/use-toast";
import UserInviteDialog from "@/components/admin/UserInviteDialog";
import {
  Plus, Search, Shield, UserCog, Mail, Ban, RotateCcw, Send, X, Loader2,
  Users, UserCheck, Clock, UserX, Save, AlertTriangle
} from "lucide-react";

const ROLE_BADGE = {
  super_admin: "bg-indigo-50 text-indigo-accent",
  admin: "bg-sky-50 text-sky-600",
  manager: "bg-emerald-50 text-emerald-600",
  staff: "bg-slate-100 text-slate-600",
};

const STATUS_BADGE = {
  active: "bg-emerald-50 text-emerald-600",
  invited: "bg-amber-50 text-amber-600",
  revoked: "bg-rose-50 text-rose-600",
  no_role: "bg-slate-100 text-slate-400",
};

const STATUS_LABEL = {
  active: "Active",
  invited: "Pending Invite",
  revoked: "Revoked",
  no_role: "No App Role",
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-cell rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function RolesManagement() {
  const { role: myRole } = useOutletContext() || { role: "staff" };
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [revokeUser, setRevokeUser] = useState(null);

  const canManageRoles = myRole === "super_admin";
  const canManageUsers = myRole === "super_admin" || myRole === "admin";

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await base44.functions.invoke("userManagement", { action: "list" });
      return res.data.users;
    },
  });

  const counts = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      invited: users.filter((u) => u.status === "invited").length,
      revoked: users.filter((u) => u.status === "revoked").length,
    }),
    [users]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (q && !u.email.toLowerCase().includes(q) && !(u.fullName || u.name || "").toLowerCase().includes(q)) return false;
      if (roleFilter !== "all" && u.appRole !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const updateRoleMut = useMutation({
    mutationFn: ({ email, role }) => base44.functions.invoke("userManagement", { action: "updateRole", email, role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast({ title: "Role updated successfully" }); setEditUser(null); },
    onError: (e) => toast({ title: e.response?.data?.error || "Failed to update role", variant: "destructive" }),
  });

  const revokeMut = useMutation({
    mutationFn: ({ email }) => base44.functions.invoke("userManagement", { action: "revoke", email }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast({ title: "Access revoked" }); setRevokeUser(null); },
    onError: (e) => toast({ title: e.response?.data?.error || "Failed to revoke access", variant: "destructive" }),
  });

  const restoreMut = useMutation({
    mutationFn: ({ email }) => base44.functions.invoke("userManagement", { action: "restore", email }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast({ title: "Access restored" }); },
    onError: (e) => toast({ title: e.response?.data?.error || "Failed to restore", variant: "destructive" }),
  });

  const resendMut = useMutation({
    mutationFn: ({ email }) => base44.functions.invoke("userManagement", { action: "resendInvite", email }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: res.data?.platformInvited ? "Invitation resent" : "Resend attempted — platform invite may require admin role" });
    },
    onError: (e) => toast({ title: e.response?.data?.error || "Failed to resend", variant: "destructive" }),
  });

  return (
    <div>
      <AdminPageHeader
        title="Roles & Users"
        subtitle="Manage admin access, roles, and invitations."
        actions={
          canManageUsers && (
            <button onClick={() => setInviteOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500">
              <Plus className="w-4 h-4" /> Invite New User
            </button>
          )
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Total Users" value={counts.total} color="bg-slate-100 text-slate-600" />
        <StatCard icon={UserCheck} label="Active" value={counts.active} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={Clock} label="Pending Invitations" value={counts.invited} color="bg-amber-50 text-amber-600" />
        <StatCard icon={UserX} label="Revoked" value={counts.revoked} color="bg-rose-50 text-rose-600" />
      </div>

      <div className="glass-cell rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-accent focus:ring-2 focus:ring-indigo-accent/20 outline-none"
            />
          </div>
          <Select value={roleFilter} onChange={setRoleFilter} options={[{ value: "all", label: "All Roles" }, ...APP_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))]} className="sm:w-40" />
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: "all", label: "All Status" }, { value: "active", label: "Active" }, { value: "invited", label: "Pending" }, { value: "revoked", label: "Revoked" }, { value: "no_role", label: "No Role" }]} className="sm:w-40" />
        </div>

        {isLoading ? (
          <div className="px-5 py-12 text-center text-slate-400 flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400">No users match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3 hidden md:table-cell">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 hidden lg:table-cell">Invited</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((u) => (
                  <tr key={u.siteUserId || u.userId || u.email} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-accent font-bold text-sm shrink-0">
                          {(u.fullName || u.name || u.email || "A").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{u.fullName || u.name || "—"}</p>
                          <p className="text-xs text-slate-500 truncate">{u.email}</p>
                          <span className="md:hidden inline-block mt-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${ROLE_BADGE[u.appRole] || "bg-slate-100 text-slate-400"}`}>{ROLE_LABELS[u.appRole] || "No Role"}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${ROLE_BADGE[u.appRole] || "bg-slate-100 text-slate-400"}`}>{ROLE_LABELS[u.appRole] || "No Role"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${STATUS_BADGE[u.status]}`}>{STATUS_LABEL[u.status]}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-sm text-slate-500">{u.invitedAt ? formatDate(u.invitedAt) : (u.platformCreatedDate ? formatDate(u.platformCreatedDate) : "—")}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {canManageRoles && u.appRole && u.status !== "no_role" && (
                          <button onClick={() => setEditUser(u)} title="Edit Role" className="p-2 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-accent"><UserCog className="w-4 h-4" /></button>
                        )}
                        {canManageUsers && (u.status === "invited" || u.status === "no_role") && (
                          <button onClick={() => resendMut.mutate({ email: u.email })} disabled={resendMut.isPending} title="Resend Invitation" className="p-2 rounded-lg text-slate-500 hover:bg-sky-50 hover:text-sky-600"><Send className="w-4 h-4" /></button>
                        )}
                        {canManageRoles && u.status === "revoked" && (
                          <button onClick={() => restoreMut.mutate({ email: u.email })} disabled={restoreMut.isPending} title="Restore Access" className="p-2 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"><RotateCcw className="w-4 h-4" /></button>
                        )}
                        {canManageRoles && u.status === "active" && (
                          <button onClick={() => setRevokeUser(u)} title="Revoke Access" className="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-500"><Ban className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!canManageRoles && (
        <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Only Super Admins can change roles or revoke access. You are signed in as {ROLE_LABELS[myRole] || myRole}.
        </p>
      )}

      {inviteOpen && <UserInviteDialog onClose={() => setInviteOpen(false)} />}

      {editUser && (
        <EditRoleDialog user={editUser} onClose={() => setEditUser(null)} onSave={(role) => updateRoleMut.mutate({ email: editUser.email, role })} saving={updateRoleMut.isPending} />
      )}

      {revokeUser && (
        <RevokeConfirmDialog user={revokeUser} onClose={() => setRevokeUser(null)} onConfirm={() => revokeMut.mutate({ email: revokeUser.email })} saving={revokeMut.isPending} />
      )}
    </div>
  );
}

function EditRoleDialog({ user, onClose, onSave, saving }) {
  const [role, setRole] = useState(user.appRole || "staff");
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Edit Role</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{user.fullName || user.name || user.email}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <Select value={role} onChange={setRole} options={APP_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))} />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={() => onSave(role)} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Role
          </button>
        </div>
      </div>
    </div>
  );
}

function RevokeConfirmDialog({ user, onClose, onConfirm, saving }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Revoke Access?</h3>
          <p className="text-sm text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">{user.fullName || user.name || user.email}</span> will lose access to the admin dashboard.
          </p>
          <p className="text-xs text-slate-400 mb-6">This action is recorded in the audit log. You can restore access later.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
            <button onClick={onConfirm} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />} Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}