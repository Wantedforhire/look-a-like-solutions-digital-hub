import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import EyebrowLabel from "@/components/ui-custom/EyebrowLabel";
import CTAButton from "@/components/ui-custom/CTAButton";

export default function FounderSection() {
  const { data: team = [] } = useQuery({
    queryKey: ["team", "founder"],
    queryFn: () => base44.entities.TeamMember.list("order")
  });
  const ramkumar = team.find((m) => m.name && m.name.toLowerCase().includes("ramkumar"));
  const founderPhoto = ramkumar?.photo || "https://media.base44.com/images/public/6a45332a796cb5a887717912/b5f87c02a_WhatsAppImage2025-10-30at112027_e9d09851.jpg";
  const tags = ramkumar?.specialisms?.length
    ? ramkumar.specialisms
    : ["Google Ads", "Meta Ads", "SEO", "Performance Marketing", "Analytics & Tracking", "AI-Powered Marketing", "Training & Consulting", "Business Growth Strategy"];

  return (
    <section className="py-24 px-6 bg-indigo-50/50 border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-14">
          <EyebrowLabel className="mb-4 justify-center">Meet The Strategist</EyebrowLabel>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Meet The Strategist Behind Look A Like Solutions
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            {/* Admin note: If Ramkumar's photo field is set, it renders here. Otherwise, a clean placeholder is shown. */}
            <img
              src={founderPhoto}
              alt={ramkumar ? `${ramkumar.name}, Founder of Look A Like Solutions` : "Ramkumar, Founder of Look A Like Solutions"}
              loading="lazy"
              className="w-full aspect-square object-cover rounded-3xl shadow-lg"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">I'm Ramkumar</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              {ramkumar?.bio || "I've spent 15+ years in the trenches of digital marketing — not as a consultant who watches from the sidelines, but as someone who has built campaigns, optimized landing pages, analyzed GA4 data at 2 AM, and figured out what actually drives leads and revenue. I started Look A Like Solutions because I was tired of seeing businesses burned by agencies that sell activity instead of outcomes."}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium text-indigo-accent border border-indigo-accent/30 bg-indigo-50/50">
                  {tag}
                </span>
              ))}
            </div>
            <CTAButton to="/growth-audit" variant="primary">
              Work With Ramkumar and His Team
            </CTAButton>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}