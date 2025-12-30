"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Customer, Product, InvoiceItem, Invoice } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  products: Product[]
  onSubmit: (data: Partial<Invoice>) => void
  nextInvoiceNumber: string
}

export function InvoiceForm({
  open,
  onOpenChange,
  customers,
  products,
  onSubmit,
  nextInvoiceNumber,
}: InvoiceFormProps) {
  const [customerId, setCustomerId] = useState("")
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([])
  const [taxRate, setTaxRate] = useState(18) // Default GST rate in India
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState("")
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

  // Safely parse numbers from inputs, falling back to a default when blank/invalid
  const toNumber = (value: string | number | undefined, fallback = 0) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : fallback
    const str = (value ?? "").toString().trim()
    if (str === "") return fallback
    const n = Number.parseFloat(str)
    return Number.isFinite(n) ? n : fallback
  }

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: unknown) => {
    const newItems = [...items]
    const item = { ...newItems[index], [field]: value }

    if (field === "productId") {
      const product = products.find((p) => String(p.id) === String(value))
      if (product) {
        item.productId = String(product.id)
        item.unitPrice = Number(product.sellingPrice) || 0
      }
    }

    const qty = Number(item.quantity || 0)
    const price = Number(item.unitPrice || 0)
    const disc = Number(item.discount || 0)
    item.total = qty * price - disc
    newItems[index] = item
    setItems(newItems)
  }

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
  const safeTaxRate = Number.isFinite(taxRate) ? taxRate : 0
  const safeDiscount = Number.isFinite(discount) ? discount : 0
  const taxAmount = (subtotal * safeTaxRate) / 100
  const total = subtotal + taxAmount - safeDiscount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = (items || []).filter(i => i.productId).map(i => ({
      ...i,
      productId: Number(i.productId),
    }))
    onSubmit({
      customerId: Number(customerId) || (customerId as any),
      items: validItems as InvoiceItem[],
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      status: "draft",
      dueDate: new Date(dueDate),
      notes,
    })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setCustomerId("")
    setItems([])
    setTaxRate(18)
    setDiscount(0)
    setNotes("")
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  }

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  // De-duplicate products by id to avoid repeated entries
  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>()
    return (products || []).filter(p => {
      const key = String(p.id)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [products])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[880px]">
        <DialogHeader className="gap-3 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <DialogTitle className="text-2xl">Create New Invoice</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Capture the basics, add items, and we will calculate totals for you.
              </p>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Invoice #{nextInvoiceNumber}
            </span>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={String(customer.id)}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose who this invoice will be billed to.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              <p className="text-xs text-muted-foreground">Set a realistic payment timeline to avoid overdue dues.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Items</Label>
                <p className="text-xs text-muted-foreground">List products or services to build your invoice.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/70 bg-muted/30 px-6 py-8 text-center">
                <div className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  No items added yet
                </div>
                <p className="text-sm text-muted-foreground">
                  Add your first line item to calculate totals automatically.
                </p>
                <Button type="button" variant="default" size="sm" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" /> Add your first item
                </Button>
              </div>
            )}
            {items.length > 0 && (
              <div className="rounded-lg border border-border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Product</TableHead>
                      <TableHead className="w-20">Qty</TableHead>
                      <TableHead className="w-24">Price</TableHead>
                      <TableHead className="w-24 hidden sm:table-cell">Discount</TableHead>
                      <TableHead className="w-28 text-right">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={item.productId ? String(item.productId) : ""}
                            onValueChange={(value) => updateItem(index, "productId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {uniqueProducts.map((product) => (
                                <SelectItem key={product.id} value={String(product.id)}>
                                  {product.name} ({formatCurrency(product.sellingPrice)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value))}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice || 0}
                            onChange={(e) => updateItem(index, "unitPrice", Number.parseFloat(e.target.value))}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.discount || 0}
                            onChange={(e) => updateItem(index, "discount", Number.parseFloat(e.target.value))}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.total || 0)}</TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add payment terms, bank details, or delivery notes."
                rows={3}
              />
            </div>
            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">GST Rate (%)</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={Number.isFinite(taxRate) ? taxRate : 0}
                  onChange={(e) => setTaxRate(toNumber(e.target.value, 0))}
                  className="w-24"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">GST Amount</span>
                <span className="font-semibold">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Discount (₹)</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={Number.isFinite(discount) ? discount : 0}
                  onChange={(e) => setDiscount(toNumber(e.target.value, 0))}
                  className="w-24"
                />
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={items.length === 0 || !customerId}>
              Create Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
