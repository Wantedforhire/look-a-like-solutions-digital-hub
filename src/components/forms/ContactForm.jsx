import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const services = [
  "SEO Services", "Performance Marketing / PPC", "Social Media Marketing", "Branding / Creative",
  "Web Design & Development", "Content Marketing", "Online Reputation Management",
  "Lead Generation", "AI SEO / GEO", "Not Sure Yet"
];

const budgets = ["Under ₹25,000/mo", "₹25,000 - ₹50,000/mo", "₹50,000 - ₹1,00,000/mo", "₹1,00,000+/mo"];

export default function ContactForm({ defaultService = "" }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", website: "",
    serviceInterest: defaultService, monthlyBudget: "", message: "", honeypot: ""
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.message.trim()) e.message = "Please tell us a bit about your project";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (form.honeypot) return; // spam bot caught
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("loading");
    try {
      const { honeypot, ...payload } = form;
      await base44.entities.ContactSubmission.create(payload);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="glass-cell rounded-2xl p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You — We've Got It!</h3>
        <p className="text-slate-500">Our strategy team will reach out within one business day with your personalized roadmap.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-cell rounded-2xl p-7 md:p-9 space-y-5" noValidate>
      <input
        type="text"
        name="honeypot"
        value={form.honeypot}
        onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-slate-sub mb-2">Full Name *</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Your name" />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm text-slate-sub mb-2">Email *</label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="you@company.com" />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-slate-sub mb-2">Phone</label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="+91-" />
        </div>
        <div>
          <label className="block text-sm text-slate-sub mb-2">Company</label>
          <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Company name" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-sub mb-2">Website</label>
        <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="https://" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-slate-sub mb-2">Service Interest</label>
          <Select value={form.serviceInterest} onValueChange={(v) => setForm({ ...form, serviceInterest: v })}>
            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900"><SelectValue placeholder="Select a service" /></SelectTrigger>
            <SelectContent>
              {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm text-slate-sub mb-2">Monthly Budget</label>
          <Select value={form.monthlyBudget} onValueChange={(v) => setForm({ ...form, monthlyBudget: v })}>
            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900"><SelectValue placeholder="Select a range" /></SelectTrigger>
            <SelectContent>
              {budgets.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-sub mb-2">Tell Us About Your Project *</label>
        <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Goals, timeline, current challenges..." />
        {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again or email us directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-indigo-accent text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === "loading" ? "Sending..." : "Request Proposal"}
      </button>
    </form>
  );
}