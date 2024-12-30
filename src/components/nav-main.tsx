"use client";
import { usePathname } from "next/navigation";

import { LayoutDashboard, ReceiptText, Tag, Wallet } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

const links = [
  {
    title: "Overview",
    url: "/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Records",
    url: "/records",
    icon: ReceiptText,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Wallet,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Tag,
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.title}>
            <a href={link.url}>
              <SidebarMenuButton
                tooltip={link.title}
                isActive={pathname === link.url ? true : false}
              >
                {link.icon && <link.icon />}
                <span>{link.title}</span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
