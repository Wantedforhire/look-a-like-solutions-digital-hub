import { Link } from "react-router-dom";
import MetaTags from "@/components/seo/MetaTags";
import SchemaMarkup, { breadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

export default function CookiePolicy() {
  return (
    <div className="pt-40 pb-24 px-6 bg-ink">
      <MetaTags
        title="Cookie Policy"
        description="How Look A Like Solutions uses cookies and similar technologies, the categories we use, and how to manage your consent preferences."
        path="/cookie-policy"
      />
      <SchemaMarkup schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Cookie Policy", path: "/cookie-policy" }])} id="schema-breadcrumb" />
      <ScrollReveal className="max-w-3xl mx-auto prose prose-slate prose-p:text-slate-600 prose-headings:text-slate-900">
        <h1>Cookie Policy</h1>
        <p>Last updated: October 2026</p>
        <p>This Cookie Policy explains how Look A Like Solutions ("we", "our", "us") uses cookies and similar technologies on our website (https://lookalikesolutions.com). It works alongside our <Link to="/privacy-policy">Privacy Policy</Link>.</p>

        <h2>What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help the site function, remember your preferences, and analyse how the site is used.</p>

        <h2>Cookie Categories</h2>
        <p>We group cookies into three categories:</p>
        <ul>
          <li><strong>Necessary</strong> — required for the website to function. These cannot be disabled.</li>
          <li><strong>Analytics</strong> — help us understand how visitors use the site so we can improve it. These are only loaded with your consent.</li>
          <li><strong>Advertising</strong> — used to measure campaign performance and show relevant ads. These are only loaded with your consent.</li>
        </ul>

        <h2>Cookies We Use</h2>
        <h3>Necessary Cookies</h3>
        <p>These enable core functionality such as security, page navigation, and your cookie consent choice. They are always active.</p>

        <h3>Analytics Cookies</h3>
        <p>When you grant analytics consent, the following may be loaded:</p>
        <ul>
          <li><strong>Google Analytics 4 (GA4)</strong> — analyses website traffic and visitor behaviour.</li>
          <li><strong>Google Tag Manager (GTM)</strong> — manages the deployment of tracking tags.</li>
        </ul>

        <h3>Advertising Cookies</h3>
        <p>When you grant advertising consent, the following may be loaded:</p>
        <ul>
          <li><strong>Google Ads tags</strong> — track conversions from Google Ads campaigns.</li>
          <li><strong>Meta (Facebook) Pixel</strong> — measures ad campaign performance on Meta platforms.</li>
        </ul>

        <h2>Google Consent Mode v2</h2>
        <p>We use Google Consent Mode v2. Before you make a choice, all analytics and advertising storage signals are set to "denied". When you grant consent, the relevant signals are updated to "granted" and the corresponding tags begin to load.</p>

        <h2>Managing Your Preferences</h2>
        <p>You can change your cookie preferences at any time by clicking "Cookie Preferences" in the footer of any page. You can also clear cookies through your browser settings, but this may affect site functionality.</p>

        <h2>Third-Party Cookies</h2>
        <p>Some cookies are set by third parties (such as Google and Meta) when you interact with their services. These providers have their own cookie and privacy policies over which we have no control.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Cookie Policy from time to time. We encourage you to review it periodically.</p>

        <h2>Contact Us</h2>
        <p>For questions about this Cookie Policy, contact us at info@lookalikesolutions.com or +91-9731588244.</p>
      </ScrollReveal>
    </div>
  );
}