"use client";

import { Badge } from "@/components/ui/badge";
import { EntityManager, type Column } from "@/components/admin/entity-manager";
import { IncomeForm } from "@/app/admin/(dashboard)/income/income-form";
import { deleteIncome } from "@/app/admin/(dashboard)/income/actions";
import type { Database } from "@/lib/types/database";

type Income = Database["public"]["Tables"]["income"]["Row"];
type ProjectOption = { id: string; title: string };

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" });

export function IncomeManager({
  rows,
  projects,
  canManage,
}: {
  rows: Income[];
  projects: ProjectOption[];
  canManage: boolean;
}) {
  const projectTitle = (id: string | null) =>
    projects.find((p) => p.id === id)?.title ?? "Γενικό";

  const columns: Column<Income>[] = [
    { header: "Ημερομηνία", cell: (row) => row.date },
    { header: "Κατηγορία", cell: (row) => <Badge variant="secondary">{row.category}</Badge> },
    { header: "Project", cell: (row) => projectTitle(row.project_id) },
    { header: "Ποσό", cell: (row) => eur.format(row.amount), className: "text-right" },
  ];

  return (
    <EntityManager
      title="Έσοδα"
      description="Έσοδα ανά project ή γενικά."
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      onDelete={(row) => deleteIncome(row.id)}
      renderForm={({ row, onDone }) => (
        <IncomeForm row={row} projects={projects} onDone={onDone} />
      )}
      canManage={canManage}
    />
  );
}
