import { useState } from "react";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import { Field, TextInput, TextArea, Select } from "@/components/admin/FormFields";
import { CheckCircle2, Loader2, ShieldCheck, TrendingUp, Users } from "lucide-react";

const spendOptions = ["No active spend", "Under ₹25,000/month", "₹25,000 - ₹50,000/month", "₹50,000 - ₹1,00,000/month", "₹1,00,000+ /month"];
const goalOptions = ["More Leads", "Better ROI", "Brand Awareness", "SEO Rankings", "Other"];

export default function StrategyCall() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", monthlyAdSpend: "", primaryGoal: "", preferredCallTime: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.primaryGoal) {
      setError("Please fill in your name, email, and primary goal.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.StrategyCallRequest.create({ ...form, status: "new" });
      setDone(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <MetaTags
        title="Book a Strategy Call"
        description="Book a free 1-on-1 strategy call with Ramkumar, founder of Look A Like Solutions. Get a personalized growth plan for your business."
        path="/strategy-call"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Strategy Call", path: "/strategy-call" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-4">Strategy Call</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Book a Call With <span className="text-indigo-accent">Ramkumar</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
              30 minutes. No pitch. Just a clear look at what's working, what's broken, and where your biggest growth levers are.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 pt-8">
          <div className="lg:col-span-3">
            {done ? (
              <div className="glass-cell rounded-2xl p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-accent" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Request Received</h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Thanks, {form.name.split(" ")[0]}. Ramkumar will personally review your details and reach out within 24 hours to schedule your call.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="glass-cell rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-5">Tell us about your business</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Name *"><TextInput value={form.name} onChange={set("name")} placeholder="Your name" /></Field>
                  <Field label="Email *"><TextInput type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" /></Field>
                  <Field label="Phone"><TextInput value={form.phone} onChange={set("phone")} placeholder="+91 ..." /></Field>
                  <Field label="Company"><TextInput value={form.company} onChange={set("company")} placeholder="Company name" /></Field>
                  <Field label="Current Monthly Ad Spend"><Select value={form.monthlyAdSpend} onChange={set("monthlyAdSpend")} options={spendOptions} placeholder="Select range" /></Field>
                  <Field label="Primary Goal *"><Select value={form.primaryGoal} onChange={set("primaryGoal")} options={goalOptions} placeholder="Select goal" /></Field>
                </div>
                <Field label="Preferred Call Time" className="mb-4">
                  <TextInput value={form.preferredCallTime} onChange={set("preferredCallTime")} placeholder="e.g. Weekday mornings, after 3 PM" />
                </Field>
                <Field label="What's your biggest challenge right now?" className="mb-5">
                  <TextArea value={form.message} onChange={set("message")} placeholder="Briefly describe what you're trying to achieve..." rows={4} />
                </Field>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-60"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Requesting...</> : "Request My Strategy Call"}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-cell rounded-2xl p-6">
              <img
                src="https://media.base44.com/images/public/6a45332a796cb5a887717912/b5f87c02a_WhatsAppImage2025-10-30at112027_e9d09851.jpg"
                alt="Ramkumar"
                className="w-20 h-20 rounded-full object-cover mb-4"
              />
              <h3 className="font-bold text-slate-900">Ramkumar</h3>
              <p className="text-sm text-slate-500 mb-4">Founder & Lead Strategist, Look A Like Solutions</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                15+ years in performance marketing. I've managed ₹50Cr+ in ad spend across Google, Meta, and beyond —
                and I'll give you straight, actionable advice on your call.
              </p>
            </div>
            <div className="glass-cell rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Real Results</p>
                  <p className="text-xs text-slate-500">100+ businesses scaled across Bengaluru and India.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-indigo-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Personal Attention</p>
                  <p className="text-xs text-slate-500">You talk directly to the strategist, not a sales rep.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">No Obligation</p>
                  <p className="text-xs text-slate-500">Free call. Walk away with a plan whether we work together or not.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}