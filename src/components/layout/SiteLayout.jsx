import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import NewsletterStrip from "./NewsletterStrip";
import SchemaMarkup, { organizationSchema } from "@/components/seo/SchemaMarkup";

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-ink text-pearl font-body">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-slate-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <SchemaMarkup schema={organizationSchema()} id="schema-org" />
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <NewsletterStrip />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}