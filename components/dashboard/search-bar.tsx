"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { dashboardApi, productApi, customerApi } from "@/lib/api-client"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn, formatCurrency } from "@/lib/utils"

interface SearchResult {
  id: string
  type: "product" | "customer" | "activity"
  title: string
  subtitle?: string
  href?: string
  meta?: string
}

const MIN_QUERY = 2
const DEBOUNCE_MS = 250

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Keyboard shortcut: Cmd/Ctrl + K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isModK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"
      if (isModK) {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 10)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    if (query.trim().length < MIN_QUERY) {
      setResults([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const [productsRes, customersRes, activityRes] = await Promise.all([
          productApi.search(query, 0, 5),
          customerApi.search(query, 0, 5),
          dashboardApi.getRecentActivity(0, 5),
        ])

        const productItems: SearchResult[] = Array.isArray(productsRes.data)
          ? productsRes.data.map((p: any) => ({
              id: p.id?.toString() || crypto.randomUUID(),
              type: "product",
              title: p.name,
              subtitle: `Stock: ${p.quantity ?? 0}`,
              href: p.id ? `/dashboard/products/${p.id}` : undefined,
              meta: p.sellingPrice !== undefined ? formatCurrency(Number(p.sellingPrice)) : undefined,
            }))
          : []

        const customerItems: SearchResult[] = Array.isArray(customersRes.data?.content || customersRes.data)
          ? (customersRes.data?.content || customersRes.data).map((c: any) => ({
              id: c.id?.toString() || crypto.randomUUID(),
              type: "customer",
              title: c.name,
              subtitle: c.email || c.phone,
              href: c.id ? `/dashboard/customers/${c.id}` : undefined,
            }))
          : []

        const activityItems: SearchResult[] = Array.isArray(activityRes.data)
          ? activityRes.data.map((a: any) => ({
              id: a.id?.toString() || crypto.randomUUID(),
              type: a.type || "activity",
              title: a.description || "Activity",
              subtitle: a.status ? `${a.status}` : undefined,
              href: a.id ? `/dashboard/invoices/${a.id}` : undefined,
            }))
          : []

        setResults([...productItems, ...customerItems, ...activityItems])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const grouped = useMemo(() => {
    return {
      products: results.filter((r) => r.type === "product"),
      customers: results.filter((r) => r.type === "customer"),
      activity: results.filter((r) => r.type === "activity"),
    }
  }, [results])

  return (
    <Popover open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) {
        setQuery("")
      } else {
        setTimeout(() => inputRef.current?.focus(), 10)
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="hidden md:flex h-10 w-80 items-center justify-start gap-2 rounded-full border border-muted-foreground/20 bg-gradient-to-r from-background via-background to-muted/30 shadow-sm"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate flex-1 text-left">
            {query ? query : "Search products, customers, activity"}
          </span>
          {loading ? <Spinner className="h-4 w-4" /> : <kbd className="text-[10px] text-muted-foreground">⌘K</kbd>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[520px] p-0" align="end">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search products, customers, activity..."
            autoFocus
            ref={inputRef}
          />
          <CommandList>
            {loading && (
              <div className="px-3 py-3 text-sm text-muted-foreground">Searching…</div>
            )}
            {!loading && <CommandEmpty>No results found</CommandEmpty>}
            {grouped.products.length > 0 && (
              <CommandGroup heading="Products">
                {grouped.products.map((item) => (
                  <CommandItem key={item.id} asChild>
                    <Link href={item.href || "#"} className="flex items-center gap-2 w-full" onClick={() => setOpen(false)}>
                      <Badge variant="outline" className="text-[10px] uppercase">Prod</Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
                      </div>
                      {item.meta && <span className="text-xs text-muted-foreground">{item.meta}</span>}
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {grouped.customers.length > 0 && (
              <CommandGroup heading="Customers">
                {grouped.customers.map((item) => (
                  <CommandItem key={item.id} asChild>
                    <Link href={item.href || "#"} className="flex items-center gap-2 w-full" onClick={() => setOpen(false)}>
                      <Badge variant="secondary" className="text-[10px] uppercase">Cust</Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
                      </div>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {grouped.activity.length > 0 && (
              <CommandGroup heading="Recent Activity">
                {grouped.activity.map((item) => (
                  <CommandItem key={item.id} asChild>
                    <Link href={item.href || "#"} className="flex items-center gap-2 w-full" onClick={() => setOpen(false)}>
                      <Badge variant="outline" className="text-[10px] uppercase">Log</Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
                      </div>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!loading && results.length === 0 && query.length >= MIN_QUERY && (
              <div className="px-3 py-4 text-xs text-muted-foreground">No matches. Try a different keyword.</div>
            )}
            {!loading && query.length < MIN_QUERY && (
              <div className="px-3 py-3 space-y-2">
                <p className="text-[13px] font-medium text-foreground">Quick filters</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {["stock", "customer", "invoice", "payment"].map((chip) => (
                    <button
                      key={chip}
                      className="rounded-full border px-3 py-1 hover:border-primary/60 hover:text-primary transition"
                      onClick={() => setQuery(chip)}
                    >
                      #{chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
