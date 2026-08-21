import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/auth/access";
import { ContactsManager } from "@/app/admin/(dashboard)/contacts/contacts-manager";

export const metadata: Metadata = { title: "Συνεργάτες" };

export default async function ContactsPage() {
  const access = await requireModuleAccess("contacts");
  const supabase = await createClient();
  const { data } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <ContactsManager rows={data ?? []} canManage={access.permissions.contacts === "manage"} />
  );
}
