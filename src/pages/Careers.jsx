import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import CTABand from "@/components/ui-custom/CTABand";
import TalentApplicationForm from "@/components/forms/TalentApplicationForm";
import { ChevronDown, MapPin, Briefcase, Clock } from "lucide-react";

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [openId, setOpenId] = useState(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", "open"],
    queryFn: () => base44.entities.JobListing.filter({ isOpen: true }, "order"),
  });

  return (
    <div>
      <MetaTags
        title="Careers & Work With Us"
        description="Join Look A Like Solutions — a founder-led, project-based digital marketing agency in Bengaluru. Explore open roles or join our talent network."
        path="/careers"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-4">Careers</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Build Your Career <span className="text-indigo-accent">With Us</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
              We're a founder-led, project-based agency. We bring together trained specialists for each engagement —
              no rigid hierarchy, no false promises. If you're skilled and hungry, there's a place for you.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto pt-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Open Roles</h2>
          {isLoading ? (
            <p className="text-center text-slate-400 py-12">Loading roles...</p>
          ) : jobs.length === 0 ? (
            <div className="glass-cell rounded-2xl p-8 text-center">
              <p className="text-slate-500 mb-4">No specific open roles right now, but we're always building our talent network.</p>
              <button
                onClick={() => setSelectedJob({ id: null, title: "General Application" })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
              >
                Submit General Application
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="glass-cell rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenId(openId === job.id ? null : job.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.department}</span>
                        {job.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>}
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openId === job.id ? "rotate-180" : ""}`} />
                  </button>
                  {openId === job.id && (
                    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">{job.description}</p>
                      {job.requirements?.length > 0 && (
                        <div className="mb-5">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Requirements</p>
                          <ul className="space-y-1.5">
                            {job.requirements.map((r, i) => (
                              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent mt-1.5 shrink-0" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
                      >
                        Apply Now
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedJob && (
        <section className="pb-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Apply: {selectedJob.title}
              </h2>
              <button onClick={() => setSelectedJob(null)} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                ← Back to roles
              </button>
            </div>
            <TalentApplicationForm jobListingId={selectedJob.id} />
          </div>
        </section>
      )}

      {!selectedJob && <CTABand title="Want to join our talent network?" primaryLabel="Submit General Application" primaryTo="/work-with-us" />}
    </div>
  );
}