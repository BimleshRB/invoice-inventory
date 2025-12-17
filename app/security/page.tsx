import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Server, Eye, Key, RefreshCw, FileCheck, Users, ArrowRight, CheckCircle } from "lucide-react"

const securityFeatures = [
  {
    icon: Lock,
    title: "Encryption at Rest & Transit",
    description:
      "All data is encrypted using AES-256 encryption at rest and TLS 1.3 for data in transit, ensuring your information is always protected.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description:
      "Our infrastructure is hosted on SOC 2 Type II certified cloud providers with redundant systems across multiple availability zones.",
  },
  {
    icon: Key,
    title: "Multi-Factor Authentication",
    description:
      "Protect your account with MFA using authenticator apps, SMS, or hardware security keys for an extra layer of security.",
  },
  {
    icon: Eye,
    title: "Access Controls",
    description:
      "Role-based access control (RBAC) allows you to define exactly what each team member can view and modify.",
  },
  {
    icon: RefreshCw,
    title: "Automated Backups",
    description:
      "Your data is automatically backed up every hour with point-in-time recovery available for the last 30 days.",
  },
  {
    icon: FileCheck,
    title: "Audit Logging",
    description:
      "Comprehensive audit logs track all actions in your account, providing full visibility into who did what and when.",
  },
]

const certifications = [
  { name: "SOC 2 Type II", status: "Certified" },
  { name: "ISO 27001", status: "Certified" },
  { name: "GDPR", status: "Compliant" },
  { name: "CCPA", status: "Compliant" },
  { name: "HIPAA", status: "Available" },
  { name: "PCI DSS", status: "Level 1" },
]

export default function SecurityPage() {
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
                Security
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Enterprise-Grade Security for Your Business
              </h1>
              <p className="text-lg text-muted-foreground">
                Your data security is our top priority. We implement industry-leading security measures to protect your
                business information.
              </p>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="px-4 mb-16">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">{cert.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {cert.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="px-4 mb-16">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, i) => (
                <Card key={i} className="border-2 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security Practices */}
        <section className="px-4 mb-16 py-16 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Our Practices
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">How We Protect Your Data</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Regular Security Audits",
                  description:
                    "We conduct quarterly penetration testing and annual security audits by independent third-party firms to identify and address potential vulnerabilities.",
                },
                {
                  title: "Employee Security Training",
                  description:
                    "All employees undergo rigorous security training and background checks. Access to customer data is strictly limited on a need-to-know basis.",
                },
                {
                  title: "Incident Response Plan",
                  description:
                    "We maintain a comprehensive incident response plan with 24/7 security monitoring and rapid response procedures to address any potential threats.",
                },
                {
                  title: "Bug Bounty Program",
                  description:
                    "We run a responsible disclosure program rewarding security researchers who help us identify and fix potential vulnerabilities.",
                },
              ].map((practice, i) => (
                <Card key={i} className="border-2">
                  <CardContent className="p-6 flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{practice.title}</h3>
                      <p className="text-sm text-muted-foreground">{practice.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8 lg:p-12 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Have security questions?</h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Our security team is available to answer your questions and discuss your specific requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      Contact Security Team
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/docs">Security Documentation</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
