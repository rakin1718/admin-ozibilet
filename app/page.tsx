"use client"

import { useState, useEffect, useCallback } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { AdminHeader } from "@/components/admin-header"
import { PageEditorCanvas } from "@/components/page-editor-canvas"
import { getPages } from "@/server/actions"
import type { Page } from "@/lib/page-types"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar" // Import Sidebar components
import { AdminSidebar } from "@/components/admin-sidebar" // New component for the sidebar content

export default function AdminPanel() {
  const [pages, setPages] = useState<Page[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [isLoadingPages, setIsLoadingPages] = useState(true)

  const fetchPages = useCallback(async () => {
    const fetchedPages = await getPages()
    setPages(fetchedPages)
    if (fetchedPages.length > 0 && !selectedPageId) {
      setSelectedPageId(fetchedPages[0].id) // Select the first page by default
    } else if (fetchedPages.length === 0) {
      setSelectedPageId(null)
    }
    setIsLoadingPages(false)
  }, [selectedPageId])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {" "}
      {/* Set defaultTheme to dark */}
      <DndProvider backend={HTML5Backend}>
        <SidebarProvider>
          {" "}
          {/* Wrap the entire app with SidebarProvider */}
          <div className="flex flex-col h-screen w-full bg-gray-950">
            {" "}
            {/* Ensure dark background for the whole app */}
            <AdminHeader pageId={selectedPageId} /> {/* Header remains at the top */}
            <div className="flex flex-1 overflow-hidden">
              {isLoadingPages ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Sayfalar yükleniyor...
                </div>
              ) : (
                <>
                  <AdminSidebar
                    pages={pages}
                    onSelectPage={setSelectedPageId}
                    onPagesUpdated={fetchPages}
                    selectedPageId={selectedPageId}
                    setPages={setPages}
                  />
                  <SidebarInset>
                    {" "}
                    {/* Main content area wrapped by SidebarInset */}
                    {selectedPageId ? (
                      <PageEditorCanvas key={selectedPageId} pageId={selectedPageId} />
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
                        <div className="text-center">
                          <h2 className="text-2xl font-semibold mb-2">Henüz bir sayfa seçilmedi.</h2>
                          <p className="mb-4">Lütfen sol panelden bir sayfa seçin veya yeni bir sayfa oluşturun.</p>
                        </div>
                      </div>
                    )}
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
