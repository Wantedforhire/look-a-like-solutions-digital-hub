import { useEffect } from "react";

export default function SchemaMarkup({ schema, id = "schema-jsonld" }) {
  useEffect(() => {
    if (!schema) return;
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => {
      el?.remove();
    };
  }, [schema, id]);

  return null;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Look A Like Solutions",
    url: "https://www.lookalikesolutions.com",
    logo: "https://static.wixstatic.com/media/f650f9_f179d9099ed645c1ac44620d6d167393~mv2.png",
    telephone: "+91-9731588244",
    email: "info@lookalikesolutions.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN"
    },
    sameAs: []
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Look A Like Solutions",
    image: "https://static.wixstatic.com/media/f650f9_f179d9099ed645c1ac44620d6d167393~mv2.png",
    telephone: "+91-9731588244",
    email: "info@lookalikesolutions.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN"
    },
    priceRange: "$$"
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `https://www.lookalikesolutions.com${item.path}`
    }))
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
}

export function serviceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: { "@type": "Organization", name: "Look A Like Solutions" },
    areaServed: "Bengaluru, India",
    description: service.metaDescription || service.shortDescription
  };
}