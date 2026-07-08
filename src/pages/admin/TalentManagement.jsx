import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { ActionButton } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/Badges";
import { Field, TextArea, Select } from "@/components/admin/FormFields";
import { exportToCsv, formatDate } from "@/lib/adminUtils";
import { Download, X, Mail, Phone, MapPin, Briefcase, Clock, Save } from "lucide-react";

const statusOptions = ["New", "Shortlisted", "Interview Scheduled", "Hired For Project", "Rejected", "Future Consideration"];
const skillAreas = ["Google Ads", "Meta Ads", "SEO", "Content Writing", "Graphic Design", "Video Editing", "Website Development", "Landing Page Design", "Social Media Management", "Analytics and Tracking", "Client Coordination", "Student Internship", "Other"];

export default function TalentManagement() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-talent", "all"],
    queryFn: () => base44.entities.TalentApplication.list("-created_date"),
  });
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  const updateStatus = useMutation({
    mutationFn: ({ id, status, adminNotes }) => base44.entities.TalentApplication.update(id, { status, ...(adminNotes !== undefined ? { adminNotes } : {}) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-talent"] }),
  });

  const filtered = rows.filter((r) => (!statusFilter || r.status === statusFilter) && (!skillFilter || r.skillArea === skillFilter));

  const columns = [
    { key: "name", label: "Name", render: (r) => <button onClick={() => setSelected(r)} className="font-semibold text-slate-900 hover:text-indigo-accent text-left">{r.name}</button> },
    { key: "skillArea", label: "Skill Area", render: (r) => <span className="text-slate-700">{r.skillArea}</span> },
    { key: "experienceLevel", label: "Experience" },
    { key: "city", label: "City" },
    { key: "created_date", label: "Date", render: (r) => <span className="text-xs text-slate-400">{formatDate(r.created_date)}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  const exportCols = [
    { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" },
    { key: "city", label: "City" }, { key: "skillArea", label: "Skill Area" }, { key: "experienceLevel", label: "Experience" },
    { key: "portfolioUrl", label: "Portfolio" }, { key: "availability", label: "Availability" }, { key: "expectedPay", label: "Expected Pay" },
    { key: "whyNote", label: "Why Note" }, { key: "status", label: "Status" }, { key: "created_date", label: "Date Applied" },
  ];

  return (
    <div>
      <AdminPageHeader title="Talent Applications" subtitle="Review and manage applications from your Work With Us page."
        actions={<button onClick={() => exportToCsv("talent-applications.csv", filtered, exportCols)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"><Download className="w-4 h-4" /> Export CSV</button>} />

      <div className="flex gap-3 mb-4">
        <Select value={statusFilter} onChange={setStatusFilter} options={statusOptions} placeholder="All Statuses" />
        <Select value={skillFilter} onChange={setSkillFilter} options={skillAreas} placeholder="All Skill Areas" />
      </div>

      {isLoading ? <p className="text-slate-400 text-sm">Loading...</p> : <AdminTable columns={columns} rows={filtered} searchKeys={["name", "skillArea", "email"]} searchPlaceholder="Search by name, skill, email..." />}

      {selected && <TalentDetail item={selected} onClose={() => setSelected(null)} onUpdate={(status, notes) => { updateStatus.mutate({ id: selected.id, status, adminNotes: notes }); setSelected(null); }} />}
    </div>
  );
}

function TalentDetail({ item, onClose, onUpdate }) {
  const [status, setStatus] = useState(item.status || "New");
  const [notes, setNotes] = useState(item.adminNotes || "");
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h3 className="font-bold text-slate-900">Application Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-accent font-bold">{item.name?.charAt(0)}</div>
            <div>
              <p className="font-bold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-400">{item.skillArea} · {item.experienceLevel}</p>
            </div>
          </div>
          <Detail icon={Mail} label="Email" value={item.email} />
          <Detail icon={Phone} label="Phone" value={item.phone} />
          <Detail icon={MapPin} label="City" value={item.city} />
          <Detail icon={Briefcase} label="Portfolio / LinkedIn" value={item.portfolioUrl} />
          <Detail icon={Clock} label="Availability" value={item.availability} />
          <div><p className="text-xs font-semibold text-slate-500 mb-1">Expected Pay</p><p className="text-slate-700">{item.expectedPay || "—"}</p></div>
          <div><p className="text-xs font-semibold text-slate-500 mb-1">Why they want to work with us</p><p className="text-slate-700 italic leading-relaxed">"{item.whyNote || "—"}"</p></div>
          <div><p className="text-xs font-semibold text-slate-500 mb-1">Applied</p><p className="text-slate-400 text-xs">{formatDate(item.created_date, "MMM d, yyyy 'at' h:mm a")}</p></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 space-y-3 sticky bottom-0 bg-white">
          <Field label="Update Status"><Select value={status} onChange={setStatus} options={statusOptions} /></Field>
          <Field label="Admin Notes"><TextArea value={notes} onChange={setNotes} rows={2} placeholder="Internal notes..." /></Field>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Close</button>
            <button onClick={() => onUpdate(status, notes)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500"><Save className="w-4 h-4" /> Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="text-slate-700 break-all">{value || "—"}</p></div>
    </div>
  );
}