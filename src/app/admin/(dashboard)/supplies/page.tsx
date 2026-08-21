import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/auth/access";
import { SuppliesManager } from "@/app/admin/(dashboard)/supplies/supplies-manager";

export const metadata: Metadata = { title: "Προμήθειες" };

export default async function SuppliesPage() {
  const access = await requireModuleAccess("supplies");
  const supabase = await createClient();
  const [{ data: supplies }, { data: projects }, { data: contacts }] =
    await Promise.all([
      supabase
        .from("supply_quantities")
        .select("*")
        .order("date", { ascending: false }),
      supabase.from("projects").select("id, title").order("title"),
      supabase.from("contacts").select("id, name").order("name"),
    ]);

  return (
    <SuppliesManager
      rows={supplies ?? []}
      projects={(projects ?? []).map((p) => ({ id: p.id, label: p.title }))}
      contacts={(contacts ?? []).map((c) => ({ id: c.id, label: c.name }))}
      canManage={access.permissions.supplies === "manage"}
    />
  );
}
