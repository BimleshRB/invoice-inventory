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

const pricingPlans = [
  {
    name: "Starter",
    price: "₹0",
    period: "forever",
    description: "Perfect for small businesses getting started",
    features: ["Up to 100 products", "50 invoices/month", "Basic analytics", "Email support", "1 user account"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Professional",
    price: "₹2,499",
    period: "month",
    description: "For growing businesses that need more",
    features: [
      "Unlimited products",
      "Unlimited invoices",
      "Advanced analytics",
      "Priority support",
      "Bulk import/export",
      "Custom branding",
      "5 user accounts",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹7,999",
    period: "month",
    description: "For large organizations with advanced needs",
    features: [
      "Everything in Pro",
      "Multi-location support",
      "Full API access",
      "Dedicated manager",
      "Custom integrations",
      "99.99% SLA",
      "Unlimited users",
      "On-premise option",
    ],
    cta: "Contact Sales",
    popular: false,
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
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 sm:w-250 h-100 sm:h-150 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl opacity-60" />
          <div className="absolute top-20 right-0 w-50 sm:w-100 h-50 sm:h-100 bg-gradient-to-bl from-chart-2/20 to-transparent rounded-full blur-3xl opacity-40" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border border-primary/20 bg-primary/5"
            >
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2 text-primary" />
              Trusted by 50,000+ businesses across India
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 text-balance leading-[1.1]">
              Inventory Management,{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-chart-1 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed text-pretty px-4">
              The all-in-one platform to track inventory, generate GST-compliant invoices, and grow your business with
              powerful real-time analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 px-4">
              <Button
                asChild
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-background/50 backdrop-blur-sm border-2"
              >
                <Link href="/demo">
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
                14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
                Cancel anytime
              </span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-12 sm:mt-16 lg:mt-24 relative px-2 sm:px-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-chart-2/20 to-primary/30 rounded-3xl blur-3xl opacity-40" />
            <div className="relative rounded-xl sm:rounded-2xl border-2 border-border/50 bg-card shadow-2xl overflow-hidden">
              <div className="bg-muted/80 px-3 sm:px-4 py-2 sm:py-3 border-b flex items-center gap-2 sm:gap-3">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs text-muted-foreground font-medium border">
                    app.inventoryflow.in/dashboard
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-muted/30 to-background">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {[
                    { label: "Total Products", value: "2,847", change: "+12.5%", positive: true },
                    { label: "Monthly Revenue", value: "₹10,84,300", change: "+23.1%", positive: true },
                    { label: "Active Orders", value: "156", change: "+8.2%", positive: true },
                    { label: "Customers", value: "1,892", change: "+15.3%", positive: true },
                  ].map((stat, i) => (
                    <div key={i} className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 border shadow-sm">
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-lg sm:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p
                        className={`text-[10px] sm:text-xs font-medium mt-1 ${stat.positive ? "text-success" : "text-destructive"}`}
                      >
                        {stat.change} vs last month
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-5 border shadow-sm h-40 sm:h-52">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h4 className="font-semibold text-xs sm:text-sm">Revenue Overview</h4>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                        This Week
                      </Badge>
                    </div>
                    <div className="flex items-end justify-between h-24 sm:h-32 gap-1.5 sm:gap-2">
                      {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-sm transition-all"
                            style={{ height: `${h}%` }}
                          />
                          <span className="text-[8px] sm:text-[10px] text-muted-foreground">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-5 border shadow-sm h-40 sm:h-52">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h4 className="font-semibold text-xs sm:text-sm">Top Products</h4>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                        By Sales
                      </Badge>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { name: "Wireless Headphones", sales: 245, percent: 100 },
                        { name: "Smart Watch Pro", sales: 189, percent: 77 },
                        { name: "USB-C Hub", sales: 156, percent: 64 },
                        { name: "Mechanical Keyboard", sales: 134, percent: 55 },
                      ].map((product, i) => (
                        <div key={i} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] sm:text-xs font-bold text-muted-foreground">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate">{product.name}</p>
                            <div className="h-1 sm:h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${product.percent}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">{product.sales}</span>
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

      {/* Stats Section */}
      <section className="py-12 sm:py-16 border-y bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 text-primary mb-2 sm:mb-3">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4">
              Powerful Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground text-pretty">
              From inventory tracking to invoice generation, get all the tools you need in one powerful platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-5 sm:p-6">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <div className="relative">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Fixed alignment */}
      <section className="py-16 sm:py-24 lg:py-32 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Simple setup process to get your business running smoothly
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 lg:gap-12 relative max-w-4xl mx-auto">
            <div className="hidden sm:block absolute top-7 left-[calc(16.67%+1.75rem)] right-[calc(16.67%+1.75rem)] h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary" />

            {steps.map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg sm:text-xl mb-4 sm:mb-6 shadow-lg shadow-primary/25 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4">
              Customer Stories
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Loved by Businesses Across India
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              See what our customers have to say about InventoryFlow
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-muted object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 lg:py-32 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4">
              Simple Pricing
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Choose Your Plan
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">Start free, scale as you grow. No hidden fees.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <Card
                key={i}
                className={`relative border-2 ${
                  plan.popular ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]" : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-5 sm:p-6 pt-6 sm:pt-8">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  <div className="my-4 sm:my-6">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6 text-balance">
                Ready to Transform Your Business?
              </h2>
              <p className="text-base sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-6 sm:mb-8">
                Join 50,000+ businesses already using InventoryFlow to streamline operations and boost revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold"
                >
                  <Link href="/signup">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  <Link href="/contact">Talk to Sales</Link>
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
