import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { sendFormNotificationEmail } from "@/lib/notifyEmail";
import { Field, TextInput, TextArea, Select } from "@/components/admin/FormFields";
import { CheckCircle2, Loader2 } from "lucide-react";

const skillAreas = [
  "Google Ads", "Meta Ads", "SEO", "Content Writing", "Graphic Design",
  "Video Editing", "Website Development", "Landing Page Design",
  "Social Media Management", "Analytics and Tracking", "Client Coordination",
  "Student Internship", "Other",
];
const experienceLevels = ["Student", "Fresher", "1 to 2 Years", "3 to 5 Years", "5+ Years"];

export default function TalentApplicationForm({ jobListingId, defaultSkillArea }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "", skillArea: defaultSkillArea || "", experienceLevel: "",
    portfolioUrl: "", availability: "", expectedPay: "", whyNote: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.skillArea || !form.experienceLevel) {
      setError("Please fill in your name, email, skill area, and experience level.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.TalentApplication.create({ ...form, status: "New", jobListingId: jobListingId || undefined });
      sendFormNotificationEmail(
        `New Talent Application — ${form.skillArea}`,
        `<h3>New Talent Application</h3>
         <p><b>Name:</b> ${form.name}</p>
         <p><b>Email:</b> ${form.email}</p>
         <p><b>Phone:</b> ${form.phone || "—"}</p>
         <p><b>City:</b> ${form.city || "—"}</p>
         <p><b>Skill Area:</b> ${form.skillArea}</p>
         <p><b>Experience:</b> ${form.experienceLevel}</p>
         <p><b>Portfolio:</b> ${form.portfolioUrl || "—"}</p>
         <p><b>Availability:</b> ${form.availability || "—"}</p>
         <p><b>Expected Pay:</b> ${form.expectedPay || "—"}</p>
         <p><b>Why Us:</b> ${form.whyNote || "—"}</p>`
      );
      setDone(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="glass-cell rounded-2xl p-10 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-accent" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Application Received</h3>
        <p className="text-slate-500 leading-relaxed mb-6">
          Thank you, {form.name.split(" ")[0]}. We've received your application for the {form.skillArea} area.
          If a project matches your skills, we'll reach out. Please note we're project-based, so we connect
          with talent as opportunities arise — not immediately.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setForm({ name: "", email: "", phone: "", city: "", skillArea: "", experienceLevel: "", portfolioUrl: "", availability: "", expectedPay: "", whyNote: "" });
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-cell rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Field label="Full Name *">
          <TextInput value={form.name} onChange={set("name")} placeholder="Your full name" />
        </Field>
        <Field label="Email *">
          <TextInput type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" />
        </Field>
        <Field label="Phone Number">
          <TextInput value={form.phone} onChange={set("phone")} placeholder="+91 ..." />
        </Field>
        <Field label="City">
          <TextInput value={form.city} onChange={set("city")} placeholder="Bengaluru" />
        </Field>
        <Field label="Skill Area *">
          <Select value={form.skillArea} onChange={set("skillArea")} options={skillAreas} placeholder="Select your skill" />
        </Field>
        <Field label="Experience Level *">
          <Select value={form.experienceLevel} onChange={set("experienceLevel")} options={experienceLevels} placeholder="Select experience" />
        </Field>
        <Field label="Portfolio or LinkedIn URL" className="sm:col-span-2">
          <TextInput value={form.portfolioUrl} onChange={set("portfolioUrl")} placeholder="https://..." />
        </Field>
        <Field label="Availability">
          <TextInput value={form.availability} onChange={set("availability")} placeholder="e.g. Weekdays, 20 hrs/week" />
        </Field>
        <Field label="Expected Monthly / Project-Based Pay">
          <TextInput value={form.expectedPay} onChange={set("expectedPay")} placeholder="e.g. ₹25,000/month or per project" />
        </Field>
      </div>
      <Field label="Why do you want to work with us?" className="mb-5">
        <TextArea value={form.whyNote} onChange={set("whyNote")} placeholder="Tell us briefly about your goals and what you bring..." rows={4} />
      </Field>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-60"
      >
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Application"}
      </button>
    </form>
  );
}