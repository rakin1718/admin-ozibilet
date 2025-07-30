"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleUser, Package2, Search, Monitor, Tablet, Smartphone } from "lucide-react" // Import responsive icons
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { usePageEditor } from "@/hooks/use-page-editor"
import { toast } from "@/components/ui/use-toast"
import { publishPage, savePageDraft } from "@/server/actions"
import { useCallback } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar" // Import SidebarTrigger
import { usePathname } from "next/navigation"

interface AdminHeaderProps {
  pageId: string | null
}

export function AdminHeader({ pageId }: AdminHeaderProps) {
  const { page, blocks } = usePageEditor({ pageId: pageId || "" })
  const pathname = usePathname()

  const handleSaveDraft = useCallback(async () => {
    if (!pageId) {
      toast({
        title: "Hata",
        description: "Kaydedilecek bir sayfa seçili değil.",
        variant: "destructive",
      })
      return
    }
    const savedPage = await savePageDraft(pageId, page.title, page.slug, blocks)
    if (savedPage) {
      toast({
        title: "Başarılı",
        description: `"${savedPage.title}" taslak olarak kaydedildi.`,
      })
    } else {
      toast({
        title: "Hata",
        description: "Taslak kaydedilirken bir sorun oluştu.",
        variant: "destructive",
      })
    }
  }, [pageId, page.title, page.slug, blocks])

  const handlePublishPage = useCallback(async () => {
    if (!pageId) {
      toast({
        title: "Hata",
        description: "Yayınlanacak bir sayfa seçili değil.",
      })
      return
    }
    const publishedPage = await publishPage(pageId, page.title, page.slug, blocks)
    if (publishedPage) {
      toast({
        title: "Başarılı",
        description: `"${publishedPage.title}" başarıyla yayınlandı.`,
      })
    } else {
      toast({
        title: "Hata",
        description: "Sayfa yayınlanırken bir sorun oluştu.",
        variant: "destructive",
      })
    }
  }, [pageId, page.title, page.slug, blocks])

  const isBuilderPage = pathname.startsWith("/admin/builder")

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-gray-900 px-4 md:px-6 z-10 text-gray-50 border-gray-700">
      <SidebarTrigger className="shrink-0 md:hidden" /> {/* Mobile trigger for sidebar */}
      <Link href="/admin/pages" className="flex items-center gap-2 text-lg font-semibold md:text-base">
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Ozibilet Admin</span>
      </Link>
      {isBuilderPage && (
        <div className="flex-1 flex items-center gap-2">
          <h2 className="text-xl font-semibold truncate">{page.title || "Sayfa Başlığı"}</h2>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-gray-50">
              <Monitor className="h-4 w-4" />
              <span className="sr-only">Masaüstü Görünümü</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-gray-50">
              <Tablet className="h-4 w-4" />
              <span className="sr-only">Tablet Görünümü</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-gray-50">
              <Smartphone className="h-4 w-4" />
              <span className="sr-only">Mobil Görünüm</span>
            </Button>
          </div>
        </div>
      )}
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ara..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-gray-800 border-gray-700 text-gray-50 placeholder:text-gray-400"
            />
          </div>
        </form>
        {pageId && isBuilderPage && (
          <>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
            >
              Taslağı Kaydet
            </Button>
            <Button onClick={handlePublishPage} className="bg-blue-600 hover:bg-blue-700 text-white">
              Yayınla
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full bg-gray-700 text-gray-50 hover:bg-gray-600">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Kullanıcı Menüsü</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 text-gray-50 border-gray-700">
            <DropdownMenuLabel className="text-gray-50">Hesabım</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">Ayarlar</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">Destek</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">Çıkış Yap</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
