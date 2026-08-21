import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MODULES } from "@/lib/constants";
import type { AccessLevel, ModuleName } from "@/lib/types/database";

export type UserAccess = {
  userId: string;
  fullName: string | null;
  isOwner: boolean;
  permissions: Record<ModuleName, AccessLevel>;
};

const NO_ACCESS: Record<ModuleName, AccessLevel> = Object.fromEntries(
  MODULES.map((m) => [m, "none"])
) as Record<ModuleName, AccessLevel>;

// Reads the current session's role + per-module permissions.
// Relies on RLS (profiles/permissions "member reads own row" policies) —
// a member literally cannot fetch anyone else's data through this call.
export async function getUserAccess(): Promise<UserAccess | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  const isOwner = profile.role === "owner" || profile.role === "admin";

  if (isOwner) {
    const fullAccess: Record<ModuleName, AccessLevel> = Object.fromEntries(
      MODULES.map((m) => [m, "manage"])
    ) as Record<ModuleName, AccessLevel>;
    return { userId: user.id, fullName: profile.full_name, isOwner, permissions: fullAccess };
  }

  const { data: rows } = await supabase
    .from("permissions")
    .select("module, access")
    .eq("profile_id", user.id);

  const permissions = { ...NO_ACCESS };
  for (const row of rows ?? []) {
    permissions[row.module] = row.access;
  }

  return { userId: user.id, fullName: profile.full_name, isOwner: false, permissions };
}

function accessSatisfies(level: AccessLevel, min: "view" | "manage") {
  if (level === "manage") return true;
  if (level === "view" && min === "view") return true;
  return false;
}

// Call at the top of a module's page.tsx. Redirects to the dashboard if the
// signed-in user has no access at all to that module — the underlying data
// is already protected by RLS regardless, this is just so a locked-out
// member sees a sensible redirect instead of a confusingly empty page.
export async function requireModuleAccess(
  module: ModuleName,
  min: "view" | "manage" = "view"
): Promise<UserAccess> {
  const access = await getUserAccess();
  if (!access) redirect("/admin/login");
  if (!accessSatisfies(access.permissions[module], min)) {
    redirect("/admin/dashboard");
  }
  return access;
}

export async function requireOwner(): Promise<UserAccess> {
  const access = await getUserAccess();
  if (!access) redirect("/admin/login");
  if (!access.isOwner) redirect("/admin/dashboard");
  return access;
}
