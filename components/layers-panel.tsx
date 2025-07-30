"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import type { PageBlock } from "@/lib/page-types"
import { cn } from "@/lib/utils"

interface LayersPanelProps {
  blocks: PageBlock[]
  selectedBlockId: string | null
  onSelectBlock: (blockId: string | null) => void
}

export function LayersPanel({ blocks, selectedBlockId, onSelectBlock }: LayersPanelProps) {
  return (
    <div className="w-64 shrink-0 border-r border-gray-700 bg-gray-900 p-4 text-gray-50 hidden md:flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Katmanlar</h3>
      <Label htmlFor="layers-description" className="text-sm text-muted-foreground mb-4">
        Sayfadaki tüm öğeleri gözden geçir ve düzenle
      </Label>
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          {blocks.length === 0 ? (
            <p className="text-muted-foreground text-sm">Henüz blok yok.</p>
          ) : (
            blocks.map((block) => (
              <div
                key={block.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-700",
                  selectedBlockId === block.id ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-800",
                )}
                onClick={() => onSelectBlock(block.id)}
              >
                <span className="truncate">{block.type.charAt(0).toUpperCase() + block.type.slice(1)}</span>
                <span className="text-xs text-muted-foreground">ID: {block.id.substring(0, 4)}...</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
