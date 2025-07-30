"use client"
import { DraggableBlock } from "./draggable-block"

import { useState, useCallback } from "react"
import { useDrop } from "react-dnd"
import type { PageBlock } from "@/lib/page-types"
import { BlockEditPanel } from "./block-edit-panel"
import { usePageEditor } from "@/hooks/use-page-editor"
import { ItemTypes } from "@/lib/dnd-types"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { LayersPanel } from "./layers-panel" // Import LayersPanel
import { StylesPanel } from "./styles-panel" // Import StylesPanel

interface PageEditorCanvasProps {
  pageId: string
}

export function PageEditorCanvas({ pageId }: PageEditorCanvasProps) {
  const {
    page,
    blocks,
    reorderBlocks,
    updateBlock,
    addBlock,
    deleteBlock,
    copyBlock,
    setPage,
    selectedBlockId,
    setSelectedBlockId,
    selectedBlock,
  } = usePageEditor({
    pageId: pageId,
  })

  const [editingBlockContent, setEditingBlockContent] = useState<PageBlock | null>(null) // For content sheet
  const [showAddBlockPopover, setShowAddBlockPopover] = useState(false)
  const [newBlockType, setNewBlockType] = useState<PageBlock["type"]>("text")

  const findBlock = useCallback(
    (id: string) => {
      const block = blocks.filter((b) => b.id === id)[0]
      return {
        block,
        index: blocks.indexOf(block),
      }
    },
    [blocks],
  )

  const moveBlock = useCallback(
    (id: string, atIndex: number) => {
      const { block, index } = findBlock(id)
      reorderBlocks(index, atIndex)
    },
    [findBlock, reorderBlocks],
  )

  const [, drop] = useDrop(() => ({ accept: ItemTypes.BLOCK }), [])

  const handleEditBlockContent = useCallback(
    (blockId: string) => {
      const blockToEdit = blocks.find((b) => b.id === blockId)
      if (blockToEdit) {
        setEditingBlockContent(blockToEdit)
      }
    },
    [blocks],
  )

  const handleCloseEditContentPanel = useCallback(() => {
    setEditingBlockContent(null)
  }, [])

  const handleAddBlock = useCallback(() => {
    addBlock(newBlockType)
    setShowAddBlockPopover(false)
  }, [addBlock, newBlockType])

  // Separate blocks into hero and other blocks for specific rendering
  const heroBlock = blocks.find((block) => block.type === "hero")
  const otherBlocks = blocks.filter((block) => block.type !== "hero")

  return (
    <div className="flex flex-1 overflow-hidden">
      <LayersPanel blocks={blocks} selectedBlockId={selectedBlockId} onSelectBlock={setSelectedBlockId} />

      <div className="flex-1 p-4 overflow-auto bg-gray-950 relative">
        <div className="max-w-5xl mx-auto bg-gray-900 shadow-lg rounded-lg p-6 min-h-[80vh] text-gray-50">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="page-title" className="text-sm font-medium text-gray-400">
                Sayfa Başlığı
              </Label>
              <Input
                id="page-title"
                className="text-3xl font-bold border-none focus-visible:ring-0 p-0 bg-transparent text-gray-50"
                value={page.title}
                onChange={(e) => setPage((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Sayfa Başlığı"
              />
            </div>
            <div>
              <Label htmlFor="page-slug" className="text-sm font-medium text-gray-400">
                Sayfa Slug
              </Label>
              <Input
                id="page-slug"
                className="text-xl border-none focus-visible:ring-0 p-0 bg-transparent text-gray-50"
                value={page.slug}
                onChange={(e) => setPage((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="sayfa-slug"
              />
            </div>
          </div>
          {heroBlock && (
            <div className="mb-6">
              <DraggableBlock
                key={heroBlock.id}
                block={heroBlock}
                index={blocks.indexOf(heroBlock)}
                moveBlock={moveBlock}
                onEdit={handleEditBlockContent}
                onSelectBlock={setSelectedBlockId}
                isSelected={selectedBlockId === heroBlock.id}
              />
            </div>
          )}
          <div ref={drop} className="min-h-[500px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherBlocks.map((block, i) => (
              <DraggableBlock
                key={block.id}
                block={block}
                index={blocks.indexOf(block)}
                moveBlock={moveBlock}
                onEdit={handleEditBlockContent}
                onSelectBlock={setSelectedBlockId}
                isSelected={selectedBlockId === block.id}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Popover open={showAddBlockPopover} onOpenChange={setShowAddBlockPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-gray-800 text-gray-50 hover:bg-gray-700 border-gray-700"
                >
                  <Plus className="w-4 h-4" /> Blok Ekle
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 bg-gray-800 text-gray-50 border-gray-700">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Blok Tipi Seçin</h4>
                    <Select value={newBlockType} onValueChange={(value) => setNewBlockType(value as PageBlock["type"])}>
                      <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-gray-50">
                        <SelectValue placeholder="Blok Tipi" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-gray-50">
                        <SelectItem value="text">Metin</SelectItem>
                        <SelectItem value="image">Görsel</SelectItem>
                        <SelectItem value="button">Buton</SelectItem>
                        <SelectItem value="hero">Hero Bölümü</SelectItem>
                        <SelectItem value="chart">Grafik</SelectItem>
                        <SelectItem value="promo">Promosyon</SelectItem>
                        <SelectItem value="event">Etkinlik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddBlock} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Ekle
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <BlockEditPanel
          isOpen={!!editingBlockContent}
          onClose={handleCloseEditContentPanel}
          block={editingBlockContent}
          onSave={(id, content) => updateBlock(id, content, selectedBlock?.styles)} // Pass existing styles
        />
      </div>
      <StylesPanel selectedBlock={selectedBlock} updateBlock={updateBlock} />
    </div>
  )
}
