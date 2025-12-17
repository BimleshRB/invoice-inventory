"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { StockTable } from "@/components/stock/stock-table"
import { StockAdjustmentForm } from "@/components/stock/stock-adjustment-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertTriangle, Clock } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { StockMovement, Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { format } from "date-fns"

export default function StockPage() {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMovements(dataStore.getStockMovements())
    setProducts(dataStore.getProducts())
    setLowStockProducts(dataStore.getLowStockProducts())
    setExpiringProducts(dataStore.getExpiringProducts(30))
  }, [])

  const handleStockAdjustment = (data: Omit<StockMovement, "id" | "createdAt" | "product">) => {
    dataStore.addStockMovement(data)
    setMovements(dataStore.getStockMovements())
    setProducts(dataStore.getProducts())
    setLowStockProducts(dataStore.getLowStockProducts())
    toast({
      title: "Stock Adjusted",
      description: "Stock levels have been updated successfully.",
    })
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
                Expiring Soon (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expiringProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products expiring soon</p>
              ) : (
                <div className="space-y-2">
                  {expiringProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{product.name}</span>
                      <Badge variant="outline">
                        {product.expiryDate && format(new Date(product.expiryDate), "MMM dd")}
                      </Badge>
                    </div>
                  ))}
                  {expiringProducts.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{expiringProducts.length - 3} more items</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stock Actions */}
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Stock Adjustment
          </Button>
        </div>

        {/* Stock Movements Table */}
        <StockTable movements={movements} />
      </div>

      <StockAdjustmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        products={products}
        onSubmit={handleStockAdjustment}
      />

      <Toaster />
    </div>
  )
}
