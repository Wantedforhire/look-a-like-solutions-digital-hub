import { Link } from "react-router-dom";

/**
 * Reusable privacy notice + optional marketing opt-in checkbox for lead forms.
 * The checkbox is unchecked by default and must not be pre-ticked.
 * Submitting an enquiry does not imply marketing consent.
 */
export default function ConsentFields({ marketingConsent = false, onMarketingChange }) {
  return (
    <div className="space-y-3">
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => onMarketingChange?.(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-indigo-accent shrink-0"
        />
        <span className="text-xs text-slate-500 leading-relaxed">
          Yes, I would like to receive marketing insights and offers. I can unsubscribe at any time.
        </span>
      </label>
      <p className="text-xs text-slate-400 leading-relaxed">
        We use the information you provide to respond to your enquiry and prepare the requested audit or proposal. See our{" "}
        <Link to="/privacy-policy" className="text-indigo-accent hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}