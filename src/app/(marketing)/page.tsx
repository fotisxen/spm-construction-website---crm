import Link from "next/link";
import { ArrowUpRight, Hammer, KeyRound, LineChart, ShieldCheck } from "lucide-react";
import { Container } from "@/components/marketing/container";
import { PortfolioCard } from "@/components/marketing/portfolio-card";
import { siteConfig } from "@/lib/site-config";
import { getPublicProjects } from "@/lib/data/public-projects";

const PHASES = [
  {
    number: "01",
    title: "Προκαταβολή & πρώτες εργασίες",
    detail: "Γκρεμίσματα, κουφώματα, υδραυλικά, ηλεκτρολογικά.",
  },
  {
    number: "02",
    title: "Δάπεδα & παραγγελίες",
    detail: "Επιλογή υλικών, παραγγελίες σε προμηθευτές, δάπεδα.",
  },
  {
    number: "03",
    title: "Ολοκλήρωση",
    detail: "Περάσματα κουφωμάτων, εξοφλήσεις, βαψίματα, παράδοση.",
  },
];

const DIFFERENTIATORS = [
  {
    icon: LineChart,
    title: "Οργανωμένη διαχείριση",
    body: "Κάθε έργο έχει σαφή προϋπολογισμό, φάσεις και χρονοδιάγραμμα — όχι προφορικές υποσχέσεις.",
  },
  {
    icon: Hammer,
    title: "Δίκτυο έμπιστων συνεργατών",
    body: "Σταθεροί μάστορες και προμηθευτές ανά ειδικότητα, όχι τυχαίες αναθέσεις.",
  },
  {
    icon: ShieldCheck,
    title: "Διαφάνεια σε κόστος & χρόνο",
    body: "Ξέρεις από την αρχή τι καλύπτει κάθε δόση και πότε ολοκληρώνεται κάθε φάση.",
  },
  {
    icon: KeyRound,
    title: "Από αγορά μέχρι παράδοση",
    body: "Είτε αγοράζουμε & ανακαινίζουμε προς πώληση, είτε αναλαμβάνουμε το ακίνητό σου.",
  },
];

export default async function HomePage() {
  const { projects, isPlaceholder } = await getPublicProjects();
  const featured = projects.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--brand)_14%,transparent),transparent_60%)]" />
        <Container className="grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center rounded-full border border-ink/15 px-3 py-1 text-xs font-medium tracking-wide text-ink-soft uppercase">
              Ανακαινίσεις ακινήτων
            </span>
            <h1 className="mt-6 font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Ανακαινίζουμε ακίνητα σαν να ήταν δικά μας.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              {siteConfig.name} αναλαμβάνει ανακαινίσεις από την πρώτη
              σκαπάνη μέχρι το κλειδί στο χέρι — είτε είναι δικό σου ακίνητο,
              είτε ένα project αγοράς-ανακαίνισης-πώλησης.
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
                className="inline-flex h-12 items-center justify-center gap-1 rounded-full px-7 text-sm font-semibold text-ink transition-colors hover:bg-paper-warm"
              >
                Δες έργα μας
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 rounded-2xl border border-ink/10 bg-paper-warm p-6">
              <p className="font-heading text-3xl font-semibold text-ink">
                3 φάσεις
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Ξεκάθαρο χρονοδιάγραμμα και προϋπολογισμός σε κάθε έργο, από
                την προκαταβολή μέχρι την παράδοση.
              </p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-ink p-6 text-paper">
              <p className="font-heading text-2xl font-semibold">Flip</p>
              <p className="mt-1 text-sm text-paper/70">
                Αγορά, ανακαίνιση, πώληση.
              </p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-brand p-6 text-brand-foreground">
              <p className="font-heading text-2xl font-semibold">Πελάτη</p>
              <p className="mt-1 text-sm text-brand-foreground/85">
                Ανακαινίζουμε το δικό σου ακίνητο.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Process / transparency */}
      <section className="py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold text-ink">
              Πώς δουλεύουμε
            </h2>
            <p className="mt-3 text-ink-soft">
              Κάθε ανακαίνιση χωρίζεται σε 3 φάσεις με σαφές αντικείμενο, ώστε
              να ξέρεις πάντα πού βρίσκεται το έργο σου.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PHASES.map((phase) => (
              <div
                key={phase.number}
                className="rounded-2xl border border-ink/10 p-7"
              >
                <span className="font-heading text-4xl font-semibold text-brand-soft">
                  {phase.number}
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
                  {phase.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{phase.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Differentiators */}
      <section className="border-y border-ink/10 bg-paper-warm py-20">
        <Container>
          <h2 className="font-heading text-3xl font-semibold text-ink">
            Γιατί εμάς
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATORS.map(({ icon: Icon, title, body }) => (
              <div key={title}>
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

      {/* Portfolio preview */}
      <section className="py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-ink">
                Πρόσφατα έργα
              </h2>
              {isPlaceholder && (
                <p className="mt-2 text-sm text-ink-soft">
                  [PLACEHOLDER] Ενδεικτικά παραδείγματα — θα αντικατασταθούν
                  με πραγματικά έργα.
                </p>
              )}
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand"
            >
              Όλα τα έργα
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <PortfolioCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <Container>
          <div className="rounded-3xl bg-ink px-8 py-16 text-center text-paper sm:px-16">
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
              Έχεις ένα ακίνητο που χρειάζεται ανακαίνιση;
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-paper/70">
              Πες μας λίγα λόγια για το ακίνητο και το έργο σου — θα
              επικοινωνήσουμε μαζί σου για δωρεάν αρχική εκτίμηση.
            </p>
            <Link
              href="/epikoinonia"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground transition-colors hover:opacity-90"
            >
              Ζήτησε προσφορά
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
