import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema, localBusinessSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import ContactForm from "@/components/forms/ContactForm";
import ContactMap from "@/components/contact/ContactMap";

const contactMethods = [
  { icon: Phone, label: "Call Us", value: "+91-9731588244", href: "tel:+919731588244" },
  { icon: MessageCircle, label: "Strategy Call (WhatsApp)", value: "Chat with Ramkumar", href: "https://wa.me/919731588244" },
  { icon: Mail, label: "Email", value: "info@lookalikesolutions.com", href: "mailto:info@lookalikesolutions.com" },
  { icon: MapPin, label: "Location", value: "Bengaluru, Karnataka, India", href: null, note: "Mon–Sat, 9:30 am – 6:30 pm IST" }
];

export default function Contact() {
  return (
    <div>
      <MetaTags
        title="Contact Us"
        description="Get in touch with Look A Like Solutions — a performance marketing agency serving businesses across India. Share your growth challenge and we'll review whether we're the right fit."
        path="/contact"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} id="schema-breadcrumb" />
      <SchemaMarkup schema={localBusinessSchema()} id="schema-local-contact" />
      <section className="pt-28 md:pt-40 pb-14 md:pb-16 px-6 bg-white text-center">
        <ScrollReveal className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Tell Us What You Are <span className="text-indigo-accent">Trying To Grow</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            Share your current challenge, and we'll review whether we're the right fit before recommending a solution.
          </p>
          <p className="mt-4 text-sm text-slate-400">We typically respond within 4 business hours.</p>
        </ScrollReveal>
      </section>

      <section className="pb-16 md:pb-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-4 order-last lg:order-none">
            {contactMethods.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 0.06}>
                {m.href ? (
                  <a href={m.href} target={m.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-accent/30 transition-all">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <m.icon className="w-5 h-5 text-indigo-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{m.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{m.value}</p>
                      {m.note && <p className="text-xs text-slate-400 mt-0.5">{m.note}</p>}
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <m.icon className="w-5 h-5 text-indigo-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{m.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{m.value}</p>
                      {m.note && <p className="text-xs text-slate-400 mt-0.5">{m.note}</p>}
                    </div>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>

          <div className="lg:col-span-3 order-first lg:order-none">
            <ScrollReveal delay={0.1}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ContactMap />
    </div>
  );
}