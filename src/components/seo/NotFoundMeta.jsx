import { useEffect } from "react";

/**
 * Tells crawlers this URL is a real 404, not a soft-404.
 * Must only be rendered once loading has finished.
 */
export default function NotFoundMeta() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "prerender-status-code";
    meta.content = "404";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
  return null;
}