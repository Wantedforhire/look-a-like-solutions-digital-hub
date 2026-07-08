import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import SectionHeading from "@/components/ui-custom/SectionHeading";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import AnimatedCounter from "@/components/ui-custom/AnimatedCounter";
import TeamMemberCard from "@/components/shared/TeamMemberCard";
import CTABand from "@/components/ui-custom/CTABand";
import CTAButton from "@/components/ui-custom/CTAButton";
import { Target, Users2, Sparkles, ShieldCheck, Award } from "lucide-react";

const values = [
  { icon: Target, title: "Results-Driven", desc: "Every strategy is designed to deliver measurable ROI and tangible business growth." },
  { icon: Users2, title: "Client-Centric", desc: "Your success is our success. We treat your business goals as our own." },
  { icon: Sparkles, title: "Innovation First", desc: "We stay ahead of digital trends to give you a competitive edge." },
  { icon: ShieldCheck, title: "Transparency", desc: "Clear communication, honest reporting, and no hidden surprises." }
];

const awards = [
  { title: "Best Digital Agency", org: "2024 Marketing Excellence Awards" },
  { title: "Top 10 SEO Agencies", org: "Digital Marketing Institute" },
  { title: "Excellence in ROI", org: "2024 Performance Awards" },
  { title: "Certified Partners", org: "Google, Facebook, HubSpot" }
];

export default function About() {
  const { data: team = [] } = useQuery({
    queryKey: ["team"],
    queryFn: () => base44.entities.TeamMember.list("order")
  });

  return (
    <div>
      <MetaTags
        title="About Us"
        description="Meet Look A Like Solutions — Bengaluru's growth-focused digital marketing agency. Our story, values, and the team behind 500+ client success stories."
        path="/about"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-20 px-6 bg-ink">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-pearl">
              Transforming Businesses Through <span className="text-indigo-accent">Digital Excellence</span>
            </h1>
            <p className="mt-6 text-lg text-slate-sub max-w-2xl mx-auto leading-relaxed">
              We're a passionate team of digital marketing experts based in Bengaluru, dedicated to helping businesses thrive through innovative strategies and data-driven results.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent mb-4">Our Story</p>
            <h2 className="text-3xl font-extrabold text-pearl mb-6">Building Digital Success Stories Since Day One</h2>
            <p className="text-slate-sub leading-relaxed mb-4">
              Look A Like Solutions was born from a simple belief: every business deserves a powerful digital presence. What started as a small team of passionate marketers in Bengaluru has grown into a full-service digital marketing agency trusted by businesses across India.
            </p>
            <p className="text-slate-sub leading-relaxed">
              We've helped hundreds of businesses transform their online presence — from startups finding their voice to established brands reaching new heights — combining cutting-edge technology with creative storytelling, always keeping your business goals at the center.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15} className="grid grid-cols-3 gap-4">
            {[{ v: 150, s: "+", l: "Projects Completed" }, { v: 98, s: "%", l: "Client Satisfaction" }, { v: 5, s: "+", l: "Team Members" }].map((m) => (
              <div key={m.l} className="glass-cell rounded-2xl p-5 text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-emerald-accent"><AnimatedCounter value={m.v} suffix={m.s} /></p>
                <p className="text-xs text-slate-sub mt-2">{m.l}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 px-6 bg-ink">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Our Values" title="What Drives Us Forward" subtitle="Our core values shape everything we do, from client work to how we support each other." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.08}>
                <div className="glass-cell rounded-2xl p-7 h-full hover:border-indigo-accent/50 transition-colors">
                  <v.icon className="w-8 h-8 text-indigo-accent mb-5" />
                  <h3 className="text-base font-bold text-pearl mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-sub leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section id="team" className="py-24 px-6 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
            <SectionHeading eyebrow="Our Team" title="Meet the Experts Behind Your Success" subtitle="Specialists in SEO, social, development, and analytics — all dedicated to your growth." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {team.map((m, i) => <TeamMemberCard key={m.id} member={m} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-6 bg-ink">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Recognition" title="Awards &amp; Certifications" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((a, i) => (
              <ScrollReveal key={a.title} delay={i * 0.08}>
                <div className="glass-cell rounded-2xl p-7 text-center h-full">
                  <Award className="w-8 h-8 text-emerald-accent mx-auto mb-4" />
                  <h3 className="text-sm font-bold text-pearl mb-1">{a.title}</h3>
                  <p className="text-xs text-slate-sub">{a.org}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Work With Us */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="glass-cell rounded-3xl p-8 sm:p-12 grid lg:grid-cols-2 gap-8 items-center">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-3">Work With Us</p>
              <h2 className="text-3xl font-extrabold text-pearl mb-4">Join Our Project Network</h2>
              <p className="text-slate-sub leading-relaxed mb-6">
                We're a founder-led, project-based agency. We bring together trained specialists for each
                engagement — no rigid hierarchy, no false promises. If you're skilled and hungry for real work,
                there's a place for you in our network.
              </p>
              <CTAButton to="/work-with-us" variant="primary">Apply to Join Our Network</CTAButton>
            </ScrollReveal>
            <ScrollReveal delay={0.12} className="grid grid-cols-2 gap-3">
              {["Google Ads", "Meta Ads", "SEO", "Content Writing", "Web Development", "Graphic Design", "Video Editing", "Analytics"].map((skill) => (
                <div key={skill} className="glass-cell rounded-xl p-4 text-center">
                  <span className="text-sm font-semibold text-slate-700">{skill}</span>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      <CTABand title="Book a Strategy Call With Ramkumar" primaryLabel="Get A Free Growth Audit" primaryTo="/growth-audit" />
    </div>
  );
}