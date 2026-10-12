import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useConsent } from "@/components/ConsentProvider";
import { Cookie, X, ShieldCheck } from "lucide-react";

export default function CookieConsentBanner() {
  const { consent, showPreferences, acceptAll, rejectAll, save, openPreferences, closePreferences } = useConsent();
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  // Sync checkbox state whenever the preferences modal opens.
  useEffect(() => {
    if (showPreferences) {
      setAnalytics(consent?.analytics ?? false);
      setAdvertising(consent?.advertising ?? false);
    }
  }, [showPreferences, consent]);

  if (showPreferences) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true" aria-label="Cookie preferences">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <Cookie className="w-6 h-6 text-indigo-accent" aria-hidden="true" />
              <h2 className="text-lg font-bold text-slate-900">Cookie Preferences</h2>
            </div>
            <button onClick={closePreferences} aria-label="Close" className="text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-accent shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Necessary</p>
                <p className="text-xs text-slate-500 mt-0.5">Required for the site to function. Always on.</p>
              </div>
              <span className="ml-auto text-xs font-semibold text-emerald-accent">On</span>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-0.5 w-4 h-4 accent-indigo-accent" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Analytics</p>
                <p className="text-xs text-slate-500 mt-0.5">Google Analytics and Tag Manager to understand how visitors use the site.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input type="checkbox" checked={advertising} onChange={(e) => setAdvertising(e.target.checked)} className="mt-0.5 w-4 h-4 accent-indigo-accent" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Advertising</p>
                <p className="text-xs text-slate-500 mt-0.5">Google Ads and Meta Pixel to measure campaign performance and show relevant ads.</p>
              </div>
            </label>
          </div>

          <Link to="/cookie-policy" onClick={closePreferences} className="block text-xs text-indigo-accent hover:underline mb-5 text-center">
            Read our Cookie Policy
          </Link>

          <button
            onClick={() => save({ analytics, advertising })}
            className="w-full px-6 py-3 rounded-full bg-indigo-accent text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    );
  }

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[99] p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-indigo-accent shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm text-slate-700 leading-relaxed">
                We use cookies to improve your experience and analyse traffic. You can accept all, reject non-essential, or manage your preferences.
                <Link to="/cookie-policy" className="text-indigo-accent hover:underline ml-1">Cookie Policy</Link>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={rejectAll}
              className="px-4 py-2.5 rounded-full text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-indigo-accent hover:bg-indigo-500 transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={openPreferences}
              className="px-4 py-2.5 rounded-full text-sm font-semibold text-indigo-accent border border-indigo-accent/30 hover:bg-indigo-50 transition-colors"
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}