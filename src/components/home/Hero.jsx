import { motion } from "framer-motion";
import { TrendingUp, MousePointerClick, Target } from "lucide-react";
import CTAButton from "@/components/ui-custom/CTAButton";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-40 pb-24 px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-accent/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-accent/30 bg-indigo-50/50 text-xs font-semibold text-indigo-accent mb-8">
            Performance Marketing Agency · Bengaluru
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
            We Don't Sell Clicks. <br className="hidden sm:block" />
            We Build <span className="text-indigo-accent">Revenue Engines.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 max-w-xl leading-relaxed">
            Google Ads, Meta Ads, SEO, Conversion Strategy, and AI-Powered Growth for businesses that want leads, revenue, and measurable results.
          </p>

          <p className="mt-4 text-sm text-slate-400">
            15+ Years Hands-On Experience · 100+ Businesses Worked With · India &amp; International Campaigns
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <CTAButton to="/growth-audit" variant="primary">Get A Free Growth Audit</CTAButton>
            <CTAButton to="/case-studies" variant="secondary">See Real Results</CTAButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative"
        >
          {/* Dashboard-style performance visual — pure Tailwind, no external image */}
          <div className="glass-cell rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Campaign Performance</p>
                <p className="text-xs text-slate-400">Last 30 days</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-accent bg-emerald-50 border border-emerald-accent/20">▲ Live</span>
            </div>

            {/* Metric tiles */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <MousePointerClick className="w-5 h-5 text-indigo-accent mb-2" aria-hidden="true" />
                <p className="text-2xl font-extrabold text-slate-900">4.8%</p>
                <p className="text-xs text-slate-400">CTR</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <Target className="w-5 h-5 text-emerald-accent mb-2" aria-hidden="true" />
                <p className="text-2xl font-extrabold text-slate-900">₹42</p>
                <p className="text-xs text-slate-400">CPL</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <TrendingUp className="w-5 h-5 text-indigo-accent mb-2" aria-hidden="true" />
                <p className="text-2xl font-extrabold text-slate-900">312</p>
                <p className="text-xs text-slate-400">Leads</p>
              </div>
            </div>

            {/* Mini bar chart */}
            <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-slate-600">Weekly Conversions</p>
                <p className="text-xs text-emerald-accent font-semibold">+47% MoM</p>
              </div>
              <div className="flex items-end justify-between gap-2 h-28">
                {[
                  { h: "40%", c: "bg-indigo-accent/40" },
                  { h: "55%", c: "bg-indigo-accent/50" },
                  { h: "35%", c: "bg-indigo-accent/35" },
                  { h: "65%", c: "bg-indigo-accent/60" },
                  { h: "75%", c: "bg-indigo-accent/70" },
                  { h: "60%", c: "bg-indigo-accent/55" },
                  { h: "90%", c: "bg-emerald-accent" }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={`w-full rounded-t-md ${bar.c}`} style={{ height: bar.h }} />
                    <span className="text-[10px] text-slate-400">{["W1","W2","W3","W4","W5","W6","W7"][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom stat row */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50/50">
              <div>
                <p className="text-xs text-slate-400">Cost Per Acquisition</p>
                <p className="text-lg font-bold text-slate-900">₹1,840 <span className="text-xs text-emerald-accent font-semibold">↓ 38%</span></p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="text-xs text-slate-400">Revenue Per Lead</p>
                <p className="text-lg font-bold text-slate-900">₹4,200 <span className="text-xs text-emerald-accent font-semibold">↑ 22%</span></p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 glass-cell rounded-2xl p-5 hidden sm:block">
            <p className="text-2xl font-extrabold text-emerald-accent">3x</p>
            <p className="text-xs text-slate-500">Avg Lead Growth</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}