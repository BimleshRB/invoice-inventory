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

interface BatchData {
  id: string
  productId: string
  productName: string
  batchNumber: string
  quantity: number
  availableQuantity?: number
  expiryDate: string
  createdAt: string
  purchaseCost?: number
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
  const [batch, setBatch] = useState<BatchData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"
        const res = await fetch(`${base}/api/products/batches/batch-number/${encodeURIComponent(batchNumber)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          // Backend returns a single batch object, not an array
          const batchData: BatchData = {
            id: String(data.id),
            productId: String(data.productId),
            productName: data.product?.name || "Unknown Product",
            batchNumber: data.batchNumber,
            quantity: data.quantity ?? 0,
            availableQuantity: data.availableQuantity ?? data.quantity ?? 0,
            expiryDate: data.expiryDate,
            createdAt: data.createdAt,
            purchaseCost: data.purchaseCost ?? 0,
            sellingPrice: data.product?.sellingPrice ?? 0,
            notes: data.notes,
          }
          setBatch(batchData)
        } else {
          setBatch(null)
        }
      } catch (e) {
        console.error("Failed to load batch:", e)
        setBatch(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [batchNumber])

  const getTotalCost = () => {
    if (!batch) return 0
    return (batch.purchaseCost ?? 0) * batch.quantity
  }

  const getTotalValue = () => {
    if (!batch) return 0
    return (batch.sellingPrice ?? 0) * batch.quantity
  }

  const getMargin = () => {
    return getTotalValue() - getTotalCost()
  }

  return (
    <div className="space-y-6">
      <Header title={`Batch ${batchNumber || "-"}`} description="Batch details and inventory information" />

      {loading ? (
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading batch details...</p>
            </div>
          </CardContent>
        </Card>
      ) : !batch ? (
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-sm font-medium text-muted-foreground mb-2">Batch not found</p>
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
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product</p>
                    <p className="text-lg font-bold">{batch.productName}</p>
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
                    <p className="text-3xl font-bold">{batch.quantity.toLocaleString()}</p>
                    {batch.availableQuantity !== undefined && batch.availableQuantity !== batch.quantity && (
                      <p className="text-xs text-muted-foreground">Available: {batch.availableQuantity.toLocaleString()}</p>
                    )}
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

          {/* Batch Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold truncate">{batch.productName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={statusFor(batch.expiryDate).variant} className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {statusFor(batch.expiryDate).label}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Added {batch.createdAt ? format(new Date(batch.createdAt), "MMM d, yyyy") : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Quantity
                    </p>
                    <p className="text-sm font-semibold">{batch.quantity.toLocaleString()} units</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expiry Date
                    </p>
                    <p className={`text-sm font-semibold ${statusFor(batch.expiryDate).color}`}>
                      {batch.expiryDate ? format(new Date(batch.expiryDate), "MMM d, yyyy") : "-"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Cost/Unit
                    </p>
                    <p className="text-sm font-semibold">{formatCurrency(batch.purchaseCost ?? 0)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Selling/Unit
                    </p>
                    <p className="text-sm font-semibold">{formatCurrency(batch.sellingPrice ?? 0)}</p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Cost</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {formatCurrency((batch.purchaseCost ?? 0) * batch.quantity)}
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1">Est. Revenue</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">
                      {formatCurrency((batch.sellingPrice ?? 0) * batch.quantity)}
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3">
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Est. Profit</p>
                    <p className={`text-lg font-bold ${
                      ((batch.sellingPrice ?? 0) - (batch.purchaseCost ?? 0)) * batch.quantity >= 0
                        ? "text-purple-700 dark:text-purple-300"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {formatCurrency(((batch.sellingPrice ?? 0) - (batch.purchaseCost ?? 0)) * batch.quantity)}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {batch.notes && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <FileText className="h-3 w-3" />
                      Notes
                    </p>
                    <p className="text-sm">{batch.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
