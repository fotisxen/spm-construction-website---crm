"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Users,
  Banknote,
  Receipt,
  TrendingUp,
  Boxes,
  BarChart3,
  LogOut,
  UserCog,
  UsersRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/lib/site-config";
import { logout } from "@/app/admin/login/actions";
import type { AccessLevel, ModuleName } from "@/lib/types/database";

const NAV_ITEMS: { href: string; label: string; icon: typeof Building2; module: ModuleName | null }[] = [
  { href: "/admin/dashboard", label: "Επισκόπηση", icon: LayoutDashboard, module: null },
  { href: "/admin/properties", label: "Ακίνητα", icon: Building2, module: "properties" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, module: "projects" },
  { href: "/admin/contacts", label: "Συνεργάτες", icon: Users, module: "contacts" },
  { href: "/admin/payments", label: "Πληρωμές", icon: Banknote, module: "payments" },
  { href: "/admin/expenses", label: "Έξοδα", icon: Receipt, module: "expenses" },
  { href: "/admin/income", label: "Έσοδα", icon: TrendingUp, module: "income" },
  { href: "/admin/supplies", label: "Προμήθειες", icon: Boxes, module: "supplies" },
  { href: "/admin/reports", label: "Αναφορές", icon: BarChart3, module: "reports" },
];

export function AdminSidebar({
  isOwner,
  permissions,
}: {
  isOwner: boolean;
  permissions: Record<ModuleName, AccessLevel>;
}) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter(
    (item) => item.module === null || permissions[item.module] !== "none"
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1.5">
          <p className="font-heading text-sm font-semibold">
            {siteConfig.shortName}
          </p>
          <p className="text-xs text-muted-foreground">Διαχειριστικό</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Μενού</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname?.startsWith(item.href)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isOwner && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/admin/team" />}
                    isActive={pathname?.startsWith("/admin/team")}
                  >
                    <UsersRound />
                    <span>Ομάδα</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/admin/profile" />}
              isActive={pathname?.startsWith("/admin/profile")}
            >
              <UserCog />
              <span>Το προφίλ μου</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={logout}>
              <SidebarMenuButton type="submit">
                <LogOut />
                <span>Αποσύνδεση</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
