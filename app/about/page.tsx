import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Users, Zap, Heart, Award, ArrowRight, Linkedin, Twitter } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We're dedicated to helping businesses of all sizes streamline their operations and achieve their goals.",
  },
  {
    icon: Users,
    title: "Customer-Centric",
    description:
      "Our customers are at the heart of everything we do. We listen, learn, and build solutions that matter.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We continuously push boundaries to deliver cutting-edge tools that give our users a competitive edge.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We operate with transparency and honesty, building trust through every interaction and decision.",
  },
]

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    image: "/team-sarah.png",
    bio: "Former product lead at Shopify with 15 years of experience in e-commerce.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Michael Torres",
    role: "CTO & Co-Founder",
    image: "/team-michael.png",
    bio: "Ex-Google engineer specializing in distributed systems and scalable architecture.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Emily Johnson",
    role: "Head of Product",
    image: "/team-emily.png",
    bio: "Product strategist who has launched 20+ successful SaaS products.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "David Kim",
    role: "Head of Engineering",
    image: "/team-david.png",
    bio: "Full-stack expert with a passion for building intuitive user experiences.",
    linkedin: "#",
    twitter: "#",
  },
]

const stats = [
  { value: "50,000+", label: "Active Businesses" },
  { value: "100M+", label: "Products Tracked" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "120+", label: "Countries Served" },
]

const milestones = [
  { year: "2020", title: "Founded", description: "InventoryFlow was born in San Francisco" },
  { year: "2021", title: "Series A", description: "Raised $12M to accelerate growth" },
  { year: "2022", title: "10K Customers", description: "Reached our first major milestone" },
  { year: "2023", title: "Global Expansion", description: "Opened offices in London and Singapore" },
  { year: "2024", title: "AI Features", description: "Launched intelligent forecasting" },
  { year: "2025", title: "50K Customers", description: "Serving businesses worldwide" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-16 pb-12">
        {/* Hero */}
        <section className="px-4 mb-14">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-3 text-xs">
                About Us
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                We&apos;re on a mission to simplify business operations
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                InventoryFlow helps thousands of businesses manage their inventory, create professional invoices, and
                make data-driven decisions that drive growth.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 mb-14">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <Card key={i} className="border-2 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl lg:text-3xl font-bold text-primary mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="px-4 mb-14 py-12 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="secondary" className="mb-3 text-xs">
                  Our Story
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Built by entrepreneurs, for entrepreneurs
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    InventoryFlow was founded in 2020 by Sarah Chen and Michael Torres, two entrepreneurs who
                    experienced firsthand the challenges of managing inventory and invoicing for their own e-commerce
                    business.
                  </p>
                  <p>
                    Frustrated by complicated, expensive software that didn&apos;t meet their needs, they set out to
                    build something better. Their vision was simple: create an intuitive, affordable platform that any
                    business could use to streamline their operations.
                  </p>
                  <p>
                    Today, InventoryFlow serves over 50,000 businesses worldwide, from small retail shops to growing
                    enterprise brands. We&apos;re proud to be part of our customers&apos; success stories.
                  </p>
                </div>
                <Button asChild className="mt-4 h-9 text-sm">
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  <img
                    src="/about-hero.jpg?height=400&width=600&query=modern office team collaboration"
                    alt="InventoryFlow team"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-4 mb-14">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-3 text-xs">
                Our Journey
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Key Milestones</h2>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-border" />
              <div className="grid md:grid-cols-6 gap-4">
                {milestones.map((milestone, i) => (
                  <div key={i} className="relative text-center">
                    <div className="hidden md:block absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background" />
                    <div className="md:pt-10">
                      <p className="text-lg font-bold text-primary mb-1">{milestone.year}</p>
                      <p className="text-sm font-semibold text-foreground mb-1">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-4 mb-14 py-12 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-3 text-xs">
                Our Values
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">What drives us forward</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((value, i) => (
                <Card key={i} className="border-2 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <value.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="px-4 mb-14">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-3 text-xs">
                Leadership
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Meet our team</h2>
              <p className="text-muted-foreground mt-1 text-sm max-w-xl mx-auto">
                Passionate experts dedicated to building the best inventory management platform.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {team.map((member, i) => (
                <Card key={i} className="border-2 hover:border-primary/30 transition-colors overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={
                          member.image || `/placeholder.svg?height=300&width=300&query=professional headshot ${i + 1}`
                        }
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
                      <p className="text-xs text-primary mb-1">{member.role}</p>
                      <p className="text-xs text-muted-foreground mb-2">{member.bio}</p>
                      <div className="flex gap-2">
                        <Link
                          href={member.linkedin}
                          className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                        >
                          <Linkedin className="h-3 w-3" />
                        </Link>
                        <Link
                          href={member.twitter}
                          className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                        >
                          <Twitter className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="px-4 mb-14 py-12 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-3 text-xs">
                Recognition
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Awards & Recognition</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {["G2 Leader 2024", "Capterra Best Value", "Forbes Cloud 100", "Inc. 5000", "ProductHunt #1"].map(
                (award, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border text-sm">
                    <Award className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium">{award}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6 lg:p-8 text-center">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-3">Join our growing team</h2>
                <p className="text-muted-foreground mb-4 text-sm max-w-xl mx-auto">
                  We&apos;re always looking for talented individuals who share our passion for helping businesses
                  succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="sm">
                    <Link href="/careers">
                      View Open Positions
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/contact">Contact Us</Link>
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
