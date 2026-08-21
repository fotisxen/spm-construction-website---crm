import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/marketing/container";
import { BeforeAfterSlider } from "@/components/marketing/before-after-slider";
import { Reveal } from "@/components/marketing/reveal";
import { getPublicProject } from "@/lib/data/public-projects";

const SCOPE_LABEL = { full: "Πλήρης ανακαίνιση", partial: "Μερική ανακαίνιση" };
const TYPE_LABEL = { flip: "Αγορά & ανακαίνιση προς πώληση", client_owned: "Ανακαίνιση ακινήτου πελάτη" };

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { project } = await getPublicProject(id);
  if (!project) return {};
  return {
    title: project.title,
    description: project.public_summary ?? undefined,
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { id } = await params;
  const { project, isPlaceholder } = await getPublicProject(id);

  if (!project) notFound();

  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Όλα τα έργα
        </Link>

        <Reveal variant="fade-up">
          {isPlaceholder && (
            <p className="mt-6 rounded-lg bg-paper-warm px-4 py-3 text-sm text-ink-soft">
              [PLACEHOLDER] Ενδεικτικό παράδειγμα case study.
            </p>
          )}

          <h1 className="mt-6 font-heading text-3xl font-semibold text-ink sm:text-4xl">
            {project.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              {SCOPE_LABEL[project.scope_size]}
            </span>
            <span className="rounded-full border border-ink/15 px-3 py-1 text-xs font-medium text-ink-soft">
              {TYPE_LABEL[project.project_type]}
            </span>
            {project.property_name && (
              <span className="rounded-full border border-ink/15 px-3 py-1 text-xs font-medium text-ink-soft">
                {project.property_name}
              </span>
            )}
          </div>

          {project.public_summary && (
            <p className="mt-8 text-lg text-ink-soft">{project.public_summary}</p>
          )}
        </Reveal>

        <Reveal variant="zoom-in" delay={100}>
          {project.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="mt-10 aspect-video w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="mt-10">
              <BeforeAfterSlider
                before={{ tone: "from-[#6b6156] to-[#5b5148]", label: "Πριν την ανακαίνιση" }}
                after={{ tone: "from-brand to-[#b6884f]", label: "Μετά την ανακαίνιση" }}
              />
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
