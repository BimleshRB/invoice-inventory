import { Metadata } from "next"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Status — InventoryFlow",
  description: "Real-time system status and incident history for InventoryFlow.",
}

const incidents = [
  { id: 1, title: "Database latency", status: "Resolved", date: "2025-02-11" },
]

export default function StatusPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6">System Status</h1>
          <p className="text-muted-foreground mb-6">Current operational status and recent incidents.</p>

          <div className="grid gap-4">
            {incidents.map((i) => (
              <Card key={i.id}>
                <CardHeader>
                  <CardTitle className="text-base">{i.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{i.date}</span>
                    <span className="text-sm">{i.status}</span>
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

