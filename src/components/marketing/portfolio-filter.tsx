"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/marketing/portfolio-card";
import { Reveal } from "@/components/marketing/reveal";
import type { PublicProject } from "@/lib/data/placeholder-portfolio";

const FILTERS = [
  { value: "all", label: "Όλα" },
  { value: "completed", label: "Ολοκληρωμένα" },
  { value: "in_progress", label: "Σε εξέλιξη" },
] as const;

export function PortfolioFilter({ projects }: { projects: PublicProject[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");

  const visible =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-ink text-paper"
                : "bg-paper-warm text-ink-soft hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 text-sm text-ink-soft">
          Δεν υπάρχουν έργα σε αυτή την κατηγορία αυτή τη στιγμή.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <Reveal key={project.id} variant="fade-up" delay={(i % 6) * 80}>
              <PortfolioCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
