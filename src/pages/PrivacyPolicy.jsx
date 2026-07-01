import MetaTags from "@/components/seo/MetaTags";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

export default function PrivacyPolicy() {
  return (
    <div className="pt-40 pb-24 px-6 bg-ink">
      <MetaTags title="Privacy Policy" description="Privacy Policy for Look A Like Solutions — how we collect, use, and protect your information." path="/privacy-policy" />
      <ScrollReveal className="max-w-3xl mx-auto prose prose-invert prose-p:text-slate-sub prose-headings:text-pearl">
        <h1>Privacy Policy</h1>
        <p>Last updated: July 2026</p>
        <p>Look A Like Solutions ("we", "our", "us") respects your privacy and is committed to protecting the personal information you share with us through this website.</p>

        <h2>Information We Collect</h2>
        <p>We collect information you voluntarily provide via our contact and audit request forms, including name, email, phone number, company, website, service interest, and project details.</p>

        <h2>How We Use Your Information</h2>
        <p>We use the information you provide to respond to enquiries, prepare proposals, deliver requested audits, and — where you've consented — send relevant marketing communications.</p>

        <h2>Data Sharing</h2>
        <p>We do not sell or rent your personal information. We may share data with trusted service providers strictly for the purpose of delivering our services.</p>

        <h2>Cookies</h2>
        <p>Our website may use cookies to improve user experience and analyze traffic. You can control cookie preferences through your browser settings.</p>

        <h2>Data Security</h2>
        <p>We implement reasonable technical and organizational measures to protect your data against unauthorized access, alteration, or disclosure.</p>

        <h2>Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at info@lookalikesolutions.com.</p>

        <h2>Contact Us</h2>
        <p>For any questions about this Privacy Policy, contact us at info@lookalikesolutions.com or +91-9731588244.</p>
      </ScrollReveal>
    </div>
  );
}