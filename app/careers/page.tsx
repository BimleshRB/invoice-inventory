import { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Careers — InventoryFlow",
  description: "Join InventoryFlow — current openings and benefits.",
}

const jobs = [
  { id: "1", title: "Senior Full-Stack Engineer", location: "Remote / SF", team: "Engineering" },
  { id: "2", title: "Product Manager", location: "London", team: "Product" },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6">Careers</h1>

          <p className="text-muted-foreground mb-6">We&apos;re building a product that helps businesses thrive. See open roles below.</p>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle className="text-base">{job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{job.team} • {job.location}</div>
                    <Button asChild>
                      <Link href={`/careers#${job.id}`}>Apply</Link>
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
