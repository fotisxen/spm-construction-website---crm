import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/auth/access";
import { IncomeManager } from "@/app/admin/(dashboard)/income/income-manager";

export const metadata: Metadata = { title: "Έσοδα" };

export default async function IncomePage() {
  const access = await requireModuleAccess("income");
  const supabase = await createClient();
  const [{ data: income }, { data: projects }] = await Promise.all([
    supabase.from("income").select("*").order("date", { ascending: false }),
    supabase.from("projects").select("id, title").order("title"),
  ]);

  return (
    <IncomeManager
      rows={income ?? []}
      projects={projects ?? []}
      canManage={access.permissions.income === "manage"}
    />
  );
}
