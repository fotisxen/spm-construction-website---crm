"use client";

import { EntityManager, type Column } from "@/components/admin/entity-manager";
import { SupplyForm } from "@/app/admin/(dashboard)/supplies/supply-form";
import { deleteSupply } from "@/app/admin/(dashboard)/supplies/actions";
import type { Database } from "@/lib/types/database";

type Supply = Database["public"]["Tables"]["supply_quantities"]["Row"];
type Option = { id: string; label: string };

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" });

export function SuppliesManager({
  rows,
  projects,
  contacts,
  canManage,
}: {
  rows: Supply[];
  projects: Option[];
  contacts: Option[];
  canManage: boolean;
}) {
  const projectLabel = (id: string) =>
    projects.find((p) => p.id === id)?.label ?? "—";

  const columns: Column<Supply>[] = [
    { header: "Ημερομηνία", cell: (row) => row.date },
    { header: "Project", cell: (row) => projectLabel(row.project_id) },
    { header: "Υλικό", cell: (row) => row.item_name },
    { header: "Ποσότητα", cell: (row) => `${row.quantity} ${row.unit}` },
    {
      header: "Κόστος",
      cell: (row) => (row.total_cost != null ? eur.format(row.total_cost) : "—"),
      className: "text-right",
    },
  ];

  return (
    <EntityManager
      title="Ποσότητες προμηθειών"
      description="Υλικά και ποσότητες ανά project."
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      onDelete={(row) => deleteSupply(row.id)}
      renderForm={({ row, onDone }) => (
        <SupplyForm row={row} projects={projects} contacts={contacts} onDone={onDone} />
      )}
      canManage={canManage}
    />
  );
}
