import { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Blog — InventoryFlow",
  description: "Articles, tutorials, and product announcements from InventoryFlow.",
}

const posts = [
  { slug: "ai-forecasting", title: "AI Forecasting: Smarter Inventory", excerpt: "How AI helps predict demand." },
  { slug: "import-tips", title: "Tips for CSV Import", excerpt: "Best practices for bulk imports." },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6">Blog</h1>

          <div className="grid gap-4">
            {posts.map((p) => (
              <Card key={p.slug}>
                <CardHeader>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{p.excerpt}</p>
                  <Button asChild variant="link">
                    <Link href={`/blog/${p.slug}`}>Read more</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}

