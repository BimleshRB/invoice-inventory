"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, History } from "lucide-react"
import { format } from "date-fns"
import { productApi } from "@/lib/api-client"
import type { PriceHistory } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface PriceHistoryDialogProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PriceHistoryDialog({ productId, open, onOpenChange }: PriceHistoryDialogProps) {
  const [items, setItems] = useState<PriceHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    const load = async () => {
      setIsLoading(true)
      const res = await productApi.priceHistory(productId, 0, 50)
      if (!res.error && res.data) {
        const rows = Array.isArray(res.data)
          ? res.data
          : (res.data as any).content || (res.data as any).data || []
        setItems(rows as PriceHistory[])
      } else {
        setItems([])
      }
      setIsLoading(false)
    }
    void load()
  }, [productId, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center gap-2">
          <History className="h-5 w-5" />
          <DialogTitle>Price History</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No price changes recorded.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Changed At</TableHead>
                  <TableHead>Old Price</TableHead>
                  <TableHead>New Price</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="w-[120px]">User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(row.changedAt), "MMM dd, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>{row.oldPrice === null ? "—" : formatCurrency(row.oldPrice)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatCurrency(row.newPrice || 0)}
                        {row.oldPrice !== null && row.newPrice !== null && row.newPrice > row.oldPrice ? (
                          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                            +{((row.newPrice - row.oldPrice) / (row.oldPrice || 1) * 100).toFixed(0)}%
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.reason || "—"}</TableCell>
                    <TableCell className="text-sm">{row.changedBy || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
