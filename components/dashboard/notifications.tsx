"use client"

import { useEffect, useMemo, useState } from "react"
import { Bell, Check, Loader2, RefreshCw, BellOff, AlertCircle, TrendingDown, Hourglass, DollarSign } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { notificationsApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface NotificationItem {
  id: string
  title: string
  body?: string
  createdAt: Date
  status?: string
  read?: boolean
}

const REFRESH_MS = 30000

// Get icon based on notification type
function getNotificationIcon(type?: string) {
  switch (type) {
    case "low_stock":
      return TrendingDown
    case "expiring_product":
      return Hourglass
    case "payment_due":
      return DollarSign
    case "payment_overdue":
      return AlertCircle
    default:
      return AlertCircle
  }
}

// Get badge color based on notification type
function getNotificationBgColor(type?: string) {
  switch (type) {
    case "low_stock":
      return "bg-orange-50 dark:bg-orange-950/30"
    case "expiring_product":
      return "bg-yellow-50 dark:bg-yellow-950/30"
    case "payment_due":
      return "bg-blue-50 dark:bg-blue-950/30"
    case "payment_overdue":
      return "bg-red-50 dark:bg-red-950/30"
    default:
      return "bg-gray-50 dark:bg-gray-950/30"
  }
}

// Get icon background color
function getIconBgColor(type?: string) {
  switch (type) {
    case "low_stock":
      return "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300"
    case "expiring_product":
      return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
    case "payment_due":
      return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
    case "payment_overdue":
      return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
    default:
      return "bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300"
  }
}

// Get badge label
function getNotificationLabel(type?: string) {
  switch (type) {
    case "low_stock":
      return "Low Stock"
    case "expiring_product":
      return "Expiring Soon"
    case "payment_due":
      return "Payment Due"
    case "payment_overdue":
      return "Overdue"
    default:
      return "Update"
  }
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  const unreadCount = useMemo(() => items.filter((n) => !readIds.has(n.id)).length, [items, readIds])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, REFRESH_MS)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await notificationsApi.list(0, 20)
      const list = Array.isArray(res.data?.content) ? res.data?.content : Array.isArray(res.data) ? res.data : []
      const mapped = list.map((n: any) => ({
        id: n.id?.toString() || crypto.randomUUID(),
        title: n.title || "Notification",
        body: n.message,
        createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
        status: n.type,
        read: n.readFlag,
      }))
      setItems(mapped)
      setReadIds(new Set(mapped.filter((m) => m.read).map((m) => m.id)))
    } finally {
      setLoading(false)
    }
  }

  const markAllRead = () => {
    notificationsApi.markAllRead()
    setReadIds(new Set(items.map((n) => n.id)))
  }

  const markRead = (id: string) => {
    notificationsApi.markRead(id)
    setReadIds((prev) => new Set(prev).add(id))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-lg">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        {/* Header */}
        <div className="px-4 py-4 bg-gradient-to-r from-primary/5 via-primary/2 to-background border-b border-border/50 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground mt-0.5">Recent activity updates</p>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-primary/10" 
              onClick={fetchNotifications} 
              aria-label="Refresh"
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllRead} 
                className="h-8 px-2 text-xs hover:bg-primary/10 text-foreground font-medium"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-96">
          {loading && (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading notifications…</span>
            </div>
          )}
          {!loading && items.length === 0 && (
            <div className="px-4 py-12 text-sm text-muted-foreground flex flex-col items-center gap-3">
              <BellOff className="h-8 w-8 text-muted-foreground/50" />
              <span className="font-medium">No notifications</span>
              <span className="text-xs">You're all caught up!</span>
            </div>
          )}
          {!loading && items.length > 0 && (
            <div className="divide-y divide-border/30">
              {items.map((item) => {
                const isUnread = !readIds.has(item.id)
                const Icon = getNotificationIcon(item.status)
                const iconBgColor = getIconBgColor(item.status)
                const notificationBgColor = getNotificationBgColor(item.status)
                const label = getNotificationLabel(item.status)

                // Get correct badge color class
                let badgeColorClass = "bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300"
                if (item.status === "low_stock") badgeColorClass = "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                else if (item.status === "expiring_product") badgeColorClass = "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                else if (item.status === "payment_due") badgeColorClass = "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                else if (item.status === "payment_overdue") badgeColorClass = "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"

                return (
                  <button
                    key={item.id}
                    className={cn(
                      "w-full px-4 py-4 text-left transition-all duration-200 hover:bg-muted/40 focus:outline-none",
                      isUnread && notificationBgColor
                    )}
                    onClick={() => markRead(item.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon Container */}
                      <div className={cn("mt-0.5 p-2.5 rounded-lg flex-shrink-0", iconBgColor)}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-foreground leading-tight">{item.title}</p>
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap",
                            badgeColorClass
                          )}>
                            {label}
                          </span>
                        </div>

                        {/* Body */}
                        {item.body && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                            {item.body}
                          </p>
                        )}

                        {/* Timestamp */}
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-muted-foreground font-medium">
                            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                          </p>
                          {isUnread && (
                            <span className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
