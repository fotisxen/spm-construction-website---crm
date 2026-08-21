import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/auth/access";
import { ExpensesManager } from "@/app/admin/(dashboard)/expenses/expenses-manager";

export const metadata: Metadata = { title: "Έξοδα" };

export default async function ExpensesPage() {
  const access = await requireModuleAccess("expenses");
  const supabase = await createClient();
  const [{ data: expenses }, { data: projects }] = await Promise.all([
    supabase.from("expenses").select("*").order("date", { ascending: false }),
    supabase.from("projects").select("id, title").order("title"),
  ]);

  return (
    <ExpensesManager
      rows={expenses ?? []}
      projects={projects ?? []}
      canManage={access.permissions.expenses === "manage"}
    />
  );
}
