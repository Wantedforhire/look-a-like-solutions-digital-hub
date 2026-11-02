import { Sparkles, Building2, FileText, Lightbulb, BookOpen } from "lucide-react";

const GROUP_ICONS = {
  Services: Sparkles,
  Industries: Building2,
  "Blog Posts": FileText,
  "Marketing Insights": Lightbulb,
  Resources: BookOpen,
};

const GROUP_TONES = {
  Services: "text-indigo-accent",
  Industries: "text-slate-400",
  "Blog Posts": "text-emerald-accent",
  "Marketing Insights": "text-indigo-accent",
  Resources: "text-slate-400",
};

/**
 * Shared suggestion list used by both the desktop dropdown and the
 * mobile in-menu panel. Items are buttons (not links) so pointer selection
 * and keyboard selection share one code path.
 */
export default function SearchSuggestions({ groups, active = -1, onSelect, onActive }) {
  return (
    <div>
      {groups.map((group) => {
        const Icon = GROUP_ICONS[group.group] || FileText;
        return (
          <div key={group.group} className="mb-1 last:mb-0">
            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.group}
            </p>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={item.index === active}
                onClick={() => onSelect(item)}
                onMouseEnter={() => onActive?.(item.index)}
                className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  item.index === active ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${GROUP_TONES[group.group] || "text-slate-400"}`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-slate-900 truncate">{item.title}</span>
                  {item.description && (
                    <span className="block text-xs text-slate-500 truncate">{item.description}</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}