import { useEffect } from "react";

const SITE_URL = "https://www.lookalikesolutions.com";
const BRAND_LOGO = "https://media.base44.com/images/public/6a45332a796cb5a887717912/54bfc626b_LookalikeSolutionsIconJPG.JPG";
const SOCIAL = {
  facebook: "https://www.facebook.com/lookalikesolutions",
  instagram: "https://www.instagram.com/lookalikesolutions",
  youtube: "https://www.youtube.com/@thelookalikesolutions",
  linkedin: "https://www.linkedin.com/company/lookalikesolutions",
};

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
    url: SITE_URL,
    logo: BRAND_LOGO,
    image: BRAND_LOGO,
    telephone: "+91-9731588244",
    email: "info@lookalikesolutions.com",
    founder: { "@type": "Person", name: "Ramkumar" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+91-9731588244",
      email: "info@lookalikesolutions.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Kannada"]
    },
    sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.youtube, SOCIAL.linkedin]
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Look A Like Solutions",
    url: SITE_URL,
    publisher: { "@type": "Organization", name: "Look A Like Solutions", url: SITE_URL },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Look A Like Solutions",
    image: BRAND_LOGO,
    logo: BRAND_LOGO,
    url: SITE_URL,
    telephone: "+91-9731588244",
    email: "info@lookalikesolutions.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN"
    },
    areaServed: {
      "@type": "Country",
      name: "India"
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "18:30"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+91-9731588244",
      email: "info@lookalikesolutions.com"
    },
    sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.youtube, SOCIAL.linkedin]
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
      item: `${SITE_URL}${item.path}`
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
    provider: {
      "@type": "Organization",
      name: "Look A Like Solutions",
      url: SITE_URL,
      telephone: "+91-9731588244"
    },
    areaServed: { "@type": "Country", name: "India" },
    description: service.metaDescription || service.shortDescription,
    offers: { "@type": "Offer", availability: "https://schema.org/InStock" }
  };
}

export function articleSchema(post, pathPrefix = "blog") {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: post.coverImage || BRAND_LOGO,
    author: { "@type": "Person", name: post.author || "Look A Like Solutions" },
    publisher: {
      "@type": "Organization",
      name: "Look A Like Solutions",
      logo: { "@type": "ImageObject", url: BRAND_LOGO }
    },
    datePublished: post.publishDate,
    mainEntityOfPage: `${SITE_URL}/${pathPrefix}/${post.slug}`
  };
}