"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PHASES } from "@/lib/constants";

const projectSchema = z.object({
  id: z.string().uuid().optional(),
  property_id: z.string().uuid("Επίλεξε ακίνητο"),
  title: z.string().min(2, "Συμπλήρωσε τίτλο"),
  scope_description: z.string().optional(),
  project_type: z.enum(["flip", "client_owned"]),
  scope_size: z.enum(["full", "partial"]),
  budget: z.coerce.number().nonnegative(),
  start_date: z.string().optional().or(z.literal("")),
  end_date_planned: z.string().optional().or(z.literal("")),
  end_date_actual: z.string().optional().or(z.literal("")),
  status: z.enum(["planning", "in_progress", "completed"]),
  show_on_website: z.boolean(),
  public_summary: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal("")),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export async function saveProject(input: ProjectInput) {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }
  const { id, ...values } = parsed.data;
  const supabase = await createClient();

  const payload = {
    ...values,
    scope_description: values.scope_description || null,
    start_date: values.start_date || null,
    end_date_planned: values.end_date_planned || null,
    end_date_actual: values.end_date_actual || null,
    public_summary: values.public_summary || null,
    cover_image_url: values.cover_image_url || null,
  };

  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };

    const phasesPayload = DEFAULT_PHASES.map((phase) => ({
      project_id: data.id,
      phase_number: phase.phase_number,
      name: phase.name,
    }));
    await supabase.from("project_phases").insert(phasesPayload);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin/reports");
  revalidatePath("/portfolio");
  return {};
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/projects");
  revalidatePath("/admin/reports");
  return {};
}

const phaseSchema = z.object({
  id: z.string().uuid(),
  planned_start: z.string().optional().or(z.literal("")),
  planned_end: z.string().optional().or(z.literal("")),
  actual_start: z.string().optional().or(z.literal("")),
  actual_end: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export async function savePhase(input: z.infer<typeof phaseSchema>) {
  const parsed = phaseSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Μη έγκυρα στοιχεία φάσης" };
  }
  const { id, ...values } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_phases")
    .update({
      planned_start: values.planned_start || null,
      planned_end: values.planned_end || null,
      actual_start: values.actual_start || null,
      actual_end: values.actual_end || null,
      notes: values.notes || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/projects");
  return {};
}
