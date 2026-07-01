import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919731588244"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 min-w-[44px] min-h-[44px] rounded-full bg-emerald-accent text-white shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:scale-110 transition-transform duration-300"
    >
      <MessageCircle className="w-7 h-7" fill="currentColor" />
    </a>
  );
}