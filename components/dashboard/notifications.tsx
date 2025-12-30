"use client"

import { useEffect, useMemo, useState } from "react"
import { Bell, Check, Loader2, RefreshCw, BellOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { notificationsApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface NotificationItem {
  id: string
  title: string
  body?: string
  createdAt: Date
  status?: string
  read?: boolean
}

const REFRESH_MS = 30000

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
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-88 p-0" align="end">
        <div className="px-3 py-3 bg-gradient-to-r from-primary/10 via-background to-background border-b border-border flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground">Recent activity updates</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchNotifications} aria-label="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-8 px-2 text-xs">
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          </div>
        </div>
        <ScrollArea className="h-80">
          {loading && (
            <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          )}
          {!loading && items.length === 0 && (
            <div className="px-3 py-6 text-sm text-muted-foreground flex flex-col items-center gap-2">
              <BellOff className="h-5 w-5 text-muted-foreground" />
              <span>Nothing new right now.</span>
            </div>
          )}
          {!loading && items.length > 0 && (
            <ul className="divide-y divide-border">
              {items.map((item) => {
                const isUnread = !readIds.has(item.id)
                return (
                  <li key={item.id}>
                    <button
                      className="w-full px-3 py-3 text-left hover:bg-muted/60 focus:outline-none"
                      onClick={() => {
                        markRead(item.id)
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <Badge variant={isUnread ? "default" : "secondary"} className="mt-0.5">
                          {item.status || "Update"}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          {item.body && <p className="text-xs text-muted-foreground">{item.body}</p>}
                          <p className="text-[11px] text-muted-foreground">
                            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                          </p>
                        </div>
                        {isUnread && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
