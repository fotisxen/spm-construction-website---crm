import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/auth/access";
import { ProjectsManager } from "@/app/admin/(dashboard)/projects/projects-manager";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const access = await requireModuleAccess("projects");
  const supabase = await createClient();
  const [{ data: projects }, { data: properties }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("properties").select("id, name").order("name"),
  ]);

  return (
    <ProjectsManager
      rows={projects ?? []}
      properties={(properties ?? []).map((p) => ({ id: p.id, label: p.name }))}
      canManage={access.permissions.projects === "manage"}
    />
  );
}
