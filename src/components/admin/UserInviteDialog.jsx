import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Field, TextInput, Select, TextArea } from "@/components/admin/FormFields";
import { APP_ROLES, ROLE_LABELS } from "@/lib/adminConfig";
import { useToast } from "@/components/ui/use-toast";
import { X, Send, Loader2 } from "lucide-react";

export default function UserInviteDialog({ onClose }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", name: "", role: "staff", message: "" });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const inviteMut = useMutation({
    mutationFn: (data) => base44.functions.invoke("userManagement", { action: "invite", ...data }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      const d = res.data;
      if (d.platformInvited) {
        toast({ title: `Invitation sent to ${form.email}`, description: `Role: ${ROLE_LABELS[form.role]}` });
      } else {
        toast({
          title: `User record created for ${form.email}`,
          description: "The platform invitation email could not be sent automatically. The user can register at /register, or use Resend Invitation later.",
        });
      }
      onClose();
    },
    onError: (e) => toast({ title: e.response?.data?.error || "Failed to invite user", variant: "destructive" }),
  });

  const roleOptions = APP_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }));

  const submit = () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: "A valid email address is required", variant: "destructive" });
      return;
    }
    inviteMut.mutate(form);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Invite New User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Full Name"><TextInput value={form.name} onChange={set("name")} placeholder="John Doe" /></Field>
          <Field label="Email Address *"><TextInput value={form.email} onChange={set("email")} placeholder="user@email.com" type="email" /></Field>
          <Field label="Role" hint="Determines which admin modules the user can access.">
            <Select value={form.role} onChange={set("role")} options={roleOptions} />
          </Field>
          <Field label="Invitation Message (Optional)" hint="Stored in the audit log. The platform sends its own invitation email.">
            <TextArea value={form.message} onChange={set("message")} rows={2} placeholder="Welcome to the team..." />
          </Field>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={submit} disabled={inviteMut.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60">
            {inviteMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}