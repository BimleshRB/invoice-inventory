import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: December 6, 2025</p>
          </div>

          <Card className="border-2">
            <CardContent className="p-6 lg:p-10 prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using InventoryFlow (&quot;the Service&quot;), you accept and agree to be bound by
                  the terms and provision of this agreement. If you do not agree to abide by these terms, please do not
                  use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  InventoryFlow provides inventory management and invoice generation services for businesses. Our
                  platform allows you to track products, manage stock levels, create invoices, and analyze business
                  performance through various tools and features.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To use certain features of the Service, you must register for an account. When you register, you agree
                  to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">You agree not to use the Service to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Distribute malware or harmful code</li>
                  <li>Attempt to gain unauthorized access to systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Use the Service for fraudulent purposes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Payment Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Paid subscriptions are billed in advance on a monthly or annual basis. All fees are non-refundable
                  except as required by law. We reserve the right to change our pricing with 30 days&apos; notice to
                  existing customers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Ownership</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You retain ownership of all data you input into the Service. We do not claim ownership over your
                  inventory data, customer information, or invoices. You grant us a license to use this data solely to
                  provide and improve the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Service Availability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to maintain high availability but do not guarantee uninterrupted access to the Service. We
                  may perform maintenance, updates, or experience outages. We are not liable for any loss or damage
                  resulting from service unavailability.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, InventoryFlow shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages, including loss of profits, data, or business
                  opportunities.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account at any time for violations of these terms. You may cancel
                  your account at any time. Upon termination, your right to use the Service will cease immediately, and
                  we may delete your data after a reasonable period.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes
                  via email or through the Service. Continued use after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">11. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact us at{" "}
                  <a href="mailto:legal@inventoryflow.app" className="text-primary hover:underline">
                    legal@inventoryflow.app
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
