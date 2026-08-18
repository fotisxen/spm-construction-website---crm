import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicProject } from "@/lib/data/placeholder-portfolio";

const SCOPE_LABEL: Record<PublicProject["scope_size"], string> = {
  full: "Πλήρης ανακαίνιση",
  partial: "Μερική ανακαίνιση",
};

export function PortfolioCard({ project }: { project: PublicProject }) {
  return (
    <Link
      href={`/portfolio/${project.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper transition-shadow hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-paper-warm">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,color-mix(in_oklch,var(--ink)_6%,transparent)_0px,color-mix(in_oklch,var(--ink)_6%,transparent)_2px,transparent_2px,transparent_14px)]" />
        <span className="relative text-xs font-medium tracking-wide text-ink-soft uppercase">
          {project.cover_image_url ? "" : "Εικόνα έργου"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          {SCOPE_LABEL[project.scope_size]}
        </span>
        <h3 className="font-heading text-lg leading-snug font-semibold text-ink">
          {project.title}
        </h3>
        {project.public_summary && (
          <p className="line-clamp-2 text-sm text-ink-soft">
            {project.public_summary}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-brand">
          Δες το έργο
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
