import { Link } from "react-router-dom";
import { MapPin, Target, LineChart, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import CTAButton from "@/components/ui-custom/CTAButton";

const trustPoints = [
  {
    icon: MapPin,
    title: "A Bengaluru team",
    text: "Strategy calls, reporting and reviews happen in IST, with a local team that reads the market you sell into.",
  },
  {
    icon: Target,
    title: "Scoped to outcomes",
    text: "Every programme starts from the commercial metric that matters to you, not a checklist of deliverables.",
  },
  {
    icon: LineChart,
    title: "Visible performance",
    text: "You see where spend goes, what it returned and what we are testing next — no black boxes.",
  },
];

export default function TrustedInBengaluru() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8 md:p-12">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-accent">Local Trust</p>
              <h2 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Trusted by Businesses in Bengaluru
              </h2>
              <p className="mt-4 text-base md:text-lg text-slate-500 leading-relaxed">
                Look A Like Solutions is a Bengaluru-based performance marketing team working with founders and
                marketing leads across the city and across India — on search, paid media and content that is
                measured in pipeline and revenue.
              </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-5">
              {trustPoints.map((point, i) => (
                <ScrollReveal key={point.title} delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-5">
                    <point.icon className="w-5 h-5 text-emerald-accent" aria-hidden="true" />
                    <h3 className="mt-3 text-sm font-bold text-slate-900">{point.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{point.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <CTAButton to="/contact" variant="primary">Talk To Our Bengaluru Team</CTAButton>
              <Link
                to="/industries"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-accent transition-colors"
              >
                See the industries we serve <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}