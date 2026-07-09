import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { exportToCsv, formatDate } from "@/lib/adminUtils";
import { Download, Trash2, Mail } from "lucide-react";

export default function NewsletterManagement() {
  const qc = useQueryClient();
  const { data: subscribers = [] } = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: () => base44.entities.NewsletterSubscriber.list("-subscribedAt"),
  });

  const delMut = useMutation({
    mutationFn: (id) => base44.entities.NewsletterSubscriber.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-newsletter"] }),
  });

  return (
    <div>
      <AdminPageHeader title="Newsletter Subscribers" subtitle={`${subscribers.length} total subscribers`} actions={
        <button onClick={() => exportToCsv("newsletter-subscribers.csv", subscribers, [{ key: "email", label: "Email" }, { key: "subscribedAt", label: "Subscribed At" }])} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"><Download className="w-4 h-4" /> Export CSV</button>
      } />

      <div className="glass-cell rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscribed</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-10 text-center text-slate-400">No subscribers yet.</td></tr>
              ) : (
                subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 text-slate-700 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {s.email}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{formatDate(s.subscribedAt, "MMM d, yyyy h:mm a")}</td>
                    <td className="px-4 py-3"><button onClick={() => { if (confirm("Remove this subscriber?")) delMut.mutate(s.id); }} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-md"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}