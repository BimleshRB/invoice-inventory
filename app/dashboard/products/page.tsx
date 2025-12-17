"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { ProductsTable } from "@/components/products/products-table"
import { ProductForm } from "@/components/products/product-form"
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
import { Plus } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { Product, Category } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setProducts(dataStore.getProducts())
    setCategories(dataStore.getCategories())
  }, [])

  const handleAddProduct = (data: Partial<Product>) => {
    const newProduct = dataStore.addProduct({
      ...data,
      storeId: "store-1",
    } as Omit<Product, "id" | "createdAt" | "updatedAt">)
    setProducts(dataStore.getProducts())
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to inventory.`,
    })
  }

  const handleUpdateProduct = (data: Partial<Product>) => {
    if (selectedProduct) {
      dataStore.updateProduct(selectedProduct.id, data)
      setProducts(dataStore.getProducts())
      toast({
        title: "Product Updated",
        description: `${data.name} has been updated.`,
      })
    }
  }

  const handleDeleteProduct = () => {
    if (deleteProduct) {
      dataStore.deleteProduct(deleteProduct.id)
      setProducts(dataStore.getProducts())
      toast({
        title: "Product Deleted",
        description: `${deleteProduct.name} has been removed.`,
        variant: "destructive",
      })
      setDeleteProduct(null)
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

  return (
    <div className="flex flex-col">
      <Header title="Products" description="Manage your product inventory" />
      <div className="flex-1 space-y-4 p-4 lg:p-6">
        <div className="flex justify-end">
          <Button onClick={handleOpenForm}>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
