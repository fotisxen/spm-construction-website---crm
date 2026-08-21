import type { Metadata } from "next";
import { Container } from "@/components/marketing/container";
import { PortfolioFilter } from "@/components/marketing/portfolio-filter";
import { Reveal } from "@/components/marketing/reveal";
import { getPublicProjects } from "@/lib/data/public-projects";

export const metadata: Metadata = {
  title: "Έργα",
  description: "Ολοκληρωμένες ανακαινίσεις ακινήτων.",
};

export default async function PortfolioPage() {
  const { projects, isPlaceholder } = await getPublicProjects();

  return (
    <section className="py-20">
      <Container>
        <Reveal variant="fade-up">
          <span className="text-xs font-medium tracking-wide text-brand uppercase">
            Έργα
          </span>
          <h1 className="mt-3 max-w-2xl font-heading text-4xl font-semibold text-ink sm:text-5xl">
            Έργα ανακαίνισης
          </h1>
          {isPlaceholder && (
            <p className="mt-4 max-w-xl text-sm text-ink-soft">
              [PLACEHOLDER] Αυτά είναι ενδεικτικά παραδείγματα — θα
              αντικατασταθούν με πραγματικά έργα.
            </p>
          )}
        </Reveal>
        <div className="mt-12">
          <PortfolioFilter projects={projects} />
        </div>
      </Container>
    </section>
  );
}
