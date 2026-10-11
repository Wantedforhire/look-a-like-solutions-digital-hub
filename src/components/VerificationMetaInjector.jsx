import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { parseVerificationValue } from "@/lib/parseVerification";

/**
 * Injects search-engine verification meta tags (Bing Webmaster Tools,
 * Google Search Console) into the document head from saved SiteConfig.
 * Only emits a tag when a verification value is saved.
 */
export default function VerificationMetaInjector() {
  const { data: config } = useQuery({
    queryKey: ["site-config", "verification"],
    queryFn: () => base44.entities.SiteConfig.filter({ configKey: "main" }),
    staleTime: 300000,
  });

  const bing = parseVerificationValue(config?.[0]?.bingVerification || "");
  const gsc = parseVerificationValue(config?.[0]?.gscVerification || "");

  useEffect(() => {
    if (bing) {
      let el = document.head.querySelector('meta[name="msvalidate.01"]');
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "msvalidate.01");
        document.head.appendChild(el);
      }
      el.setAttribute("content", bing);
    }
    if (gsc) {
      let el = document.head.querySelector('meta[name="google-site-verification"]');
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "google-site-verification");
        document.head.appendChild(el);
      }
      el.setAttribute("content", gsc);
    }
  }, [bing, gsc]);

  return null;
}