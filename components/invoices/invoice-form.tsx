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
import { Plus, Trash2, Package } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { CustomerForm } from "@/components/customers/customer-form"
import { customerApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  products: Product[]
  onSubmit: (data: Partial<Invoice>) => void
  nextInvoiceNumber: string
  isSaving?: boolean
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
  const [invoiceType, setInvoiceType] = useState<'in' | 'out'>("out")
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([])
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState("")
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers)
  const { toast } = useToast()

  // Safely parse numbers
  const toNumber = (value: string | number | undefined, fallback = 0) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : fallback
    const str = (value ?? "").toString().trim()
    if (str === "") return fallback
    const n = Number.parseFloat(str)
    return Number.isFinite(n) ? n : fallback
  }

  const addItem = () => {
    setItems([...items, { 
      productId: undefined, 
      quantity: 1, 
      unitPrice: 0, 
      discount: 0,
      discountType: "percentage",
      taxRate: 18, // Default GST rate in India
      total: 0 
    }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateItemTotal = (item: any) => {
    const qty = toNumber(item.quantity, 0)
    const price = toNumber(item.unitPrice, 0)
    const discount = toNumber(item.discount, 0)
    const taxRate = toNumber(item.taxRate, 0)
    
    // Line subtotal before discount
    let lineSubtotal = qty * price
    
    // Apply discount
    let discountAmount = 0
    if (item.discountType === "percentage") {
      discountAmount = (lineSubtotal * discount) / 100
    } else {
      discountAmount = discount
    }
    
    // Subtotal after discount
    const subtotalAfterDiscount = lineSubtotal - discountAmount
    
    // Calculate tax on discounted amount
    const taxAmount = (subtotalAfterDiscount * taxRate) / 100
    
    // Total = subtotal after discount + tax
    const total = subtotalAfterDiscount + taxAmount
    
    return { discountAmount, taxAmount, total }
  }

  const updateItem = (index: number, field: string, value: unknown) => {
    const newItems = [...items]
    const item = { ...newItems[index], [field]: value }

    // Auto-fill price when product is selected
    if (field === "productId") {
      const product = products.find((p) => String(p.id) === String(value))
      if (product) {
        item.productId = product.id
        item.unitPrice = toNumber(product.sellingPrice, 0)
      }
    }

    // Recalculate item total whenever any relevant field changes
    if (["quantity", "unitPrice", "discount", "discountType", "taxRate"].includes(field)) {
      const { total } = calculateItemTotal(item)
      item.total = total
    }
    
    newItems[index] = item
    setItems(newItems)
  }

  // Calculate invoice totals
  const invoiceSubtotal = items.reduce((sum, item) => {
    const qty = toNumber(item.quantity, 0)
    const price = toNumber(item.unitPrice, 0)
    const discount = toNumber(item.discount, 0)
    let subtotal = qty * price
    if (item.discountType === "percentage") {
      subtotal -= (subtotal * discount) / 100
    } else {
      subtotal -= discount
    }
    return sum + subtotal
  }, 0)

  const invoiceTaxTotal = items.reduce((sum, item) => {
    const qty = toNumber(item.quantity, 0)
    const price = toNumber(item.unitPrice, 0)
    const discount = toNumber(item.discount, 0)
    const taxRate = toNumber(item.taxRate, 0)
    
    let subtotal = qty * price
    if (item.discountType === "percentage") {
      subtotal -= (subtotal * discount) / 100
    } else {
      subtotal -= discount
    }
    
    return sum + ((subtotal * taxRate) / 100)
  }, 0)

  const invoiceDiscount = toNumber(discount, 0)
  const invoiceTotal = invoiceSubtotal + invoiceTaxTotal - invoiceDiscount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = items
      .filter(i => i.productId)
      .map(i => ({
        ...i,
        productId: Number(i.productId),
        quantity: toNumber(i.quantity, 1),
        unitPrice: toNumber(i.unitPrice, 0),
        discount: toNumber(i.discount, 0),
        discountType: i.discountType || "percentage",
        taxRate: toNumber(i.taxRate, 0),
      })) as InvoiceItem[]

    onSubmit({
      customerId: Number(customerId) || (customerId as any),
      type: invoiceType,
      items: validItems,
      subtotal: invoiceSubtotal,
      taxRate: 0, // Not used at invoice level (per-item instead)
      taxAmount: invoiceTaxTotal,
      discount: invoiceDiscount,
      total: invoiceTotal,
      status: "draft",
      dueDate: new Date(dueDate),
      notes,
    })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setCustomerId("")
    setInvoiceType("out")
    setItems([])
    setDiscount(0)
    setNotes("")
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  }

  const handleCustomerCreated = async (newCustomerData: Partial<Customer>) => {
    try {
      const res = await customerApi.create(newCustomerData)
      if (res.error) {
        toast({
          title: "Failed to add customer",
          description: res.error,
          variant: "destructive",
        })
      } else if (res.data) {
        toast({
          title: "Customer Added",
          description: `${newCustomerData.name} has been added.`,
        })
        // Add to local list and select it
        setLocalCustomers([...localCustomers, res.data])
        setCustomerId(String(res.data.id))
        setIsCustomerDialogOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error adding customer",
        description: "Unable to create customer",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    setLocalCustomers(customers)
  }, [customers])

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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader className="gap-3 pb-2 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <DialogTitle className="text-2xl">Create New Invoice</DialogTitle>
              <DialogDescription className="text-xs">
                Add items with individual tax rates and discounts. All calculations are automatic.
              </DialogDescription>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
              #{nextInvoiceNumber}
            </span>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header: Customer, Due Date */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="customer" className="text-xs font-semibold">Customer *</Label>
              <div className="flex gap-1.5">
                <Select value={customerId} onValueChange={setCustomerId} required>
                  <SelectTrigger className="flex-1 h-9 text-sm">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {localCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={String(customer.id)}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsCustomerDialogOpen(true)}
                  className="h-9 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-xs font-semibold">Invoice Type *</Label>
              <Select value={invoiceType} onValueChange={(v) => setInvoiceType(v as 'in' | 'out')}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="out">Outgoing (Sale)</SelectItem>
                  <SelectItem value="in">Intake (Purchase)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-xs font-semibold">Due Date *</Label>
              <Input 
                id="dueDate" 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                required 
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Line Items</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addItem}
                className="h-8 text-xs"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 py-8">
                <Package className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">No items yet. Click "Add Item" to get started.</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader className="bg-muted/50 hover:bg-muted/50">
                    <TableRow className="border-b hover:bg-transparent">
                      <TableHead className="w-45 px-2 py-2 font-semibold">Product</TableHead>
                      <TableHead className="w-14 px-2 py-2 text-center font-semibold">Qty</TableHead>
                      <TableHead className="w-20 px-2 py-2 text-right font-semibold">Unit Price</TableHead>
                      <TableHead className="w-28 px-2 py-2 text-center font-semibold">Discount</TableHead>
                      <TableHead className="w-16 px-2 py-2 text-center font-semibold">Tax %</TableHead>
                      <TableHead className="w-24 px-2 py-2 text-right font-semibold">Amount</TableHead>
                      <TableHead className="w-8 px-2 py-2"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => {
                      const { total } = calculateItemTotal(item)
                      return (
                        <TableRow key={index} className="hover:bg-muted/50">
                          <TableCell className="px-2 py-1.5">
                            <Select
                              value={item.productId ? String(item.productId) : ""}
                              onValueChange={(value) => updateItem(index, "productId", Number(value))}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {uniqueProducts.map((product) => (
                                  <SelectItem key={product.id} value={String(product.id)}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="px-2 py-1.5">
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={item.quantity || 1}
                              onChange={(e) => updateItem(index, "quantity", toNumber(e.target.value, 1))}
                              className="h-7 w-full text-center text-xs p-1"
                            />
                          </TableCell>
                          <TableCell className="px-2 py-1.5">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice || 0}
                              onChange={(e) => updateItem(index, "unitPrice", toNumber(e.target.value, 0))}
                              className="h-7 w-full text-right text-xs p-1"
                            />
                          </TableCell>
                          <TableCell className="px-2 py-1.5">
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.discount || 0}
                                onChange={(e) => updateItem(index, "discount", toNumber(e.target.value, 0))}
                                className="h-7 w-16 text-right text-xs p-1"
                              />
                              <Select 
                                value={item.discountType || "percentage"}
                                onValueChange={(value) => updateItem(index, "discountType", value)}
                              >
                                <SelectTrigger className="h-7 w-12 p-0 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">%</SelectItem>
                                  <SelectItem value="amount">₹</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell className="px-2 py-1.5">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={item.taxRate || 0}
                              onChange={(e) => updateItem(index, "taxRate", toNumber(e.target.value, 0))}
                              className="h-7 w-full text-center text-xs p-1"
                            />
                          </TableCell>
                          <TableCell className="px-2 py-1.5 text-right font-semibold">
                            {formatCurrency(total)}
                          </TableCell>
                          <TableCell className="px-2 py-1.5">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Notes and Summary */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-semibold">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, bank details, etc."
                rows={4}
                className="text-xs resize-none"
              />
            </div>

            {/* Summary Box */}
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(invoiceSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">GST Total</span>
                  <span className="font-medium">{formatCurrency(invoiceTaxTotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">Invoice Discount</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount || 0}
                    onChange={(e) => setDiscount(toNumber(e.target.value, 0))}
                    className="h-6 w-20 text-right text-xs p-1"
                    placeholder="₹0.00"
                  />
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Total Amount</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(invoiceTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <DialogFooter className="flex gap-2 pt-2 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="h-9"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={items.length === 0 || !customerId}
              className="h-9 min-w-24"
            >
              Create Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Customer Form Dialog */}
      <CustomerForm 
        open={isCustomerDialogOpen} 
        onOpenChange={setIsCustomerDialogOpen}
        onSubmit={handleCustomerCreated}
      />
    </Dialog>
  )
}
