import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie, CheckCircle } from "lucide-react"

const cookieTypes = [
  {
    title: "Essential Cookies",
    required: true,
    description: "These cookies are necessary for the website to function and cannot be switched off.",
    examples: ["Session cookies for authentication", "Security cookies to prevent fraud", "Load balancing cookies"],
  },
  {
    title: "Functional Cookies",
    required: false,
    description: "These cookies enable enhanced functionality and personalization.",
    examples: ["Theme preference (light/dark mode)", "Language settings", "Dashboard customization"],
  },
  {
    title: "Analytics Cookies",
    required: false,
    description: "These cookies help us understand how visitors use our Service.",
    examples: ["Page view tracking", "Feature usage analytics", "Performance monitoring"],
  },
  {
    title: "Marketing Cookies",
    required: false,
    description: "These cookies are used to deliver relevant advertisements.",
    examples: ["Conversion tracking", "Retargeting pixels", "Ad personalization"],
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Cookie className="h-3.5 w-3.5 mr-1.5" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: December 6, 2025</p>
          </div>

          {/* Cookie Types Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {cookieTypes.map((type, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{type.title}</h3>
                    <Badge variant={type.required ? "default" : "secondary"} className="text-xs">
                      {type.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                  <ul className="space-y-1">
                    {type.examples.map((example, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-success" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Policy */}
          <Card className="border-2">
            <CardContent className="p-6 lg:p-10 prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">What Are Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are stored on your device when you visit a website. They help
                  websites remember your preferences, understand how you use the site, and improve your overall
                  experience.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  InventoryFlow uses cookies for authentication, remembering your preferences, analyzing usage patterns,
                  and delivering relevant content. We use both first-party cookies (set by us) and third-party cookies
                  (set by our partners).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some cookies are placed by third-party services that appear on our pages. We use services like Google
                  Analytics to analyze usage patterns. These third parties may use cookies in accordance with their own
                  privacy policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Managing Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can control and manage cookies in several ways:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>
                    <strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies
                  </li>
                  <li>
                    <strong>Cookie Preferences:</strong> Use our cookie consent tool to manage your preferences
                  </li>
                  <li>
                    <strong>Opt-Out Links:</strong> Many analytics and advertising services offer opt-out mechanisms
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Note that blocking certain cookies may impact your experience and limit functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Cookie Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Session cookies are deleted when you close your browser. Persistent cookies remain on your device for
                  a set period (typically 30 days to 1 year) or until you delete them.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time. Any changes will be posted on this page with an
                  updated revision date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about our use of cookies, please contact us at{" "}
                  <a href="mailto:privacy@inventoryflow.app" className="text-primary hover:underline">
                    privacy@inventoryflow.app
                  </a>{" "}
                  or through our{" "}
                  <a href="/contact" className="text-primary hover:underline">
                    contact page
                  </a>
                  .
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
