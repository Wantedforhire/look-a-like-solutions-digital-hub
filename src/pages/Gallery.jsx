import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import CTABand from "@/components/ui-custom/CTABand";

const categories = ["All", "Logo Design", "Social Media", "Website", "Ad Creative", "Other"];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["gallery", "public"],
    queryFn: () => base44.entities.GalleryItem.list("order"),
  });

  const filtered = active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      <MetaTags
        title="Design Gallery"
        description="Explore our portfolio of logo designs, social media creatives, websites, and ad campaigns built by Look A Like Solutions."
        path="/gallery"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-accent font-semibold mb-4">Gallery</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Work We're <span className="text-indigo-accent">Proud Of</span>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active === cat ? "bg-indigo-accent text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-center text-slate-400 py-20">Loading gallery...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-20">No items in this category yet.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {filtered.map((item, i) => (
                <ScrollReveal key={item.id} delay={(i % 3) * 0.06} className="break-inside-avoid mb-5">
                  <div className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                    <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    <div className="p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-accent mb-1">{item.category}</p>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      {item.clientIndustry && <p className="text-xs text-slate-400 mt-0.5">{item.clientIndustry}</p>}
                      {item.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABand />
    </div>
  );
}