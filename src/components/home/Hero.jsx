import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import CTAButton from "@/components/ui-custom/CTAButton";
import AnimatedCounter from "@/components/ui-custom/AnimatedCounter";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink pt-40 pb-24 px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-cell text-xs font-semibold text-emerald-accent mb-8">
            <ShieldCheck className="w-4 h-4" /> Trusted by 500+ Businesses
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-pearl leading-[1.05]">
            Digital Marketing That Helps <span className="text-indigo-accent">Bengaluru</span> Businesses Get Found, Trusted &amp; Chosen
          </h1>

          <p className="mt-6 text-lg text-slate-sub max-w-xl leading-relaxed">
            The digital marketing agency in Bangalore engineering measurable SEO, performance marketing, social media, and brand growth. See real results in 90 days.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <CTAButton to="/contact" variant="primary">Get Free Strategy Session</CTAButton>
            <CTAButton to="/case-studies" variant="secondary">View Case Studies</CTAButton>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-extrabold text-pearl"><AnimatedCounter value={300} suffix="%" /></p>
              <p className="text-xs text-slate-sub uppercase tracking-wider mt-1">Avg Growth</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-pearl"><AnimatedCounter value={50} suffix="+" /></p>
              <p className="text-xs text-slate-sub uppercase tracking-wider mt-1">Leads / Month</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-pearl">4.9★</p>
              <p className="text-xs text-slate-sub uppercase tracking-wider mt-1">Client Rating</p>
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-sub">No credit card required &middot; 30-min consultation &middot; Personalized roadmap</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden glass-cell p-2">
            <img
              src="https://static.wixstatic.com/media/f650f9_a153d83e6b714abd85209431c3edd563~mv2.png"
              alt="Digital marketing analytics dashboard showing SEO, ads, and conversion growth planning for Bengaluru businesses"
              className="w-full h-full object-cover rounded-2xl"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 glass-cell rounded-2xl p-5 bg-ink/95 backdrop-blur-xl hidden sm:block">
            <p className="text-2xl font-extrabold text-emerald-accent">98%</p>
            <p className="text-xs text-slate-sub">Client Satisfaction</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}