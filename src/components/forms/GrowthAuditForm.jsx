import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { sendFormNotificationEmail } from "@/lib/notifyEmail";
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
    if (form.phone && !/^[+\d\s()-]{6,}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (form.website && !/^https?:\/\/.+\..+/.test(form.website)) e.website = "Enter a valid URL (https://)";
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
      sendFormNotificationEmail(
        `New Growth Audit Request from ${form.name}`,
        `<h3>New Growth Audit Request</h3>
         <p><b>Name:</b> ${form.name}</p>
         <p><b>Email:</b> ${form.email}</p>
         <p><b>Phone:</b> ${form.phone || "—"}</p>
         <p><b>Company:</b> ${form.company || "—"}</p>
         <p><b>Website:</b> ${form.website || "—"}</p>
         <p><b>Monthly Budget:</b> ${form.monthlyBudget || "—"}</p>
         <p><b>Current Channels:</b> ${form.currentChannels.join(", ") || "—"}</p>
         <p><b>Challenge:</b> ${form.message || "—"}</p>`
      );
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="glass-cell rounded-2xl p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-accent mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You — Request Received</h3>
        <p className="text-slate-500">We review every request within 1 business day. Ramkumar or a senior strategist will reach out personally.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-cell rounded-2xl p-7 md:p-9 space-y-5" noValidate>
      <input type="text" name="company_website" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="ga-name" className="block text-sm text-slate-600 mb-2">Name *</label>
          <Input id="ga-name" name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Your name" required />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="ga-company" className="block text-sm text-slate-600 mb-2">Business Name</label>
          <Input id="ga-company" name="company" autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Company name" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="ga-website" className="block text-sm text-slate-600 mb-2">Website URL</label>
          <Input id="ga-website" name="website" type="url" autoComplete="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="https://yoursite.com" />
          {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website}</p>}
        </div>
        <div>
          <label htmlFor="ga-email" className="block text-sm text-slate-600 mb-2">Email *</label>
          <Input id="ga-email" name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="you@company.com" required />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="ga-phone" className="block text-sm text-slate-600 mb-2">Phone Number</label>
          <Input id="ga-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="+91-" />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="ga-budget" className="block text-sm text-slate-600 mb-2">Monthly Budget Range</label>
          <Select value={form.monthlyBudget} onValueChange={(v) => setForm({ ...form, monthlyBudget: v })}>
            <SelectTrigger id="ga-budget" className="bg-slate-50 border-slate-200 text-slate-900" aria-required="false"><SelectValue placeholder="Select a range" /></SelectTrigger>
            <SelectContent>
              {budgets.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="ga-message" className="block text-sm text-slate-600 mb-2">Marketing Challenge</label>
        <Textarea id="ga-message" name="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={compact ? 3 : 4} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="What's not working? What are you trying to fix?" />
      </div>

      {showChannels && (
        <fieldset>
          <legend className="block text-sm text-slate-600 mb-3">Current Marketing Channels</legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {channels.map((ch) => (
              <label key={ch} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={form.currentChannels.includes(ch)} onCheckedChange={() => toggleChannel(ch)} />
                <span className="text-sm text-slate-600">{ch}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" aria-hidden="true" /> Something went wrong. Please try again or email us directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-indigo-accent text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {status === "loading" ? "Sending..." : "Request My Free Growth Audit"}
      </button>
      <p className="text-xs text-slate-400 text-center">We only use your details to respond to your request. No spam.</p>
    </form>
  );
}