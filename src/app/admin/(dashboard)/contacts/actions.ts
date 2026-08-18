"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CONTACT_CATEGORIES } from "@/lib/constants";

const contactSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Συμπλήρωσε όνομα"),
  category: z.enum(CONTACT_CATEGORIES),
  phone: z.string().optional(),
  email: z.string().email("Μη έγκυρο email").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export async function saveContact(input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }
  const { id, ...values } = parsed.data;
  const supabase = await createClient();

  const payload = {
    ...values,
    phone: values.phone || null,
    email: values.email || null,
    notes: values.notes || null,
  };

  const { error } = id
    ? await supabase.from("contacts").update(payload).eq("id", id)
    : await supabase.from("contacts").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/admin/contacts");
  return {};
}

export async function deleteContact(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/contacts");
  return {};
}
