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
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return {
          success: false,
          error:
            "Το email δεν έχει επιβεβαιωθεί ακόμα. Στο Supabase dashboard -> Authentication -> Users, άνοιξε τον χρήστη και κάνε 'Confirm email' χειροκίνητα (ή απενεργοποίησε το 'Confirm email' απαίτηση από Authentication -> Providers -> Email).",
        };
      }
      // Surfaced as-is for now (only reaches this admin-only login) so we can see the real cause.
      return { success: false, error: `Σφάλμα σύνδεσης: ${error.message}` };
    }
    return { success: true };
  } catch (e) {
    console.error("Login fetch failure:", e);
    const cause = e instanceof Error && e.cause instanceof Error ? e.cause.message : undefined;
    return {
      success: false,
      error: `Δεν ήταν δυνατή η σύνδεση: ${e instanceof Error ? e.message : "άγνωστο σφάλμα"}${cause ? ` (${cause})` : ""}`,
    };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
