import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

// Service-role client — bypasses RLS entirely. Only used for the Team
// management admin actions (invite/remove member), and only ever imported
// from server-only modules. Never expose SUPABASE_SERVICE_ROLE_KEY to the
// client (no NEXT_PUBLIC_ prefix).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY δεν έχει οριστεί στο .env.local — χρειάζεται για διαχείριση ομάδας."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
