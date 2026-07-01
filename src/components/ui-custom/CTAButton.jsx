import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function CTAButton({ to, href, children, variant = "primary", className = "", onClick }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-full font-semibold text-sm transition-all duration-300 focus-visible:outline-none";
  const variants = {
    primary: "bg-indigo-accent text-white hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]",
    secondary: "bg-transparent border border-white/20 text-pearl hover:border-indigo-accent hover:bg-white/5",
    emerald: "bg-emerald-accent text-white hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
        {children}
        <ArrowUpRight className="w-4 h-4" />
      </a>
    );
  }
  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
      <ArrowUpRight className="w-4 h-4" />
    </button>
  );
}