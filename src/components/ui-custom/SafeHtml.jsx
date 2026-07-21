import DOMPurify from "dompurify";

export default function SafeHtml({ html, className = "" }) {
  const clean = html ? DOMPurify.sanitize(html) : "";
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}