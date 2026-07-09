import ScrollReveal from "@/components/ui-custom/ScrollReveal";

export default function ClientLogoMarquee({ clients = [] }) {
  if (!clients.length) return null;
  return (
    <section className="py-16 px-6 bg-ink">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-sub">Trusted by Businesses in Bengaluru</p>
        </ScrollReveal>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {clients.map((c) => (
            <a
              key={c.id}
              href={c.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <img src={c.logoUrl} alt={`${c.name} logo`} loading="lazy" className="h-8 md:h-10 w-auto object-contain transition-all" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}