export type PageBlockType = "text" | "image" | "button" | "promo" | "event" | "hero" | "chart" // Updated block types

export interface PageBlock {
  id: string
  type: PageBlockType
  content: Record<string, any> // Flexible content based on block type
  styles?: Record<string, any> // Optional styles for the block
}

export interface PageVersion {
  id: string
  page_id: string // Added page_id to link to the page
  version_number: number // Added version_number
  content: PageBlock[]
  createdAt: string // ISO string date
}

export interface Page {
  id: string
  title: string // Changed from 'name' to 'title'
  slug: string // Added slug
  content: PageBlock[]
  is_published: boolean // Changed from 'status' to 'is_published'
  order_index: number // Added order_index
  versions?: PageVersion[] // Optional array of versions
  created_at: string // ISO string date
  updated_at: string // ISO string date
}
