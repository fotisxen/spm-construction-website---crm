"use client";

import { Badge } from "@/components/ui/badge";
import { EntityManager, type Column } from "@/components/admin/entity-manager";
import { ContactForm } from "@/app/admin/(dashboard)/contacts/contact-form";
import { deleteContact } from "@/app/admin/(dashboard)/contacts/actions";
import type { Database } from "@/lib/types/database";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];

const columns: Column<Contact>[] = [
  { header: "Όνομα", cell: (row) => row.name },
  { header: "Ειδικότητα", cell: (row) => <Badge variant="secondary">{row.category}</Badge> },
  { header: "Τηλέφωνο", cell: (row) => row.phone ?? "—" },
  { header: "Email", cell: (row) => row.email ?? "—" },
];

export function ContactsManager({ rows, canManage }: { rows: Contact[]; canManage: boolean }) {
  return (
    <EntityManager
      title="Συνεργάτες"
      description="Μάστορες, προμηθευτές και λοιποί συνεργάτες."
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      onDelete={(row) => deleteContact(row.id)}
      renderForm={({ row, onDone }) => <ContactForm row={row} onDone={onDone} />}
      canManage={canManage}
    />
  );
}
