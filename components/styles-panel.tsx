"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import type { PageBlock } from "@/lib/page-types"
import { Button } from "@/components/ui/button"

interface StylesPanelProps {
  selectedBlock: PageBlock | null
  updateBlock: (id: string, content: Record<string, any>, styles?: Record<string, any>) => void
}

export function StylesPanel({ selectedBlock, updateBlock }: StylesPanelProps) {
  const handleStyleChange = (key: string, value: any) => {
    if (selectedBlock) {
      updateBlock(selectedBlock.id, selectedBlock.content, { ...selectedBlock.styles, [key]: value })
    }
  }

  if (!selectedBlock) {
    return (
      <div className="w-64 shrink-0 border-l border-gray-700 bg-gray-900 p-4 text-gray-50 hidden md:flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Stiller</h3>
        <p className="text-muted-foreground text-sm">Düzenlemek için bir blok seçin.</p>
      </div>
    )
  }

  const currentStyles = selectedBlock.styles || {}

  return (
    <div className="w-64 shrink-0 border-l border-gray-700 bg-gray-900 p-4 text-gray-50 hidden md:flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Stiller</h3>
      <p className="text-muted-foreground text-sm mb-4">Tüm bileşenlere istediğin stili ekleyebilirsin</p>

      <div className="flex gap-2 mb-4">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
        >
          Masaüstü
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
        >
          Tablet
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
        >
          Mobil
        </Button>
      </div>

      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-6">
          {/* Tipografi */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-50">Tipografi</h4>
            <div>
              <Label htmlFor="text-align" className="text-sm text-muted-foreground">
                Metin Hizalama
              </Label>
              <div className="flex gap-1 mt-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1 bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
                  onClick={() => handleStyleChange("textAlign", "left")}
                >
                  <span className="sr-only">Sola Hizala</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-align-left"
                  >
                    <line x1="21" x2="3" y1="6" y2="6" />
                    <line x1="15" x2="3" y1="12" y2="12" />
                    <line x1="17" x2="3" y1="18" y2="18" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1 bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
                  onClick={() => handleStyleChange("textAlign", "center")}
                >
                  <span className="sr-only">Ortala</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-align-center"
                  >
                    <line x1="18" x2="6" y1="6" y2="6" />
                    <line x1="21" x2="3" y1="12" y2="12" />
                    <line x1="16" x2="8" y1="18" y2="18" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1 bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
                  onClick={() => handleStyleChange("textAlign", "right")}
                >
                  <span className="sr-only">Sağa Hizala</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-align-right"
                  >
                    <line x1="21" x2="3" y1="6" y2="6" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                    <line x1="21" x2="7" y1="18" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="font-family" className="text-sm text-muted-foreground">
                Yazı Tipi
              </Label>
              <Select
                value={currentStyles.fontFamily || ""}
                onValueChange={(value) => handleStyleChange("fontFamily", value)}
              >
                <SelectTrigger className="w-full mt-1 bg-gray-800 border-gray-700 text-gray-50">
                  <SelectValue placeholder="Yazı tipi seçin" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-50">
                  <SelectItem value="sans-serif">Sans-serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="monospace">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="color" className="text-sm text-muted-foreground">
                Renk
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start mt-1 bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
                    style={{ color: currentStyles.color || "inherit" }}
                  >
                    {currentStyles.color || "Seçilmedi"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <HexColorPicker
                    color={currentStyles.color || "#ffffff"}
                    onChange={(color) => handleStyleChange("color", color)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="font-weight" className="text-sm text-muted-foreground">
                Kalınlık
              </Label>
              <Select
                value={currentStyles.fontWeight || ""}
                onValueChange={(value) => handleStyleChange("fontWeight", value)}
              >
                <SelectTrigger className="w-full mt-1 bg-gray-800 border-gray-700 text-gray-50">
                  <SelectValue placeholder="Kalınlık seçin" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-50">
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Kalın</SelectItem>
                  <SelectItem value="bolder">Daha Kalın</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="font-size" className="text-sm text-muted-foreground">
                Boyut (px)
              </Label>
              <Input
                id="font-size"
                type="number"
                value={Number.parseInt(currentStyles.fontSize) || ""}
                onChange={(e) => handleStyleChange("fontSize", `${e.target.value}px`)}
                placeholder="16"
                className="mt-1 bg-gray-800 border-gray-700 text-gray-50 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Boyutlar */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-50">Boyutlar</h4>
            <div>
              <Label htmlFor="padding" className="text-sm text-muted-foreground">
                Doldurma (Padding)
              </Label>
              <Input
                id="padding"
                value={currentStyles.padding || ""}
                onChange={(e) => handleStyleChange("padding", e.target.value)}
                placeholder="Örn: 16px, 1rem"
                className="mt-1 bg-gray-800 border-gray-700 text-gray-50 placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="margin" className="text-sm text-muted-foreground">
                Kenar Boşluğu (Margin)
              </Label>
              <Input
                id="margin"
                value={currentStyles.margin || ""}
                onChange={(e) => handleStyleChange("margin", e.target.value)}
                placeholder="Örn: 16px auto, 1rem"
                className="mt-1 bg-gray-800 border-gray-700 text-gray-50 placeholder:text-gray-400"
              />
            </div>
            {selectedBlock.type === "hero" && (
              <div>
                <Label htmlFor="hero-background-gradient" className="text-sm text-muted-foreground">
                  Arka Plan Gradyanı (CSS)
                </Label>
                <Input
                  id="hero-background-gradient"
                  value={currentStyles.background || ""}
                  onChange={(e) => handleStyleChange("background", e.target.value)}
                  placeholder="Örn: linear-gradient(to right, #8a2be2, #ff1493)"
                  className="mt-1 bg-gray-800 border-gray-700 text-gray-50 placeholder:text-gray-400"
                />
              </div>
            )}
            {selectedBlock.type === "promo" && (
              <div>
                <Label htmlFor="border-color" className="text-sm text-muted-foreground">
                  Kenarlık Rengi
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start mt-1 bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
                      style={{ borderColor: currentStyles.borderColor || "transparent", borderWidth: "2px" }}
                    >
                      {currentStyles.borderColor || "Seçilmedi"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <HexColorPicker
                      color={currentStyles.borderColor || "#ffffff"}
                      onChange={(color) => handleStyleChange("borderColor", color)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
