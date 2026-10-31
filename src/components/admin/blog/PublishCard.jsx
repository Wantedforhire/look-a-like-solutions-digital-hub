import { Field, TextInput, Select } from "@/components/admin/FormFields";
import { formatIst } from "@/lib/ist";
import { CalendarClock, ShieldCheck } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function PublishCard({ form, set, isApprover, onApprove }) {
  return (
    <div className="glass-cell rounded-2xl p-5 space-y-4">
      <p className="text-sm font-bold text-slate-900">Publishing</p>

      <Field label="Status">
        <Select value={form.status} onChange={set("status")} options={STATUS_OPTIONS} />
      </Field>

      {form.status === "scheduled" && (
        <Field label="Schedule (India Standard Time)" hint="Publishes automatically at this IST time.">
          <TextInput type="datetime-local" value={form.scheduledIst || ""} onChange={set("scheduledIst")} />
        </Field>
      )}

      <Field label="Publish Date">
        <TextInput type="date" value={form.publishDate || ""} onChange={set("publishDate")} />
      </Field>

      {form.publishedAt && (
        <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <CalendarClock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-slate-500">
            First published {formatIst(form.publishedAt)}. Edits keep this original date.
          </p>
        </div>
      )}

      {form.status === "scheduled" && form.scheduledIst && (
        <p className="text-[11px] text-indigo-accent font-semibold">
          Goes live {formatIst(new Date(`${form.scheduledIst}:00+05:30`).toISOString())}
        </p>
      )}

      {form.aiAssisted && (
        <div className={`rounded-lg px-3 py-2 text-[11px] ${form.aiApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          {form.aiApproved ? (
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> AI-assisted content approved</span>
          ) : isApprover ? (
            <div className="space-y-2">
              <p>This post contains AI-generated content. Administrator approval is required before publishing.</p>
              <button
                type="button"
                onClick={onApprove}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-600 text-white font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Approve AI content
              </button>
            </div>
          ) : (
            <p>AI-generated content needs administrator approval before it can be published.</p>
          )}
        </div>
      )}
    </div>
  );
}