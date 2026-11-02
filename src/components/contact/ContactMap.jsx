import { MapPin, ExternalLink } from "lucide-react";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

const MAP_QUERY = "Look A Like Solutions, Bengaluru";
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

export default function ContactMap() {
  return (
    <section className="pb-16 md:pb-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-3 md:p-4">
            <div className="flex flex-wrap items-end justify-between gap-4 px-3 md:px-5 pt-4 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-accent">Find Us</p>
                <h2 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                  Look A Like Solutions in Bengaluru
                </h2>
                <p className="mt-2 text-sm text-slate-500">Open the map to see the full listing, reviews and directions.</p>
              </div>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-accent px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Open in Google Maps
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <iframe
                title="Look A Like Solutions location on Google Maps"
                src={MAP_EMBED}
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block w-full h-[300px] md:h-[420px] border-0"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}