"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Copy, Trash, History, CheckCircle2, CircleDotDashed, Edit, Eye } from "lucide-react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface PageManagementDashboardProps {
  pages: Page[]
  onPagesUpdated: () => void // Callback to refresh pages after CUD operations
  setPages: React.Dispatch<React.SetStateAction<Page[]>> // Declare setPages variable
}

export function PageManagementDashboard({ pages, onPagesUpdated, setPages }: PageManagementDashboardProps) {
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
      // No direct selection here, user will see it in the list
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
    <div className="flex-1 p-4 md:p-6 bg-gray-950 text-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Sayfalarım</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700">
            Site Ayarlarını Aç
          </Button>
          <Popover open={showNewPageDialog} onOpenChange={setShowNewPageDialog}>
            <PopoverTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> Yeni Sayfa Oluştur
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
      </div>

      <p className="text-muted-foreground mb-4">{pages.length} sayfa</p>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pages.length === 0 ? (
            <p className="text-muted-foreground text-lg col-span-full text-center py-10">
              Henüz sayfa yok. Yeni bir sayfa oluşturun.
            </p>
          ) : (
            pages.map((page, index) => (
              <PageCard
                key={page.id}
                page={page}
                index={index}
                movePage={movePage}
                onDuplicate={() => {
                  setPageToDuplicate(page)
                  setDuplicatePageTitle(`${page.title}-kopya`)
                  setNewPageSlugForDuplicate(`${page.slug}-kopya`)
                }}
                onDelete={() => setPageToDelete(page)}
                onRestoreVersion={handleRestoreVersion}
              />
            ))
          )}
        </div>
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
    </div>
  )
}

interface PageCardProps {
  page: Page
  index: number
  movePage: (id: string, toIndex: number) => void
  onDuplicate: () => void
  onDelete: () => void
  onRestoreVersion: (pageId: string, versionId: string, versionName: string) => void
}

const PageCard: React.FC<PageCardProps> = ({ page, index, movePage, onDuplicate, onDelete, onRestoreVersion }) => {
  const ref = useRef<HTMLDivElement>(null)
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
    <Card
      ref={ref}
      data-handler-id={handlerId}
      className={`relative bg-gray-800 text-gray-50 border-gray-700 hover:border-blue-500 transition-colors ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{page.title}</CardTitle>
          {page.is_published ? (
            <span className="inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Aktif
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
              <CircleDotDashed className="w-3 h-3 mr-1" /> Aktifleştir
            </span>
          )}
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Oluşturuldu: {new Date(page.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="aspect-video w-full rounded-md bg-gray-700 flex items-center justify-center text-gray-400 text-sm mb-4">
          {/* Placeholder for page preview */}
          <img
            src="/placeholder.svg?height=120&width=200"
            alt="Page Preview"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <p className="text-sm text-muted-foreground mb-4 truncate">{page.slug}</p>
        <div className="flex flex-col gap-2">
          <Link href={`/admin/builder/${page.id}`} passHref>
            <Button variant="outline" className="w-full bg-gray-700 text-gray-50 hover:bg-gray-600 border-gray-600">
              <Edit className="w-4 h-4 mr-2" /> Düzenle
            </Button>
          </Link>
          <Link href={`/${page.slug}`} passHref target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full bg-gray-700 text-gray-50 hover:bg-gray-600 border-gray-600">
              <Eye className="w-4 h-4 mr-2" /> Önizle
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={onDuplicate}
            className="w-full bg-gray-700 text-gray-50 hover:bg-gray-600 border-gray-600"
          >
            <Copy className="w-4 h-4 mr-2" /> Kopyala
          </Button>
          <Button
            variant="outline"
            onClick={onDelete}
            className="w-full bg-gray-700 text-red-400 hover:bg-red-900/20 border-red-800/50"
          >
            <Trash className="w-4 h-4 mr-2" /> Sil
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs text-muted-foreground hover:bg-gray-700">
              <History className="w-3 h-3 mr-1" /> Versiyon Geçmişi
            </Button>
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
                      e.stopPropagation()
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
      </CardContent>
    </Card>
  )
}
