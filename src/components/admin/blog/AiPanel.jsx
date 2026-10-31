import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import {
  Sparkles, Loader2, ListTree, FileText, Gauge, Search, HelpCircle,
  Link2, Type, ImagePlus, Check, Wand2,
} from "lucide-react";

const ACTIONS = [
  { key: "topics", label: "Topic ideas", icon: Sparkles },
  { key: "outline", label: "Article outline", icon: ListTree },
  { key: "draft", label: "Write draft article", icon: FileText },
  { key: "readability", label: "Improve readability", icon: Gauge },
  { key: "seo", label: "SEO title & description", icon: Search },
  { key: "faqs", label: "FAQ suggestions", icon: HelpCircle },
  { key: "internalLinks", label: "Internal link ideas", icon: Link2 },
  { key: "altText", label: "Image alt text", icon: Type },
  { key: "image", label: "Generate featured image", icon: ImagePlus },
];

export default function AiPanel({ form, onApply }) {
  const { toast } = useToast();
  const [running, setRunning] = useState(null);
  const [result, setResult] = useState(null);

  const run = async (action) => {
    setRunning(action);
    setResult(null);
    try {
      const payload = {
        action,
        title: form.title,
        content: form.content,
        keyword: form.focusKeyword,
      };
      if (action === "image") {
        payload.prompt = `Editorial hero image for a blog article titled "${form.title || "digital marketing insights"}"`;
      }
      const res = await base44.functions.invoke("blogAI", payload);
      setResult({ action, data: res.data.result, imageUrl: res.data.imageUrl });
    } catch (e) {
      toast({ title: e.response?.data?.error || "AI request failed", variant: "destructive" });
    } finally {
      setRunning(null);
    }
  };

  const apply = (patch, ai = true) => {
    onApply(patch, ai);
    toast({ title: "Applied to your draft", description: "Review and edit it before publishing." });
  };

  return (
    <div className="glass-cell rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <Wand2 className="w-4 h-4 text-indigo-accent" />
        <p className="text-sm font-bold text-slate-900">AI Assistant</p>
      </div>
      <p className="text-[11px] text-slate-400 mb-3">Suggestions are editable and need administrator approval before publishing.</p>

      <div className="grid grid-cols-2 gap-1.5">
        {ACTIONS.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => run(a.key)}
            disabled={!!running}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:border-indigo-accent hover:text-indigo-accent disabled:opacity-50 text-left"
          >
            {running === a.key ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <a.icon className="w-3.5 h-3.5 shrink-0" />}
            {a.label}
          </button>
        ))}
      </div>

      {result && <ResultBlock result={result} onApply={apply} />}
    </div>
  );
}

function ResultBlock({ result, onApply }) {
  const { action, data, imageUrl } = result;

  const Box = ({ children }) => (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2 max-h-80 overflow-y-auto">{children}</div>
  );

  const ApplyButton = ({ onClick, label = "Apply" }) => (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-accent text-white text-[11px] font-semibold hover:bg-indigo-500"
    >
      <Check className="w-3 h-3" /> {label}
    </button>
  );

  if (action === "topics") {
    return (
      <Box>
        {data.topics?.map((t, i) => (
          <div key={i} className="border-b border-slate-200 last:border-0 pb-2">
            <p className="text-xs font-semibold text-slate-800">{t.title}</p>
            <p className="text-[11px] text-slate-500 mb-1">{t.angle}</p>
            <ApplyButton label="Use title" onClick={() => onApply({ title: t.title, slug: "", focusKeyword: t.keyword || "" })} />
          </div>
        ))}
      </Box>
    );
  }

  if (action === "outline") {
    const html = (data.outline || [])
      .map((o) => `<${o.level === "H3" ? "h3" : "h2"}>${o.heading}</${o.level === "H3" ? "h3" : "h2"}>` + (o.points?.length ? `<ul>${o.points.map((p) => `<li>${p}</li>`).join("")}</ul>` : ""))
      .join("");
    return (
      <Box>
        <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
          {data.outline?.map((o, i) => <li key={i}><span className="font-semibold">{o.heading}</span></li>)}
        </ul>
        <ApplyButton label="Insert outline" onClick={() => onApply({ content: html, metaDescription: data.metaDescription || "" })} />
      </Box>
    );
  }

  if (action === "draft") {
    return (
      <Box>
        <p className="text-xs font-semibold text-slate-800">{data.title}</p>
        <p className="text-[11px] text-slate-500">{data.excerpt}</p>
        <ApplyButton label="Use draft" onClick={() => onApply({
          title: data.title, excerpt: data.excerpt, content: data.content,
          metaTitle: data.metaTitle, metaDescription: data.metaDescription,
        })} />
      </Box>
    );
  }

  if (action === "readability") {
    return (
      <Box>
        <p className="text-[11px] text-slate-500">Rewritten content is ready. Applying replaces the current article body.</p>
        <ApplyButton label="Replace content" onClick={() => onApply({ content: data.content })} />
      </Box>
    );
  }

  if (action === "seo") {
    return (
      <Box>
        <p className="text-[11px] text-slate-500">Title: <span className="text-slate-800">{data.metaTitle}</span></p>
        <p className="text-[11px] text-slate-500">Description: <span className="text-slate-800">{data.metaDescription}</span></p>
        <p className="text-[11px] text-slate-500">Focus: <span className="text-slate-800">{data.focusKeyword}</span></p>
        <ApplyButton label="Apply SEO" onClick={() => onApply({
          metaTitle: data.metaTitle, metaDescription: data.metaDescription,
          focusKeyword: data.focusKeyword, secondaryKeywords: data.secondaryKeywords,
        }, false)} />
      </Box>
    );
  }

  if (action === "faqs") {
    const html = `<h2>Frequently asked questions</h2>` + (data.faqs || []).map((f) => `<h3>${f.question}</h3><p>${f.answer}</p>`).join("");
    return (
      <Box>
        {data.faqs?.map((f, i) => (
          <div key={i} className="border-b border-slate-200 last:border-0 pb-2">
            <p className="text-xs font-semibold text-slate-800">{f.question}</p>
            <p className="text-[11px] text-slate-500">{f.answer}</p>
          </div>
        ))}
        <ApplyButton label="Append FAQs" onClick={() => onApply({ content: html }, false)} />
      </Box>
    );
  }

  if (action === "internalLinks") {
    return (
      <Box>
        {data.links?.map((l, i) => (
          <div key={i} className="border-b border-slate-200 last:border-0 pb-2">
            <p className="text-xs font-semibold text-slate-800">{l.anchor}</p>
            <p className="text-[11px] text-slate-400">{l.url}</p>
            <p className="text-[11px] text-slate-500">{l.reason}</p>
          </div>
        ))}
        <ApplyButton
          label="Insert as link list"
          onClick={() => onApply({
            content: `<h2>Related reading</h2><ul>${(data.links || []).map((l) => `<li><a href="${l.url}">${l.anchor}</a></li>`).join("")}</ul>`,
          }, false)}
        />
      </Box>
    );
  }

  if (action === "altText") {
    return (
      <Box>
        <p className="text-[11px] text-slate-600">{data.alt}</p>
        <p className="text-[11px] text-slate-400 italic">Image prompt: {data.imagePrompt}</p>
        <ApplyButton label="Use alt text" onClick={() => onApply({ coverImageAlt: data.alt }, false)} />
      </Box>
    );
  }

  if (action === "image") {
    return (
      <Box>
        {imageUrl && <img src={imageUrl} alt="Generated preview" className="w-full rounded-lg" />}
        <ApplyButton label="Use as featured image" onClick={() => onApply({ coverImage: imageUrl })} />
      </Box>
    );
  }

  return null;
}