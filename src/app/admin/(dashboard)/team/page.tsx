import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireOwner } from "@/lib/auth/access";
import { MODULES } from "@/lib/constants";
import { TeamManager } from "@/app/admin/(dashboard)/team/team-manager";
import type { AccessLevel, ModuleName } from "@/lib/types/database";
import type { MemberRow } from "@/app/admin/(dashboard)/team/member-form";

export const metadata: Metadata = { title: "Ομάδα" };

export default async function TeamPage() {
  const access = await requireOwner();
  const supabase = await createClient();

  const [{ data: profiles }, { data: permissionRows }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email, role").order("created_at"),
    supabase.from("permissions").select("profile_id, module, access"),
  ]);

  const owner = (profiles ?? []).find((p) => p.role === "owner" || p.role === "admin");
  const memberProfiles = (profiles ?? []).filter((p) => p.role === "member");

  const members: MemberRow[] = memberProfiles.map((p) => {
    const permissions = Object.fromEntries(
      MODULES.map((m) => [m, "none"])
    ) as Record<ModuleName, AccessLevel>;
    for (const row of permissionRows ?? []) {
      if (row.profile_id === p.id) permissions[row.module] = row.access;
    }
    return {
      profileId: p.id,
      fullName: p.full_name ?? "—",
      email: p.email ?? "—",
      permissions,
    };
  });

  return (
    <TeamManager
      owner={{ fullName: owner?.full_name ?? access.fullName ?? "—", email: owner?.email ?? "—" }}
      members={members}
    />
  );
}
