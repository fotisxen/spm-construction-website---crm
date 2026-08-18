"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(
  input: z.infer<typeof loginSchema>
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Συμπλήρωσε email και κωδικό" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) {
      return { success: false, error: "Λάθος στοιχεία σύνδεσης" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Δεν ήταν δυνατή η σύνδεση. Δοκίμασε ξανά." };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
