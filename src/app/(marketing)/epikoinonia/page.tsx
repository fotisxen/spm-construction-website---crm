import type { Metadata } from "next";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { Container } from "@/components/marketing/container";
import { ContactForm } from "@/components/marketing/contact-form";
import { Reveal } from "@/components/marketing/reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description: `Ζήτησε προσφορά για ανακαίνιση από την ${siteConfig.name}.`,
};

const QUICK_REASONS = [
  "Σαφές χρονοδιάγραμμα και προϋπολογισμό σε κάθε φάση",
  "Ένας υπεύθυνος επικοινωνίας για όλο το έργο",
  "Δωρεάν αρχική εκτίμηση, χωρίς δέσμευση",
];

export default function EpikoinoniaPage() {
  return (
    <section className="py-20">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal variant="slide-right">
          <div>
            <span className="text-xs font-medium tracking-wide text-brand uppercase">
              Επικοινωνία
            </span>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-ink">
              Ζήτησε προσφορά
            </h1>
            <p className="mt-5 text-ink-soft">
              Στείλε μας λίγα στοιχεία για το ακίνητο και το έργο που έχεις
              κατά νου — θα επικοινωνήσουμε μαζί σου για δωρεάν αρχική
              εκτίμηση.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 rounded-xl border border-ink/10 px-4 py-3 text-sm text-ink transition-colors hover:border-brand/30 hover:bg-paper-warm"
              >
                <Phone className="size-4 text-brand" />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 rounded-xl border border-ink/10 px-4 py-3 text-sm text-ink transition-colors hover:border-brand/30 hover:bg-paper-warm"
              >
                <Mail className="size-4 text-brand" />
                {siteConfig.email}
              </a>
            </div>

            <ul className="mt-10 space-y-3">
              {QUICK_REASONS.map((reason) => (
                <li key={reason} className="flex gap-3 text-sm text-ink-soft">
                  <CheckCircle2 className="size-4 shrink-0 text-brand" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal variant="slide-left" delay={100}>
          <div className="rounded-3xl border border-ink/10 p-8">
            <ContactForm />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
