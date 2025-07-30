import { notFound } from "next/navigation"
import { getPublishedPageBySlug } from "@/server/actions"
import { BlockRenderer } from "@/components/block-renderer"
import { ThemeProvider } from "next-themes"

interface PublicPageProps {
  params: {
    slug: string
  }
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { slug } = params
  const page = await getPublishedPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        {page.content.map((block) => (
          <BlockRenderer key={block.id} block={block} onEdit={() => {}} />
        ))}
      </div>
    </ThemeProvider>
  )
}
