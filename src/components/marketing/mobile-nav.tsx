"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";

const NAV_LINKS = [
  { href: "/ergasies", label: "Υπηρεσίες" },
  { href: "/portfolio", label: "Έργα" },
  { href: "/about", label: "Ποιοι είμαστε" },
  { href: "/epikoinonia", label: "Επικοινωνία" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Άνοιγμα μενού"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="bg-paper w-72">
        <SheetHeader>
          <SheetTitle className="font-heading text-left">
            {siteConfig.shortName}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-base font-medium text-ink-soft hover:bg-paper-warm hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
