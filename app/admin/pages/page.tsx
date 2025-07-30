"use client"

import { useState, useEffect, useCallback } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { AdminHeader } from "@/components/admin-header"
import { getPages } from "@/server/actions"
import type { Page } from "@/lib/page-types"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { PageManagementDashboard } from "@/components/page-management-dashboard"

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoadingPages, setIsLoadingPages] = useState(true)

  const fetchPages = useCallback(async () => {
    const fetchedPages = await getPages()
    setPages(fetchedPages)
    setIsLoadingPages(false)
  }, [])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <DndProvider backend={HTML5Backend}>
        <SidebarProvider>
          <div className="flex flex-col h-screen w-full bg-gray-950">
            <AdminHeader pageId={null} /> {/* No specific page selected on dashboard */}
            <div className="flex flex-1 overflow-hidden">
              {isLoadingPages ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Sayfalar yükleniyor...
                </div>
              ) : (
                <>
                  <AdminSidebar
                    pages={pages}
                    onSelectPage={() => {}} // No direct page selection from sidebar on this page
                    onPagesUpdated={fetchPages}
                    selectedPageId={null}
                    setPages={setPages}
                  />
                  <SidebarInset>
                    <PageManagementDashboard pages={pages} onPagesUpdated={fetchPages} setPages={setPages} />
                  </SidebarInset>
                </>
              )}
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </DndProvider>
    </ThemeProvider>
  )
}
