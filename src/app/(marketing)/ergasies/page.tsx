import type { Metadata } from "next";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Hammer,
  DoorOpen,
  Grid3x3,
  ChefHat,
  Paintbrush,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/marketing/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Υπηρεσίες",
  description: `Ανακαινίσεις ${siteConfig.areaServed}: γκρεμίσματα, υδραυλικά, ηλεκτρολογικά, δάπεδα, κουφώματα, πλακάκια, κουζίνες, βαψίματα.`,
};

const SERVICES = [
  { icon: Hammer, title: "Γκρεμίσματα", body: "Καθαίρεση χώρων και προετοιμασία για νέα διαρρύθμιση." },
  { icon: Wrench, title: "Υδραυλικά", body: "Πλήρης ανανέωση δικτύου, μπάνιο, κουζίνα." },
  { icon: Zap, title: "Ηλεκτρολογικά", body: "Νέα εγκατάσταση ή αναβάθμιση πίνακα και καλωδίωσης." },
  { icon: Grid3x3, title: "Δάπεδα & πλακάκια", body: "Επιλογή, παραγγελία και τοποθέτηση υλικών." },
  { icon: DoorOpen, title: "Κουφώματα", body: "Πόρτες και παράθυρα, θερμομόνωση, αισθητική." },
  { icon: ChefHat, title: "Κουζίνες", body: "Σχεδιασμός και τοποθέτηση με έμπιστους συνεργάτες." },
  { icon: Paintbrush, title: "Βαψίματα", body: "Ελαιοχρωματισμοί εσωτερικών χώρων." },
  { icon: Sparkles, title: "Καθαρισμός", body: "Τελικός καθαρισμός έτοιμου χώρου πριν την παράδοση." },
];

export default function ErgasiesPage() {
  return (
    <>
      <section className="border-b border-ink/10 py-20">
        <Container>
          <span className="text-xs font-medium tracking-wide text-brand uppercase">
            Υπηρεσίες
          </span>
          <h1 className="mt-3 max-w-2xl font-heading text-4xl font-semibold text-ink sm:text-5xl">
            Ό,τι χρειάζεται μια ανακαίνιση, κάτω από μία στέγη.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Συντονίζουμε όλες τις ειδικότητες που χρειάζεται ένα έργο — δεν
            χρειάζεται να μιλήσεις με δέκα διαφορετικούς ανθρώπους.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-ink/10 p-6"
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-ink/10 bg-paper-warm py-20">
        <Container className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-paper p-8">
            <h2 className="font-heading text-xl font-semibold text-ink">
              Πλήρης ανακαίνιση
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              Ολόκληρο το ακίνητο, από το γκρέμισμα μέχρι το τελευταίο χέρι
              μπογιάς — σε 3 σαφείς φάσεις με δικό τους προϋπολογισμό και
              χρονοδιάγραμμα.
            </p>
          </div>
          <div className="rounded-2xl bg-paper p-8">
            <h2 className="font-heading text-xl font-semibold text-ink">
              Μερική ανακαίνιση
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              Ένα μπάνιο, μια κουζίνα, ένα δωμάτιο — αναλαμβάνουμε και
              μικρότερης κλίμακας έργα με την ίδια προσοχή στη λεπτομέρεια.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 text-center">
        <Container>
          <h2 className="font-heading text-2xl font-semibold text-ink">
            Πες μας για το ακίνητό σου
          </h2>
          <Link
            href="/epikoinonia"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground transition-colors hover:opacity-90"
          >
            Ζήτησε προσφορά
          </Link>
        </Container>
      </section>
    </>
  );
}
