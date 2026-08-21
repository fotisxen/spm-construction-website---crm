"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChefHat,
  Droplet,
  Home,
  Layers,
  Paintbrush,
  PenTool,
  Ruler,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/marketing/container";
import { siteConfig } from "@/lib/site-config";

const BLUEPRINT_GRID =
  "bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:34px_34px]";

// Placeholder slides until real project photography exists — each is a
// distinct composed graphic (layered icons, blueprint grid, geometric
// accents) rather than a single centered icon, so it reads as designed
// artwork and is easy to swap for a real photo per slide later.
function DiagonalSplitSlide({ tone }: { tone: string }) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${tone}`}>
      <div className={`absolute inset-0 ${BLUEPRINT_GRID}`} />
      <div
        className="absolute inset-0 bg-paper/[0.06]"
        style={{ clipPath: "polygon(0 100%, 45% 100%, 75% 0, 0 0)" }}
      />
      <div className="absolute top-10 left-10 flex gap-4 opacity-25">
        <Ruler className="size-8 -rotate-12" />
        <PenTool className="size-6 rotate-6" />
      </div>
      <Home className="absolute right-10 bottom-10 size-16 text-paper/15 sm:size-24" />
      <div className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/10 sm:size-64" />
    </div>
  );
}

function IconMosaicSlide({ tone }: { tone: string }) {
  const scattered = [
    { Icon: Wrench, className: "top-[18%] left-[12%] size-7 -rotate-12 opacity-20" },
    { Icon: Droplet, className: "top-[30%] left-[70%] size-6 rotate-6 opacity-25" },
    { Icon: ChefHat, className: "top-[65%] left-[20%] size-8 rotate-3 opacity-20" },
    { Icon: Wrench, className: "top-[75%] left-[62%] size-5 rotate-12 opacity-15" },
  ];
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${tone}`}>
      <div className={`absolute inset-0 ${BLUEPRINT_GRID}`} />
      <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_60%_45%,black,transparent_70%)]">
        <div className="absolute inset-0 bg-paper/10" />
      </div>
      {scattered.map(({ Icon, className }, i) => (
        <Icon key={i} className={`absolute text-paper ${className}`} />
      ))}
      <Layers className="absolute right-12 bottom-12 size-16 text-paper/20 sm:size-24" />
    </div>
  );
}

function ConcentricRingsSlide({ tone }: { tone: string }) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${tone}`}>
      <div className={`absolute inset-0 ${BLUEPRINT_GRID}`} />
      <div className="absolute -right-16 -bottom-16 size-72 rounded-full border border-paper/10 sm:size-96" />
      <div className="absolute -right-16 -bottom-16 size-56 rounded-full border border-paper/10 sm:size-72" />
      <div className="absolute -right-16 -bottom-16 size-40 rounded-full border border-paper/15 sm:size-48" />
      <Sparkles className="absolute top-16 left-14 size-6 text-paper/25" />
      <Sparkles className="absolute top-28 left-28 size-4 text-paper/15" />
      <Paintbrush className="absolute right-14 bottom-14 size-16 text-paper/20 sm:size-24" />
    </div>
  );
}

const SLIDES = [
  { Art: DiagonalSplitSlide, tone: "from-ink to-ink/70", label: "Πλήρης ανακαίνιση διαμερίσματος" },
  { Art: IconMosaicSlide, tone: "from-brand to-brand/70", label: "Ανακαίνιση κουζίνας & μπάνιου" },
  { Art: ConcentricRingsSlide, tone: "from-[#3f4a4a] to-[#3f4a4a]/70", label: "Τελικά φινιρίσματα & παράδοση" },
];

const INTERVAL_MS = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.label}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <slide.Art tone={slide.tone} />
          <span className="absolute top-6 right-6 rounded-full bg-ink/40 px-3 py-1 text-[10px] font-medium tracking-wide text-paper/80 uppercase backdrop-blur-sm">
            [PLACEHOLDER] {slide.label}
          </span>
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/40" />

      <Container className="relative flex h-full flex-col justify-end pb-20">
        <span className="inline-flex w-fit items-center rounded-full border border-paper/25 px-3 py-1 text-xs font-medium tracking-wide text-paper/90 uppercase">
          Κατασκευαστική εταιρεία ανακαινίσεων · {siteConfig.areaServed}
        </span>
        <h1 className="mt-6 max-w-3xl font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-paper sm:text-5xl lg:text-6xl">
          Ανακαινίσεις που κρατούν αυτό που υπόσχονται.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-paper/85">
          Αναλαμβάνουμε ολικές και μερικές ανακαινίσεις κατοικιών, με σαφές
          χρονοδιάγραμμα και προϋπολογισμό σε κάθε φάση — από το πρώτο σχέδιο
          μέχρι το τελευταίο χέρι μπογιάς.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/epikoinonia"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground transition-colors hover:opacity-90"
          >
            Ζήτησε προσφορά
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex h-12 items-center justify-center gap-1 rounded-full border border-paper/30 px-7 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
          >
            Δες έργα μας
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </Container>

      {/* Controls */}
      <div className="absolute right-6 bottom-6 z-10 flex items-center gap-3 sm:right-10">
        <button
          type="button"
          aria-label="Προηγούμενη φωτογραφία"
          onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
          className="flex size-9 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:bg-paper/10"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex gap-1.5">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.label}
              type="button"
              aria-label={`Φωτογραφία ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-paper" : "w-1.5 bg-paper/40"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Επόμενη φωτογραφία"
          onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
          className="flex size-9 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:bg-paper/10"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
