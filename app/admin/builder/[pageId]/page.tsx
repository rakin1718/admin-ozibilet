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
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { redirect } from "next/navigation"

interface AdminBuilderPageProps {
  params: {
    pageId: string
  }
}

export default function AdminBuilderPage({ params }: AdminBuilderPageProps) {
  const { pageId } = params
  const [pages, setPages] = useState<Page[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string | null>(pageId)
  const [isLoadingPages, setIsLoadingPages] = useState(true)

  const fetchPages = useCallback(async () => {
    const fetchedPages = await getPages()
    setPages(fetchedPages)
    if (fetchedPages.length > 0 && !selectedPageId) {
      setSelectedPageId(fetchedPages[0].id)
    } else if (fetchedPages.length === 0) {
      setSelectedPageId(null)
    }
    setIsLoadingPages(false)
  }, [selectedPageId])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  // Redirect to /admin/pages if no pageId is provided or pages are loading/empty
  useEffect(() => {
    if (!pageId && !isLoadingPages && pages.length === 0) {
      redirect("/admin/pages")
    }
  }, [pageId, isLoadingPages, pages.length])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <DndProvider backend={HTML5Backend}>
        <SidebarProvider>
          <div className="flex flex-col h-screen w-full bg-gray-950">
            <AdminHeader pageId={selectedPageId} />
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
