import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
      {items.map((item, i) => (
        <details key={item.q} className="group" {...(i === 0 ? { open: true } : {})}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-heading text-base font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="size-4 shrink-0 text-ink-soft transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-5 text-sm text-ink-soft">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
