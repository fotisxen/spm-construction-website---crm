"use client";

import { Badge } from "@/components/ui/badge";
import { EntityManager, type Column } from "@/components/admin/entity-manager";
import { InstallmentForm } from "@/app/admin/(dashboard)/payments/[id]/installment-form";
import { deleteInstallment } from "@/app/admin/(dashboard)/payments/actions";
import type { Database } from "@/lib/types/database";

type Installment = Database["public"]["Tables"]["payment_installments"]["Row"];

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" });

export function InstallmentsManager({
  paymentId,
  rows,
}: {
  paymentId: string;
  rows: Installment[];
}) {
  const nextNumber = rows.length > 0 ? Math.max(...rows.map((r) => r.installment_number)) + 1 : 1;

  const columns: Column<Installment>[] = [
    { header: "#", cell: (row) => row.installment_number },
    { header: "Ποσό", cell: (row) => eur.format(row.amount) },
    { header: "Προθεσμία", cell: (row) => row.due_date ?? "—" },
    { header: "Ημ. πληρωμής", cell: (row) => row.paid_date ?? "—" },
    {
      header: "Κατάσταση",
      cell: (row) => (
        <Badge variant={row.status === "paid" ? "default" : "secondary"}>
          {row.status === "paid" ? "Πληρώθηκε" : "Εκκρεμεί"}
        </Badge>
      ),
    },
  ];

  return (
    <EntityManager
      title="Δόσεις"
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      onDelete={(row) => deleteInstallment(row.id, paymentId)}
      renderForm={({ row, onDone }) => (
        <InstallmentForm row={row} paymentId={paymentId} nextNumber={nextNumber} onDone={onDone} />
      )}
      emptyLabel="Δεν υπάρχουν ακόμα δόσεις."
    />
  );
}
