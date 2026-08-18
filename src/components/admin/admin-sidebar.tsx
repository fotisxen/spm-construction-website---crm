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

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Επισκόπηση", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Ακίνητα", icon: Building2 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/contacts", label: "Συνεργάτες", icon: Users },
  { href: "/admin/payments", label: "Πληρωμές", icon: Banknote },
  { href: "/admin/expenses", label: "Έξοδα", icon: Receipt },
  { href: "/admin/income", label: "Έσοδα", icon: TrendingUp },
  { href: "/admin/supplies", label: "Προμήθειες", icon: Boxes },
  { href: "/admin/reports", label: "Αναφορές", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
              {NAV_ITEMS.map((item) => (
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
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
