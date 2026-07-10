import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { sendFormNotificationEmail } from "@/lib/notifyEmail";
import { Send, Check } from "lucide-react";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await base44.entities.NewsletterSubscriber.create({
        email: email.trim(),
        subscribedAt: new Date().toISOString(),
      });
      sendFormNotificationEmail(
        "New Newsletter Subscriber",
        `<h3>New Newsletter Subscriber</h3><p><b>Email:</b> ${email.trim()}</p>`
      );
      setDone(true);
      setEmail("");
    } catch {
      // already subscribed or error — still show success to avoid leaking
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-indigo-accent">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Get Marketing Insights Delivered
        </h3>
        <p className="text-indigo-100 text-sm mt-2 mb-6">
          Join 500+ Bengaluru business owners getting actionable growth tips every week. No fluff.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 text-white text-sm font-semibold">
            <Check className="w-4 h-4" /> You're subscribed! Check your inbox.
          </div>
        ) : (
          <form onSubmit={subscribe} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-5 py-3 rounded-full text-sm text-slate-900 bg-white outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? "Subscribing..." : "Subscribe"} <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}