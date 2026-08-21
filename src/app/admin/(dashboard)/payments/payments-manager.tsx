"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EntityManager, type Column } from "@/components/admin/entity-manager";
import { PaymentForm } from "@/app/admin/(dashboard)/payments/payment-form";
import { deletePayment } from "@/app/admin/(dashboard)/payments/actions";
import type { Database } from "@/lib/types/database";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type Option = { id: string; label: string };

const STATUS_LABEL: Record<Payment["status"], string> = {
  pending: "Εκκρεμεί",
  partial: "Μερική",
  paid: "Εξοφλήθηκε",
};

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" });

export function PaymentsManager({
  rows,
  projects,
  contacts,
  canManage,
}: {
  rows: Payment[];
  projects: Option[];
  contacts: Option[];
  canManage: boolean;
}) {
  const projectLabel = (id: string) => projects.find((p) => p.id === id)?.label ?? "—";
  const contactLabel = (id: string | null) => contacts.find((c) => c.id === id)?.label ?? "—";

  const columns: Column<Payment>[] = [
    { header: "Project", cell: (row) => projectLabel(row.project_id) },
    { header: "Συνεργάτης", cell: (row) => contactLabel(row.contact_id) },
    { header: "Κατηγορία", cell: (row) => row.category },
    { header: "Ποσό", cell: (row) => eur.format(row.total_amount), className: "text-right" },
    {
      header: "Τρόπος",
      cell: (row) =>
        row.payment_type === "installments" ? (
          <Link href={`/admin/payments/${row.id}`} className="underline underline-offset-2">
            Δόσεις
          </Link>
        ) : (
          "Αποκοπή"
        ),
    },
    { header: "Κατάσταση", cell: (row) => <Badge variant="secondary">{STATUS_LABEL[row.status]}</Badge> },
  ];

  return (
    <EntityManager
      title="Πληρωμές"
      description="Πληρωμές σε μάστορες, προμηθευτές και καθαρισμό."
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      onDelete={(row) => deletePayment(row.id)}
      renderForm={({ row, onDone }) => (
        <PaymentForm row={row} projects={projects} contacts={contacts} onDone={onDone} />
      )}
      canManage={canManage}
    />
  );
}
