import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const budgets = ["Under ₹25K", "₹25K–₹1L", "₹1L–₹5L", "₹5L+"];
const channels = ["Google Ads", "Meta Ads", "SEO", "Social Media", "Email", "None"];

export default function GrowthAuditForm({ showChannels = false, compact = false }) {
  const [form, setForm] = useState({
    name: "", company: "", website: "", email: "", phone: "",
    message: "", monthlyBudget: "", currentChannels: [], honeypot: ""
  });
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    return e;
  };

  const toggleChannel = (ch) => {
    setForm((f) => ({
      ...f,
      currentChannels: f.currentChannels.includes(ch)
        ? f.currentChannels.filter((c) => c !== ch)
        : [...f.currentChannels, ch]
    }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (form.honeypot) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("loading");
    try {
      await base44.entities.ContactSubmission.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        website: form.website,
        serviceInterest: "Growth Audit",
        monthlyBudget: form.monthlyBudget,
        message: form.message + (form.currentChannels.length ? ` | Current channels: ${form.currentChannels.join(", ")}` : "")
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="glass-cell rounded-2xl p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You — Request Received</h3>
        <p className="text-slate-500">We review every request within 1 business day. Ramkumar or a senior strategist will reach out personally.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-cell rounded-2xl p-7 md:p-9 space-y-5" noValidate>
      <input type="text" name="honeypot" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-slate-600 mb-2">Name *</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Your name" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-2">Business Name</label>
          <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Company name" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-slate-600 mb-2">Website URL</label>
          <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="https://yoursite.com" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-2">Email *</label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="you@company.com" />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-slate-600 mb-2">Phone Number</label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="+91-" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-2">Monthly Budget Range</label>
          <Select value={form.monthlyBudget} onValueChange={(v) => setForm({ ...form, monthlyBudget: v })}>
            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900"><SelectValue placeholder="Select a range" /></SelectTrigger>
            <SelectContent>
              {budgets.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-600 mb-2">Marketing Challenge</label>
        <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={compact ? 3 : 4} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="What's not working? What are you trying to fix?" />
      </div>

      {showChannels && (
        <div>
          <label className="block text-sm text-slate-600 mb-3">Current Marketing Channels</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {channels.map((ch) => (
              <label key={ch} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={form.currentChannels.includes(ch)} onCheckedChange={() => toggleChannel(ch)} />
                <span className="text-sm text-slate-600">{ch}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again or email us directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-indigo-accent text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === "loading" ? "Sending..." : "Request My Free Growth Audit"}
      </button>
    </form>
  );
}