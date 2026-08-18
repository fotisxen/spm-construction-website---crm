import type { Metadata } from "next";
import { Container } from "@/components/marketing/container";
import { ContactForm } from "@/components/marketing/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description: `Ζήτησε προσφορά για ανακαίνιση από την ${siteConfig.name}.`,
};

export default function EpikoinoniaPage() {
  return (
    <section className="py-20">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
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
          <div className="mt-10 space-y-2 text-sm text-ink-soft">
            <p>
              <span className="font-medium text-ink">Τηλέφωνο: </span>
              {siteConfig.phone}
            </p>
            <p>
              <span className="font-medium text-ink">Email: </span>
              {siteConfig.email}
            </p>
            <p>
              <span className="font-medium text-ink">Γραφείο: </span>
              {siteConfig.address}
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-ink/10 p-8">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
