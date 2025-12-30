"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { StockTable } from "@/components/stock/stock-table"
import { StockAdjustmentForm } from "@/components/stock/stock-adjustment-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertTriangle, Clock, Loader2 } from "lucide-react"
import { stockApi, productApi, dashboardApi } from "@/lib/api-client"
import type { StockMovement, Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { format } from "date-fns"

export default function StockPage() {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load stock movements
      const movementsRes = await stockApi.list(0, 100)
      if (movementsRes.error) {
        toast({
          title: "Failed to load stock movements",
          description: movementsRes.error,
          variant: "destructive",
        })
        setMovements([])
      } else {
        // Normalize movements data: map movementType to type for frontend compatibility
        const normalizedMovements = (movementsRes.data?.content || []).map((m: any) => ({
          ...m,
          type: m.movementType === 'adjust' ? 'adjustment' : m.movementType
        }))
        setMovements(normalizedMovements)
      }

      // Load products for low stock alert
      const productsRes = await productApi.list(0, 100)
      if (!productsRes.error) {
        const allProducts = productsRes.data?.content || []
        setProducts(allProducts)
        // Calculate low stock products (stock < minimum stock level)
        const low = allProducts.filter(p => 
          p.quantity < (p.minimumStock || 10)
        )
        setLowStockProducts(low)
      }

      // Load dashboard stats for inventory overview
      const statsRes = await dashboardApi.getInventorySummary()
      if (statsRes.error) {
        console.warn("Failed to load inventory summary:", statsRes.error)
      }
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Unable to load stock data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStockAdjustment = async (data: Omit<StockMovement, "id" | "createdAt" | "product">) => {
    setIsSaving(true)
    try {
      const res = await stockApi.create(data)
      if (res.error) {
        toast({
          title: "Failed to record adjustment",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Stock Adjusted",
          description: "Stock levels have been updated successfully.",
        })
        setIsFormOpen(false)
        await loadData()
      }
    } catch (error) {
      toast({
        title: "Error adjusting stock",
        description: "Unable to record stock adjustment",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col">
      <Header title="Stock Management" description="Track inventory levels and movements" />
      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Alerts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-warning/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">All products are well stocked</p>
              ) : (
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{product.name}</span>
                      <Badge variant="destructive">{product.quantity} left</Badge>
                    </div>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{lowStockProducts.length - 3} more items</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Stock Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : movements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No stock movements yet</p>
              ) : (
                <div className="space-y-2">
                  {movements.slice(0, 3).map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{movement.product?.name || "Unknown"}</span>
                      <Badge variant={(movement.type || movement.movementType) === "in" ? "default" : "secondary"}>
                        {(movement.type || movement.movementType) === "in" ? "+" : "-"}{movement.quantity}
                      </Badge>
                    </div>
                  ))}
                  {movements.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{movements.length - 3} more movements</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stock Actions */}
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsFormOpen(true)}
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Stock Adjustment
          </Button>
        </div>

        {/* Stock Movements Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <StockTable movements={movements} />
        )}
      </div>

      <StockAdjustmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        products={products}
        onSubmit={handleStockAdjustment}
        isSaving={isSaving}
      />

      <Toaster />
    </div>
  )

  return (
    <div className="flex flex-col">
      <Header title="Stock Management" description="Track inventory levels and movements" />
      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Alerts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-warning/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">All products are well stocked</p>
              ) : (
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{product.name}</span>
                      <Badge variant="destructive">{product.quantity} left</Badge>
                    </div>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{lowStockProducts.length - 3} more items</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Stock Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : movements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No stock movements yet</p>
              ) : (
                <div className="space-y-2">
                  {movements.slice(0, 3).map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{movement.product?.name || "Unknown"}</span>
                      <Badge variant={movement.movementType === "in" ? "default" : "secondary"}>
                        {movement.movementType === "in" ? "+" : "-"}{movement.quantity}
                      </Badge>
                    </div>
                  ))}
                  {movements.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{movements.length - 3} more movements</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stock Actions */}
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsFormOpen(true)}
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Stock Adjustment
          </Button>
        </div>

        {/* Stock Movements Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <StockTable movements={movements} />
        )}
      </div>

      <StockAdjustmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        products={products}
        onSubmit={handleStockAdjustment}
        isSaving={isSaving}
      />

      <Toaster />
    </div>
  )
}
