import MetaTags from "@/components/seo/MetaTags";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="pt-40 pb-24 px-6 bg-ink">
      <MetaTags
        title="Terms & Conditions"
        description="Terms & Conditions governing use of the Look A Like Solutions website and engagement of our digital marketing services. Governing law: India."
        path="/terms"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Terms & Conditions", path: "/terms" }])} id="schema-breadcrumb" />
      <ScrollReveal className="max-w-3xl mx-auto prose prose-slate prose-p:text-slate-600 prose-headings:text-slate-900">
        <h1>Terms &amp; Conditions</h1>
        <p>Last updated: October 2026</p>
        <p>By accessing or using this website (https://lookalikesolutions.com), you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use the website.</p>

        <h2>Use of This Website</h2>
        <p>This website is provided for informational purposes about the digital marketing services offered by Look A Like Solutions. You agree to use it lawfully and not to misuse, disrupt, or attempt to gain unauthorised access to the site, its content, or its underlying systems. All content is provided "as is" without warranties of any kind.</p>

        <h2>Service Engagements</h2>
        <p>Any services described on this website are subject to a separate, signed agreement between Look A Like Solutions and the client. That agreement will outline the scope of work, deliverables, timelines, fees, payment terms, and other conditions. No service engagement is formed solely by submitting a form or contacting us through this website.</p>
        <div className="p-4 my-4 rounded-xl bg-amber-50 border border-amber-200 not-prose">
          <p className="text-xs font-semibold text-amber-800">[TO BE REVIEWED BY LEGAL COUNSEL]</p>
          <p className="text-xs text-amber-700 mt-1">Confirm the governing legal entity name and reference the standard service-agreement template.</p>
        </div>

        <h2>Intellectual Property</h2>
        <p>All content, branding, design, copy, and creative assets on this website are the property of Look A Like Solutions unless otherwise credited, and are protected under applicable Indian intellectual property laws. You may not reproduce, distribute, or use any content for commercial purposes without our prior written permission.</p>

        <h2>Results Disclaimer</h2>
        <p>Metrics, case study figures, and testimonials on this website reflect actual client outcomes at the time reported and are not typical or guaranteed results. Digital marketing outcomes vary based on industry, competition, budget, market conditions, tracking setup, and other factors outside our control. We do not guarantee specific search engine rankings, lead volumes, revenue, or return on investment.</p>

        <h2>Cookies and Tracking</h2>
        <p>This website uses cookies and third-party tracking tools, including Google Analytics, Google Tag Manager, Meta Pixel, and Google Ads tags. Non-essential tracking is only loaded after you grant consent via our cookie consent banner. See our <Link to="/cookie-policy">Cookie Policy</Link> and <Link to="/privacy-policy">Privacy Policy</Link> for details.</p>

        <h2>Payment and Cancellation</h2>
        <p>Payment terms, including fees, invoicing schedule, and cancellation or refund conditions, are defined in the separate service agreement signed between Look A Like Solutions and the client. No payment is processed through this website itself unless explicitly stated in that agreement.</p>

        <h2>Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, Look A Like Solutions and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, or data, arising out of or related to your use of this website or our services.</p>
        <div className="p-4 my-4 rounded-xl bg-amber-50 border border-amber-200 not-prose">
          <p className="text-xs font-semibold text-amber-800">[TO BE REVIEWED BY LEGAL COUNSEL]</p>
          <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc pl-4">
            <li>Confirm liability cap amount and scope (e.g. limited to fees paid in the preceding 12 months).</li>
            <li>Review whether the cap should exclude certain causes of action (e.g. IP infringement, confidentiality breach).</li>
            <li>Confirm governing legal entity for liability purposes.</li>
          </ul>
        </div>

        <h2>Third-Party Links and Tools</h2>
        <p>This website may contain links to third-party websites or use third-party tools (such as Google, Meta, and analytics platforms). We are not responsible for the content, privacy practices, or availability of those third parties.</p>

        <h2>Governing Law and Jurisdiction</h2>
        <p>These Terms &amp; Conditions are governed by the laws of India. Any disputes arising out of or relating to these Terms, the website, or our services shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.</p>
        <div className="p-4 my-4 rounded-xl bg-amber-50 border border-amber-200 not-prose">
          <p className="text-xs font-semibold text-amber-800">[TO BE REVIEWED BY LEGAL COUNSEL]</p>
          <p className="text-xs text-amber-700 mt-1">Confirm governing entity, jurisdiction, and whether dispute resolution should include arbitration before court action.</p>
        </div>

        <h2>Changes to These Terms</h2>
        <p>We may update these Terms from time to time. When we do, we will revise the "Last updated" date at the top of this page. Continued use of the website after any changes constitutes acceptance of the revised Terms.</p>

        <h2>Contact Us</h2>
        <p>Questions about these Terms can be directed to info@lookalikesolutions.com or +91-9731588244.</p>
      </ScrollReveal>
    </div>
  );
}