import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "lals_consent_v1";
const ConsentContext = createContext(null);

export function useConsent() {
  return useContext(ConsentContext);
}

function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

function setDefaultConsent() {
  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
}

function pushConsentUpdate(c) {
  gtag("consent", "update", {
    ad_storage: c.advertising ? "granted" : "denied",
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_user_data: c.advertising ? "granted" : "denied",
    ad_personalization: c.advertising ? "granted" : "denied",
  });
}

export default function ConsentProvider({ children }) {
  const [consent, setConsent] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    setDefaultConsent();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConsent(parsed);
        pushConsentUpdate(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const save = useCallback((values) => {
    const next = { necessary: true, analytics: false, advertising: false, ...values };
    setConsent(next);
    pushConsentUpdate(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setShowPreferences(false);
  }, []);

  const acceptAll = useCallback(() => save({ analytics: true, advertising: true }), [save]);
  const rejectAll = useCallback(() => save({ analytics: false, advertising: false }), [save]);
  const openPreferences = useCallback(() => setShowPreferences(true), []);
  const closePreferences = useCallback(() => setShowPreferences(false), []);

  return (
    <ConsentContext.Provider
      value={{ consent, showPreferences, save, acceptAll, rejectAll, openPreferences, closePreferences }}
    >
      {children}
    </ConsentContext.Provider>
  );
}