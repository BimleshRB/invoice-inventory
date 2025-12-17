import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Download, Trash2, Eye, Lock, Bell, ArrowRight, CheckCircle } from "lucide-react"

const rights = [
  {
    icon: Eye,
    title: "Right to Access",
    description: "Request a copy of all personal data we hold about you and how it's being processed.",
  },
  {
    icon: Download,
    title: "Right to Portability",
    description: "Export your data in a machine-readable format to transfer to another service.",
  },
  {
    icon: Trash2,
    title: "Right to Erasure",
    description: "Request deletion of your personal data when it's no longer necessary for our services.",
  },
  {
    icon: Lock,
    title: "Right to Rectification",
    description: "Correct any inaccurate or incomplete personal data we hold about you.",
  },
  {
    icon: Bell,
    title: "Right to Object",
    description: "Object to processing of your data for direct marketing or legitimate interests.",
  },
  {
    icon: Shield,
    title: "Right to Restrict",
    description: "Request restriction of processing in certain circumstances while we verify your concerns.",
  },
]

export default function GDPRPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <section className="px-4 mb-16">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                GDPR Compliance
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Your Data, Your Rights</h1>
              <p className="text-lg text-muted-foreground">
                InventoryFlow is fully compliant with the General Data Protection Regulation (GDPR). We respect your
                privacy and give you control over your personal data.
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="px-4 mb-16">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Your Rights
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Under GDPR, You Have These Rights</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rights.map((right, i) => (
                <Card key={i} className="border-2 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <right.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{right.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{right.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How We Comply */}
        <section className="px-4 mb-16 py-16 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Our Commitment
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">How We Ensure GDPR Compliance</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Data Processing Agreements",
                  description: "We have DPAs in place with all our sub-processors and can provide these upon request.",
                },
                {
                  title: "Privacy by Design",
                  description:
                    "Privacy considerations are built into every feature from the start, not added as an afterthought.",
                },
                {
                  title: "Data Minimization",
                  description: "We only collect and process data that is necessary for providing our services to you.",
                },
                {
                  title: "Transparent Processing",
                  description: "Our privacy policy clearly explains what data we collect, why, and how it's used.",
                },
                {
                  title: "Secure Data Transfers",
                  description:
                    "When transferring data outside the EU, we use Standard Contractual Clauses and other approved mechanisms.",
                },
                {
                  title: "Dedicated DPO",
                  description: "We have appointed a Data Protection Officer who oversees our compliance efforts.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-card border">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exercise Your Rights */}
        <section className="px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8 lg:p-12 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Exercise Your Rights</h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  To exercise any of your GDPR rights or if you have questions about how we handle your data, please
                  contact our Data Protection Officer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      Submit a Request
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="mailto:dpo@inventoryflow.app">Email DPO</a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-6">
                  We respond to all GDPR requests within 30 days as required by law.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
