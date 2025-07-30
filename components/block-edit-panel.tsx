"use client"
import type { PageBlock } from "@/lib/page-types"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
// Removed HexColorPicker and Popover as style editing moves to StylesPanel

interface BlockEditPanelProps {
  isOpen: boolean
  onClose: () => void
  block: PageBlock | null
  onSave: (id: string, content: Record<string, any>) => void // Removed styles from onSave
}

export function BlockEditPanel({ isOpen, onClose, block, onSave }: BlockEditPanelProps) {
  const [currentContent, setCurrentContent] = useState<Record<string, any>>({})

  useEffect(() => {
    if (block) {
      setCurrentContent(block.content)
    }
  }, [block])

  const handleContentChange = (key: string, value: any) => {
    setCurrentContent((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (block) {
      onSave(block.id, currentContent) // Only save content
      onClose()
    }
  }

  if (!block) return null

  const renderContentFields = () => {
    switch (block.type) {
      case "text":
        return (
          <div>
            <Label htmlFor="text-content">Metin İçeriği</Label>
            <Textarea
              id="text-content"
              value={currentContent.text || ""}
              onChange={(e) => handleContentChange("text", e.target.value)}
              className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
          </div>
        )
      case "image":
        return (
          <div>
            <Label htmlFor="image-url">Görsel URL</Label>
            <Input
              id="image-url"
              value={currentContent.url || ""}
              onChange={(e) => handleContentChange("url", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="image-alt" className="mt-2 block">
              Alternatif Metin (Alt Text)
            </Label>
            <Input
              id="image-alt"
              value={currentContent.alt || ""}
              onChange={(e) => handleContentChange("alt", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
          </div>
        )
      case "button":
        return (
          <div>
            <Label htmlFor="button-text">Buton Metni</Label>
            <Input
              id="button-text"
              value={currentContent.text || ""}
              onChange={(e) => handleContentChange("text", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="button-link" className="mt-2 block">
              Link (URL)
            </Label>
            <Input
              id="button-link"
              value={currentContent.link || ""}
              onChange={(e) => handleContentChange("link", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
          </div>
        )
      case "hero":
        return (
          <div>
            <Label htmlFor="hero-logo-url">Logo URL</Label>
            <Input
              id="hero-logo-url"
              value={currentContent.logoUrl || ""}
              onChange={(e) => handleContentChange("logoUrl", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="hero-bonus-text" className="mt-2 block">
              Bonus Metni
            </Label>
            <Input
              id="hero-bonus-text"
              value={currentContent.bonusText || ""}
              onChange={(e) => handleContentChange("bonusText", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="hero-bonus-image-url" className="mt-2 block">
              Bonus Görsel URL
            </Label>
            <Input
              id="hero-bonus-image-url"
              value={currentContent.bonusImageUrl || ""}
              onChange={(e) => handleContentChange("bonusImageUrl", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="hero-description" className="mt-2 block">
              Açıklama
            </Label>
            <Textarea
              id="hero-description"
              value={currentContent.description || ""}
              onChange={(e) => handleContentChange("description", e.target.value)}
              className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="hero-social-icons" className="mt-2 block">
              Sosyal Medya İkonları (JSON)
            </Label>
            <Textarea
              id="hero-social-icons"
              value={JSON.stringify(currentContent.socialIcons || [], null, 2)}
              onChange={(e) => {
                try {
                  handleContentChange("socialIcons", JSON.parse(e.target.value))
                } catch (error) {
                  // Hata yönetimi
                }
              }}
              className="min-h-[100px] font-mono text-xs bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
          </div>
        )
      case "chart":
        return (
          <div>
            <Label htmlFor="chart-type">Grafik Tipi</Label>
            <Input
              id="chart-type"
              value={currentContent.chartType || ""}
              onChange={(e) => handleContentChange("chartType", e.target.value)}
              placeholder="Örn: BarChart, LineChart"
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="chart-data" className="mt-2 block">
              Grafik Verisi (JSON)
            </Label>
            <Textarea
              id="chart-data"
              value={JSON.stringify(currentContent.data || [], null, 2)}
              onChange={(e) => {
                try {
                  handleContentChange("data", JSON.parse(e.target.value))
                } catch (error) {
                  // Hata yönetimi
                }
              }}
              className="min-h-[150px] font-mono text-xs bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="chart-keys" className="mt-2 block">
              Veri Anahtarları (Virgülle Ayrılmış)
            </Label>
            <Input
              id="chart-keys"
              value={currentContent.keys ? currentContent.keys.join(", ") : ""}
              onChange={(e) =>
                handleContentChange(
                  "keys",
                  e.target.value.split(",").map((s: string) => s.trim()),
                )
              }
              placeholder="Örn: name, value"
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
          </div>
        )
      case "promo":
        return (
          <div>
            <Label htmlFor="promo-logo-url">Promosyon Logo URL</Label>
            <Input
              id="promo-logo-url"
              value={currentContent.promoLogoUrl || ""}
              onChange={(e) => handleContentChange("promoLogoUrl", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="promo-title" className="mt-2 block">
              Promosyon Başlığı
            </Label>
            <Input
              id="promo-title"
              value={currentContent.promoTitle || ""}
              onChange={(e) => handleContentChange("promoTitle", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="promo-description" className="mt-2 block">
              Promosyon Açıklaması
            </Label>
            <Textarea
              id="promo-description"
              value={currentContent.promoDescription || ""}
              onChange={(e) => handleContentChange("promoDescription", e.target.value)}
              className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
          </div>
        )
      case "event":
        return (
          <div>
            <Label htmlFor="event-name">Etkinlik Adı</Label>
            <Input
              id="event-name"
              value={currentContent.eventName || ""}
              onChange={(e) => handleContentChange("eventName", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="event-date" className="mt-2 block">
              Etkinlik Tarihi
            </Label>
            <Input
              id="event-date"
              type="date"
              value={currentContent.eventDate || ""}
              onChange={(e) => handleContentChange("eventDate", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
            <Label htmlFor="event-location" className="mt-2 block">
              Konum
            </Label>
            <Input
              id="event-location"
              value={currentContent.eventLocation || ""}
              onChange={(e) => handleContentChange("eventLocation", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-400"
            />
          </div>
        )
      default:
        return <p className="text-gray-400">Bu blok tipi için düzenlenecek içerik yok.</p>
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col bg-gray-900 text-gray-100 border-l border-gray-700">
        <SheetHeader>
          <SheetTitle className="text-gray-50">
            {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Bloğu İçeriğini Düzenle
          </SheetTitle>
          <SheetDescription className="text-gray-400">Bloğun içeriğini buradan düzenleyin.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-50">İçerik</h3>
          {renderContentFields()}
        </div>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-700 text-gray-50 hover:bg-gray-600 border-gray-600"
          >
            İptal
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Kaydet
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
