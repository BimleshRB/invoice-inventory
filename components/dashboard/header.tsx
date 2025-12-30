"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchBar } from "@/components/dashboard/search-bar"
import { NotificationsBell } from "@/components/dashboard/notifications"

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button asChild variant="ghost" size="icon" className="lg:hidden">
            <span className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {/* Sidebar content is now handled by the Button in mobile view */}
        </SheetContent>
      </Sheet>
      <div className="pl-12 lg:pl-0 flex-1">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <SearchBar />
        <NotificationsBell />
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
