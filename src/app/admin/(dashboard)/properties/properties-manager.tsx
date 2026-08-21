"use client";

import { EntityManager, type Column } from "@/components/admin/entity-manager";
import { PropertyForm } from "@/app/admin/(dashboard)/properties/property-form";
import { deleteProperty } from "@/app/admin/(dashboard)/properties/actions";
import type { Database } from "@/lib/types/database";

type Property = Database["public"]["Tables"]["properties"]["Row"];

const ACQUISITION_LABEL: Record<Property["acquisition_type"], string> = {
  flip: "Flip",
  client_owned: "Πελάτη",
};

const columns: Column<Property>[] = [
  { header: "Όνομα", cell: (row) => row.name },
  { header: "Διεύθυνση", cell: (row) => row.address },
  { header: "Τ.μ.", cell: (row) => row.sqm ?? "—" },
  { header: "Τύπος", cell: (row) => ACQUISITION_LABEL[row.acquisition_type] },
];

export function PropertiesManager({ rows, canManage }: { rows: Property[]; canManage: boolean }) {
  return (
    <EntityManager
      title="Ακίνητα"
      description="Όλα τα ακίνητα που διαχειρίζεται η επιχείρηση."
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      onDelete={(row) => deleteProperty(row.id)}
      renderForm={({ row, onDone }) => <PropertyForm row={row} onDone={onDone} />}
      canManage={canManage}
    />
  );
}
