import type { Metadata } from "next";
import { Container } from "@/components/marketing/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Ποιοι είμαστε",
  description: `Σχετικά με την ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <span className="text-xs font-medium tracking-wide text-brand uppercase">
          Ποιοι είμαστε
        </span>
        <h1 className="mt-3 font-heading text-4xl font-semibold text-ink sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mt-6 text-lg text-ink-soft">
          [PLACEHOLDER] Εδώ μπαίνει το πραγματικό κείμενο για την ιστορία,
          την εμπειρία και τη φιλοσοφία της επιχείρησης — πόσα χρόνια
          δραστηριοποιείται, τι τη διαφοροποιεί, ποιοι είναι οι άνθρωποι
          πίσω από τα έργα.
        </p>
        <p className="mt-4 text-lg text-ink-soft">
          Αναλαμβάνουμε ανακαινίσεις είτε αγοράζοντας εμείς το ακίνητο για να
          το ανακαινίσουμε και να το πουλήσουμε, είτε αναλαμβάνοντας το
          ακίνητο ενός πελάτη από την αρχή μέχρι την παράδοση — πάντα με
          σαφές χρονοδιάγραμμα και προϋπολογισμό ανά φάση.
        </p>
      </Container>
    </section>
  );
}
