"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Product, StockMovement } from "@/lib/types"

interface StockAdjustmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  onSubmit: (data: Omit<StockMovement, "id" | "createdAt" | "product">) => void
}

export function StockAdjustmentForm({ open, onOpenChange, products, onSubmit }: StockAdjustmentFormProps) {
  const [productId, setProductId] = useState("")
  const [type, setType] = useState<"in" | "out" | "adjustment">("in")
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      productId,
      type,
      quantity,
      reason,
      referenceId: null,
      referenceType: "manual",
      storeId: "store-1",
    })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setProductId("")
    setType("in")
    setQuantity(1)
    setReason("")
  }

  const selectedProduct = products.find((p) => p.id === productId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Stock Adjustment</DialogTitle>
          <DialogDescription>Add or remove stock from your inventory</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={productId} onValueChange={setProductId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.quantity} in stock)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                Current stock: <span className="font-semibold text-foreground">{selectedProduct.quantity}</span>{" "}
                {selectedProduct.unit}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Adjustment Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "in" | "out" | "adjustment")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Stock In (Add)</SelectItem>
                <SelectItem value="out">Stock Out (Remove)</SelectItem>
                <SelectItem value="adjustment">Set Quantity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">{type === "adjustment" ? "New Quantity" : "Quantity"}</Label>
            <Input
              id="quantity"
              type="number"
              min={type === "adjustment" ? 0 : 1}
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for adjustment..."
              rows={2}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!productId}>
              Apply Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
