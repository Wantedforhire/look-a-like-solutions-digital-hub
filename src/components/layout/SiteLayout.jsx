import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import NewsletterStrip from "./NewsletterStrip";

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-ink text-pearl font-body">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <NewsletterStrip />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}