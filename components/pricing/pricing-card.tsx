import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, ArrowRight } from "lucide-react"
import { PRICING_TIERS, getPriceDisplay, type PRICING_TIERS as PricingTier } from "@/lib/pricing-config"

interface PricingCardProps {
  tier: (typeof PRICING_TIERS)[0]
  billingPeriod: "monthly" | "annual"
  showFullFeatures?: boolean
}

export function PricingCard({ tier, billingPeriod, showFullFeatures = true }: PricingCardProps) {
  const displayPrice = getPriceDisplay(tier.price, billingPeriod)
  const annualSavings =
    tier.price && billingPeriod === "annual" ? ((tier.price * 12 * 0.1).toFixed(0) as unknown as number) : 0

  return (
    <Card
      className={`border-2 transition-all duration-300 flex flex-col ${
        tier.highlighted
          ? "border-primary/50 hover:border-primary shadow-lg shadow-primary/20 md:scale-105"
          : "border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
      }`}
    >
      <CardHeader className="pb-4">
        {tier.badge && (
          <Badge className="w-fit mb-2 bg-primary/20 text-primary border-primary/30">
            {tier.badge === "Free Forever" && "🎉"} {tier.badge === "Most Popular" && "⭐"} {tier.badge}
          </Badge>
        )}
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <CardDescription className="text-sm">{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pb-6">
        {/* Price */}
        <div className="mb-6">
          {tier.price !== null ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">{displayPrice}</span>
                {tier.price !== 0 && (
                  <span className="text-sm text-muted-foreground">
                    {billingPeriod === "annual" ? "/year" : "/month"}
                  </span>
                )}
              </div>
              {billingPeriod === "annual" && tier.price !== 0 && (
                <p className="text-xs text-success mt-2">Save ${annualSavings}/year with annual billing</p>
              )}
            </>
          ) : (
            <div className="text-2xl font-black text-foreground">Custom Pricing</div>
          )}
        </div>

        {/* CTA Button */}
        <Button
          asChild
          variant={tier.ctaVariant}
          className={`w-full h-10 font-semibold text-sm mb-6 ${
            tier.highlighted ? "bg-primary hover:bg-primary/90" : ""
          }`}
        >
          <Link href={tier.cta === "Contact Sales" ? "/contact" : "/signup"}>
            {tier.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        {/* Features List */}
        <div className="space-y-3">
          {tier.features.slice(0, showFullFeatures ? undefined : 5).map((feature, j) => (
            <div key={j} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
              )}
              <span
                className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/50"}`}
              >
                {feature.text}
              </span>
            </div>
          ))}
          {!showFullFeatures && tier.features.length > 5 && (
            <p className="text-xs text-primary font-semibold mt-4">+ {tier.features.length - 5} more features</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
