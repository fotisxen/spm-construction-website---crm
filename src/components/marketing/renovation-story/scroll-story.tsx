"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { STORY_STAGES } from "@/components/marketing/renovation-story/story-content";

const RenovationScene = dynamic(
  () =>
    import("@/components/marketing/renovation-story/renovation-scene").then(
      (m) => m.RenovationScene
    ),
  { ssr: false }
);

export function ScrollStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      raf = requestAnimationFrame(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? (0 - rect.top) / total : 0;
        const clamped = Math.min(1, Math.max(0, p));
        progressRef.current = clamped;
        setStage(clamped < 0.34 ? 0 : clamped < 0.7 ? 1 : 2);
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const current = STORY_STAGES[stage];

  return (
    <div ref={wrapperRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-paper-warm">
        <RenovationScene progressRef={progressRef} />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-ink/10" />

        <div className="relative flex h-full flex-col justify-end px-6 pb-24 sm:px-10 lg:px-16">
          <div key={stage} className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
            <span className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-xs font-semibold tracking-wide text-brand-foreground uppercase">
              {current.eyebrow}
            </span>
            <h2 className="mt-4 font-heading text-3xl leading-tight font-semibold text-paper sm:text-4xl">
              {current.title}
            </h2>
            <p className="mt-3 max-w-md text-paper/85">{current.body}</p>
          </div>

          <div className="mt-10 flex gap-2">
            {STORY_STAGES.map((s, i) => (
              <div
                key={s.eyebrow}
                className={`h-1 flex-1 max-w-16 rounded-full transition-colors ${
                  i === stage ? "bg-brand" : "bg-paper/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute top-6 right-6 hidden text-xs font-medium tracking-widest text-paper/70 uppercase sm:block">
          Κύλισε για να δεις την πορεία
        </div>
      </div>
    </div>
  );
}
