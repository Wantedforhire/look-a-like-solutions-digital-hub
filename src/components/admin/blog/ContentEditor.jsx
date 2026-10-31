import { useEffect, useState } from "react";
import Wysiwyg from "@/components/admin/Wysiwyg";
import { Table2 } from "lucide-react";

const TABLE_SNIPPET = `<table>
  <thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead>
  <tbody>
    <tr><td>Example</td><td>—</td><td>—</td></tr>
  </tbody>
</table>`;

export default function ContentEditor({ value, onChange }) {
  const [mode, setMode] = useState("visual");

  // Tables are HTML-only, so open in HTML mode when the saved post contains one.
  useEffect(() => {
    if (/<table/i.test(value || "")) setMode("html");
  }, [value]);

  const insertTable = () => onChange(`${value || ""}\n${TABLE_SNIPPET}\n`);

  return (
    <div className="glass-cell rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold text-slate-600">Content</label>
        <div className="flex items-center gap-2">
          {mode === "html" && (
            <button
              type="button"
              onClick={insertTable}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50"
            >
              <Table2 className="w-3.5 h-3.5" /> Insert table
            </button>
          )}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {["visual", "html"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  mode === m ? "bg-indigo-accent text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {m === "html" ? "HTML" : "Visual"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === "visual" ? (
        <Wysiwyg value={value} onChange={onChange} />
      ) : (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={22}
          spellCheck={false}
          placeholder="<h2>Section heading</h2>&#10;<p>Paragraph text…</p>"
          className="w-full px-3.5 py-3 rounded-lg border border-slate-300 font-mono text-xs text-slate-800 focus:border-indigo-accent focus:ring-2 focus:ring-indigo-accent/20 outline-none bg-slate-50"
        />
      )}
      <p className="text-[11px] text-slate-400 mt-2">
        Switch to HTML to add tables or image alt attributes. Images added in the visual editor should be given alt text here.
      </p>
    </div>
  );
}