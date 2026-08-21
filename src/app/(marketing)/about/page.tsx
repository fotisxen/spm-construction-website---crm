import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/marketing/container";
import { ValueFlipCard } from "@/components/marketing/value-flip-card";
import { GalleryGrid } from "@/components/marketing/gallery-grid";
import { Reveal } from "@/components/marketing/reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Ποιοι είμαστε",
  description: `Η ${siteConfig.name} αναλαμβάνει ανακαινίσεις κατοικιών στη ${siteConfig.areaServed} από το ${siteConfig.foundedYear}.`,
};

const VALUES = [
  {
    icon: "target" as const,
    title: "Ακρίβεια",
    body: "Κάθε έργο ξεκινά με σαφή μελέτη — τι θα γίνει, πότε, με τι κόστος. Όχι εκτιμήσεις στο πόδι.",
  },
  {
    icon: "gem" as const,
    title: "Ποιότητα εκτέλεσης",
    body: "Επιλέγουμε συνεργάτες και υλικά με κριτήριο το αποτέλεσμα, όχι το φθηνότερο δυνατό.",
  },
  {
    icon: "clock" as const,
    title: "Συνέπεια στον χρόνο",
    body: "Ένα χρονοδιάγραμμα που δεν τηρείται δεν είναι χρονοδιάγραμμα. Το δικό μας τηρείται.",
  },
  {
    icon: "award" as const,
    title: "Διαφάνεια",
    body: "Ξέρεις πάντα πού βρίσκεται το έργο σου και τι έχει κοστίσει μέχρι εκείνη τη στιγμή.",
  },
];

const STATS = [
  { value: "10+", label: "Ολοκληρωμένα έργα" },
  { value: siteConfig.foundedYear, label: "Δραστηριοποιούμαστε από" },
  { value: "3", label: "Σαφείς φάσεις ανά έργο" },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink/10 py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fade-up">
            <span className="text-xs font-medium tracking-wide text-brand uppercase">
              Ποιοι είμαστε
            </span>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-ink sm:text-5xl">
              {siteConfig.name}
            </h1>
            <p className="mt-6 text-lg text-ink-soft">
              Η {siteConfig.name} δραστηριοποιείται στη {siteConfig.areaServed}{" "}
              από το {siteConfig.foundedYear}, με έμφαση σε αυτό που πραγματικά
              μετράει σε μια ανακαίνιση: ποιοτικά υλικά, έμπειρους μάστορες ανά
              ειδικότητα και τεχνογνωσία σε κάθε στάδιο του έργου.
            </p>
            <p className="mt-4 text-lg text-ink-soft">
              Η βασική μας δουλειά είναι ολικές και μερικές ανακαινίσεις
              κατοικιών — από ένα μπάνιο μέχρι ολόκληρο διαμέρισμα — πάντα με
              σαφές χρονοδιάγραμμα και προϋπολογισμό ανά φάση. Περιστασιακά
              αναλαμβάνουμε και δικά μας ακίνητα προς ανακαίνιση και πώληση.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-b border-ink/10 bg-paper-warm py-14">
        <Container>
          <div className="grid grid-cols-3 gap-6 text-center">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} variant="zoom-in" delay={i * 100}>
                <div>
                  <p className="font-heading text-3xl font-semibold text-brand sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium tracking-wide text-ink-soft uppercase sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20">
        <Container>
          <Reveal variant="slide-right">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold text-ink">
                Οι αρχές μας
              </h2>
              <p className="mt-3 text-ink-soft">
                Δεν είναι σύνθημα — είναι ο τρόπος που δουλεύουμε κάθε έργο,
                μικρό ή μεγάλο.
              </p>
            </div>
            <p className="mt-2 text-xs text-ink-soft/70">
              Πάτησε μια κάρτα για να τη γυρίσεις.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon, title, body }, i) => (
              <Reveal key={title} variant="fade-up" delay={i * 100}>
                <ValueFlipCard icon={icon} title={title} body={body} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery */}
      <section className="border-y border-ink/10 bg-paper-warm py-20">
        <Container>
          <Reveal variant="slide-left">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold text-ink">
                Στιγμιότυπα από τα έργα μας
              </h2>
              <p className="mt-3 text-ink-soft">
                [PLACEHOLDER] Θέση για πραγματικές φωτογραφίες από έργα σε
                εξέλιξη και ολοκληρωμένα — θα αντικατασταθούν σύντομα.
              </p>
            </div>
          </Reveal>
          <Reveal variant="fade-in" delay={100}>
            <div className="mt-10">
              <GalleryGrid />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Collaboration process */}
      <section className="border-y border-ink/10 bg-paper-warm py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fade-in" duration={900}>
            <h2 className="font-heading text-3xl font-semibold text-ink">
              Πώς δουλεύουμε μαζί σου
            </h2>
            <p className="mt-5 text-ink-soft">
              Πρώτα σε γνωρίζουμε — σου κάνουμε ερωτήσεις, ακούμε τι
              φαντάζεσαι για τον χώρο σου και σε τι προϋπολογισμό κινείσαι.
              Καταλήγουμε μαζί σε ένα σαφές πλάνο: τι θα γίνει σε κάθε φάση,
              με ποιο κόστος και μέχρι πότε. Από εκεί και πέρα, δεν χρειάζεται
              να τρέχεις πίσω από δέκα διαφορετικούς μάστορες — το
              αναλαμβάνουμε εμείς, ενήμερος εσύ σε κάθε βήμα.
            </p>
            <p className="mt-4 text-ink-soft">
              Το αποτέλεσμα που κυνηγάμε είναι πάντα το ίδιο: ο χώρος να
              ανταποκρίνεται σε αυτό που φαντάστηκες, μέσα στον χρόνο και το
              budget που συμφωνήσαμε.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 text-center">
        <Container>
          <Reveal variant="zoom-in">
            <h2 className="font-heading text-2xl font-semibold text-ink">
              Έχεις ένα ακίνητο κατά νου;
            </h2>
            <Link
              href="/epikoinonia"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground transition-colors hover:opacity-90"
            >
              Ζήτησε προσφορά
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
