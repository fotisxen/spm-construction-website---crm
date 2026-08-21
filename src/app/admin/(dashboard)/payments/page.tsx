import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/auth/access";
import { PaymentsManager } from "@/app/admin/(dashboard)/payments/payments-manager";

export const metadata: Metadata = { title: "Πληρωμές" };

export default async function PaymentsPage() {
  const access = await requireModuleAccess("payments");
  const supabase = await createClient();
  const [{ data: payments }, { data: projects }, { data: contacts }] =
    await Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("id, title").order("title"),
      supabase.from("contacts").select("id, name").order("name"),
    ]);

  return (
    <PaymentsManager
      rows={payments ?? []}
      projects={(projects ?? []).map((p) => ({ id: p.id, label: p.title }))}
      contacts={(contacts ?? []).map((c) => ({ id: c.id, label: c.name }))}
      canManage={access.permissions.payments === "manage"}
    />
  );
}
