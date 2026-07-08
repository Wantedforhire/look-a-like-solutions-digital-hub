import { useState, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { StatusBadge, PriorityBadge } from "@/components/admin/Badges";
import { Select, TextArea } from "@/components/admin/FormFields";
import { exportToCsv, formatDate } from "@/lib/adminUtils";
import { Download, ChevronDown, ChevronUp, Save, Inbox, TrendingUp } from "lucide-react";

const statusOptions = ["New", "Contacted", "Qualified", "Proposal Sent", "Converted", "Not Interested"];
const priorityOptions = ["High", "Medium", "Low"];

export default function LeadManagement() {
  const qc = useQueryClient();
  const [tab, setTab] = useState("contact");
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [checked, setChecked] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-leads", "all"],
    queryFn: () => base44.entities.ContactSubmission.list("-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => base44.entities.ContactSubmission.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leads"] }),
  });
  const bulkUpdate = useMutation({
    mutationFn: (data) => base44.entities.ContactSubmission.bulkUpdate(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-leads"] }); setChecked([]); setBulkStatus(""); },
  });

  const filtered = rows
    .filter((r) => (tab === "growth" ? r.serviceInterest === "Growth Audit" : r.serviceInterest !== "Growth Audit"))
    .filter((r) => (!search || [r.name, r.email, r.company].some((v) => String(v || "").toLowerCase().includes(search.toLowerCase()))))
    .filter((r) => (!statusFilter || r.status === statusFilter));

  const toggleCheck = (id) => setChecked((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);
  const allChecked = filtered.length > 0 && checked.length === filtered.length;

  const exportCols = [
    { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" },
    { key: "company", label: "Company" }, { key: "website", label: "Website" }, { key: "serviceInterest", label: "Service Interest" },
    { key: "monthlyBudget", label: "Budget" }, { key: "message", label: "Message" }, { key: "status", label: "Status" },
    { key: "priority", label: "Priority" }, { key: "created_date", label: "Date" },
  ];

  return (
    <div>
      <AdminPageHeader title="Leads" subtitle="Manage contact enquiries and growth audit submissions."
        actions={<button onClick={() => exportToCsv(`${tab}-leads.csv`, filtered, exportCols)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"><Download className="w-4 h-4" /> Export CSV</button>} />

      <div className="flex gap-2 mb-4">
        <button onClick={() => { setTab("contact"); setChecked([]); }} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "contact" ? "bg-indigo-accent text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          <Inbox className="w-4 h-4" /> Contact Enquiries ({rows.filter(r => r.serviceInterest !== "Growth Audit").length})
        </button>
        <button onClick={() => { setTab("growth"); setChecked([]); }} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "growth" ? "bg-indigo-accent text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          <TrendingUp className="w-4 h-4" /> Growth Audits ({rows.filter(r => r.serviceInterest === "Growth Audit").length})
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, company..." className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm flex-1 min-w-[200px] focus:border-indigo-accent focus:ring-2 focus:ring-indigo-accent/20 outline-none" />
        <Select value={statusFilter} onChange={setStatusFilter} options={statusOptions} placeholder="All Statuses" />
      </div>

      {checked.length > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 glass-cell rounded-xl">
          <span className="text-sm font-semibold text-slate-700">{checked.length} selected</span>
          <Select value={bulkStatus} onChange={setBulkStatus} options={statusOptions} placeholder="Set status to..." />
          <button onClick={() => bulkStatus && bulkUpdate.mutate(checked.map((id) => ({ id, status: bulkStatus })))} disabled={!bulkStatus} className="px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50">Apply</button>
          <button onClick={() => setChecked([])} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">Clear</button>
        </div>
      )}

      {isLoading ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : (
        <div className="glass-cell rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-3 w-8"><input type="checkbox" checked={allChecked} onChange={() => setChecked(allChecked ? [] : filtered.map((r) => r.id))} className="rounded" /></th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400">No leads in this category.</td></tr>
                ) : filtered.map((r) => (
                  <Fragment key={r.id}>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3"><input type="checkbox" checked={checked.includes(r.id)} onChange={() => toggleCheck(r.id)} className="rounded" /></td>
                      <td className="px-4 py-3"><button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="font-semibold text-slate-900 hover:text-indigo-accent text-left">{r.name}<span className="block text-xs text-slate-400 font-normal">{r.email}</span></button></td>
                      <td className="px-4 py-3 text-slate-600">{r.company || "—"}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{r.monthlyBudget || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{formatDate(r.created_date)}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                      <td className="px-4 py-3"><button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="text-slate-400 hover:text-indigo-accent">{expanded === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button></td>
                    </tr>
                    {expanded === r.id && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={8} className="px-8 py-5">
                          <LeadDetail row={r} onUpdate={(data) => updateMutation.mutate({ id: r.id, ...data })} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadDetail({ row, onUpdate }) {
  const [status, setStatus] = useState(row.status || "New");
  const [priority, setPriority] = useState(row.priority || "");
  const [notes, setNotes] = useState(row.adminNotes || "");
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3 text-sm">
        <div><p className="text-xs font-semibold text-slate-500">Phone</p><p className="text-slate-700">{row.phone || "—"}</p></div>
        <div><p className="text-xs font-semibold text-slate-500">Website</p><p className="text-slate-700 break-all">{row.website || "—"}</p></div>
        <div><p className="text-xs font-semibold text-slate-500">Service Interest</p><p className="text-slate-700">{row.serviceInterest || "—"}</p></div>
        <div><p className="text-xs font-semibold text-slate-500">Message</p><p className="text-slate-700 italic leading-relaxed bg-white rounded-lg p-3 border border-slate-100">"{row.message || "—"}"</p></div>
      </div>
      <div className="space-y-3">
        <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Status</label><Select value={status} onChange={setStatus} options={statusOptions} /></div>
        <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Priority</label><Select value={priority} onChange={setPriority} options={priorityOptions} placeholder="None" /></div>
        <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Admin Notes</label><TextArea value={notes} onChange={setNotes} rows={3} placeholder="Internal notes..." /></div>
        <button onClick={() => onSave()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Save className="w-4 h-4" /> Update Lead</button>
      </div>
    </div>
  );
  function onSave() { onUpdate({ status, priority, adminNotes: notes }); }
}