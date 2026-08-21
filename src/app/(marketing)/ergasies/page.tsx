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
  Leaf,
} from "lucide-react";
import { Container } from "@/components/marketing/container";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { Reveal } from "@/components/marketing/reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Υπηρεσίες",
  description: `Ανακαινίσεις ${siteConfig.areaServed}: γκρεμίσματα, υδραυλικά, ηλεκτρολογικά, δάπεδα, κουφώματα, πλακάκια, κουζίνες, ενεργειακή αναβάθμιση, βαψίματα.`,
};

const SERVICES = [
  { icon: Hammer, title: "Γκρεμίσματα", body: "Καθαίρεση χώρων και προετοιμασία για νέα διαρρύθμιση." },
  { icon: Wrench, title: "Υδραυλικά", body: "Πλήρης ανανέωση δικτύου, μπάνιο, κουζίνα." },
  { icon: Zap, title: "Ηλεκτρολογικά", body: "Νέα εγκατάσταση ή αναβάθμιση πίνακα και καλωδίωσης." },
  { icon: Grid3x3, title: "Δάπεδα & πλακάκια", body: "Επιλογή, παραγγελία και τοποθέτηση υλικών." },
  { icon: DoorOpen, title: "Κουφώματα", body: "Πόρτες και παράθυρα, θερμομόνωση, αισθητική." },
  { icon: Leaf, title: "Ενεργειακή αναβάθμιση", body: "Θερμομόνωση και κουφώματα που μειώνουν το κόστος θέρμανσης/ψύξης." },
  { icon: ChefHat, title: "Κουζίνες", body: "Σχεδιασμός και τοποθέτηση με έμπιστους συνεργάτες." },
  { icon: Paintbrush, title: "Βαψίματα", body: "Ελαιοχρωματισμοί εσωτερικών χώρων." },
  { icon: Sparkles, title: "Καθαρισμός", body: "Τελικός καθαρισμός έτοιμου χώρου πριν την παράδοση." },
];

const SCOPE_ITEMS = [
  "Ανακαίνιση ολόκληρου ακινήτου ή μεμονωμένων χώρων (μπάνιο, κουζίνα, δωμάτιο)",
  "Εκσυγχρονισμός ηλεκτρολογικής και υδραυλικής εγκατάστασης",
  "Αντικατάσταση κουφωμάτων και θερμομόνωση για ενεργειακή αναβάθμιση",
  "Κατεδάφιση, αποξήλωση και προετοιμασία χώρου",
  "Επιλογή και τοποθέτηση δαπέδων, πλακιδίων, ειδών υγιεινής",
  "Συντονισμός όλων των ειδικοτήτων μέχρι την τελική παράδοση",
];

const FAQ = [
  {
    q: "Πόσο διαρκεί μια ανακαίνιση;",
    a: "Εξαρτάται από την έκταση: ένα μπάνιο συνήθως 2-4 εβδομάδες, μια πλήρης ανακαίνιση διαμερίσματος 2-4 μήνες. Πριν ξεκινήσουμε δίνουμε συγκεκριμένο χρονοδιάγραμμα ανά φάση.",
  },
  {
    q: "Πώς λειτουργεί η πληρωμή;",
    a: "Σε 3 φάσεις: προκαταβολή 30% για τις πρώτες εργασίες, 30% στα δάπεδα και τις παραγγελίες υλικών, 40% στην ολοκλήρωση. Κάθε φάση έχει σαφές αντικείμενο, οπότε ξέρεις τι πληρώνεις και πότε.",
  },
  {
    q: "Χρειάζεται άδεια για την ανακαίνιση μου;",
    a: "Εξαρτάται από την έκταση της παρέμβασης — π.χ. αν επηρεάζονται φέροντα στοιχεία. Σε κάθε περίπτωση σε ενημερώνουμε τι απαιτείται πριν ξεκινήσει οποιαδήποτε εργασία.",
  },
  {
    q: "Αναλαμβάνετε και μικρές εργασίες;",
    a: "Ναι — από ένα μπάνιο μέχρι ολόκληρο ακίνητο, με την ίδια προσοχή στη λεπτομέρεια ανεξαρτήτως κλίμακας.",
  },
  {
    q: "Τι γίνεται αν θέλω να αλλάξω κάτι στην πορεία του έργου;",
    a: "Το συζητάμε άμεσα μαζί σου και ενημερώνουμε χρονοδιάγραμμα και προϋπολογισμό ανάλογα, πριν προχωρήσουμε — καμία έκπληξη στο τέλος.",
  },
  {
    q: "Μπορώ να μένω στο ακίνητο όσο γίνονται οι εργασίες;",
    a: "Σε μερικές ανακαινίσεις συνήθως ναι. Σε πλήρεις ανακαινίσεις συνιστούμε να μην μένεις, για λόγους ασφάλειας και ταχύτητας του έργου.",
  },
];

export default function ErgasiesPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="border-b border-ink/10 py-20">
        <Container>
          <Reveal variant="fade-up">
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
          </Reveal>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} variant="zoom-in" delay={(i % 3) * 90}>
                <div className="group rounded-2xl border border-ink/10 p-6 transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg hover:shadow-ink/5">
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

      <section className="border-y border-ink/10 bg-paper-warm py-20">
        <Container className="grid gap-8 md:grid-cols-2">
          <Reveal variant="slide-right">
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
          </Reveal>
          <Reveal variant="slide-left" delay={100}>
            <div className="rounded-2xl bg-paper p-8">
              <h2 className="font-heading text-xl font-semibold text-ink">
                Μερική ανακαίνιση
              </h2>
              <p className="mt-3 text-sm text-ink-soft">
                Ένα μπάνιο, μια κουζίνα, ένα δωμάτιο — αναλαμβάνουμε και
                μικρότερης κλίμακας έργα με την ίδια προσοχή στη λεπτομέρεια.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Scope detail */}
      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal variant="slide-right">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-ink">
                Τι περιλαμβάνει ένα έργο
              </h2>
              <p className="mt-3 max-w-md text-ink-soft">
                Ανεξάρτητα από την κλίμακα, κάθε ανάθεση μπορεί να καλύψει όσα
                χρειάζεσαι από την παρακάτω λίστα — εσύ αποφασίζεις πόσο
                μακριά θα πάει.
              </p>
            </div>
          </Reveal>
          <ul className="space-y-4">
            {SCOPE_ITEMS.map((item, i) => (
              <Reveal key={item} variant="fade-up" delay={i * 70}>
                <li className="flex gap-3 text-sm text-ink-soft">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" />
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-ink/10 bg-paper-warm py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fade-in">
            <h2 className="font-heading text-3xl font-semibold text-ink">
              Συχνές ερωτήσεις
            </h2>
          </Reveal>
          <Reveal variant="fade-up" delay={100}>
            <div className="mt-10">
              <FaqAccordion items={FAQ} />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 text-center">
        <Container>
          <Reveal variant="zoom-in">
            <h2 className="font-heading text-2xl font-semibold text-ink">
              Πες μας για το ακίνητό σου
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
