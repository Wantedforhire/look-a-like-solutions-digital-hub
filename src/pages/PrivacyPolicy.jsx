import MetaTags from "@/components/seo/MetaTags";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";

export default function PrivacyPolicy() {
  return (
    <div className="pt-40 pb-24 px-6 bg-ink">
      <MetaTags
        title="Privacy Policy"
        description="Privacy Policy for Look A Like Solutions — how we collect, use, store, and protect your personal information under applicable Indian law."
        path="/privacy-policy"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }])} id="schema-breadcrumb" />
      <ScrollReveal className="max-w-3xl mx-auto prose prose-slate prose-p:text-slate-600 prose-headings:text-slate-900">
        <h1>Privacy Policy</h1>
        <p>Last updated: July 2026</p>
        <p>Look A Like Solutions ("we", "our", "us") is a digital marketing agency headquartered in Bengaluru, Karnataka, India. We respect your privacy and are committed to protecting the personal information you share with us through this website (https://www.lookalikesolutions.com).</p>

        <h2>Information We Collect</h2>
        <p>We collect information you voluntarily provide through our forms — including the contact form, free growth audit request, strategy call request, newsletter subscription, and talent application. This may include your name, email address, phone number, company name, website URL, service interest, monthly budget, marketing challenge, and message.</p>
        <p>We may also automatically collect limited technical data such as IP address, browser type, device information, and pages visited, through cookies and analytics tools (described below).</p>

        <h2>How We Use Your Information</h2>
        <p>We use the information you provide to:</p>
        <ul>
          <li>Respond to your enquiries and prepare proposals or audits;</li>
          <li>Deliver requested services and communicate about your engagement;</li>
          <li>Send relevant marketing communications, only where you have consented;</li>
          <li>Improve our website, content, and service offerings;</li>
          <li>Meet legal, accounting, and reporting obligations.</li>
        </ul>

        <h2>Lead Form and Newsletter Consent</h2>
        <p>By submitting any form on this website, you consent to us using the details you provide to respond to your request. If you subscribe to our newsletter, you consent to receiving periodic marketing emails. You can unsubscribe at any time using the link in any email or by contacting us at info@lookalikesolutions.com.</p>

        <h2>Cookies and Analytics</h2>
        <p>This website uses cookies and similar technologies to understand how visitors use the site and to improve user experience. We use the following third-party tracking and analytics tools:</p>
        <ul>
          <li><strong>Google Analytics 4 (GA4)</strong> — to analyse website traffic and behaviour;</li>
          <li><strong>Google Tag Manager (GTM)</strong> — to manage tracking tags;</li>
          <li><strong>Meta (Facebook) Pixel</strong> — to measure ad campaign performance;</li>
          <li><strong>Google Ads tags</strong> — to track conversions from Google Ads campaigns.</li>
        </ul>
        <p>You can control or disable cookies through your browser settings. Disabling cookies may affect some website functionality.</p>

        <h2>Third-Party Processors</h2>
        <p>We do not sell or rent your personal information. We may share data with trusted third-party service providers — such as cloud hosting, email delivery, analytics, and advertising platforms — strictly for the purpose of operating our website and delivering our services. These providers are bound by their own privacy and data protection obligations.</p>

        <h2>Data Retention</h2>
        <p>We retain personal information only for as long as necessary to fulfil the purposes for which it was collected, including legal, accounting, or reporting requirements. Lead and enquiry data is typically retained for the duration of any active engagement and for a reasonable period thereafter, after which it is deleted or anonymised.</p>

        <h2>Your Rights and Contact</h2>
        <p>Subject to applicable Indian law, you may request access to, correction of, or deletion of your personal data, and you may withdraw any consent you have given, at any time. To exercise these rights, contact us at info@lookalikesolutions.com or +91-9731588244.</p>

        <h2>Security Limitations</h2>
        <p>We implement reasonable technical and organisational measures to protect your data against unauthorised access, alteration, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>

        <h2>Governing Law</h2>
        <p>This Privacy Policy is governed by the laws of India. Any disputes arising from it shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Continued use of the website after changes constitutes acceptance of the revised policy.</p>

        <h2>Contact Us</h2>
        <p>For any questions about this Privacy Policy, contact us at info@lookalikesolutions.com or +91-9731588244.</p>
      </ScrollReveal>
    </div>
  );
}