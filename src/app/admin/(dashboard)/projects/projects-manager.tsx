"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EntityManager, type Column } from "@/components/admin/entity-manager";
import { ProjectForm } from "@/app/admin/(dashboard)/projects/project-form";
import { deleteProject } from "@/app/admin/(dashboard)/projects/actions";
import type { Database } from "@/lib/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Option = { id: string; label: string };

const STATUS_LABEL: Record<Project["status"], string> = {
  planning: "Σχεδιασμός",
  in_progress: "Σε εξέλιξη",
  completed: "Ολοκληρωμένο",
};

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" });

export function ProjectsManager({
  rows,
  properties,
  canManage,
}: {
  rows: Project[];
  properties: Option[];
  canManage: boolean;
}) {
  const propertyLabel = (id: string) =>
    properties.find((p) => p.id === id)?.label ?? "—";

  const columns: Column<Project>[] = [
    {
      header: "Τίτλος",
      cell: (row) => (
        <Link href={`/admin/projects/${row.id}`} className="font-medium underline-offset-2 hover:underline">
          {row.title}
        </Link>
      ),
    },
    { header: "Ακίνητο", cell: (row) => propertyLabel(row.property_id) },
    { header: "Κατάσταση", cell: (row) => <Badge variant="secondary">{STATUS_LABEL[row.status]}</Badge> },
    { header: "Προϋπολογισμός", cell: (row) => eur.format(row.budget), className: "text-right" },
    { header: "Site", cell: (row) => (row.show_on_website ? "✓" : "—") },
  ];

  return (
    <EntityManager
      title="Projects"
      description="Έργα ανακαίνισης. Άνοιξε ένα project για φάσεις/χρονοδιάγραμμα."
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      onDelete={(row) => deleteProject(row.id)}
      renderForm={({ row, onDone }) => (
        <ProjectForm row={row} properties={properties} onDone={onDone} />
      )}
      canManage={canManage}
    />
  );
}
