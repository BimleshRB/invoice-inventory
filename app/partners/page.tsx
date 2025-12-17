import { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Partners — InventoryFlow",
  description: "Partner program and integration information for InventoryFlow.",
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6">Partners</h1>
          <p className="text-muted-foreground mb-6">We partner with technology and channel partners to deliver value.</p>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Technology Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Integrate InventoryFlow with your stack using our APIs.</p>
                <div className="mt-3">
                  <Button asChild>
                    <Link href="/docs">Developer docs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Channel Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Become a reseller or integration partner.</p>
                <div className="mt-3">
                  <Button asChild variant="outline">
                    <Link href="/contact">Contact us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}

