"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const supplySchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid("Επίλεξε project"),
  contact_id: z.string().uuid().optional().or(z.literal("")),
  item_name: z.string().min(2, "Συμπλήρωσε το υλικό"),
  quantity: z.coerce.number().positive("Η ποσότητα πρέπει να είναι θετική"),
  unit: z.string().min(1, "Συμπλήρωσε μονάδα"),
  unit_cost: z.coerce.number().nonnegative().optional(),
  total_cost: z.coerce.number().nonnegative().optional(),
  date: z.string().min(1, "Συμπλήρωσε ημερομηνία"),
});

export type SupplyInput = z.infer<typeof supplySchema>;

export async function saveSupply(input: SupplyInput) {
  const parsed = supplySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }
  const { id, ...values } = parsed.data;
  const supabase = await createClient();

  const payload = {
    ...values,
    contact_id: values.contact_id || null,
    unit_cost: values.unit_cost ?? null,
    total_cost:
      values.total_cost ??
      (values.unit_cost ? values.unit_cost * values.quantity : null),
  };

  const { error } = id
    ? await supabase.from("supply_quantities").update(payload).eq("id", id)
    : await supabase.from("supply_quantities").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/admin/supplies");
  revalidatePath("/admin/reports");
  return {};
}

export async function deleteSupply(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("supply_quantities")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/supplies");
  revalidatePath("/admin/reports");
  return {};
}
