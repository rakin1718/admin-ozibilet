"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Copy, Trash, History, CheckCircle2, CircleDotDashed } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Page } from "@/lib/page-types"
import { useDrag, useDrop } from "react-dnd"
import { ItemTypes, type PageDragItem } from "@/lib/dnd-types"
import {
  createPage,
  duplicatePage,
  deletePage as deletePageAction,
  restorePageVersion,
  updatePageOrder,
} from "@/server/actions"
import { toast } from "@/components/ui/use-toast"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuAction } from "@/components/ui/sidebar" // Import sidebar menu components

interface PageListSidebarProps {
  pages: Page[]
  onSelectPage: (pageId: string) => void
  onPagesUpdated: () => void // Callback to refresh pages after CUD operations
  selectedPageId: string | null
  setPages: React.Dispatch<React.SetStateAction<Page[]>> // Declare setPages variable
}

export function PageListSidebar({
  pages,
  onSelectPage,
  onPagesUpdated,
  selectedPageId,
  setPages,
}: PageListSidebarProps) {
  const [newPageTitle, setNewPageTitle] = useState("")
  const [newPageSlug, setNewPageSlug] = useState("")
  const [duplicatePageTitle, setDuplicatePageTitle] = useState("")
  const [duplicatePageSlug, setNewPageSlugForDuplicate] = useState("") // Renamed for clarity
  const [pageToDuplicate, setPageToDuplicate] = useState<Page | null>(null)
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null)
  const [showNewPageDialog, setShowNewPageDialog] = useState(false)

  const handleCreatePage = async () => {
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      toast({
        title: "Hata",
        description: "Sayfa başlığı ve slug boş olamaz.",
        variant: "destructive",
      })
      return
    }
    const newPage = await createPage(newPageTitle.trim(), newPageSlug.trim(), []) // Boş içerikle başla
    if (newPage) {
      toast({
        title: "Başarılı",
        description: `"${newPage.title}" sayfası oluşturuldu.`,
      })
      setNewPageTitle("")
      setNewPageSlug("")
      setShowNewPageDialog(false)
      onPagesUpdated()
      onSelectPage(newPage.id) // Yeni sayfayı seç
    } else {
      toast({
        title: "Hata",
        description: "Sayfa oluşturulurken bir sorun oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleDuplicatePage = async () => {
    if (!pageToDuplicate || !duplicatePageTitle.trim() || !duplicatePageSlug.trim()) {
      toast({
        title: "Hata",
        description: "Kopyalanacak sayfa, yeni başlık veya slug boş olamaz.",
        variant: "destructive",
      })
      return
    }
    const duplicated = await duplicatePage(pageToDuplicate.id, duplicatePageTitle.trim(), duplicatePageSlug.trim())
    if (duplicated) {
      toast({
        title: "Başarılı",
        description: `"${pageToDuplicate.title}" sayfası "${duplicated.title}" olarak kopyalandı.`,
      })
      setPageToDuplicate(null)
      setDuplicatePageTitle("")
      setNewPageSlugForDuplicate("")
      onPagesUpdated()
      onSelectPage(duplicated.id) // Kopyalanan sayfayı seç
    } else {
      toast({
        title: "Hata",
        description: "Sayfa kopyalanırken bir sorun oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePage = async () => {
    if (!pageToDelete) return
    const success = await deletePageAction(pageToDelete.id)
    if (success) {
      toast({
        title: "Başarılı",
        description: `"${pageToDelete.title}" sayfası silindi.`,
      })
      setPageToDelete(null)
      onPagesUpdated()
      if (selectedPageId === pageToDelete.id) {
        onSelectPage(pages[0]?.id || null) // İlk sayfayı seç veya hiçbirini
      }
    } else {
      toast({
        title: "Hata",
        description: "Sayfa silinirken bir sorun oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleRestoreVersion = async (pageId: string, versionId: string, versionName: string) => {
    const restoredPage = await restorePageVersion(pageId, versionId)
    if (restoredPage) {
      toast({
        title: "Başarılı",
        description: `Sayfa "${versionName}" versiyonuna geri yüklendi.`,
      })
      onPagesUpdated() // Sayfa listesini ve içeriğini yenile
      onSelectPage(pageId) // Mevcut sayfayı tekrar seç
    } else {
      toast({
        title: "Hata",
        description: "Versiyon geri yüklenirken bir sorun oluştu.",
        variant: "destructive",
      })
    }
  }

  const movePage = useCallback(
    (dragId: string, hoverIndex: number) => {
      const dragPage = pages.find((p) => p.id === dragId)
      if (!dragPage) return

      const dragIndex = pages.indexOf(dragPage)
      if (dragIndex === -1) return

      const newPages = Array.from(pages)
      newPages.splice(dragIndex, 1)
      newPages.splice(hoverIndex, 0, dragPage)

      setPages(newPages)
      updatePageOrder(newPages.map((p) => p.id)).then((success) => {
        if (!success) {
          toast({
            title: "Hata",
            description: "Sayfa sıralaması güncellenirken bir sorun oluştu.",
            variant: "destructive",
          })
          onPagesUpdated() // Re-fetch to revert if DB update fails
        }
      })
    },
    [pages, onPagesUpdated, setPages],
  )

  return (
    <>
      <div className="flex items-center justify-between mb-2 px-2">
        {" "}
        {/* Added padding for alignment */}
        <h4 className="text-sm font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
          Sayfalar
        </h4>
        <Popover open={showNewPageDialog} onOpenChange={setShowNewPageDialog}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" title="Yeni Sayfa Oluştur" className="h-7 w-7">
              <Plus className="w-4 h-4" />
              <span className="sr-only">Yeni Sayfa Oluştur</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 bg-gray-800 text-gray-50 border-gray-700">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Yeni Sayfa</h4>
                <p className="text-sm text-muted-foreground">Yeni sayfanız için bir başlık ve slug girin.</p>
              </div>
              <Input
                placeholder="Sayfa Başlığı (örn. Hakkımızda)"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
              />
              <Input
                placeholder="Sayfa Slug (örn. hakkimizda)"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
              />
              <Button onClick={handleCreatePage} className="bg-blue-600 hover:bg-blue-700 text-white">
                Oluştur
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <ScrollArea className="h-full pr-4">
        {pages.length === 0 ? (
          <p className="text-muted-foreground text-sm px-2">Henüz sayfa yok. Yeni bir sayfa oluşturun.</p>
        ) : (
          <SidebarMenu>
            {" "}
            {/* Use SidebarMenu for the list */}
            {pages.map((page, index) => (
              <PageListItem
                key={page.id}
                page={page}
                index={index}
                onSelectPage={onSelectPage}
                isSelected={selectedPageId === page.id}
                movePage={movePage}
                onDuplicate={() => {
                  setPageToDuplicate(page)
                  setDuplicatePageTitle(`${page.title}-kopya`)
                  setNewPageSlugForDuplicate(`${page.slug}-kopya`)
                }}
                onDelete={() => setPageToDelete(page)}
                onRestoreVersion={handleRestoreVersion}
              />
            ))}
          </SidebarMenu>
        )}
      </ScrollArea>

      {/* Kopyalama Onay Dialogu */}
      <AlertDialog open={!!pageToDuplicate} onOpenChange={(open) => !open && setPageToDuplicate(null)}>
        <AlertDialogContent className="bg-gray-800 text-gray-50 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-50">Sayfayı Kopyala</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              "{pageToDuplicate?.title}" sayfasını kopyalıyorsunuz. Yeni sayfa için bir başlık ve slug girin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Yeni Sayfa Başlığı"
            value={duplicatePageTitle}
            onChange={(e) => setDuplicatePageTitle(e.target.value)}
            className="mb-2 bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
          />
          <Input
            placeholder="Yeni Sayfa Slug"
            value={duplicatePageSlug}
            onChange={(e) => setNewPageSlugForDuplicate(e.target.value)}
            className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-gray-50 hover:bg-gray-600 border-gray-600">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDuplicatePage} className="bg-blue-600 hover:bg-blue-700 text-white">
              Kopyala
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Silme Onay Dialogu */}
      <AlertDialog open={!!pageToDelete} onOpenChange={(open) => !open && setPageToDelete(null)}>
        <AlertDialogContent className="bg-gray-800 text-gray-50 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-50">Sayfayı Sil</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              "{pageToDelete?.title}" sayfasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-gray-50 hover:bg-gray-600 border-gray-600">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePage} className="bg-red-500 hover:bg-red-600 text-white">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface PageListItemProps {
  page: Page
  index: number
  onSelectPage: (pageId: string) => void
  isSelected: boolean
  movePage: (id: string, toIndex: number) => void
  onDuplicate: () => void
  onDelete: () => void
  onRestoreVersion: (pageId: string, versionId: string, versionName: string) => void
}

const PageListItem: React.FC<PageListItemProps> = ({
  page,
  index,
  onSelectPage,
  isSelected,
  movePage,
  onDuplicate,
  onDelete,
  onRestoreVersion,
}) => {
  const ref = useRef<HTMLLIElement>(null)
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.PAGE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: PageDragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      movePage(item.id, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PAGE,
    item: () => {
      return { id: page.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <SidebarMenuItem
      ref={ref}
      data-handler-id={handlerId}
      className={`group/menu-item relative ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <SidebarMenuButton asChild isActive={isSelected} onClick={() => onSelectPage(page.id)}>
        <a href="#">
          {" "}
          {/* Use a dummy href or actual link if routing */}
          <span className="truncate flex-1">{page.title}</span>
          {page.is_published ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" title="Yayınlandı" />
          ) : (
            <CircleDotDashed className="w-4 h-4 text-yellow-500" title="Taslak" />
          )}
        </a>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <History className="w-4 h-4" />
            <span className="sr-only">Versiyon Geçmişi</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56 bg-gray-800 text-gray-50 border-gray-700">
          <DropdownMenuLabel className="text-gray-50">Versiyon Geçmişi</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          {page.versions && page.versions.length > 0 ? (
            page.versions
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((version) => (
                <DropdownMenuItem
                  key={version.id}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent closing dropdown and page selection
                    onRestoreVersion(page.id, version.id, `Versiyon ${version.version_number}`)
                  }}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  <span>Versiyon {version.version_number}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(version.createdAt).toLocaleDateString()}
                  </span>
                </DropdownMenuItem>
              ))
          ) : (
            <DropdownMenuItem disabled className="text-gray-400">
              Versiyon yok
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <SidebarMenuAction
        showOnHover
        onClick={(e) => {
          e.stopPropagation()
          onDuplicate()
        }}
        title="Kopyala"
      >
        <Copy className="w-4 h-4" />
        <span className="sr-only">Kopyala</span>
      </SidebarMenuAction>
      <SidebarMenuAction
        showOnHover
        className="text-red-500 hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        title="Sil"
      >
        <Trash className="w-4 h-4" />
        <span className="sr-only">Sil</span>
      </SidebarMenuAction>
    </SidebarMenuItem>
  )
}
