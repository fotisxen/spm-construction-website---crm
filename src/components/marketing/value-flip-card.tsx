"use client";

import { useState } from "react";
import { Award, Clock, Gem, RotateCw, Target } from "lucide-react";

// Icon components can't cross the Server -> Client Component boundary as
// props (they're functions, not serializable), so the parent passes a key
// and the mapping lives entirely in this client module.
const ICONS = { target: Target, gem: Gem, clock: Clock, award: Award } as const;

export function ValueFlipCard({
  icon,
  title,
  body,
}: {
  icon: keyof typeof ICONS;
  title: string;
  body: string;
}) {
  const Icon = ICONS[icon];
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className="group h-44 w-full cursor-pointer text-left [perspective:1000px]"
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-ink/10 bg-paper p-6 [backface-visibility:hidden]">
          <div className="flex items-start justify-between">
            <div className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Icon className="size-5" />
            </div>
            <RotateCw className="size-4 text-ink-soft/40 transition-opacity group-hover:opacity-100 sm:opacity-0" />
          </div>
          <h3 className="font-heading text-base font-semibold text-ink">{title}</h3>
        </div>
        {/* Back */}
        <div className="absolute inset-0 flex items-center rounded-2xl border border-brand/20 bg-brand-soft p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm text-ink">{body}</p>
        </div>
      </div>
    </button>
  );
}
