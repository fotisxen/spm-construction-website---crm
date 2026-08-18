import Link from "next/link";
import { Container } from "@/components/marketing/container";
import { MobileNav } from "@/components/marketing/mobile-nav";
import { siteConfig } from "@/lib/site-config";

const NAV_LINKS = [
  { href: "/ergasies", label: "Υπηρεσίες" },
  { href: "/portfolio", label: "Έργα" },
  { href: "/about", label: "Ποιοι είμαστε" },
  { href: "/epikoinonia", label: "Επικοινωνία" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <Container className="flex h-18 items-center justify-between py-4">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-ink"
        >
          {siteConfig.shortName}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/epikoinonia"
            className="hidden h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground transition-colors hover:opacity-90 sm:inline-flex"
          >
            Ζήτησε προσφορά
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
