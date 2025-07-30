"use client"

import type React from "react"
import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { ItemTypes, type BlockDragItem } from "@/lib/dnd-types"
import { BlockRenderer } from "./block-renderer"
import type { PageBlock } from "@/lib/page-types"

interface DraggableBlockProps {
  block: PageBlock
  index: number
  moveBlock: (id: string, atIndex: number) => void
  onEdit: (blockId: string) => void
  onSelectBlock: (blockId: string | null) => void // Added for style panel selection
  isSelected: boolean // Added for style panel selection
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  index,
  moveBlock,
  onEdit,
  onSelectBlock,
  isSelected,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: BlockDragItem, monitor) {
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

      moveBlock(item.id, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BLOCK,
    item: () => {
      return { id: block.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-handler-id={handlerId}
      onClick={() => onSelectBlock(block.id)} // Select block on click
      className={isSelected ? "ring-2 ring-blue-500 rounded-lg" : ""} // Highlight selected block
    >
      <BlockRenderer block={block} onEdit={onEdit} isDragging={isDragging} />
    </div>
  )
}
