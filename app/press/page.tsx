import { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Press — InventoryFlow",
  description: "Press kit, logos, and media contact for InventoryFlow.",
}

export default function PressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Press & Media</h1>
            <p className="text-muted-foreground mb-6">
              Welcome to the InventoryFlow press page. Find our press kit, brand assets, and media contact information
              below.
            </p>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">Press Kit</h2>
              <p className="text-sm text-muted-foreground">
                Download our press kit which includes company overview, executive bios, and high-resolution logos.
              </p>
              <div className="grid sm:flex sm:items-center sm:gap-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Logo Pack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">SVG and PNG versions (zip)</p>
                    <Button asChild>
                      <Link href="/assets/press/InventoryFlow-Logo.zip">Download</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Press Kit (PDF)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">Overview, bios, and screenshots</p>
                    <Button asChild variant="outline">
                      <Link href="/assets/press/InventoryFlow-PressKit.pdf">Download</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">Brand Assets</h2>
              <p className="text-sm text-muted-foreground">
                Use our brand assets in accordance with the brand guidelines. For other formats, contact our media
                team.
              </p>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Primary logo (SVG, PNG)</li>
                <li>Secondary mark (SVG, PNG)</li>
                <li>Color palette and usage examples</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">Media Contact</h2>
              <p className="text-sm text-muted-foreground">
                For media inquiries, please reach out to:
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Press Relations — press@inventoryflow.app</div>
                <div>Phone — +91 98765 43210</div>
              </div>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">Recent Announcements</h2>
              <article className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-semibold text-foreground">InventoryFlow Announces AI Forecasting</h3>
                <p className="text-sm text-muted-foreground">January 10, 2025 — New intelligent forecasting tools...</p>
                <div className="mt-3">
                  <Link href="/changelog" className="text-sm text-primary hover:underline">
                    Read release notes
                  </Link>
                </div>
              </article>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
