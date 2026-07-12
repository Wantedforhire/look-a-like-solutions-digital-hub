import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export const GTM_FALLBACK_ID = "GTM-KKCKP3M6";
const GTM_PATTERN = /^GTM-[A-Z0-9]{6,}$/;

export default function GtmInjector() {
  const { data: config } = useQuery({
    queryKey: ["site-config", "gtm"],
    queryFn: () => base44.entities.SiteConfig.filter({ configKey: "main" }),
    staleTime: 300000,
  });

  const storedId = config?.[0]?.gtmContainerId;
  // Fall back to the hardcoded container ID so the tag fires immediately,
  // even before SiteConfig is fetched or populated.
  const gtmId = storedId && GTM_PATTERN.test(storedId) ? storedId : GTM_FALLBACK_ID;

  useEffect(() => {
    if (!GTM_PATTERN.test(gtmId)) return;
    const scriptId = "gtm-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(script);

    const noscript = document.createElement("noscript");
    noscript.id = "gtm-noscript";
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
  }, [gtmId]);

  return null;
}