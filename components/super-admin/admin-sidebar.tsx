"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  UserCog,
  Building2,
  Users,
  CreditCard,
  Mail,
  MessageSquare,
  Phone,
  Menu,
  LogOut,
  Shield,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const adminNavigation = [
  { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Admins", href: "/dashboard/admin#admins", icon: UserCog },
  { name: "Stores", href: "/dashboard/admin#stores", icon: Building2 },
  { name: "Users", href: "/dashboard/admin#users", icon: Users },
  { name: "Payments", href: "/dashboard/admin#payments", icon: CreditCard },
  { name: "Emails", href: "/dashboard/admin#emails", icon: Mail },
  { name: "Testimonials", href: "/dashboard/admin#testimonials", icon: MessageSquare },
  { name: "Contacts", href: "/dashboard/admin#contacts", icon: Phone },
]

function AdminSidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeHash, setActiveHash] = useState("")

  useEffect(() => {
    // Track hash changes
    const handleHashChange = () => {
      setActiveHash(window.location.hash)
    }
    
    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("signup_temp_data")
    if (onLinkClick) onLinkClick()
    router.push("/")
  }

  const isLinkActive = (href: string) => {
    if (href === "/dashboard/admin") {
      return pathname === "/dashboard/admin" && !activeHash
    }
    const hash = href.split('#')[1]
    return pathname === "/dashboard/admin" && activeHash === `#${hash}`
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href.includes('#')) {
      const hash = href.split('#')[1]
      window.location.hash = hash
    } else {
      // Clear hash for overview - navigate to admin page without hash
      if (window.location.hash) {
        window.location.hash = ""
      } else {
        // Already on overview, just trigger update
        window.dispatchEvent(new HashChangeEvent("hashchange"))
      }
      setActiveHash("")
    }
    if (onLinkClick) onLinkClick()
  }

  return (
    <>
      <Link
        href="/"
        onClick={onLinkClick}
        className="flex h-16 items-center gap-3 border-b border-border px-6 hover:bg-muted/70 dark:hover:bg-muted/60 transition-colors bg-card/80 backdrop-blur"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">InventoryFlow</span>
          <span className="text-xs text-muted-foreground">Super Admin Panel</span>
        </div>
      </Link>
      
      <nav className="flex-1 space-y-1 p-4">
        {adminNavigation.map((item) => {
          const isActive = isLinkActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/90 text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/70",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t border-border p-4 space-y-3 bg-card/80 backdrop-blur">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:border-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild suppressHydrationWarning>
            <Button asChild variant="outline" size="icon" className="bg-card">
              <span className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-background" suppressHydrationWarning>
            <div className="flex h-full flex-col">
              <AdminSidebarContent onLinkClick={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <AdminSidebarContent />
      </aside>
    </>
  )
}
