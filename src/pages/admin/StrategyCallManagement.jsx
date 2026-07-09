import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { ActionButton } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/Badges";
import { formatDate, exportToCsv } from "@/lib/adminUtils";
import { Download, X } from "lucide-react";

export default function StrategyCallManagement() {
  const qc = useQueryClient();
  const [viewing, setViewing] = useState(null);
  const { data: calls = [] } = useQuery({
    queryKey: ["admin-strategy-calls"],
    queryFn: () => base44.entities.StrategyCallRequest.list("-created_date"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.StrategyCallRequest.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-strategy-calls"] }),
  });

  const columns = [
    { key: "name", label: "Name", render: (r) => <button onClick={() => setViewing(r)} className="font-semibold text-slate-900 hover:text-indigo-accent text-left">{r.name}</button> },
    { key: "email", label: "Email" },
    { key: "primaryGoal", label: "Goal" },
    { key: "monthlyAdSpend", label: "Ad Spend" },
    { key: "status", label: "Status", render: (r) => (
      <select value={r.status} onChange={(e) => updateStatus.mutate({ id: r.id, status: e.target.value })} className="text-xs border border-slate-200 rounded-md px-2 py-1">
        {["new", "scheduled", "completed", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    ) },
    { key: "created_date", label: "Requested", render: (r) => <span className="text-xs text-slate-400">{formatDate(r.created_date)}</span> },
  ];

  return (
    <div>
      <AdminPageHeader title="Strategy Calls" subtitle="Strategy call booking requests." actions={
        <button onClick={() => exportToCsv("strategy-calls.csv", calls, [{ key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "company", label: "Company" }, { key: "monthlyAdSpend", label: "Ad Spend" }, { key: "primaryGoal", label: "Goal" }, { key: "preferredCallTime", label: "Preferred Time" }, { key: "message", label: "Message" }, { key: "status", label: "Status" }])} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"><Download className="w-4 h-4" /> Export CSV</button>
      } />
      <AdminTable columns={columns} rows={calls} searchKeys={["name", "email", "company", "primaryGoal"]} searchPlaceholder="Search requests..." />

      {viewing && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">{viewing.name}</h3>
              <button onClick={() => setViewing(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-slate-400">Email</p><p className="text-slate-700">{viewing.email}</p></div>
                <div><p className="text-xs text-slate-400">Phone</p><p className="text-slate-700">{viewing.phone || "—"}</p></div>
                <div><p className="text-xs text-slate-400">Company</p><p className="text-slate-700">{viewing.company || "—"}</p></div>
                <div><p className="text-xs text-slate-400">Goal</p><p className="text-slate-700">{viewing.primaryGoal}</p></div>
                <div><p className="text-xs text-slate-400">Monthly Ad Spend</p><p className="text-slate-700">{viewing.monthlyAdSpend || "—"}</p></div>
                <div><p className="text-xs text-slate-400">Preferred Time</p><p className="text-slate-700">{viewing.preferredCallTime || "—"}</p></div>
              </div>
              <div><p className="text-xs text-slate-400">Message</p><p className="text-slate-700">{viewing.message || "—"}</p></div>
              <div className="pt-2 border-t border-slate-100"><StatusBadge status={viewing.status} /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}