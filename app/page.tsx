import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Package,
  FileText,
  BarChart3,
  Users,
  Upload,
  Shield,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Star,
  Play,
  Sparkles,
  Globe,
  Clock,
  Award,
} from "lucide-react"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { PricingCard } from "@/components/pricing/pricing-card"
import { PRICING_TIERS_LANDING } from "@/lib/pricing-config"

const features = [
  {
    icon: Package,
    title: "Smart Inventory Tracking",
    description: "Real-time stock monitoring with automatic low-stock alerts and expiry date tracking.",
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    icon: FileText,
    title: "Professional Invoices",
    description: "Generate GST-compliant invoices instantly with customizable templates and payment tracking.",
    color: "from-emerald-500/20 to-emerald-600/20",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive dashboards with sales trends, revenue insights, and performance metrics.",
    color: "from-violet-500/20 to-violet-600/20",
  },
  {
    icon: Users,
    title: "Customer CRM",
    description: "Complete customer management with purchase history and relationship tracking.",
    color: "from-orange-500/20 to-orange-600/20",
  },
  {
    icon: Upload,
    title: "Bulk Operations",
    description: "Import thousands of products via CSV and export reports with one click.",
    color: "from-pink-500/20 to-pink-600/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, automated backups, and compliance-ready infrastructure.",
    color: "from-cyan-500/20 to-cyan-600/20",
  },
]

const stats = [
  { value: "50K+", label: "Active Businesses", icon: Globe },
  { value: "10M+", label: "Invoices Generated", icon: FileText },
  { value: "99.99%", label: "Uptime SLA", icon: Clock },
  { value: "4.9/5", label: "Customer Rating", icon: Award },
]

const testimonials = [
  {
    quote:
      "InventoryFlow completely transformed our operations. We've reduced stockouts by 85% and increased revenue by 40% in just 6 months.",
    author: "Rajesh Kumar",
    role: "CEO, TechRetail India",
    avatar: "/professional-woman-headshot.png",
    company: "TechRetail",
  },
  {
    quote:
      "The bulk import feature saved us weeks of manual work. We migrated 15,000 products seamlessly. The support team is phenomenal.",
    author: "Priya Sharma",
    role: "Operations Director, StorePlus",
    avatar: "/professional-man-headshot.png",
    company: "StorePlus",
  },
  {
    quote:
      "Best ROI on any software we've purchased. The analytics alone helped us identify ₹20L in cost savings. Absolutely essential.",
    author: "Amit Patel",
    role: "Founder & CEO, Craft & Co.",
    avatar: "/testimonial-person-3.png",
    company: "Craft & Co.",
  },
]

const steps = [
  {
    step: "01",
    title: "Create Your Account",
    description: "Sign up in seconds. Set up your store profile with your logo, business details, and preferences.",
    icon: Users,
  },
  {
    step: "02",
    title: "Add Your Products",
    description: "Import your catalog via CSV or add products manually. Set prices, stock levels, and categories.",
    icon: Package,
  },
  {
    step: "03",
    title: "Start Growing",
    description: "Create invoices, track sales, and use analytics to make smarter business decisions.",
    icon: TrendingUp,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <LandingHeader />

      {/* Hero Section - Enhanced */}
      <section className="relative pt-20 sm:pt-28 pb-20 sm:pb-28 lg:pt-44 lg:pb-40 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-chart-1/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-chart-2/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-xs sm:text-sm font-semibold border border-primary/20 bg-primary/8 inline-flex items-center gap-2 hover:bg-primary/10 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Trusted by 50,000+ businesses across India
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6 text-balance leading-[1.1] space-y-2">
              Manage Your Business
              <br />
              <span className="bg-gradient-to-r from-primary via-chart-1 to-primary bg-clip-text text-transparent animate-gradient">
                With Precision
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed text-pretty font-light">
              The complete all-in-one platform for inventory management, GST-compliant invoicing, and business analytics. 
              Join thousands of businesses growing faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 px-4">
              <Button
                asChild
                size="lg"
                className="h-13 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all group relative overflow-hidden"
              >
                <Link href="/signup" className="relative z-10">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-13 px-8 text-base font-semibold rounded-xl border-2 bg-background/80 backdrop-blur-sm hover:bg-muted/50 transition-colors"
              >
                <Link href="/demo" className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Watch Demo (3 min)
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2 hover:text-foreground transition-colors">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="font-medium">No credit card required</span>
              </span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-2 hover:text-foreground transition-colors">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="font-medium">30-day free trial</span>
              </span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-2 hover:text-foreground transition-colors">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="font-medium">Cancel anytime</span>
              </span>
            </div>
          </div>

          {/* Enhanced Dashboard Preview */}
          <div className="mt-20 lg:mt-28 relative px-2 sm:px-0">
            <div className="absolute -inset-6 bg-gradient-to-r from-primary/40 via-chart-2/30 to-primary/40 rounded-3xl blur-3xl opacity-30 -z-10" />
            <div className="relative rounded-2xl sm:rounded-3xl border-2 border-border/60 bg-card shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="bg-muted/60 px-4 sm:px-6 py-3 border-b flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background px-4 py-1.5 rounded-lg text-xs text-muted-foreground font-medium border">
                    app.inventoryflow.in/dashboard
                  </div>
                </div>
              </div>
              <div className="p-6 lg:p-8 bg-gradient-to-br from-card via-card to-muted/5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total Products", value: "2,847", change: "+12.5%", icon: "📦" },
                    { label: "Monthly Revenue", value: "₹10.84L", change: "+23.1%", icon: "💰" },
                    { label: "Active Orders", value: "156", change: "+8.2%", icon: "📋" },
                    { label: "Customers", value: "1,892", change: "+15.3%", icon: "👥" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gradient-to-br from-card/80 to-muted/20 rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-muted-foreground font-semibold">{stat.label}</p>
                        <span className="text-lg">{stat.icon}</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs font-semibold text-success mt-2">↑ {stat.change}</p>
                    </div>
                  ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-card/80 to-muted/20 rounded-xl p-5 border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-sm">Revenue Trend</h4>
                      <Badge variant="secondary" className="text-xs">Weekly</Badge>
                    </div>
                    <div className="flex items-end justify-between h-32 gap-2">
                      {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                          <div
                            className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t transition-all hover:from-primary to-primary/60"
                            style={{ height: `${h}%` }}
                          />
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {["M", "T", "W", "T", "F", "S", "S"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-card/80 to-muted/20 rounded-xl p-5 border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-sm">Top Performers</h4>
                      <Badge variant="secondary" className="text-xs">By Sales</Badge>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "Wireless Headphones", sales: 245, percent: 100 },
                        { name: "Smart Watch Pro", sales: 189, percent: 77 },
                        { name: "USB-C Hub", sales: 156, percent: 64 },
                        { name: "Keyboard", sales: 134, percent: 55 },
                      ].map((product, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{product.name}</p>
                            <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-primary to-chart-1 rounded-full" style={{ width: `${product.percent}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-16 sm:py-20 lg:py-24 border-y border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-chart-2/5">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                  <stat.icon className="h-7 w-7" />
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section id="features" className="py-20 sm:py-28 lg:py-36">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              🚀 Powerful Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6 text-balance">
              Everything You Need to Grow
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground text-pretty">
              Designed for modern businesses. From inventory tracking to analytics, get all the tools in one powerful platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden border-2 border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-7 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-5 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  <ArrowRight className="h-5 w-5 text-primary mt-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-20 sm:py-28 lg:py-36 bg-gradient-to-b from-muted/40 to-muted/20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              ⚡ Quick Setup
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Simple 3-step process to launch your business
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            {/* Connection Line */}
            <div className="hidden sm:block absolute top-12 left-[calc(16.67%+1.75rem)] right-[calc(16.67%+1.75rem)] h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {steps.map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-black text-2xl mb-6 shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 transition-all group-hover:scale-110 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section className="py-20 sm:py-28 lg:py-36">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              💬 Success Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6">
              Loved by Successful Businesses
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              See how InventoryFlow is transforming businesses across India
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="group border-2 border-border/60 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-7">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed text-sm sm:text-base font-medium">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground truncate">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Enhanced */}
      <section id="pricing" className="py-20 sm:py-28 lg:py-36 bg-gradient-to-b from-muted/40 to-muted/20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              💳 Transparent Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6">
              Plans for Every Business Size
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8">Start free, scale as you grow. No hidden charges.</p>
            <Button asChild className="h-11 font-semibold">
              <Link href="/pricing">
                View All Plans & Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {PRICING_TIERS_LANDING.map((tier) => (
              <PricingCard key={tier.id} tier={tier} billingPeriod="monthly" showFullFeatures={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="py-20 sm:py-28 lg:py-36">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 sm:p-16 lg:p-20 text-center overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary-foreground mb-6 text-balance">
                Start Growing Your Business Today
              </h2>
              <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10 font-medium">
                Join thousands of successful businesses already using InventoryFlow to manage inventory, track sales, and grow faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-13 px-8 text-base font-semibold rounded-xl"
                >
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 text-base font-semibold rounded-xl border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
