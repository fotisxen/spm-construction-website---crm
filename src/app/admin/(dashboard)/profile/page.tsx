import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/app/admin/(dashboard)/profile/profile-form";

export const metadata: Metadata = { title: "Το προφίλ μου" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return <ProfileForm fullName={profile?.full_name ?? ""} email={user.email ?? "—"} />;
}
