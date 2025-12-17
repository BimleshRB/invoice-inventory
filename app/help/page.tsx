"use client"

import { useState } from "react"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Package,
  FileText,
  Users,
  Settings,
  CreditCard,
  Shield,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Video,
  Mail,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

const categories = [
  {
    icon: Package,
    title: "Inventory Management",
    description: "Products, stock levels, and categories",
    articles: 24,
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    icon: FileText,
    title: "Invoicing",
    description: "Creating and managing invoices",
    articles: 18,
    color: "from-emerald-500/20 to-emerald-600/20",
  },
  {
    icon: Users,
    title: "Customers",
    description: "Customer database and management",
    articles: 12,
    color: "from-violet-500/20 to-violet-600/20",
  },
  {
    icon: Settings,
    title: "Account Settings",
    description: "Profile and store configuration",
    articles: 15,
    color: "from-orange-500/20 to-orange-600/20",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description: "Subscription and payment methods",
    articles: 10,
    color: "from-pink-500/20 to-pink-600/20",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Account security and data protection",
    articles: 8,
    color: "from-cyan-500/20 to-cyan-600/20",
  },
]

const faqs = [
  {
    question: "How do I add products to my inventory?",
    answer:
      "Navigate to the Products page from your dashboard sidebar. Click 'Add Product' to add items individually, or use the 'Import' feature to bulk upload products via CSV file. You can set product details including name, SKU, price, quantity, and expiry dates.",
  },
  {
    question: "How do I create an invoice?",
    answer:
      "Go to the Invoices section and click 'New Invoice'. Select a customer (or create a new one), add line items from your inventory, set the tax rate and any discounts, then save or send the invoice directly to your customer.",
  },
  {
    question: "Can I import products from a CSV file?",
    answer:
      "Yes! Go to the Import page from your dashboard. Download our CSV template, fill in your product data, and upload the file. The system will validate and import your products automatically. You can also import customer data the same way.",
  },
  {
    question: "How do I set up low stock alerts?",
    answer:
      "When adding or editing a product, set the 'Minimum Stock Level' field. When inventory falls below this threshold, the product will appear in your low stock alerts on the dashboard.",
  },
  {
    question: "How can I track expiring products?",
    answer:
      "Products with expiry dates are automatically tracked. The dashboard shows products expiring within 30 days. You can also view all expiring products in the Stock Management section.",
  },
  {
    question: "Can I customize my invoice template?",
    answer:
      "Yes, go to Settings > Store Settings to upload your logo and configure your business information. This information will appear on all generated invoices.",
  },
  {
    question: "How do I export my data?",
    answer:
      "Use the Reports page to generate and export reports in CSV format. You can export product lists, sales data, customer information, and financial summaries.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "Go to Settings > Billing and click 'Cancel Subscription'. Your access will continue until the end of your current billing period. You can export your data before canceling.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use industry-standard encryption (TLS 1.3) for all data in transit and AES-256 encryption for data at rest. We perform regular security audits and backups to ensure your data is protected.",
  },
]

const popularArticles = [
  { title: "Getting started with InventoryFlow", views: "12.5K" },
  { title: "Importing your first products", views: "8.2K" },
  { title: "Setting up your store profile", views: "7.8K" },
  { title: "Creating and sending invoices", views: "6.9K" },
  { title: "Understanding the dashboard", views: "5.4K" },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <section className="px-4 mb-16">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                Help Center
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">How can we help you?</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Search our knowledge base or browse categories to find answers to your questions.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for help articles..."
                  className="h-14 pl-12 pr-4 text-base border-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 mb-16">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Browse by Category</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, i) => (
                <Card
                  key={i}
                  className="group border-2 hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                >
                  <CardContent className="p-6 relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                    <div className="relative flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {category.articles} articles
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs and Popular Articles */}
        <section className="px-4 mb-16">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* FAQs */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
                <Card className="border-2">
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
                          <AccordionTrigger className="text-left hover:no-underline py-4">
                            <span className="flex items-start gap-3 pr-4">
                              <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="font-medium">{faq.question}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pl-8 pb-4">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    {filteredFaqs.length === 0 && (
                      <div className="text-center py-12">
                        <HelpCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No results found for &quot;{searchQuery}&quot;. Try a different search term.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Popular Articles */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-base">Popular Articles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {popularArticles.map((article, i) => (
                      <Link
                        key={i}
                        href="#"
                        className="flex items-center justify-between py-2 text-sm hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          {article.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{article.views}</span>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-base">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                      <Link href="/docs">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Documentation
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                      <Link href="#">
                        <Video className="mr-2 h-4 w-4" />
                        Video Tutorials
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                      <Link href="#">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Community Forum
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Documentation
                  </CardTitle>
                  <CardDescription>
                    Explore our comprehensive documentation and API reference for developers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/docs">
                      View Documentation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>
                    Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/contact">
                      Contact Us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
