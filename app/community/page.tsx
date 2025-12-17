import { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Community — InventoryFlow",
  description: "Join the InventoryFlow community to share ideas and get help.",
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6">Community</h1>
          <p className="text-muted-foreground mb-6">Join our forums, Slack, and events to connect with other users.</p>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Forum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Ask questions and share tips with other users.</p>
                <div className="mt-3">
                  <Link href="/community/forum" className="text-sm text-primary hover:underline">
                    Visit forum
                  </Link>
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

