import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const SITE_URL = "https://www.lookalikesolutions.com";

export function setMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function MetaTags({ title, description, path = "/", image, noindex }) {
  const { data: pageMetas } = useQuery({
    queryKey: ["page-meta", path],
    queryFn: () => base44.entities.PageMeta.filter({ path }),
    staleTime: 300000,
    enabled: !!path,
  });
  const override = pageMetas?.[0];
  const finalTitle = override?.metaTitle || title;
  const finalDescription = override?.metaDescription || description;

  useEffect(() => {
    const fullTitle = finalTitle ? `${finalTitle} | Look A Like Solutions` : "Look A Like Solutions | Digital Marketing Agency in Bangalore";
    document.title = fullTitle;
    setMeta("description", finalDescription);
    setMeta("robots", noindex ? "noindex,nofollow" : "index,follow");
    setLink("canonical", `${SITE_URL}${path}`);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", finalDescription, "property");
    setMeta("og:site_name", "Look A Like Solutions", "property");
    setMeta("og:url", `${SITE_URL}${path}`, "property");
    setMeta("og:type", "website", "property");
    if (image) setMeta("og:image", image, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", finalDescription);
    if (image) setMeta("twitter:image", image);
  }, [finalTitle, finalDescription, path, image, noindex]);

  return null;
}