"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import type { Category, Product } from "@/lib/types"
import { CategoryDialog } from "./category-dialog"

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  categories: Category[]
  onSubmit: (data: Partial<Product>) => void
  isSaving?: boolean
  onCategoriesChange?: (categories: Category[]) => void
}

const defaultFormData: Partial<Product> = {
  sku: "",
  name: "",
  description: "",
  categoryId: "",
  costPrice: 0,
  sellingPrice: 0,
  quantity: 0,
  minStockLevel: 10,
  unit: "pcs",
  barcode: "",
  expiryDate: null,
  isActive: true,
}

export function ProductForm({ open, onOpenChange, product, categories, onSubmit, isSaving = false, onCategoriesChange }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(defaultFormData)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [localCategories, setLocalCategories] = useState<Category[]>(categories)

  useEffect(() => {
    if (open) {
      setLocalCategories(categories)
      if (product) {
        setFormData({
          sku: product.sku,
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
          quantity: product.quantity,
          minStockLevel: product.minStockLevel,
          unit: product.unit,
          barcode: product.barcode || "",
          expiryDate: product.expiryDate,
          isActive: product.isActive,
        })
      } else {
        setFormData(defaultFormData)
      }
    }
  }, [product, open, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product details below."
              : "Fill in the details to add a new product to your inventory."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku || ""}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SKU-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode || ""}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="1234567890123"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Product name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description"
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Category</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCategoryDialogOpen(true)}
                  className="h-6 w-6 p-0"
                  title="Add new category"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Select
                value={String(formData.categoryId || "")}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {localCategories && localCategories.length > 0 ? (
                    localCategories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">No categories available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit || "pcs"}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="g">Grams</SelectItem>
                  <SelectItem value="l">Liters</SelectItem>
                  <SelectItem value="ml">Milliliters</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="pack">Pack</SelectItem>
                  <SelectItem value="license">License</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price ($)</Label>
              <Input
                id="costPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.costPrice === 0 ? "" : formData.costPrice || ""}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value ? Number.parseFloat(e.target.value) : 0 })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price ($)</Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice === 0 ? "" : formData.sellingPrice || ""}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value ? Number.parseFloat(e.target.value) : 0 })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">{product ? "Quantity" : "Initial Qty"}</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity === 0 ? "" : formData.quantity || ""}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value ? Number.parseInt(e.target.value) : 0 })}
                placeholder="0"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minStockLevel">Min Stock Level</Label>
              <Input
                id="minStockLevel"
                type="number"
                min="0"
                value={formData.minStockLevel === 10 ? "" : formData.minStockLevel || ""}
                onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value ? Number.parseInt(e.target.value) : 10 })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value ? new Date(e.target.value) : null })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : product ? "Update" : "Add"} Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSuccess={(newCategory) => {
          setLocalCategories([...localCategories, newCategory])
          setFormData({ ...formData, categoryId: newCategory.id })
          if (onCategoriesChange) {
            onCategoriesChange([...localCategories, newCategory])
          }
        }}
      />
    </Dialog>
  )
}
