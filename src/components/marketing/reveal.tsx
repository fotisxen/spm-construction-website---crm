"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "zoom-in";

const VARIANT_CLASSES: Record<Variant, { hidden: string; visible: string }> = {
  "fade-up": { hidden: "opacity-0 translate-y-8", visible: "opacity-100 translate-y-0" },
  "fade-in": { hidden: "opacity-0", visible: "opacity-100" },
  "slide-left": { hidden: "opacity-0 -translate-x-10", visible: "opacity-100 translate-x-0" },
  "slide-right": { hidden: "opacity-0 translate-x-10", visible: "opacity-100 translate-x-0" },
  "zoom-in": { hidden: "opacity-0 scale-90", visible: "opacity-100 scale-100" },
};

// One-time scroll-triggered entrance animation. Disconnects after firing
// once — this is an entrance effect, not a repeating scroll gimmick.
export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = VARIANT_CLASSES[variant];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${visible ? classes.visible : classes.hidden} ${className}`}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
