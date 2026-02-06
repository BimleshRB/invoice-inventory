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
  TrendingUp,
  Zap,
  Headphones,
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <LandingHeader />

      <main className="flex-1 pt-16 pb-12">
        {/* Hero Section */}
        <section className="px-4 mb-14">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs">
                📚 Help Center
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 text-balance">
                How can we help you?
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                Search our knowledge base or browse categories to find answers. We're here to help you succeed.
              </p>

              {/* Search */}
              <div className="max-w-2xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-chart-1/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center bg-card border-2 border-border rounded-lg p-1">
                  <Search className="h-4 w-4 text-muted-foreground ml-3" />
                  <Input
                    type="search"
                    placeholder="Search for help articles, topics, or keywords..."
                    className="h-10 px-3 border-0 bg-transparent focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 mb-14">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Browse by Category</h2>
              <p className="text-muted-foreground mt-1 text-sm">Explore topics organized by subject area</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, i) => (
                <Card
                  key={i}
                  className="group relative overflow-hidden border-2 border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-7 relative z-10">
                    <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">{category.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                      📄 {category.articles} articles
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-primary mt-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs and Popular Articles */}
        <section className="px-4 mb-12">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* FAQs */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground mt-1 text-sm">Quick answers to common questions</p>
                </div>
                <Card className="border-2 border-border/60">
                  <CardContent className="p-4">
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/50 last:border-0">
                          <AccordionTrigger className="text-left hover:no-underline py-3 hover:text-primary transition-colors">
                            <span className="flex items-start gap-3 pr-4 text-sm font-semibold">
                              {faq.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-3 text-xs leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    {filteredFaqs.length === 0 && (
                      <div className="text-center py-8">
                        <HelpCircle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium text-sm">
                          No results found for &quot;{searchQuery}&quot;
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Try a different search term or browse categories above</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Popular Articles */}
                <Card className="border-2 border-border/60 hover:border-border transition-colors">
                  <CardHeader className="border-b border-border/50 pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Popular Articles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {popularArticles.map((article, i) => (
                      <Link
                        key={i}
                        href="#"
                        className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <span className="flex items-center gap-2 flex-1 min-w-0">
                          <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                          <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {article.title}
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{article.views}</span>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="border-2 border-border/60 hover:border-border transition-colors">
                  <CardHeader className="border-b border-border/50 pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start h-9 hover:bg-muted/50 border-border/60 text-sm">
                      <Link href="/docs">
                        <BookOpen className="mr-2 h-3 w-3 text-primary" />
                        <span>Documentation</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start h-9 hover:bg-muted/50 border-border/60 text-sm">
                      <Link href="#">
                        <Video className="mr-2 h-3 w-3 text-primary" />
                        <span>Video Tutorials</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start h-9 hover:bg-muted/50 border-border/60 text-sm">
                      <Link href="#">
                        <MessageSquare className="mr-2 h-3 w-3 text-primary" />
                        <span>Community Forum</span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support CTA */}
        <section className="px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-2 border-border/60 hover:border-primary/30 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Documentation
                  </CardTitle>
                  <CardDescription className="text-xs">Explore comprehensive guides and API references for developers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full h-9 font-semibold text-sm">
                    <Link href="/docs">
                      View Documentation
                      <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/60 hover:border-primary/30 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Headphones className="h-4 w-4 text-primary" />
                    Contact Support
                  </CardTitle>
                  <CardDescription className="text-xs">Can't find what you need? Our support team is here to help you 24/7</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full h-9 font-semibold text-sm">
                    <Link href="/contact">
                      Contact Us
                      <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
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
