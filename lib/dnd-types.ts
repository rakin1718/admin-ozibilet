export const ItemTypes = {
  BLOCK: "block",
  PAGE: "page",
  CHART_LIBRARY_ITEM: "chart_library_item",
}

export interface BlockDragItem {
  id: string
  index: number
  type: typeof ItemTypes.BLOCK
}

export interface PageDragItem {
  id: string
  index: number
  type: typeof ItemTypes.PAGE
}

export interface ChartLibraryDragItem {
  id: string
  type: typeof ItemTypes.CHART_LIBRARY_ITEM
  chartType: string
}
