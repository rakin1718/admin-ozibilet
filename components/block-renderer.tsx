"use client"
import type { PageBlock } from "@/lib/page-types"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash, Copy, Edit, TextIcon as Telegram, Instagram, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePageEditor } from "@/hooks/use-page-editor"
import Link from "next/link"

interface BlockRendererProps {
  block: PageBlock
  onEdit: (blockId: string) => void
  isDragging?: boolean
}

export function BlockRenderer({ block, onEdit, isDragging = false }: BlockRendererProps) {
  const { deleteBlock, copyBlock } = usePageEditor({})

  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        return <p className="text-base" dangerouslySetInnerHTML={{ __html: block.content.text || "Metin bloğu" }} />
      case "image":
        return (
          <img
            src={block.content.url || "/placeholder.svg?height=200&width=300&query=placeholder-image"}
            alt={block.content.alt || "Görsel"}
            className="max-w-full h-auto rounded-md"
            style={block.styles}
          />
        )
      case "button":
        return (
          <Button style={block.styles} className={cn(block.styles?.className)}>
            {block.content.text || "Buton"}
          </Button>
        )
      case "hero":
        return (
          <div
            className="relative p-8 rounded-lg text-center overflow-hidden"
            style={{
              background: block.styles?.background || "linear-gradient(to right, #8a2be2, #ff1493)",
              color: block.styles?.color || "#ffffff",
              ...block.styles,
            }}
          >
            {/* Background pattern/texture if any */}
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `url(/placeholder.svg?height=100&width=100&query=abstract-pattern)` }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center">
              {block.content.logoUrl && (
                <img src={block.content.logoUrl || "/placeholder.svg"} alt="Ozibey Logo" className="mb-4 h-16 w-auto" />
              )}
              <div className="flex gap-4 mb-6">
                {block.content.socialIcons?.map((icon: any) => (
                  <Link key={icon.type} href={icon.url} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-white/20 hover:bg-white/30 text-white"
                    >
                      {icon.type === "telegram" && <Telegram className="h-6 w-6" />}
                      {icon.type === "instagram" && <Instagram className="h-6 w-6" />}
                      {icon.type === "youtube" && <Youtube className="h-6 w-6" />}
                      <span className="sr-only">{icon.type}</span>
                    </Button>
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-5xl font-bold">{block.content.bonusText || "Bonus Metni"}</span>
                {block.content.bonusImageUrl && (
                  <img
                    src={block.content.bonusImageUrl || "/placeholder.svg"}
                    alt="Bonus Figure"
                    className="h-24 w-24 object-contain"
                  />
                )}
              </div>
              {block.content.description && <p className="text-lg max-w-2xl">{block.content.description}</p>}
            </div>
          </div>
        )
      case "chart":
        return (
          <div className="bg-blue-100 p-4 rounded-md text-center border border-blue-300">
            <p className="font-semibold">Grafik Bloğu</p>
            <p className="text-sm text-muted-foreground">{block.content.chartType || "Bilinmeyen Grafik"}</p>
          </div>
        )
      case "promo":
        return (
          <div
            className="relative p-4 rounded-lg text-center border-2"
            style={{
              borderColor: block.styles?.borderColor || "#ffffff",
              backgroundColor: block.styles?.backgroundColor || "hsl(var(--card))",
              color: block.styles?.color || "hsl(var(--card-foreground))",
              ...block.styles,
            }}
          >
            {block.content.promoLogoUrl && (
              <img
                src={block.content.promoLogoUrl || "/placeholder.svg"}
                alt={block.content.promoTitle || "Promosyon Logosu"}
                className="mx-auto mb-2 h-8 w-auto object-contain"
              />
            )}
            <h3 className="font-semibold text-lg mb-1">{block.content.promoTitle || "Promosyon Başlığı"}</h3>
            <p className="text-sm text-muted-foreground">{block.content.promoDescription || "Promosyon Metni"}</p>
          </div>
        )
      case "event":
        return (
          <div className="bg-green-100 p-4 rounded-md text-center border border-green-300">
            <h3 className="font-semibold">Etkinlik Bloğu</h3>
            <p className="text-sm text-muted-foreground">{block.content.eventName || "Etkinlik Adı"}</p>
          </div>
        )
      default:
        return <p className="text-muted-foreground">Bilinmeyen blok tipi: {block.type}</p>
    }
  }

  return (
    <Card
      className={cn(
        "relative p-4 border-2 border-dashed border-transparent hover:border-blue-400 group bg-transparent", // Ensure transparent background for hover effect
        isDragging && "opacity-50 border-blue-500",
      )}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button variant="outline" size="icon" className="h-7 w-7 bg-background" onClick={() => onEdit(block.id)}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Düzenle</span>
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7 bg-background" onClick={() => copyBlock(block.id)}>
          <Copy className="h-4 w-4" />
          <span className="sr-only">Kopyala</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 text-red-500 hover:text-red-600 bg-background"
          onClick={() => deleteBlock(block.id)}
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Sil</span>
        </Button>
      </div>
      {renderBlockContent()}
    </Card>
  )
}
