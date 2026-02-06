"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Package, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

interface ProductBatchHistoryProps {
  productId: string
}

interface BatchHistory {
  id: string
  batchNumber: string
  quantity: number
  purchaseCost: number
  sellingPrice?: number
  expiryDate: string
  createdAt: string
  notes?: string
}

export function ProductBatchHistory({ productId }: ProductBatchHistoryProps) {
  const [batches, setBatches] = useState<BatchHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadBatchHistory()
  }, [productId])

  const loadBatchHistory = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setBatches([])
        return
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api"}/products/batches/product/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.ok) {
        const data = await res.json()
        const batchList = Array.isArray(data) ? data : data.content || data.data || []
        setBatches(batchList)
      } else {
        setBatches([])
      }
    } catch (error) {
      console.error("Failed to load batch history:", error)
      setBatches([])
    } finally {
      setIsLoading(false)
    }
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
  }

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    return expiry < today
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Batch History
          </CardTitle>
          <CardDescription>All batches added for this product</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (batches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Batch History
          </CardTitle>
          <CardDescription>All batches added for this product</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-sm text-muted-foreground">No batches added yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5" />
          Batch History
        </CardTitle>
        <CardDescription>All batches added for this product ({batches.length})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline View */}
          <div className="space-y-3">
            {batches.map((batch, index) => (
              <div key={batch.id} className="relative">
                {/* Timeline line */}
                {index < batches.length - 1 && (
                  <div className="absolute left-4 top-12 w-0.5 h-8 bg-border" />
                )}

                {/* Batch Item */}
                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0 pt-1">
                    <div className="h-8 w-8 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-3">
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">Batch {batch.batchNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            Added on {format(new Date(batch.createdAt), "MMM dd, yyyy h:mm a")}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {isExpired(batch.expiryDate) ? (
                            <Badge variant="destructive" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              Expired
                            </Badge>
                          ) : isExpiringSoon(batch.expiryDate) ? (
                            <Badge variant="secondary" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              Expiring Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="font-semibold text-sm">{batch.quantity.toLocaleString()} units</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Cost/Unit</p>
                          <p className="font-semibold text-sm">{formatCurrency(batch.purchaseCost)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Selling/Unit</p>
                          <p className="font-semibold text-sm">{formatCurrency(batch.sellingPrice || 0)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Expiry Date</p>
                          <p className="font-semibold text-sm">{format(new Date(batch.expiryDate), "MMM dd, yyyy")}</p>
                        </div>
                      </div>

                      {batch.notes && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-1">Notes</p>
                          <p className="text-sm text-foreground">{batch.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
