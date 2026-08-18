import Link from "next/link";
import { Container } from "@/components/marketing/container";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-paper">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold">
            {siteConfig.shortName}
          </p>
          <p className="mt-3 max-w-xs text-sm text-paper/70">
            {siteConfig.tagline}
          </p>
        </div>
        <div className="text-sm text-paper/70">
          <p className="font-medium text-paper">Επικοινωνία</p>
          <p className="mt-3">{siteConfig.phone}</p>
          <p>{siteConfig.email}</p>
          <p>{siteConfig.address}</p>
        </div>
        <div className="text-sm text-paper/70">
          <p className="font-medium text-paper">Σύνδεσμοι</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/ergasies" className="hover:text-paper">
              Υπηρεσίες
            </Link>
            <Link href="/portfolio" className="hover:text-paper">
              Έργα
            </Link>
            <Link href="/about" className="hover:text-paper">
              Ποιοι είμαστε
            </Link>
            <Link href="/epikoinonia" className="hover:text-paper">
              Επικοινωνία
            </Link>
          </div>
        </div>
      </Container>
      <Container className="border-t border-paper/10 py-6 text-xs text-paper/50">
        © {new Date().getFullYear()} {siteConfig.shortName}. Με επιφύλαξη
        παντός δικαιώματος.
      </Container>
    </footer>
  );
}
