export default function EyebrowLabel({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-indigo-accent ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-accent" />
      {children}
    </span>
  );
}