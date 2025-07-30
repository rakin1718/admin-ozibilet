"use client"

import type React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import type { Page } from "@/lib/page-types"
import {
  Package2,
  Settings,
  Home,
  LayoutDashboard,
  Ticket,
  CircleUser,
  Globe,
  CreditCard,
  History,
  FileText,
  ImageIcon,
} from "lucide-react" // Added more icons
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminSidebarProps {
  pages: Page[]
  onSelectPage: (pageId: string) => void
  onPagesUpdated: () => void
  selectedPageId: string | null
  setPages: React.Dispatch<React.SetStateAction<Page[]>>
}

export function AdminSidebar({ pages, onSelectPage, onPagesUpdated, selectedPageId, setPages }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Gösterge Paneli",
      href: "/admin/dashboard", // Placeholder for a future dashboard page
      icon: LayoutDashboard,
    },
    {
      title: "Alan Adları",
      href: "/admin/domains", // Placeholder
      icon: Globe,
    },
  ]

  const contentCreationItems = [
    {
      title: "Sayfalar",
      href: "/admin/pages", // Link to the new pages dashboard
      icon: Home,
    },
    {
      title: "Canlı Yayın Kartları",
      href: "/admin/live-cards", // Placeholder
      icon: Ticket,
    },
    {
      title: "Overlay",
      href: "/admin/overlay", // Placeholder
      icon: ImageIcon,
    },
  ]

  const accountItems = [
    {
      title: "Hesap & Faturalandırma",
      href: "/admin/billing", // Placeholder
      icon: CreditCard,
    },
    {
      title: "Ödeme",
      href: "/admin/payments", // Placeholder
      icon: Ticket, // Reusing Ticket icon for now
    },
    {
      title: "Abonelik Geçmişi",
      href: "/admin/subscriptions", // Placeholder
      icon: History,
    },
    {
      title: "Kullanıcı Logları",
      href: "/admin/user-logs", // Placeholder
      icon: FileText,
    },
  ]

  const otherItems = [
    {
      title: "Belgeler",
      href: "/admin/docs", // Placeholder
      icon: FileText,
    },
    {
      title: "Medya",
      href: "/admin/media", // Placeholder
      icon: ImageIcon,
    },
    {
      title: "Ayarlar",
      href: "/admin/settings", // Placeholder
      icon: Settings,
    },
  ]

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader className="p-2">
        <Link href="/admin/pages" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Package2 className="h-6 w-6" />
          <span className="sr-only group-data-[collapsible=icon]/sidebar-wrapper:hidden">Ozibilet Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Genel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">İçerik Üretimi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentCreationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Hesap & Faturalandırma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup className="flex-1 flex flex-col min-h-0">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Diğer</SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 min-h-0">
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/profile">
                <CircleUser />
                <span className="group-data-[collapsible=icon]:hidden">Ozibey</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
