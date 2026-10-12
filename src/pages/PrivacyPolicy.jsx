import MetaTags from "@/components/seo/MetaTags";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { Link } from "react-router-dom";

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
        <p>Last updated: October 2026</p>
        <p>Look A Like Solutions ("we", "our", "us") is a digital marketing agency headquartered in Bengaluru, Karnataka, India. We respect your privacy and are committed to protecting the personal information you share with us through this website (https://lookalikesolutions.com).</p>

        <div className="p-4 my-6 rounded-xl bg-amber-50 border border-amber-200 not-prose">
          <p className="text-xs font-semibold text-amber-800 mb-2">[TO BE COMPLETED BY BUSINESS OWNER / LEGAL COUNSEL]</p>
          <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4">
            <li>Legal entity name (registered business name)</li>
            <li>Registered / business address</li>
            <li>Privacy / grievance officer name and contact email</li>
            <li>Exact data retention periods per data category</li>
            <li>Complete data processor / vendor list with purposes</li>
            <li>International data-transfer details, if applicable</li>
          </ul>
        </div>

        <h2>Information We Collect</h2>
        <p>We collect information you voluntarily provide through our forms — including the contact form, free growth audit request, strategy call request, newsletter subscription, and talent application. This may include your name, email address, phone number, company name, website URL, service interest, monthly budget, marketing challenge, and message.</p>
        <p>We may also automatically collect limited technical data such as IP address, browser type, device information, and pages visited, through cookies and analytics tools (described below and in our <Link to="/cookie-policy">Cookie Policy</Link>).</p>

        <h2>How We Use Your Information</h2>
        <p>We use the information you provide for the following specific purposes:</p>
        <ul>
          <li><strong>Responding to enquiries</strong> — to reply to your contact, audit, or strategy call request and prepare the requested proposal or audit. This processing is based on your request and our legitimate interest in responding to it.</li>
          <li><strong>Service delivery</strong> — to deliver requested services and communicate about your active engagement. This is based on our contractual relationship with you.</li>
          <li><strong>Marketing communications</strong> — to send relevant marketing insights and offers, only where you have separately and explicitly consented via the marketing opt-in checkbox. You can unsubscribe at any time.</li>
          <li><strong>Site improvement</strong> — to improve our website, content, and service offerings, based on our legitimate interest in operating and improving our business.</li>
          <li><strong>Legal compliance</strong> — to meet legal, accounting, and reporting obligations.</li>
        </ul>

        <h2>Lead Forms and Marketing Consent</h2>
        <p>Submitting an enquiry form (contact, growth audit, strategy call, or talent application) allows us to use the details you provide to respond to your request and prepare the requested audit or proposal. This does not constitute consent to receive marketing emails.</p>
        <p>If you wish to receive marketing insights and offers, you can separately opt in using the marketing checkbox on each form. This checkbox is not pre-ticked. You can withdraw this consent at any time by unsubscribing or contacting us.</p>
        <p>If you subscribe to our newsletter, you consent to receiving periodic marketing emails. You can unsubscribe at any time using the link in any email or by contacting us at info@lookalikesolutions.com.</p>

        <h2>Cookies and Analytics</h2>
        <p>This website uses cookies and similar technologies. Non-essential tracking (analytics and advertising) is blocked until you grant consent via our cookie consent banner. See our <Link to="/cookie-policy">Cookie Policy</Link> for full details on the categories, purposes, and how to manage your preferences.</p>
        <p>Tools that may be used after consent include Google Analytics 4, Google Tag Manager, Meta (Facebook) Pixel, and Google Ads tags.</p>

        <h2>Third-Party Processors</h2>
        <p>We do not sell or rent your personal information. We may share data with trusted third-party service providers — such as cloud hosting, email delivery, analytics, and advertising platforms — strictly for the purpose of operating our website and delivering our services.</p>
        <div className="p-4 my-4 rounded-xl bg-amber-50 border border-amber-200 not-prose">
          <p className="text-xs font-semibold text-amber-800">[TO BE COMPLETED BY BUSINESS OWNER / LEGAL COUNSEL]</p>
          <p className="text-xs text-amber-700 mt-1">Complete data processor / vendor list with names, purposes, and transfer details.</p>
        </div>

        <h2>Data Retention</h2>
        <p>We retain personal information only for as long as necessary to fulfil the purposes for which it was collected, including legal, accounting, or reporting requirements.</p>
        <div className="p-4 my-4 rounded-xl bg-amber-50 border border-amber-200 not-prose">
          <p className="text-xs font-semibold text-amber-800">[TO BE COMPLETED BY BUSINESS OWNER / LEGAL COUNSEL]</p>
          <p className="text-xs text-amber-700 mt-1">Specify exact retention periods per data category (e.g. enquiry data, newsletter data, talent applications).</p>
        </div>

        <h2>Your Rights</h2>
        <p>Subject to applicable Indian law, you may request access to, correction of, or deletion of your personal data, and you may withdraw any consent you have given, at any time. To exercise these rights, contact us using the details below.</p>

        <h2>Consent Withdrawal</h2>
        <p>You can withdraw your marketing consent at any time by unsubscribing via the link in our emails or by contacting us. Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.</p>

        <h2>Complaints</h2>
        <p>If you believe we have not handled your personal data in accordance with this policy, you have the right to lodge a complaint with the relevant data protection authority. We encourage you to contact us first at the details below so we can address your concerns.</p>

        <h2>Security</h2>
        <p>We implement reasonable technical and organisational measures to protect your data against unauthorised access, alteration, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>

        <h2>International Data Transfers</h2>
        <p>Your information may be processed by third-party providers located outside India. Where this occurs, we take reasonable steps to ensure appropriate safeguards are in place.</p>
        <div className="p-4 my-4 rounded-xl bg-amber-50 border border-amber-200 not-prose">
          <p className="text-xs font-semibold text-amber-800">[TO BE COMPLETED BY BUSINESS OWNER / LEGAL COUNSEL]</p>
          <p className="text-xs text-amber-700 mt-1">List countries of transfer, transfer mechanisms, and safeguards relied upon.</p>
        </div>

        <h2>Governing Law</h2>
        <p>This Privacy Policy is governed by the laws of India. Any disputes arising from it shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. We encourage you to review this policy periodically.</p>

        <h2>Contact Us</h2>
        <p>For any questions about this Privacy Policy, or to exercise your rights, contact us at:</p>
        <p>
          Email: info@lookalikesolutions.com<br />
          Phone: +91-9731588244
        </p>
        <div className="p-4 my-4 rounded-xl bg-amber-50 border border-amber-200 not-prose">
          <p className="text-xs font-semibold text-amber-800">[TO BE COMPLETED BY BUSINESS OWNER / LEGAL COUNSEL]</p>
          <p className="text-xs text-amber-700 mt-1">Add designated privacy / grievance officer name and dedicated contact email.</p>
        </div>
      </ScrollReveal>
    </div>
  );
}