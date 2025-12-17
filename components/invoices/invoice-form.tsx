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
      const product = products.find((p) => p.id === value)
      if (product) {
        item.unitPrice = product.sellingPrice
      }
    }

    item.total = (item.quantity || 0) * (item.unitPrice || 0) - (item.discount || 0)
    newItems[index] = item
    setItems(newItems)
  }

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount - discount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      customerId,
      storeId: "store-1",
      items: items as InvoiceItem[],
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Invoice Number: <span className="font-mono font-semibold">{nextInvoiceNumber}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
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
                            value={item.productId || ""}
                            onValueChange={(value) => updateItem(index, "productId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
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
                placeholder="Additional notes for the invoice..."
                rows={3}
              />
            </div>
            <div className="space-y-3 rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">GST Rate (%)</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number.parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">GST Amount</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Discount (₹)</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(Number.parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
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
