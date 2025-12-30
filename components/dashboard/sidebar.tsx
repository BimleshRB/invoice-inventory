"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  ArrowUpDown,
  Settings,
  BarChart3,
  Upload,
  Store,
  BookOpen,
  Menu,
  LogOut,
  Shield,
  UserCog,
  Landmark,
  CreditCard,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { API_BASE } from "@/lib/api-client"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Stock Movements", href: "/dashboard/stock", icon: ArrowUpDown },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Import/Export", href: "/dashboard/import", icon: Upload },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Documentation", href: "/dashboard/docs", icon: BookOpen },
]

const adminNavigation = [
  { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Admins", href: "/dashboard/admin#admins", icon: UserCog },
  { name: "Stores", href: "/dashboard/admin#stores", icon: Landmark },
  { name: "Users", href: "/dashboard/admin#users", icon: Users },
  { name: "Payments", href: "/dashboard/admin#payments", icon: CreditCard },
  { name: "Emails", href: "/dashboard/admin#emails", icon: Mail },
  { name: "Testimonials", href: "/dashboard/admin#testimonials", icon: MessageSquare },
  { name: "Contacts", href: "/dashboard/admin#contacts", icon: Phone },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [storeName, setStoreName] = useState<string>("")
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        // Get super admin status from stored role
        try {
          const userRole = localStorage.getItem("userRole")
          if (userRole) {
            const roleData = JSON.parse(userRole)
            setIsSuperAdmin(roleData.isSuperAdmin === true)
          } else {
            // Fallback: fetch from API if not stored
            const roleRes = await fetch(`${API_BASE}/admin/me/role`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (roleRes.ok) {
              const roleData = await roleRes.json()
              const isSuperAdmin = roleData.isSuperAdmin === true
              setIsSuperAdmin(isSuperAdmin)
              // Store for future use
              localStorage.setItem("userRole", JSON.stringify({ isSuperAdmin }))
            }
          }
        } catch (e) {
          // ignore
        }

        // Get store name from profile
        try {
          const res = await fetch(`${API_BASE}/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const profile = await res.json()
            setStoreName(profile.storeName || "My Store")
          }
        } catch (e) {
          // ignore
        }
      }
    }
    loadProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("signup_temp_data")
    if (onLinkClick) onLinkClick()
    router.push("/")
  }

  return (
    <>
      <Link href="/" className="flex h-16 items-center gap-3 border-b border-border px-6 hover:bg-accent/50 transition-colors">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Store className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">InventoryFlow</span>
          <span className="text-xs text-muted-foreground truncate max-w-[160px]" title={storeName}>
            {storeName || "Loading..."}
          </span>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 p-4">
        {/* Regular users see standard navigation, super admins see only admin navigation */}
        {!isSuperAdmin && navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
        
        {/* Super Admin Only - Admin Options */}
        {isSuperAdmin && (
          <>
            {adminNavigation.map((item) => {
              const isActive = item.href === "/dashboard/admin" 
                ? pathname === "/dashboard/admin" && !window.location.hash
                : pathname === "/dashboard/admin" && window.location.hash === item.href.split('#')[1] ? `#${item.href.split('#')[1]}` : false
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </>
        )}
      </nav>
      <div className="border-t border-border p-4 space-y-3">
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

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button asChild variant="outline" size="icon" className="bg-card">
              <span className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <SidebarContent onLinkClick={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <SidebarContent />
      </aside>
    </>
  )
}
