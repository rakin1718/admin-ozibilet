"use client"

import { useState, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Page, PageBlock, PageBlockType } from "@/lib/page-types"
import { getPageById, updatePageContent } from "@/server/actions"
import { toast } from "@/components/ui/use-toast"

interface UsePageEditorProps {
  initialPage?: Page // For initial load or creating a new page
  pageId?: string // For fetching an existing page
}

export function usePageEditor({ initialPage, pageId }: UsePageEditorProps) {
  const [page, setPage] = useState<Page>(
    initialPage || {
      id: uuidv4(),
      title: "Yeni Sayfa", // Changed from name
      slug: "yeni-sayfa-" + uuidv4().substring(0, 8), // Added slug
      content: [],
      is_published: false, // Changed from status
      order_index: 0, // Added order_index
      versions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  )
  const [blocks, setBlocks] = useState<PageBlock[]>(initialPage?.content || [])
  const [isSaving, setIsSaving] = useState(false)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null) // New state for selected block

  useEffect(() => {
    if (pageId) {
      const fetchPage = async () => {
        const fetchedPage = await getPageById(pageId)
        if (fetchedPage) {
          setPage(fetchedPage)
          setBlocks(fetchedPage.content)
        } else {
          toast({
            title: "Hata",
            description: "Sayfa yüklenirken bir sorun oluştu.",
            variant: "destructive",
          })
        }
      }
      fetchPage()
    }
  }, [pageId])

  const savePage = useCallback(async () => {
    setIsSaving(true)
    if (!page.id) {
      toast({
        title: "Hata",
        description: "Kaydedilecek sayfa ID'si yok.",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }
    const updatedPage = await updatePageContent(page.id, blocks)
    if (updatedPage) {
      setPage(updatedPage)
      toast({
        title: "Başarılı",
        description: "Sayfa içeriği kaydedildi.",
      })
    } else {
      toast({
        title: "Hata",
        description: "Sayfa içeriği kaydedilirken bir sorun oluştu.",
        variant: "destructive",
      })
    }
    setIsSaving(false)
  }, [page.id, blocks])

  const addBlock = useCallback((type: PageBlockType, initialContent?: Record<string, any>) => {
    const newBlock: PageBlock = {
      id: uuidv4(),
      type,
      content: initialContent || {},
    }
    setBlocks((prevBlocks) => [...prevBlocks, newBlock])
    setSelectedBlockId(newBlock.id) // Select the newly added block
  }, [])

  const updateBlock = useCallback((id: string, newContent: Record<string, any>, newStyles?: Record<string, any>) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id
          ? { ...block, content: { ...block.content, ...newContent }, styles: { ...block.styles, ...newStyles } }
          : block,
      ),
    )
  }, [])

  const deleteBlock = useCallback(
    (id: string) => {
      setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== id))
      if (selectedBlockId === id) {
        setSelectedBlockId(null) // Deselect if deleted
      }
    },
    [selectedBlockId],
  )

  const copyBlock = useCallback(
    (id: string) => {
      const blockToCopy = blocks.find((block) => block.id === id)
      if (blockToCopy) {
        const newBlock: PageBlock = {
          ...blockToCopy,
          id: uuidv4(), // Yeni bir ID ata
        }
        setBlocks((prevBlocks) => {
          const index = prevBlocks.findIndex((block) => block.id === id)
          if (index > -1) {
            return [...prevBlocks.slice(0, index + 1), newBlock, ...prevBlocks.slice(index + 1)]
          }
          return [...prevBlocks, newBlock]
        })
        setSelectedBlockId(newBlock.id) // Select the newly copied block
      }
    },
    [blocks],
  )

  const reorderBlocks = useCallback((dragIndex: number, hoverIndex: number) => {
    setBlocks((prevBlocks) => {
      const newBlocks = [...prevBlocks]
      const [removed] = newBlocks.splice(dragIndex, 1)
      newBlocks.splice(hoverIndex, 0, removed)
      return newBlocks
    })
  }, [])

  const selectedBlock = selectedBlockId ? blocks.find((b) => b.id === selectedBlockId) : null

  return {
    page,
    setPage,
    blocks,
    setBlocks,
    isSaving,
    savePage,
    addBlock,
    updateBlock,
    deleteBlock,
    copyBlock,
    reorderBlocks,
    selectedBlockId,
    setSelectedBlockId,
    selectedBlock,
  }
}
