"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Package, Menu, X, BarChart3, FileText, Users, Upload, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const features = [
  {
    icon: Package,
    title: "Inventory Management",
    description: "Track products and stock levels",
    href: "/#features",
  },
  {
    icon: FileText,
    title: "Invoice Generation",
    description: "Create professional invoices",
    href: "/#features",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Insights and business metrics",
    href: "/#features",
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Manage your client database",
    href: "/#features",
  },
  {
    icon: Upload,
    title: "Bulk Import/Export",
    description: "CSV import and data export",
    href: "/#features",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Enterprise-grade protection",
    href: "/#features",
  },
]

const navLinks = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/help", label: "Help" },
  { href: "/contact", label: "Contact" },
]

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">InventoryFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-muted/50 data-[state=open]:bg-muted/50">
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-125 gap-3 p-4 md:grid-cols-2">
                      {features.map((feature) => (
                        <NavigationMenuLink key={feature.title} asChild>
                          <Link
                            href={feature.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted transition-colors"
                          >
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <feature.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">{feature.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{feature.description}</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="font-medium">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="font-medium shadow-md">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-9 w-9"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-125 pb-4" : "max-h-0",
          )}
        >
          <div className="pt-2 border-t">
            <nav className="flex flex-col gap-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Features
              </div>
              {features.slice(0, 4).map((feature) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <feature.icon className="h-4 w-4" />
                  {feature.title}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-3">
                <Button asChild variant="outline" className="w-full justify-center bg-transparent">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full justify-center">
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
