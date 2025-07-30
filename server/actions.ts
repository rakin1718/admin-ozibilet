"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import type { Page, PageBlock, PageVersion } from "@/lib/page-types"

// Helper to get current page content
async function getCurrentPageContent(pageId: string): Promise<PageBlock[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("ozibilet_pages").select("content").eq("id", pageId).single()

  if (error) {
    console.error("Error fetching current page content:", error)
    return []
  }
  return data?.content || []
}

// Helper to add a new version
async function addNewPageVersion(pageId: string, versionName: string, content: PageBlock[]) {
  const supabase = createClient()

  // Get current page to determine next version number
  const { data: currentPage, error: fetchError } = await supabase
    .from("ozibilet_pages")
    .select("versions")
    .eq("id", pageId)
    .single()

  if (fetchError) {
    console.error("Error fetching page for versioning:", fetchError)
    return null
  }

  const currentVersions = currentPage?.versions || []
  const nextVersionNumber =
    currentVersions.length > 0 ? Math.max(...currentVersions.map((v) => v.version_number || 0)) + 1 : 1

  const newVersion: PageVersion = {
    id: uuidv4(),
    page_id: pageId, // Link to the page
    version_number: nextVersionNumber,
    content,
    createdAt: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("ozibilet_page_versions") // Insert into versions table
    .insert(newVersion)
    .select()
    .single()

  if (error) {
    console.error("Error adding new page version:", error)
    return null
  }
  return data
}

export async function getPages(): Promise<Page[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("ozibilet_pages").select("*").order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching pages:", error)
    return []
  }
  return data || []
}

export async function getPageById(pageId: string): Promise<Page | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("ozibilet_pages").select("*").eq("id", pageId).single()

  if (error) {
    console.error("Error fetching page by ID:", error)
    return null
  }
  return data
}

export async function getPublishedPageBySlug(slug: string): Promise<Page | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("ozibilet_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true) // Only fetch published pages
    .single()

  if (error) {
    console.error("Error fetching published page by slug:", error)
    return null
  }
  return data
}

export async function createPage(title: string, slug: string, content: PageBlock[]): Promise<Page | null> {
  const supabase = createClient()

  // Determine the next order_index
  const { data: maxOrder, error: orderError } = await supabase
    .from("ozibilet_pages")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single()

  const newOrderIndex = (maxOrder?.order_index || 0) + 1

  // Add a default hero and promo blocks for new pages to match the screenshot
  const defaultContent: PageBlock[] = [
    {
      id: uuidv4(),
      type: "hero",
      content: {
        logoUrl: "/placeholder.svg?height=60&width=200",
        socialIcons: [
          { type: "telegram", url: "#" },
          { type: "instagram", url: "#" },
          { type: "youtube", url: "#" },
        ],
        bonusText: "1000₺ DENEME BONUSU",
        bonusImageUrl: "/placeholder.svg?height=100&width=100",
        description: "Şansınızı deneyin ve büyük ödüller kazanın. Her 1000 TL yatırım için bilet kazanın.",
      },
      styles: {
        background: "linear-gradient(to right, #8a2be2, #ff1493)", // Purple to pink gradient
        color: "#ffffff",
        padding: "2rem",
        textAlign: "center",
      },
    },
    {
      id: uuidv4(),
      type: "promo",
      content: {
        promoLogoUrl: "/placeholder.svg?height=30&width=100",
        promoTitle: "Şans Casino",
        promoDescription: "OZİBEYE ÖZEL 50 FS 2 TL DEĞERİNDE KOD : sansozi777",
      },
      styles: {
        borderColor: "#00ff00", // Vibrant Green
      },
    },
    {
      id: uuidv4(),
      type: "promo",
      content: {
        promoLogoUrl: "/placeholder.svg?height=30&width=100",
        promoTitle: "BET JUVE",
        promoDescription: "5000 TL NAKİT İADE",
      },
      styles: {
        borderColor: "#ffff00", // Vibrant Yellow
      },
    },
    {
      id: uuidv4(),
      type: "promo",
      content: {
        promoLogoUrl: "/placeholder.svg?height=30&width=100",
        promoTitle: "MATADORBET",
        promoDescription: "500 TL DENEME",
      },
      styles: {
        borderColor: "#ff0000", // Vibrant Red
      },
    },
    {
      id: uuidv4(),
      type: "promo",
      content: {
        promoLogoUrl: "/placeholder.svg?height=30&width=100",
        promoTitle: "FIXBET",
        promoDescription: "555 TL DENEME!",
      },
      styles: {
        borderColor: "#00ffff", // Vibrant Cyan
      },
    },
    {
      id: uuidv4(),
      type: "promo",
      content: {
        promoLogoUrl: "/placeholder.svg?height=30&width=100",
        promoTitle: "KRALBET",
        promoDescription: "2000 TL HOŞGELDİN!",
      },
      styles: {
        borderColor: "#ff00ff", // Vibrant Magenta
      },
    },
    {
      id: uuidv4(),
      type: "promo",
      content: {
        promoLogoUrl: "/placeholder.svg?height=30&width=100",
        promoTitle: "MISTY CASINO",
        promoDescription: "1000 TL DENEME!",
      },
      styles: {
        borderColor: "#ffa500", // Vibrant Orange
      },
    },
    {
      id: uuidv4(),
      type: "promo",
      content: {
        promoLogoUrl: "/placeholder.svg?height=30&width=100",
        promoTitle: "PARİBAHİS",
        promoDescription: "%150 HOŞGELDİN",
      },
      styles: {
        borderColor: "#008000", // Vibrant Dark Green
      },
    },
  ]

  const newPage: Page = {
    id: uuidv4(),
    title,
    slug,
    content: defaultContent, // Use default content
    is_published: false, // Default to draft
    order_index: newOrderIndex,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  const { data, error } = await supabase.from("ozibilet_pages").insert(newPage).select().single()

  if (error) {
    console.error("Error creating page:", error)
    return null
  }

  // Add initial version
  await addNewPageVersion(data.id, "Initial Draft", defaultContent) // Use default content for initial version

  revalidatePath("/")
  return data
}

export async function updatePageContent(pageId: string, content: PageBlock[]): Promise<Page | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("ozibilet_pages")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", pageId)
    .select()
    .single()

  if (error) {
    console.error("Error updating page content:", error)
    return null
  }
  revalidatePath("/")
  return data
}

export async function savePageDraft(
  pageId: string,
  title: string,
  slug: string,
  content: PageBlock[],
): Promise<Page | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("ozibilet_pages")
    .update({ title, slug, content, is_published: false, updated_at: new Date().toISOString() })
    .eq("id", pageId)
    .select()
    .single()

  if (error) {
    console.error("Error saving page draft:", error)
    return null
  }

  // Add a new version for the draft
  await addNewPageVersion(pageId, `Draft - ${new Date().toLocaleString()}`, content)

  revalidatePath("/")
  return data
}

export async function publishPage(
  pageId: string,
  title: string,
  slug: string,
  content: PageBlock[],
): Promise<Page | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("ozibilet_pages")
    .update({ title, slug, content, is_published: true, updated_at: new Date().toISOString() })
    .eq("id", pageId)
    .select()
    .single()

  if (error) {
    console.error("Error publishing page:", error)
    return null
  }

  // Add a new version for the published state
  await addNewPageVersion(pageId, `Published - ${new Date().toLocaleString()}`, content)

  revalidatePath("/")
  return data
}

export async function duplicatePage(pageId: string, newTitle: string, newSlug: string): Promise<Page | null> {
  const supabase = createClient()
  const { data: originalPage, error: fetchError } = await supabase
    .from("ozibilet_pages")
    .select("*")
    .eq("id", pageId)
    .single()

  if (fetchError || !originalPage) {
    console.error("Error fetching original page for duplication:", fetchError)
    return null
  }

  // Determine the next order_index for the duplicated page
  const { data: maxOrder, error: orderError } = await supabase
    .from("ozibilet_pages")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single()

  const newOrderIndex = (maxOrder?.order_index || 0) + 1

  const duplicatedPage: Page = {
    id: uuidv4(),
    title: newTitle,
    slug: newSlug,
    content: originalPage.content,
    is_published: false, // Duplicated pages start as draft
    order_index: newOrderIndex,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("ozibilet_pages").insert(duplicatedPage).select().single()

  if (error) {
    console.error("Error duplicating page:", error)
    return null
  }

  // Add initial version for the duplicated page
  await addNewPageVersion(data.id, "Duplicated from " + originalPage.title, originalPage.content)

  revalidatePath("/")
  return data
}

export async function deletePage(pageId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("ozibilet_pages").delete().eq("id", pageId)

  if (error) {
    console.error("Error deleting page:", error)
    return false
  }
  revalidatePath("/")
  return true
}

export async function restorePageVersion(pageId: string, versionId: string): Promise<Page | null> {
  const supabase = createClient()
  const { data: versionToRestore, error: fetchError } = await supabase
    .from("ozibilet_page_versions")
    .select("content")
    .eq("id", versionId)
    .eq("page_id", pageId)
    .single()

  if (fetchError || !versionToRestore) {
    console.error("Error fetching version for restore:", fetchError)
    return null
  }

  const { data, error } = await supabase
    .from("ozibilet_pages")
    .update({ content: versionToRestore.content, updated_at: new Date().toISOString() })
    .eq("id", pageId)
    .select()
    .single()

  if (error) {
    console.error("Error restoring page version:", error)
    return null
  }
  revalidatePath("/")
  return data
}

export async function updatePageOrder(pageIds: string[]): Promise<boolean> {
  const supabase = createClient()
  const updates = pageIds.map((id, index) => ({
    id,
    order_index: index,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("ozibilet_pages").upsert(updates, { onConflict: "id" }) // Use upsert to update existing rows

  if (error) {
    console.error("Error updating page order:", error)
    return false
  }
  revalidatePath("/")
  return true
}
