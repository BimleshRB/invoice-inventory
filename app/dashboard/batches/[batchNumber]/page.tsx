"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import { Package, Calendar, DollarSign, TrendingUp, FileText, Clock } from "lucide-react"

interface BatchItem {
  id: string
  productName: string
  batchNumber: string
  quantity: number
  expiryDate: string
  createdAt: string
  costPrice?: number
  sellingPrice?: number
  notes?: string
}

function statusFor(expiryDate: string) {
  const daysLeft = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (daysLeft < 0) return { label: "Expired", variant: "destructive" as const, color: "text-red-600" }
  if (daysLeft <= 30) return { label: "Expiring Soon", variant: "secondary" as const, color: "text-yellow-600" }
  return { label: "Active", variant: "outline" as const, color: "text-green-600" }
}

export default function BatchDetailsPage() {
  const params = useParams()
  const batchNumber = typeof params?.batchNumber === "string" ? params.batchNumber : Array.isArray(params?.batchNumber) ? params?.batchNumber?.[0] : ""
  const [items, setItems] = useState<BatchItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"
        const res = await fetch(`${base}/api/products/batches/by-number/${encodeURIComponent(batchNumber)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data) ? data : data.content || data.data || []
          const mapped = list.map((b: any) => ({
            id: String(b.id),
            productName: b.product?.name || b.productName || "Unknown",
            batchNumber: b.batchNumber,
            quantity: b.quantity,
            expiryDate: b.expiryDate,
            createdAt: b.createdAt,
            costPrice: b.costPrice ?? 0,
            sellingPrice: b.sellingPrice ?? b.product?.sellingPrice ?? 0,
            notes: b.notes,
          }))
          setItems(mapped)
        } else {
          setItems([])
        }
      } catch (e) {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [batchNumber])

  const getTotalQuantity = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalCost = () => {
    return items.reduce((sum, item) => sum + (item.costPrice ?? 0) * item.quantity, 0)
  }

  const getTotalValue = () => {
    return items.reduce((sum, item) => sum + (item.sellingPrice ?? 0) * item.quantity, 0)
  }

  const getMargin = () => {
    const cost = getTotalCost()
    const value = getTotalValue()
    return value - cost
  }

  return (
    <div className="space-y-6">
      <Header title={`Batch ${batchNumber || "-"}`} description="Products added in this batch" />

      {loading ? (
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading batch details...</p>
            </div>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-sm font-medium text-muted-foreground mb-2">No products found for this batch</p>
              <p className="text-xs text-muted-foreground">This batch may have been deleted or doesn't exist.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Products</p>
                    <p className="text-3xl font-bold">{items.length}</p>
                  </div>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Quantity</p>
                    <p className="text-3xl font-bold">{getTotalQuantity().toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Cost</p>
                    <p className="text-3xl font-bold truncate">{formatCurrency(getTotalCost())}</p>
                  </div>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Est. Margin</p>
                    <p className={`text-3xl font-bold truncate ${getMargin() >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(getMargin())}
                    </p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {items.map((item, index) => {
                  const st = statusFor(item.expiryDate)
                  return (
                    <div key={item.id}>
                      {index > 0 && <Separator className="my-6" />}
                      
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold truncate">{item.productName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={st.variant} className="gap-1">
                                <Calendar className="h-3 w-3" />
                                {st.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Added {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : "-"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/50 rounded-lg p-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              Quantity
                            </p>
                            <p className="text-sm font-semibold">{item.quantity.toLocaleString()} units</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Expiry Date
                            </p>
                            <p className={`text-sm font-semibold ${st.color}`}>
                              {item.expiryDate ? format(new Date(item.expiryDate), "MMM d, yyyy") : "-"}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Cost/Unit
                            </p>
                            <p className="text-sm font-semibold">{formatCurrency(item.costPrice ?? 0)}</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Selling/Unit
                            </p>
                            <p className="text-sm font-semibold">{formatCurrency(item.sellingPrice ?? 0)}</p>
                          </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Cost</p>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                              {formatCurrency((item.costPrice ?? 0) * item.quantity)}
                            </p>
                          </div>

                          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                            <p className="text-xs text-green-600 dark:text-green-400 mb-1">Est. Revenue</p>
                            <p className="text-lg font-bold text-green-700 dark:text-green-300">
                              {formatCurrency((item.sellingPrice ?? 0) * item.quantity)}
                            </p>
                          </div>

                          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3">
                            <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Est. Profit</p>
                            <p className={`text-lg font-bold ${
                              ((item.sellingPrice ?? 0) - (item.costPrice ?? 0)) * item.quantity >= 0
                                ? "text-purple-700 dark:text-purple-300"
                                : "text-red-600 dark:text-red-400"
                            }`}>
                              {formatCurrency(((item.sellingPrice ?? 0) - (item.costPrice ?? 0)) * item.quantity)}
                            </p>
                          </div>
                        </div>

                        {/* Notes */}
                        {item.notes && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              <FileText className="h-3 w-3" />
                              Notes
                            </p>
                            <p className="text-sm">{item.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
