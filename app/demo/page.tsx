import { Metadata } from "next"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Demo — InventoryFlow",
  description: "Product demo and overview for InventoryFlow.",
}

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Product Demo</h1>
            <p className="text-muted-foreground mb-6">Watch a short demo showcasing InventoryFlow's core features.</p>

            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/ysz5S6PUM-U"
                title="InventoryFlow demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                Prefer to try the product yourself? <Link href="/signup" className="text-primary hover:underline">Start a free trial</Link> or
                <Link href="/contact" className="text-primary hover:underline ml-2">contact sales</Link> for an enterprise demo.
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
