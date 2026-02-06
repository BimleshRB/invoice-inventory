"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { ProductBatchManager } from "@/components/products/batch-manager"
import { ProductBatchHistory } from "@/components/products/product-batch-history"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, Package } from "lucide-react"
import type { Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { API_BASE } from "@/lib/api-client"
import { useProductStock } from "@/hooks/use-product-stock"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [storeId, setStoreId] = useState<number | null>(null)

  // Use ERP ledger API for stock
  const { currentStock, batches, loading: stockLoading, refetch: refetchStock } = useProductStock(
    product?.id ? Number(product.id) : null
  )

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const url = `${API_BASE}/products/${productId}`
        console.log("[PRODUCT-DETAIL] Loading product. URL:", url, "Token:", token ? "present" : "missing")
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("[PRODUCT-DETAIL] Response status:", response.status, response.statusText)
        
        if (response.ok) {
          const data = await response.json()
          console.log("[PRODUCT-DETAIL] Product loaded:", data)
          setProduct(data)
          setStoreId(data.storeId)
        } else {
          const errorText = await response.text()
          console.error("[PRODUCT-DETAIL] Failed to load product. Status:", response.status, "Error:", errorText)
          toast({
            title: "Product not found",
            description: "Unable to load product details",
            variant: "destructive",
          })
          router.push("/dashboard/products")
        }
      } catch (error) {
        console.error("[PRODUCT-DETAIL] Exception loading product:", error)
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        })
        router.push("/dashboard/products")
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId, router, toast])

  const handleBatchesUpdated = async () => {
    // Reload product and refetch stock from ledger
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        // Refetch stock from ledger
        await refetchStock()
      }
    } catch (error) {
      console.error("Failed to reload product:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Product Details" description="" />
        <div className="flex-1 flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col">
        <Header title="Product Details" description="" />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Product Details" description={product.name} />
      
      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        {/* Product Information Card */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-muted-foreground mt-1">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">SKU</p>
                  <p className="font-mono text-sm font-medium">{product.sku}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Unit</p>
                  <p className="text-sm font-medium">{product.unit || "---"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Barcode</p>
                  <p className="font-mono text-sm font-medium">{product.barcode || "---"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Stock (from Ledger)</p>
                  {stockLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <p className="text-lg font-semibold">{currentStock}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Min Stock</p>
                  <p className="text-lg font-semibold">{product.minStockLevel || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Batches</p>
                  {stockLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <p className="text-lg font-semibold">{batches.length}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                {product.isActive ? (
                  <Badge className="bg-success text-success-foreground">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </div>

            {product.imageUrl && (
              <div className="flex-shrink-0">
                <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Batch Management Section */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Batch Management
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Manage inventory batches with different expiry dates. Each batch is tracked separately for accurate stock calculations and expiry management.
            </p>
          </div>

          {storeId ? (
            <ProductBatchManager
              productId={parseInt(productId)}
              storeId={storeId}
              onBatchesUpdated={handleBatchesUpdated}
            />
          ) : (
            <p className="text-muted-foreground">Loading batch information...</p>
          )}
        </div>

        {/* Batch History Section */}
        <ProductBatchHistory productId={productId} />
      </div>
    </div>
  )
}
