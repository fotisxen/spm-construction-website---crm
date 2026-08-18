"use client";

import { Badge } from "@/components/ui/badge";
import { EntityManager, type Column } from "@/components/admin/entity-manager";
import { ExpenseForm } from "@/app/admin/(dashboard)/expenses/expense-form";
import { deleteExpense } from "@/app/admin/(dashboard)/expenses/actions";
import type { Database } from "@/lib/types/database";

type Expense = Database["public"]["Tables"]["expenses"]["Row"];
type ProjectOption = { id: string; title: string };

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" });

export function ExpensesManager({
  rows,
  projects,
}: {
  rows: Expense[];
  projects: ProjectOption[];
}) {
  const projectTitle = (id: string | null) =>
    projects.find((p) => p.id === id)?.title ?? "Εταιρικό / πάγιο";

  const columns: Column<Expense>[] = [
    { header: "Ημερομηνία", cell: (row) => row.date },
    { header: "Κατηγορία", cell: (row) => <Badge variant="secondary">{row.category}</Badge> },
    { header: "Project", cell: (row) => projectTitle(row.project_id) },
    { header: "Ποσό", cell: (row) => eur.format(row.amount), className: "text-right" },
  ];

  return (
    <EntityManager
      title="Έξοδα"
      description="Γενικά έξοδα, ανά project ή εταιρικά/πάγια."
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      onDelete={(row) => deleteExpense(row.id)}
      renderForm={({ row, onDone }) => (
        <ExpenseForm row={row} projects={projects} onDone={onDone} />
      )}
    />
  );
}
