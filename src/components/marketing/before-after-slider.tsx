"use client";

import { useCallback, useRef, useState } from "react";
import { GripVertical, Home, Sparkles } from "lucide-react";

// "before"/"after" icons are fixed (not passed in) — passing a component
// reference as a prop from a Server Component parent isn't serializable
// across the RSC boundary, so the icon choice lives entirely in this
// client module instead.
type PanelInput = { tone: string; label: string };

export function BeforeAfterSlider({
  before,
  after,
}: {
  before: PanelInput;
  after: PanelInput;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-16/10 w-full touch-none overflow-hidden rounded-2xl select-none sm:aspect-2/1"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      {/* Before (full width, base layer) */}
      <Panel {...before} icon={Home} />

      {/* After (revealed up to slider position via clip-path, not scaled) */}
      <div
        className="absolute inset-0 h-full"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Panel {...after} icon={Sparkles} />
      </div>

      {/* Labels */}
      <span className="absolute top-4 left-4 rounded-full bg-ink/50 px-3 py-1 text-xs font-semibold tracking-wide text-paper uppercase backdrop-blur-sm">
        Πριν
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-brand/80 px-3 py-1 text-xs font-semibold tracking-wide text-brand-foreground uppercase backdrop-blur-sm">
        Μετά
      </span>

      {/* Handle */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-paper"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-lg">
          <GripVertical className="size-5" />
        </div>
      </div>
    </div>
  );
}

function Panel({
  tone,
  label,
  icon: Icon,
}: PanelInput & { icon: typeof Home }) {
  return (
    <div className={`relative h-full w-full bg-gradient-to-br ${tone}`}>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_18px)]" />
      <Icon className="absolute right-6 bottom-6 size-14 text-paper/20 sm:size-20" />
      <span className="absolute bottom-6 left-6 max-w-[70%] text-xs font-medium tracking-wide text-paper/70 uppercase">
        [PLACEHOLDER] {label}
      </span>
    </div>
  );
}
