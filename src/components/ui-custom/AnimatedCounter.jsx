import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function AnimatedCounter({ value, suffix = "", duration = 1.6, className = "", fallback }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);
  const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
  const useFallback = (value === 0 || value === undefined || value === null || isNaN(numericValue)) && fallback;

  useEffect(() => {
    if (!isInView) return;
    let start = null;
    let raf;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setDisplay(Math.floor(progress * numericValue));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, numericValue, duration]);

  if (useFallback) {
    return <span className={className}>{fallback}{suffix}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}