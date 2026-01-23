"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { ProductsTable } from "@/components/products/products-table"
import { ProductForm } from "@/components/products/product-form"
import { CategoryDialog } from "@/components/products/category-dialog"
import { InventoryIntakeDialog } from "@/components/products/inventory-intake-dialog"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Loader2 } from "lucide-react"
import type { Product, Category } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { productApi, categoryApi, type Product as ApiProduct } from "@/lib/api-client"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isIntakeDialogOpen, setIsIntakeDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Helper function to reload products
  const reloadProducts = async () => {
    try {
      console.log("[RELOAD] Starting product reload...")
      const listRes = await productApi.list(0, 100)
      console.log("[RELOAD] API response:", listRes)
      
      if (listRes.error) {
        console.error("[RELOAD] Error from API:", listRes.error)
        toast({
          title: "Failed to reload products",
          description: listRes.error,
          variant: "destructive",
        })
        return false
      }
      
      console.log("[RELOAD] listRes.data type:", typeof listRes.data)
      console.log("[RELOAD] listRes.data keys:", listRes.data ? Object.keys(listRes.data) : "null")
      
      const items = Array.isArray(listRes.data) ? listRes.data : listRes.data?.content || []
      console.log("[RELOAD] Extracted items count:", items.length)
      console.log("[RELOAD] Items:", items)
      
      setProducts(items)
      return true
    } catch (err) {
      console.error("[RELOAD] Exception during reload:", err)
      return false
    }
  }

  // Load products and categories from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        console.log("[INIT] Loading initial data...")
        // Load products
        const productRes = await productApi.list(0, 100)
        console.log("[INIT] Product response:", productRes)
        if (productRes.error) {
          console.error("[INIT] Failed to load products:", productRes.error)
          toast({
            title: "Failed to load products",
            description: productRes.error,
            variant: "destructive",
          })
        } else {
          const items = Array.isArray(productRes.data) ? productRes.data : productRes.data?.content || []
          console.log("[INIT] Setting products, count:", items.length)
          setProducts(items)
        }

        // Load categories
        const catRes = await categoryApi.list()
        console.log("[INIT] Category API Response:", catRes)
        if (!catRes.error) {
          const catItems = Array.isArray(catRes.data) ? catRes.data : (catRes.data as any)?.content || []
          console.log("[INIT] Loaded categories:", catItems)
          setCategories(catItems)
        } else {
          console.error("[INIT] Failed to load categories:", catRes.error)
        }
      } catch (err) {
        console.error("[INIT] Error loading data:", err)
        toast({
          title: "Error loading data",
          description: "Unable to load products and categories",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [toast])

  const normalizeProductPayload = (data: Partial<Product>) => {
    const normalized: any = {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      minStockLevel: Number(data.minStockLevel ?? 0),
      unit: data.unit || "pcs",
      barcode: data.barcode,
      isActive: data.isActive !== false,
    }
    
    // Include optional fields only if they have values
    if (data.sku) normalized.sku = data.sku
    if (data.costPrice !== undefined && data.costPrice !== null) normalized.costPrice = Number(data.costPrice)
    if (data.sellingPrice !== undefined && data.sellingPrice !== null) normalized.sellingPrice = Number(data.sellingPrice)
    if (data.quantity !== undefined && data.quantity !== null) normalized.quantity = Number(data.quantity)
    if (data.imageUrl) normalized.imageUrl = data.imageUrl
    if (data.expiryDate) normalized.expiryDate = data.expiryDate
    
    console.log("[NORMALIZE] Normalized payload:", normalized)
    return normalized
  }

  const handleAddProduct = async (data: Partial<Product>) => {
    setIsSaving(true)
    try {
      const payload = normalizeProductPayload(data)
      console.log("[ADD-PRODUCT] Form data:", data)
      console.log("[ADD-PRODUCT] Normalized payload:", payload)
      console.log("[ADD-PRODUCT] Making API request to /products")
      
      const res = await productApi.create(payload)
      console.log("[ADD-PRODUCT] API response:", res)
      
      if (res.error) {
        console.error("[ADD-PRODUCT] API error:", res)
        const errorMessage = typeof res.error === 'string' ? res.error : JSON.stringify(res.error)
        toast({
          title: res.status === 409 ? "Duplicate SKU or Name" : "Failed to add product",
          description: res.status === 409 ? "SKU or product name must be unique per store." : errorMessage,
          variant: "destructive",
        })
      } else {
        console.log("[ADD-PRODUCT] Product created successfully:", res.data)
        toast({
          title: "Product Added",
          description: `${data.name} has been added to inventory.`,
        })
        setIsFormOpen(false)
        setSelectedProduct(undefined)
        // Reload products
        await reloadProducts()
      }
    } catch (err) {
      console.error("[ADD-PRODUCT] Exception:", err)
      const errorMsg = err instanceof Error ? err.message : "Failed to add product"
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateProduct = async (data: Partial<Product>) => {
    if (!selectedProduct?.id) return
    setIsSaving(true)
    try {
      console.log("[UPDATE] Starting product update for ID:", selectedProduct.id)
      const payload = normalizeProductPayload(data)
      delete (payload as any).createdAt; // Ensure createdAt is not sent during update
      console.log("[UPDATE] Payload:", payload)
      
      const res = await productApi.update(selectedProduct.id, payload)
      console.log("[UPDATE] API response:", res)
      
      if (res.error) {
        console.error("[UPDATE] Update failed:", res.error)
        toast({
          title: res.status === 409 ? "Duplicate SKU or Name" : "Failed to update product",
          description: res.status === 409 ? "SKU or product name must be unique per store." : res.error,
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }
      
      console.log("[UPDATE] Update successful, updating state directly")
      
      // Update the product in the state directly with the response
      if (res.data) {
        const updatedProduct = res.data
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        )
        console.log("[UPDATE] Product state updated with response:", updatedProduct)
      }

      // Ensure freshest quantities (recomputed server-side from batches)
      await reloadProducts()
      
      toast({
        title: "Product Updated",
        description: `${data.name} has been updated.`,
      })
      setIsFormOpen(false)
      setSelectedProduct(undefined)
      
    } catch (err) {
      console.error("[UPDATE] Exception:", err)
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!deleteProduct?.id) return
    setIsSaving(true)
    try {
      const res = await productApi.delete(deleteProduct.id)
      if (res.error) {
        toast({
          title: "Failed to delete product",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Product Deleted",
          description: `${deleteProduct.name} has been removed.`,
          variant: "destructive",
        })
        setDeleteProduct(null)
        // Reload products
        await reloadProducts()
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }

  const handleOpenForm = () => {
    setSelectedProduct(undefined)
    setIsFormOpen(true)
  }

  const handleCategoryCreated = async (newCategory: Category) => {
    // Add new category to the list
    setCategories([...categories, newCategory])
    toast({
      title: "Category Added",
      description: `${newCategory.name} has been added.`,
    })
    setIsCategoryDialogOpen(false)
  }

  const reloadCategories = async () => {
    try {
      const catRes = await categoryApi.list()
      if (!catRes.error) {
        const catItems = Array.isArray(catRes.data) ? catRes.data : catRes.data?.content || []
        setCategories(catItems)
      }
    } catch (err) {
      console.error("Error reloading categories:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Products" description="Manage your product inventory" />
        <div className="flex-1 flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Products" description="Manage your product inventory" />
      <div className="flex-1 space-y-4 p-4 lg:p-6">
        <div className="flex justify-end gap-2">
          <Button onClick={() => setIsCategoryDialogOpen(true)} variant="outline" disabled={isSaving}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <Button onClick={handleOpenForm} disabled={isSaving}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        <ProductsTable products={products} categories={categories} onEdit={handleEdit} onDelete={setDeleteProduct} />
      </div>

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct}
        categories={categories}
        onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}
        isSaving={isSaving}
      />

      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={isSaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSuccess={handleCategoryCreated}
      />

      <InventoryIntakeDialog
        open={isIntakeDialogOpen}
        onOpenChange={setIsIntakeDialogOpen}
        categories={categories}
        onSuccess={reloadProducts}
      />

      <Toaster />
    </div>
  )
}
