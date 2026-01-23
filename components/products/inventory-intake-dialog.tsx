"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { API_BASE, productApi } from "@/lib/api-client"
import type { Product, Category } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface IntakeBatchLine {
  id: string
  productId?: string
  productName: string
  quantity: number
  expiryDate: string
  costPrice: number
  sellingPrice: number
  batchNumber: string
  notes: string
}

interface InventoryIntakeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onSuccess?: () => void
}

export function InventoryIntakeDialog({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: InventoryIntakeDialogProps) {
  const [step, setStep] = useState<"intake" | "review">("intake")
  const [products, setProducts] = useState<Product[]>([])
  const [batches, setBatches] = useState<IntakeBatchLine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    quantity: 0,
    expiryDate: "",
    costPrice: 0,
    sellingPrice: 0,
    batchNumber: "",
    notes: "",
  })

  useEffect(() => {
    if (open) {
      loadProducts()
    }
  }, [open])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const res = await productApi.list(0, 1000)
      if (!res.error && res.data) {
        const items = Array.isArray(res.data) ? res.data : res.data?.content || []
        setProducts(items)
      }
    } catch (error) {
      console.error("Failed to load products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBatchLine = () => {
    if (!formData.productId || !formData.productName || !formData.quantity || !formData.expiryDate) {
      toast({
        title: "Validation Error",
        description: "Product, quantity, and expiry date are required",
        variant: "destructive",
      })
      console.error("Validation failed:", {
        productId: formData.productId,
        productName: formData.productName,
        quantity: formData.quantity,
        expiryDate: formData.expiryDate,
      })
      return
    }

    // Selling price must be provided and greater than 0
    if (!formData.sellingPrice || formData.sellingPrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Selling price per unit is required",
        variant: "destructive",
      })
      return
    }

    // Auto-generate batch number if not provided
    const batchNum =
      formData.batchNumber.trim() || `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    const newBatch: IntakeBatchLine = {
      id: `${Date.now()}-${Math.random()}`,
      productId: formData.productId,
      productName: formData.productName,
      quantity: formData.quantity,
      expiryDate: formData.expiryDate,
      costPrice: formData.costPrice,
      sellingPrice: formData.sellingPrice,
      batchNumber: batchNum,
      notes: formData.notes,
    }

    console.log("Adding batch to list:", newBatch)
    setBatches([...batches, newBatch])

    // Reset form
    setFormData({
      productId: "",
      productName: "",
      quantity: 0,
      expiryDate: "",
      costPrice: 0,
      sellingPrice: 0,
      batchNumber: "",
      notes: "",
    })

    toast({
      title: "Batch Added",
      description: `${formData.productName} (${formData.quantity} units) added to intake`,
    })
  }

  const handleRemoveBatchLine = (id: string) => {
    setBatches(batches.filter((b) => b.id !== id))
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => String(p.id) === productId)
    if (product) {
      setFormData({
        ...formData,
        productId: String(product.id),
        productName: product.name,
        costPrice: product.costPrice ? parseFloat(String(product.costPrice)) : 0,
        sellingPrice: product.sellingPrice ? parseFloat(String(product.sellingPrice)) : 0,
      })
    }
  }

  const handleSubmitIntake = async () => {
    if (batches.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one product batch",
        variant: "destructive",
      })
      return
    }

    setStep("review")
  }

  const handleConfirmIntake = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login first",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      console.log("Token length:", token.length)
      console.log("Token starts with:", token.substring(0, 20) + "...")

      let successCount = 0
      let errorCount = 0

      for (const batch of batches) {
        try {
          const productId = String(batch.productId).trim()
          if (!productId) {
            console.error("Product ID is missing for batch:", batch)
            errorCount++
            continue
          }

          const payload = {
            productId: parseInt(productId),
            batchNumber: batch.batchNumber || undefined,
            quantity: parseInt(String(batch.quantity)),
            expiryDate: batch.expiryDate,
            costPrice: batch.costPrice ? parseFloat(String(batch.costPrice)) : null,
            sellingPrice: batch.sellingPrice ? parseFloat(String(batch.sellingPrice)) : null,
            notes: batch.notes || undefined,
          }

          console.log(`Adding batch for product ${productId}:`, payload)

          const res = await fetch(`${API_BASE}/products/batches`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })

          if (res.ok) {
            successCount++
            console.log(`✓ Batch added successfully for ${batch.productName}`)
          } else {
            errorCount++
            const errorText = await res.text()
            console.error(`Failed to add batch for ${batch.productName}:`, res.status, errorText)
          }
        } catch (error) {
          errorCount++
          console.error(`Error adding batch for ${batch.productName}:`, error)
        }
      }

      if (successCount > 0) {
        toast({
          title: "Intake Successful",
          description: `${successCount} batch(es) added${errorCount > 0 ? `, ${errorCount} failed` : ""}`,
        })

        // Reset
        setBatches([])
        setStep("intake")
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast({
          title: "Intake Failed",
          description: "Could not add any batches. Please check your data and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Intake error:", error)
      toast({
        title: "Error",
        description: "Failed to process inventory intake",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const calculateTotal = () => {
    return batches.reduce((sum, b) => sum + b.quantity * b.costPrice, 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full max-w-[95vw] max-h-[98vh] lg:max-w-[98vw] lg:max-h-[98vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-bold text-foreground">
            {step === "intake" ? "Inventory Intake / Receiving" : "Review & Confirm Intake"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {step === "intake"
              ? "Add products to your inventory with different expiry dates"
              : "Review the batches before confirming"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          {step === "intake" ? (
            <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
              {/* Intake Form */}
              <Card className="border lg:h-fit">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Product Details
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Product Selection - Full Width */}
                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-sm font-medium">
                        Product <span className="text-red-500">*</span>
                      </Label>
                      {isLoading ? (
                        <div className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground flex items-center">
                          Loading products...
                        </div>
                      ) : (
                        <Select value={formData.productId} onValueChange={handleProductSelect}>
                          <SelectTrigger className="h-10 text-sm">
                            <SelectValue placeholder={products.length === 0 ? "No products available" : "Select product"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {products.length === 0 ? (
                              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                No products available
                              </div>
                            ) : (
                              products.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)} className="text-sm">
                                  {p.name} - {p.sku}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Primary Fields - 2 Column Grid */}
                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="quantity" className="text-sm font-medium">
                          Quantity <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          placeholder="Enter quantity"
                          className="h-10 text-sm"
                          value={formData.quantity || ""}
                          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-sm font-medium">
                          Expiry Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          className="h-10 text-sm"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Secondary Fields - 2 Column Grid */}
                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="costPrice" className="text-sm font-medium">
                          Cost Price Per Unit
                        </Label>
                        <Input
                          id="costPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="h-10 text-sm"
                          value={formData.costPrice || ""}
                          onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sellingPrice" className="text-sm font-medium">
                          Selling Price Per Unit <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="sellingPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="h-10 text-sm"
                          value={formData.sellingPrice || ""}
                          onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    {/* Batch Number - Full Width */}
                    <div className="space-y-2">
                      <Label htmlFor="batchNumber" className="text-sm font-medium">
                        Batch Number <span className="text-muted-foreground text-sm">(Optional)</span>
                      </Label>
                      <Input
                        id="batchNumber"
                        placeholder="Auto-generated if empty"
                        className="h-10 text-sm"
                        value={formData.batchNumber}
                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                      />
                    </div>

                    {/* Notes - Full Width */}
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Notes <span className="text-muted-foreground text-sm">(Optional)</span>
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Supplier, invoice number, or other details..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>

                    {/* Add Button */}
                    <Button onClick={handleAddBatchLine} className="w-full h-10 gap-2 text-sm font-medium">
                      <Plus className="h-4 w-4" />
                      Add to Intake List
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Intake List */}
              {batches.length > 0 ? (
                <Card className="lg:col-span-1">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        Added Batches
                        <Badge variant="secondary" className="ml-2">{batches.length}</Badge>
                      </h3>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Cost</p>
                        <p className="text-lg font-bold">{formatCurrency(calculateTotal())}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto -mx-4 px-4">
                      <Table className="text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Product</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="min-w-[100px]">Expiry</TableHead>
                            <TableHead className="text-right min-w-[100px]">Cost/Unit</TableHead>
                            <TableHead className="text-right min-w-[100px]">Selling/Unit</TableHead>
                            <TableHead className="text-right min-w-[100px]">Total Cost</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {batches.map((batch) => (
                            <TableRow key={batch.id}>
                              <TableCell className="font-medium">{batch.productName}</TableCell>
                              <TableCell className="text-right">{batch.quantity}</TableCell>
                              <TableCell>{batch.expiryDate}</TableCell>
                              <TableCell className="text-right">{formatCurrency(batch.costPrice)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(batch.sellingPrice)}</TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatCurrency(batch.quantity * batch.costPrice)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveBatchLine(batch.id)}
                                  className="hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed border lg:col-span-1">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-sm mb-2">No batches added yet</h3>
                    <p className="text-muted-foreground text-center text-sm max-w-sm">
                      Fill in the form above and click "Add to Intake List" to start building your inventory intake
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
        ) : (
          /* Review Step */
          <div className="space-y-4">
            <Card className="border">
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Total Batches</p>
                    <p className="text-2xl font-bold text-foreground">{batches.length}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Total Units</p>
                    <p className="text-2xl font-bold text-foreground">{batches.reduce((sum, b) => sum + b.quantity, 0)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Total Cost</p>
                    <p className="text-2xl font-bold text-foreground truncate">{formatCurrency(calculateTotal())}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-sm mb-4 text-foreground">Batch Summary</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {batches.map((batch) => (
                        <div key={batch.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-muted/50 rounded border hover:bg-muted transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{batch.productName}</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                            <span className="truncate">Batch: {batch.batchNumber}</span>
                            <span>•</span>
                            <span>Expires: {batch.expiryDate}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="font-semibold text-sm text-foreground">{batch.quantity} units</p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            Cost: {formatCurrency(batch.costPrice)}/unit · Selling: {formatCurrency(batch.sellingPrice)}/unit · Total: {formatCurrency(batch.quantity * batch.costPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          {step === "intake" && batches.length > 0 && (
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitIntake} disabled={isSaving || batches.length === 0}>
                Review & Confirm ({batches.length})
              </Button>
            </DialogFooter>
          )}

          {step === "intake" && batches.length === 0 && (
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          )}

          {step === "review" && (
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("intake")}
                disabled={isSaving}
              >
                Back to Edit
              </Button>
              <Button onClick={handleConfirmIntake} disabled={isSaving} className="min-w-[140px]">
                {isSaving ? "Processing..." : "Confirm Intake"}
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
