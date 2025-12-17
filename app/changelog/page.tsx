import { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Changelog — InventoryFlow",
  description: "Release notes and product updates for InventoryFlow.",
}

const releases = [
  { date: "2025-01-10", title: "AI Forecasting", summary: "Introduced intelligent demand forecasting." },
  { date: "2024-10-02", title: "Multi-Store Support", summary: "Manage inventory across multiple stores." },
  { date: "2024-06-15", title: "Improved CSV Import", summary: "Faster and more reliable bulk imports." },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6">Changelog</h1>

          <div className="space-y-4">
            {releases.map((r) => (
              <Card key={r.date}>
                <CardHeader>
                  <CardTitle className="text-base">{r.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{r.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                    <Button asChild variant="ghost">
                      <Link href="/changelog">View details</Link>
                    </Button>
                  </div>
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
