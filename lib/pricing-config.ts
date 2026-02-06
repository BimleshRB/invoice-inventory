// Shared pricing configuration
export const PRICING_TIERS = [
  {
    id: "basic",
    name: "Basic",
    description: "Free forever for getting started",
    price: 0,
    period: "month",
    badge: "Free Forever",
    features: [
      { text: "Up to 10 products", included: true },
      { text: "Up to 10 invoices/month", included: true },
      { text: "Basic reporting", included: true },
      { text: "1 user account", included: true },
      { text: "Email support", included: true },
      { text: "Basic inventory tracking", included: true },
      { text: "Mobile app access", included: false },
      { text: "API access", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Priority support", included: false },
      { text: "Custom integrations", included: false },
    ],
    cta: "Get Started",
    ctaVariant: "outline" as const,
  },
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses and freelancers",
    price: 29,
    period: "month",
    features: [
      { text: "Up to 50 products", included: true },
      { text: "Up to 100 invoices/month", included: true },
      { text: "Basic reporting", included: true },
      { text: "1 user account", included: true },
      { text: "Email support", included: true },
      { text: "Basic inventory tracking", included: true },
      { text: "Mobile app access", included: true },
      { text: "API access", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Priority support", included: false },
      { text: "Custom integrations", included: false },
    ],
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing businesses",
    price: 79,
    period: "month",
    badge: "Most Popular",
    features: [
      { text: "Up to 5,000 products", included: true },
      { text: "Unlimited invoices", included: true },
      { text: "Advanced reporting", included: true },
      { text: "Up to 5 users", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Full inventory management", included: true },
      { text: "Multi-location support", included: true },
      { text: "API access", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority support", included: false },
      { text: "Custom integrations", included: false },
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: null,
    period: "custom",
    features: [
      { text: "Unlimited products", included: true },
      { text: "Unlimited invoices", included: true },
      { text: "Custom reports & dashboards", included: true },
      { text: "Unlimited users", included: true },
      { text: "24/7 dedicated support", included: true },
      { text: "Advanced multi-location", included: true },
      { text: "Advanced APIs", included: true },
      { text: "API access", included: true },
      { text: "Business intelligence", included: true },
      { text: "24/7 Priority support", included: true },
      { text: "Custom integrations", included: true },
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
  },
]

// For landing page - show only top 3 tiers
export const PRICING_TIERS_LANDING = PRICING_TIERS.slice(1) // Exclude Basic, show Starter, Professional, Enterprise

// Get price based on billing period
export const getPrice = (monthlyPrice: number | null, billingPeriod: "monthly" | "annual") => {
  if (monthlyPrice === null) return null
  if (billingPeriod === "annual") {
    return Math.round(monthlyPrice * 12 * 0.9)
  }
  return monthlyPrice
}

// Get display price text
export const getPriceDisplay = (price: number | null, billingPeriod: "monthly" | "annual") => {
  if (price === null) return "Custom Pricing"
  if (price === 0) return "Free"
  return `$${getPrice(price, billingPeriod)}`
}
