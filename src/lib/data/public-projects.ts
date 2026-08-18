import { createClient } from "@/lib/supabase/server";
import {
  PLACEHOLDER_PORTFOLIO,
  type PublicProject,
} from "@/lib/data/placeholder-portfolio";

// Falls back to clearly-marked placeholder case studies until a real
// Supabase project is connected and has published projects.
export async function getPublicProjects(): Promise<{
  projects: PublicProject[];
  isPlaceholder: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("public_projects")
      .select("*")
      .order("end_date_actual", { ascending: false });

    if (error || !data || data.length === 0) {
      return { projects: PLACEHOLDER_PORTFOLIO, isPlaceholder: true };
    }

    return { projects: data, isPlaceholder: false };
  } catch {
    return { projects: PLACEHOLDER_PORTFOLIO, isPlaceholder: true };
  }
}

export async function getPublicProject(
  id: string
): Promise<{ project: PublicProject | null; isPlaceholder: boolean }> {
  const placeholder = PLACEHOLDER_PORTFOLIO.find((p) => p.id === id);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("public_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return { project: placeholder ?? null, isPlaceholder: true };
    }

    return { project: data, isPlaceholder: false };
  } catch {
    return { project: placeholder ?? null, isPlaceholder: true };
  }
}
