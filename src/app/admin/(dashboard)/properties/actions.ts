"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const propertySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Συμπλήρωσε όνομα"),
  address: z.string().min(2, "Συμπλήρωσε διεύθυνση"),
  power_supply_number: z.string().optional(),
  water_supply_number: z.string().optional(),
  sqm: z.coerce.number().nonnegative().optional(),
  map_url: z.string().url("Μη έγκυρο URL").optional().or(z.literal("")),
  acquisition_type: z.enum(["flip", "client_owned"]),
  notes: z.string().optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;

export async function saveProperty(input: PropertyInput) {
  const parsed = propertySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }
  const { id, ...values } = parsed.data;
  const supabase = await createClient();

  const payload = {
    ...values,
    map_url: values.map_url || null,
    power_supply_number: values.power_supply_number || null,
    water_supply_number: values.water_supply_number || null,
    notes: values.notes || null,
    sqm: values.sqm ?? null,
  };

  const { error } = id
    ? await supabase.from("properties").update(payload).eq("id", id)
    : await supabase.from("properties").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/admin/properties");
  return {};
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/properties");
  return {};
}
