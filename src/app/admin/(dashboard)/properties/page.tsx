import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/auth/access";
import { PropertiesManager } from "@/app/admin/(dashboard)/properties/properties-manager";

export const metadata: Metadata = { title: "Ακίνητα" };

export default async function PropertiesPage() {
  const access = await requireModuleAccess("properties");
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <PropertiesManager
      rows={data ?? []}
      canManage={access.permissions.properties === "manage"}
    />
  );
}
