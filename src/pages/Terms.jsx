import MetaTags from "@/components/seo/MetaTags";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

export default function Terms() {
  return (
    <div className="pt-40 pb-24 px-6 bg-ink">
      <MetaTags title="Terms &amp; Conditions" description="Terms and Conditions for using the Look A Like Solutions website and services." path="/terms" />
      <ScrollReveal className="max-w-3xl mx-auto prose prose-invert prose-p:text-slate-sub prose-headings:text-pearl">
        <h1>Terms &amp; Conditions</h1>
        <p>Last updated: July 2026</p>
        <p>By accessing this website, you agree to be bound by these Terms &amp; Conditions. Please read them carefully.</p>

        <h2>Use of This Website</h2>
        <p>This website is provided for informational purposes about the digital marketing services offered by Look A Like Solutions. You agree not to misuse the site or its content.</p>

        <h2>Service Engagements</h2>
        <p>Any services described on this website are subject to a separate signed agreement between Look A Like Solutions and the client, outlining scope, deliverables, timelines, and fees.</p>

        <h2>Intellectual Property</h2>
        <p>All content, branding, and creative assets on this website are the property of Look A Like Solutions unless otherwise credited, and may not be reproduced without permission.</p>

        <h2>Results Disclaimer</h2>
        <p>Metrics and case study figures reflect actual client outcomes at the time reported. Digital marketing results vary by industry, competition, and market conditions, and are not guaranteed.</p>

        <h2>Limitation of Liability</h2>
        <p>Look A Like Solutions is not liable for indirect or consequential damages arising from use of this website.</p>

        <h2>Changes to These Terms</h2>
        <p>We may update these Terms from time to time. Continued use of the website constitutes acceptance of the revised Terms.</p>

        <h2>Contact Us</h2>
        <p>Questions about these Terms can be directed to info@lookalikesolutions.com.</p>
      </ScrollReveal>
    </div>
  );
}