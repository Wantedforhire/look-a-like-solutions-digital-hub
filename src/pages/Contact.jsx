import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema, localBusinessSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import ContactForm from "@/components/forms/ContactForm";

const contactMethods = [
  { icon: Phone, label: "Call Us", value: "+91-9731588244", href: "tel:+919731588244" },
  { icon: MessageCircle, label: "WhatsApp", value: "+91-9731588244", href: "https://wa.me/919731588244" },
  { icon: Mail, label: "Email", value: "info@lookalikesolutions.com", href: "mailto:info@lookalikesolutions.com" },
  { icon: MapPin, label: "Location", value: "Bengaluru, Karnataka, India", href: null }
];

export default function Contact() {
  return (
    <div>
      <MetaTags
        title="Contact Us"
        description="Get in touch with Look A Like Solutions — Bengaluru's digital marketing agency. Request a free strategy session, SEO audit, or proposal today."
        path="/contact"
      />
      <SchemaMarkup schema={localBusinessSchema()} id="schema-local" />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} id="schema-breadcrumb" />

      <section className="pt-40 pb-16 px-6 bg-ink text-center">
        <ScrollReveal className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-pearl">
            Let's Build Your <span className="text-indigo-accent">Growth Story</span>
          </h1>
          <p className="mt-6 text-lg text-slate-sub leading-relaxed">
            Request a free strategy session, Google Ads audit, or website audit — no obligation, no credit card required.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-24 px-6 bg-ink">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {contactMethods.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 0.06}>
                {m.href ? (
                  <a href={m.href} target={m.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-4 glass-cell rounded-2xl p-5 hover:border-indigo-accent/50 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-indigo-accent/10 flex items-center justify-center shrink-0">
                      <m.icon className="w-5 h-5 text-indigo-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-sub">{m.label}</p>
                      <p className="text-sm font-semibold text-pearl">{m.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 glass-cell rounded-2xl p-5">
                    <div className="w-11 h-11 rounded-xl bg-indigo-accent/10 flex items-center justify-center shrink-0">
                      <m.icon className="w-5 h-5 text-indigo-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-sub">{m.label}</p>
                      <p className="text-sm font-semibold text-pearl">{m.value}</p>
                    </div>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>

          <div className="lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}