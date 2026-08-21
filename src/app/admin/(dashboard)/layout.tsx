import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getUserAccess } from "@/lib/auth/access";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getUserAccess();
  if (!access) redirect("/admin/login");

  return (
    <SidebarProvider>
      <AdminSidebar isOwner={access.isOwner} permissions={access.permissions} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 space-y-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
