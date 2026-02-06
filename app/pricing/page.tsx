"use client"

import { useState } from "react"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PricingCard } from "@/components/pricing/pricing-card"
import { PRICING_TIERS } from "@/lib/pricing-config"
import { ArrowRight, Package, FileText, BarChart3, Users, Lock, Headphones } from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Inventory Management",
    description: "Track products, stock levels, and automate reordering",
  },
  {
    icon: FileText,
    title: "Invoice Management",
    description: "Create, send, and track invoices with automation",
  },
  {
    icon: Users,
    title: "Customer Portal",
    description: "Let customers view invoices and make payments",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Custom reports and business intelligence insights",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Enterprise-level encryption and compliance (SOC 2)",
  },
  {
    icon: Headphones,
    title: "World-Class Support",
    description: "Expert support team available when you need help",
  },
]

const faqs = [
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes! You can change your plan at any time. If you upgrade, you'll only be charged the prorated difference. If you downgrade, your credit will be applied to your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Absolutely! All plans come with a 14-day free trial. No credit card required to get started. Full access to all features in your chosen plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and PayPal. Annual plans also get 10% discount.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "Your service won't be interrupted. We'll notify you when you're approaching your limits so you can upgrade. You'll only be charged for overage at the per-unit rate.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes! Pay annually and save 10% on your monthly subscription. Annual billing also includes priority support and free training.",
  },
  {
    question: "Can I integrate with other tools?",
    answer:
      "Professional and Enterprise plans include API access and integrations with popular accounting software, payment processors, and business tools.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "Starter plans get email support. Professional plans include email and chat support. Enterprise customers get 24/7 dedicated support with a dedicated account manager.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use enterprise-grade security with AES-256 encryption, TLS 1.3, regular security audits, and SOC 2 Type II compliance. Your data is backed up hourly.",
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <LandingHeader />

      <main className="flex-1 pt-16 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              💰 Simple, Transparent Pricing
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 text-balance">
              Plans for Every Business Size
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your business. Scale up as you grow. Cancel anytime, no questions asked.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                  billingPeriod === "annual"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-success/20 text-success px-2 py-1 rounded inline-block">
                  Save 10%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {PRICING_TIERS.map((tier) => (
              <PricingCard key={tier.id} tier={tier} billingPeriod={billingPeriod} />
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
              All Plans Include
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="border-2 border-border/60 hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trust Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 py-8 px-6 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl border-2 border-primary/20">
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">10,000+</div>
              <p className="text-sm text-muted-foreground">Businesses trust us</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">99.9%</div>
              <p className="text-sm text-muted-foreground">Uptime guarantee</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">SOC 2</div>
              <p className="text-sm text-muted-foreground">Certified secure</p>
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, i) => (
                  <Card key={i} className="border-2 border-border/60">
                    <AccordionItem value={`faq-${i}`} className="border-0">
                      <AccordionTrigger className="hover:no-underline px-6 py-4 hover:text-primary transition-colors">
                        <span className="text-left font-semibold text-foreground">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground border-t border-border/50 pt-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center py-12 px-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl border-2 border-primary/20">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">
              Ready to transform your business?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using InventoryFlow to manage invoices, inventory, and customers more
              efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="h-11 font-semibold">
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 font-semibold border-primary/30">
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              14-day free trial. No credit card required. Full access to all features.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
