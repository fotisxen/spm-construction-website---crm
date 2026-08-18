import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PropertiesManager } from "@/app/admin/(dashboard)/properties/properties-manager";

export const metadata: Metadata = { title: "Ακίνητα" };

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return <PropertiesManager rows={data ?? []} />;
}
