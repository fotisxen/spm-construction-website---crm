import Link from "next/link";
import {
  ArrowUpRight,
  Hammer,
  Leaf,
  LineChart,
  PhoneCall,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/marketing/container";
import { PortfolioCard } from "@/components/marketing/portfolio-card";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { BeforeAfterSlider } from "@/components/marketing/before-after-slider";
import { Reveal } from "@/components/marketing/reveal";
import { ScrollStory } from "@/components/marketing/renovation-story/scroll-story";
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
    icon: Ruler,
    title: "Κάθε κλίμακα, ίδια προσοχή",
    body: "Από ένα μπάνιο μέχρι ολόκληρο διαμέρισμα — αναλαμβάνουμε μερικές και ολικές ανακαινίσεις με την ίδια σχολαστικότητα.",
  },
  {
    icon: Leaf,
    title: "Ενεργειακή αναβάθμιση",
    body: "Θερμομόνωση και κουφώματα που μειώνουν πραγματικά το κόστος θέρμανσης και ψύξης, όχι μόνο την αισθητική.",
  },
  {
    icon: PhoneCall,
    title: "Ένας υπεύθυνος επικοινωνίας",
    body: "Δεν χρειάζεται να τρέχεις πίσω από τον κάθε μάστορα — μιλάς πάντα με τον ίδιο άνθρωπο για την πορεία του έργου.",
  },
];

export default async function HomePage() {
  const { projects, isPlaceholder } = await getPublicProjects();
  const featured = projects.slice(0, 3);

  return (
    <>
      {/* Hero: full-bleed photo carousel with headline overlaid */}
      <HeroCarousel />

      {/* 3D scroll story: before -> during -> after */}
      <ScrollStory />

      {/* Process / transparency */}
      <section className="py-20">
        <Container>
          <Reveal variant="fade-up">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold text-ink">
                Πώς δουλεύουμε
              </h2>
              <p className="mt-3 text-ink-soft">
                Κάθε ανακαίνιση χωρίζεται σε 3 φάσεις με σαφές αντικείμενο,
                ώστε να ξέρεις πάντα πού βρίσκεται το έργο σου.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PHASES.map((phase, i) => (
              <Reveal key={phase.number} variant="fade-up" delay={i * 100}>
                <div className="rounded-2xl border border-ink/10 p-7">
                  <span className="font-heading text-4xl font-semibold text-brand-soft">
                    {phase.number}
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
                    {phase.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">{phase.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Interactive before/after */}
      <section className="border-t border-ink/10 py-20">
        <Container>
          <Reveal variant="slide-right">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold text-ink">
                Δες τη διαφορά
              </h2>
              <p className="mt-3 text-ink-soft">
                Σύρε το χερούλι για να δεις πριν και μετά — έτσι θα δείχνουν
                τα πραγματικά μας έργα εδώ.
              </p>
            </div>
          </Reveal>
          <Reveal variant="zoom-in" delay={100}>
            <div className="mt-10">
              <BeforeAfterSlider
                before={{ tone: "from-[#6b6156] to-[#5b5148]", label: "Πριν την ανακαίνιση" }}
                after={{ tone: "from-brand to-[#b6884f]", label: "Μετά την ανακαίνιση" }}
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Mission statement */}
      <section className="py-16">
        <Container>
          <Reveal variant="fade-in" duration={1000}>
            <p className="mx-auto max-w-3xl text-center font-heading text-2xl leading-snug font-medium text-ink sm:text-3xl">
              Δεν πουλάμε υποσχέσεις. Παραδίδουμε αυτό που συμφωνήσαμε,{" "}
              <span className="text-brand">όταν</span> το συμφωνήσαμε.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Differentiators */}
      <section className="border-y border-ink/10 bg-paper-warm py-20">
        <Container>
          <Reveal variant="fade-up">
            <h2 className="font-heading text-3xl font-semibold text-ink">
              Γιατί εμάς
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATORS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} variant="zoom-in" delay={(i % 3) * 90}>
                <div className="group rounded-2xl p-2 transition-transform hover:-translate-y-1">
                  <div className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Portfolio preview */}
      <section className="py-20">
        <Container>
          <Reveal variant="slide-left">
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
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <Reveal key={project.id} variant="fade-up" delay={i * 100}>
                <PortfolioCard project={project} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <Container>
          <Reveal variant="zoom-in">
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
          </Reveal>
        </Container>
      </section>
    </>
  );
}
