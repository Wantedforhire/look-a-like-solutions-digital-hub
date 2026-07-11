import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { sendFormNotificationEmail } from "@/lib/notifyEmail";
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
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    if (form.phone && !/^[+\d\s()-]{6,}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (form.website && !/^https?:\/\/.+\..+/.test(form.website)) e.website = "Enter a valid URL (https://)";
    if (!form.message.trim()) e.message = "Please tell us a bit about your project";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (form.honeypot) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("loading");
    try {
      const { honeypot, ...payload } = form;
      await base44.entities.ContactSubmission.create(payload);
      sendFormNotificationEmail(
        `New Contact Form Submission from ${payload.name}`,
        `<h3>New Contact Submission</h3>
         <p><b>Name:</b> ${payload.name}</p>
         <p><b>Email:</b> ${payload.email}</p>
         <p><b>Phone:</b> ${payload.phone || "—"}</p>
         <p><b>Company:</b> ${payload.company || "—"}</p>
         <p><b>Website:</b> ${payload.website || "—"}</p>
         <p><b>Service Interest:</b> ${payload.serviceInterest || "—"}</p>
         <p><b>Monthly Budget:</b> ${payload.monthlyBudget || "—"}</p>
         <p><b>Message:</b> ${payload.message}</p>`
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
        <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You — We've Got It!</h3>
        <p className="text-slate-500">Our strategy team will reach out within one business day with your personalized roadmap.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-cell rounded-2xl p-7 md:p-9 space-y-5" noValidate>
      <input
        type="text"
        name="company_website"
        value={form.honeypot}
        onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className="block text-sm text-slate-sub mb-2">Full Name *</label>
          <Input id="cf-name" name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Your name" required />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-sm text-slate-sub mb-2">Email *</label>
          <Input id="cf-email" name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="you@company.com" required />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-phone" className="block text-sm text-slate-sub mb-2">Phone</label>
          <Input id="cf-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="+91-" />
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="cf-company" className="block text-sm text-slate-sub mb-2">Company</label>
          <Input id="cf-company" name="company" autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Company name" />
        </div>
      </div>

      <div>
        <label htmlFor="cf-website" className="block text-sm text-slate-sub mb-2">Website</label>
        <Input id="cf-website" name="website" type="url" autoComplete="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="https://" />
        {errors.website && <p className="text-xs text-red-400 mt-1">{errors.website}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-service" className="block text-sm text-slate-sub mb-2">Service Interest</label>
          <Select value={form.serviceInterest} onValueChange={(v) => setForm({ ...form, serviceInterest: v })}>
            <SelectTrigger id="cf-service" className="bg-slate-50 border-slate-200 text-slate-900" aria-required="false"><SelectValue placeholder="Select a service" /></SelectTrigger>
            <SelectContent>
              {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="cf-budget" className="block text-sm text-slate-sub mb-2">Monthly Budget</label>
          <Select value={form.monthlyBudget} onValueChange={(v) => setForm({ ...form, monthlyBudget: v })}>
            <SelectTrigger id="cf-budget" className="bg-slate-50 border-slate-200 text-slate-900" aria-required="false"><SelectValue placeholder="Select a range" /></SelectTrigger>
            <SelectContent>
              {budgets.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm text-slate-sub mb-2">Tell Us About Your Project *</label>
        <Textarea id="cf-message" name="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="bg-slate-50 border-slate-200 text-slate-900" placeholder="Goals, timeline, current challenges..." required />
        {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" aria-hidden="true" /> Something went wrong. Please try again or email us directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-indigo-accent text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {status === "loading" ? "Sending..." : "Request Proposal"}
      </button>
      <p className="text-xs text-slate-400 text-center">We only use your details to respond to your request. No spam.</p>
    </form>
  );
}