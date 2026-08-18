import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ContactsManager } from "@/app/admin/(dashboard)/contacts/contacts-manager";

export const metadata: Metadata = { title: "Συνεργάτες" };

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  return <ContactsManager rows={data ?? []} />;
}
