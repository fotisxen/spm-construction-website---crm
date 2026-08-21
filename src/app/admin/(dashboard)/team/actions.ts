"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireOwner } from "@/lib/auth/access";
import { MODULES, ACCESS_LEVELS } from "@/lib/constants";

const permissionsSchema = z.record(z.enum(MODULES), z.enum(ACCESS_LEVELS));

const inviteSchema = z.object({
  email: z.string().email("Μη έγκυρο email"),
  full_name: z.string().min(2, "Συμπλήρωσε όνομα"),
  permissions: permissionsSchema,
});

export async function inviteMember(input: z.infer<typeof inviteSchema>) {
  await requireOwner();

  const parsed = inviteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Λείπει το service role key" };
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(parsed.data.email);
  if (error || !data.user) {
    return { error: error?.message ?? "Η πρόσκληση απέτυχε" };
  }

  const supabase = await createClient();

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    role: "member",
  });
  if (profileError) {
    return { error: profileError.message };
  }

  const permissionRows = MODULES.map((module) => ({
    profile_id: data.user!.id,
    module,
    access: parsed.data.permissions[module],
  }));
  const { error: permError } = await supabase.from("permissions").insert(permissionRows);
  if (permError) {
    return { error: permError.message };
  }

  revalidatePath("/admin/team");
  return {};
}

const updateSchema = z.object({
  profileId: z.string().uuid(),
  full_name: z.string().min(2, "Συμπλήρωσε όνομα"),
  permissions: permissionsSchema,
});

export async function updateMember(input: z.infer<typeof updateSchema>) {
  await requireOwner();

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }

  const supabase = await createClient();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name })
    .eq("id", parsed.data.profileId);
  if (profileError) return { error: profileError.message };

  const permissionRows = MODULES.map((module) => ({
    profile_id: parsed.data.profileId,
    module,
    access: parsed.data.permissions[module],
  }));
  const { error: permError } = await supabase
    .from("permissions")
    .upsert(permissionRows, { onConflict: "profile_id,module" });
  if (permError) return { error: permError.message };

  revalidatePath("/admin/team");
  return {};
}

export async function removeMember(profileId: string) {
  await requireOwner();

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Λείπει το service role key" };
  }

  const { error } = await admin.auth.admin.deleteUser(profileId);
  if (error) return { error: error.message };

  revalidatePath("/admin/team");
  return {};
}
