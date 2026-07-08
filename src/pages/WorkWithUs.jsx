import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import EyebrowLabel from "@/components/ui-custom/EyebrowLabel";
import CTAButton from "@/components/ui-custom/CTAButton";
import TalentApplicationForm from "@/components/forms/TalentApplicationForm";
import {
  Target, Layers, Handshake, Users, Sparkles, ArrowRight,
  Search, TrendingUp, Share2, Palette, Code2, PenTool,
  BarChart3, Megaphone, Video, ClipboardCheck
} from "lucide-react";

const skillAreas = [
  { icon: TrendingUp, label: "Google Ads" },
  { icon: Share2, label: "Meta Ads" },
  { icon: Search, label: "SEO" },
  { icon: PenTool, label: "Content Writing" },
  { icon: Palette, label: "Graphic Design" },
  { icon: Video, label: "Video Editing" },
  { icon: Code2, label: "Website Development" },
  { icon: Layers, label: "Landing Page Design" },
  { icon: Megaphone, label: "Social Media Management" },
  { icon: BarChart3, label: "Analytics & Tracking" },
  { icon: ClipboardCheck, label: "Client Coordination" },
  { icon: Sparkles, label: "Student Internship" },
];

const pillars = [
  { icon: Target, title: "Founder-Led", desc: "Every project is led by Ramkumar, our founder and lead strategist. You work directly with decision-makers — not a chain of account managers." },
  { icon: Layers, title: "Project-Based Teams", desc: "We assemble flexible teams of trained specialists around each project. There's no rigid hierarchy — the right people come together for the right work." },
  { icon: Handshake, title: "Honest Collaboration", desc: "We're upfront: this is project-based engagement. We don't promise full-time roles. We promise real work, real mentorship, and real results." },
  { icon: Users, title: "Grow With Us", desc: "Deliver great work and you become part of our trusted network — the first people we call when new projects land." },
];

export default function WorkWithUs() {
  return (
    <div>
      <MetaTags
        title="Work With Us — Join Our Project Network"
        description="Look A Like Solutions is a founder-led, project-based digital marketing agency in Bengaluru. Join our talent network for flexible, real-work project collaborations."
        path="/work-with-us"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Work With Us", path: "/work-with-us" }])} id="schema-breadcrumb" />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <EyebrowLabel className="mb-4">Join Our Project Network</EyebrowLabel>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Work With A <span className="text-indigo-accent">Founder-Led</span> Marketing Team
            </h1>
            <p className="mt-6 text-lg text-slate-500 leading-relaxed">
              We're not a traditional agency with layers of management. We're a founder-led, project-based studio
              that brings together trained specialists for each engagement. If you're skilled, reliable, and
              hungry for real work — there's a place for you in our network.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* How we work */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-3">How We Work</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">A Different Kind of Agency</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.08}>
                <div className="glass-cell rounded-2xl p-7 h-full">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
                    <p.icon className="w-6 h-6 text-indigo-accent" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skill areas */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-3">Skill Areas</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Where We Need Talent</h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
              We bring in specialists across these areas as projects demand. Whether you're a student, a fresher,
              or a seasoned pro — if you're great at what you do, apply.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skillAreas.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.04}>
                <div className="glass-cell rounded-xl p-5 flex items-center gap-3 hover:border-indigo-accent/40 transition-colors h-full">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5 text-emerald-accent" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{s.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-3">Apply Now</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Tell Us About Yourself</h2>
            <p className="text-slate-500 leading-relaxed">
              Fill out the form below. We review every application and reach out when a project fits your skills.
              This is a project opportunity — not a full-time job guarantee.
            </p>
          </ScrollReveal>
        </div>
        <TalentApplicationForm />
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-white text-center">
        <ScrollReveal>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Looking for marketing help instead?</h3>
          <CTAButton to="/growth-audit" variant="primary">Get A Free Growth Audit <ArrowRight className="w-4 h-4 inline ml-1" /></CTAButton>
        </ScrollReveal>
      </section>
    </div>
  );
}