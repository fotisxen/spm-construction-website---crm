"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const leadSchema = z.object({
  name: z.string().min(2, "Συμπλήρωσε το όνομά σου"),
  phone: z.string().optional(),
  email: z.string().email("Μη έγκυρο email").optional().or(z.literal("")),
  message: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export async function submitLead(
  input: LeadInput
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      message: parsed.data.message || null,
    });

    if (error) {
      return { success: false, error: "Δεν ήταν δυνατή η αποστολή. Δοκίμασε ξανά." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Δεν ήταν δυνατή η αποστολή. Δοκίμασε ξανά." };
  }
}
