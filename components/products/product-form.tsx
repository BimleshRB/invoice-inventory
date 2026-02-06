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
  name: "",
  sku: "",
  description: "",
  categoryId: undefined,
  minStockLevel: undefined,
  unit: "pcs",
  barcode: "",
  isActive: true,
}

/**
 * Generate SKU from product name, category, and unit
 * Format: {CATEGORY_ABBR}-{NAME_FIRST_3}-{UNIT_ABBR}-{RANDOM}
 * Example: ELEC-EAR-KG-7F2A
 */
function generateSKU(name: string, categoryId: number | undefined, unit: string, categories: Category[]): string {
  if (!name || !categoryId || !unit) return ""
  
  // Get category abbreviation
  const category = categories.find(c => c.id === categoryId)
  const categoryAbbr = category?.name?.slice(0, 3).toUpperCase() || "GEN"
  
  // Get first 3 letters of name
  const nameAbbr = name.slice(0, 3).toUpperCase()
  
  // Get unit abbreviation
  const unitMap: Record<string, string> = {
    "pcs": "PC",
    "kg": "KG",
    "g": "GM",
    "l": "LT",
    "ml": "ML",
    "box": "BX",
    "pack": "PK",
    "license": "LC",
  }
  const unitAbbr = unitMap[unit] || unit.slice(0, 2).toUpperCase()
  
  // Generate random 2-char suffix
  const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase()
  
  return `${categoryAbbr}-${nameAbbr}-${unitAbbr}-${randomSuffix}`
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
          name: product.name,
          sku: product.sku,
          description: product.description,
          categoryId: product.categoryId,
          minStockLevel: product.minStockLevel,
          unit: product.unit,
          barcode: product.barcode || "",
          isActive: product.isActive,
        })
      } else {
        setFormData(defaultFormData)
      }
    }
  }, [product, open, categories])

  // Auto-generate SKU when name, category, or unit changes
  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value })
    // Auto-generate SKU if it's a new product (no existing SKU)
    if (!product && value && formData.categoryId && formData.unit) {
      const newSku = generateSKU(value, formData.categoryId, formData.unit, localCategories)
      setFormData(prev => ({ ...prev, sku: newSku }))
    }
  }

  const handleCategoryChange = (value: string) => {
    const categoryId = Number(value)
    setFormData({ ...formData, categoryId })
    // Auto-generate SKU if it's a new product
    if (!product && formData.name && categoryId && formData.unit) {
      const newSku = generateSKU(formData.name, categoryId, formData.unit, localCategories)
      setFormData(prev => ({ ...prev, sku: newSku }))
    }
  }

  const handleUnitChange = (value: string) => {
    setFormData({ ...formData, unit: value })
    // Auto-generate SKU if it's a new product
    if (!product && formData.name && formData.categoryId && value) {
      const newSku = generateSKU(formData.name, formData.categoryId, value, localCategories)
      setFormData(prev => ({ ...prev, sku: newSku }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate that category is selected
    if (!formData.categoryId) {
      alert("Please select a category")
      return
    }
    console.log("[FORM-SUBMIT] Form submitted with data:", formData)
    onSubmit(formData)
    // Note: Do NOT close dialog here - let the parent component close it after async operation
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
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
              <div className="flex items-center gap-2">
                <Select
                  value={formData.categoryId ? String(formData.categoryId) : ""}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="text-foreground w-full">
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCategoryDialogOpen(true)}
                  title="Add Category"
                  className="whitespace-nowrap shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit || "pcs"}
                  onValueChange={handleUnitChange}
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

              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Min Stock Level</Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  min="0"
                  value={formData.minStockLevel ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minStockLevel: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    })
                  }
                  placeholder="Enter minimum stock level"
                />
              </div>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : product ? "Update" : "Add"} Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
        <CategoryDialog
          open={isCategoryDialogOpen}
          onOpenChange={setIsCategoryDialogOpen}
          onSuccess={(newCategory) => {
            const updated = [...localCategories, newCategory]
            setLocalCategories(updated)
            onCategoriesChange?.(updated)
          }}
        />
      </Dialog>
    )
}

