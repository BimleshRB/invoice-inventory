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
import { SupplierForm } from "@/components/procurement/suppliers/SupplierForm"
import { customerApi } from "@/lib/api-client"
import { supplierApi } from "@/lib/api/procurement"
import { useToast } from "@/hooks/use-toast"

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  suppliers: any[]
  products: Product[]
  onSubmit: (data: Partial<Invoice>) => void
  nextInvoiceNumber: string
  isSaving?: boolean
  initialData?: Invoice
  storeId?: number
  onSupplierCreated?: (storeId?: number | null) => void | Promise<void>
}

export function InvoiceForm({
  open,
  onOpenChange,
  customers,
  suppliers,
  products,
  onSubmit,
  nextInvoiceNumber,
  initialData,
  storeId,
  onSupplierCreated,
}: InvoiceFormProps) {
  const normalizeSuppliers = (value: any) => {
    if (Array.isArray(value)) return value
    if (value && Array.isArray((value as any).content)) return (value as any).content
    return []
  }

  const [customerId, setCustomerId] = useState("")
  const [supplierId, setSupplierId] = useState("")
  const [invoiceType, setInvoiceType] = useState<'in' | 'out'>("out")
  const [status, setStatus] = useState<'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'>("draft")
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([])
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState("")
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false)
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers)
  const [localSuppliers, setLocalSuppliers] = useState<any[]>(normalizeSuppliers(suppliers))
  const { toast } = useToast()

  // Initialize form with existing data when editing
  useEffect(() => {
    if (open && initialData) {
      setCustomerId(initialData.customerId || "")
      setSupplierId((initialData as any).supplierId || "")
      setInvoiceType((initialData.type as 'in' | 'out') || "out")
      setStatus((initialData.status as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled') || "draft")
      
      // Normalize items to include batch fields from backend
      const normalizedItems = (initialData.items || []).map((item: any) => ({
        ...item,
        productId: item.productId || item.product?.id || "",
        // Map backend field names to frontend
        unitPrice: item.unitPrice || item.unitPriceSnapshot || 0,
        purchasePrice: item.purchasePrice || 0,
        batchNumber: item.batchNumber || "",
        // Format dates for date input (YYYY-MM-DD)
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
        manufactureDate: item.manufactureDate ? new Date(item.manufactureDate).toISOString().split('T')[0] : '',
        taxRate: item.taxRate || 0,
        discount: item.discount || 0,
        discountType: item.discountType || "percentage"
      }))
      setItems(normalizedItems)
      
      setDiscount(initialData.discount || 0)
      setNotes(initialData.notes || "")
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
    } else if (open) {
      // Reset form for new invoice
      setCustomerId("")
      setSupplierId("")
      setInvoiceType("out")
      setStatus("draft")
      setItems([])
      setDiscount(0)
      setNotes("")
      setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
    }
  }, [open, initialData])

  // Safely parse numbers
  const toNumber = (value: string | number | undefined, fallback = 0) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : fallback
    const str = (value ?? "").toString().trim()
    if (str === "") return fallback
    const n = Number.parseFloat(str)
    return Number.isFinite(n) ? n : fallback
  }

  const addItem = () => {
    const newItem: any = { 
      productId: undefined, 
      quantity: 1, 
      unitPrice: 0, 
      discount: 0,
      discountType: "percentage",
      taxRate: 18, // Default GST rate in India
      total: 0 
    }
    
    // Add batch fields for PURCHASE invoices
    if (invoiceType === 'in') {
      newItem.batchNumber = ''
      newItem.purchasePrice = 0
      newItem.expiryDate = ''
      newItem.manufactureDate = ''
    }
    
    setItems([...items, newItem])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateItemTotal = (item: any) => {
    const qty = toNumber(item.quantity, 0)
    // Use purchasePrice for PURCHASE invoices, unitPrice for SALE invoices
    const price = invoiceType === 'in' 
      ? toNumber(item.purchasePrice, 0) 
      : toNumber(item.unitPrice, 0)
    const discount = toNumber(item.discount, 0)
    const taxRate = toNumber(item.taxRate, 0)
    
    // Line subtotal before discount
    let lineSubtotal = qty * price
    
    // Apply discount (typically not used for PURCHASE invoices)
    let discountAmount = 0
    if (invoiceType === 'out') {
      if (item.discountType === "percentage") {
        discountAmount = (lineSubtotal * discount) / 100
      } else {
        discountAmount = discount
      }
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
        // For SALE invoices: use selling price from product master
        // For PURCHASE invoices: user enters cost price manually
        if (invoiceType === 'out') {
          item.unitPrice = toNumber(product.sellingPrice, 0)
        }
      }
    }

    // Recalculate item total whenever any relevant field changes
    const recalcFields = invoiceType === 'in' 
      ? ["quantity", "purchasePrice", "taxRate"]
      : ["quantity", "unitPrice", "discount", "discountType", "taxRate"]
    
    if (recalcFields.includes(field)) {
      const { total } = calculateItemTotal(item)
      item.total = total
    }
    
    newItems[index] = item
    setItems(newItems)
  }

  // Calculate invoice totals
  const invoiceSubtotal = items.reduce((sum, item) => {
    const qty = toNumber(item.quantity, 0)
    // Use purchasePrice for PURCHASE invoices, unitPrice for SALE invoices
    const price = invoiceType === 'in' 
      ? toNumber((item as any).purchasePrice, 0)
      : toNumber(item.unitPrice, 0)
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
    // Use purchasePrice for PURCHASE invoices, unitPrice for SALE invoices
    const price = invoiceType === 'in' 
      ? toNumber((item as any).purchasePrice, 0)
      : toNumber(item.unitPrice, 0)
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
      .map(i => {
        const baseItem: any = {
          productId: Number(i.productId),
          quantity: toNumber(i.quantity, 1),
          taxRate: toNumber(i.taxRate, 0),
        }
        
        // For PURCHASE invoices: include batch fields and purchase price
        if (invoiceType === 'in') {
          baseItem.purchasePrice = toNumber((i as any).purchasePrice, 0)
          baseItem.batchNumber = (i as any).batchNumber || ''
          // Send dates as YYYY-MM-DD or null (empty string becomes null)
          baseItem.expiryDate = (i as any).expiryDate || null
          baseItem.manufactureDate = (i as any).manufactureDate || null
        } else {
          // For SALE invoices: include selling price and discount
          baseItem.unitPrice = toNumber(i.unitPrice, 0)
          baseItem.discount = toNumber(i.discount, 0)
          baseItem.discountType = i.discountType || "percentage"
        }
        
        return baseItem
      }) as InvoiceItem[]

    const submitData: Partial<Invoice> = {
      type: invoiceType,
      status: status,
      items: validItems,
      subtotal: invoiceSubtotal,
      taxRate: 0, // Not used at invoice level (per-item instead)
      taxAmount: invoiceTaxTotal,
      discount: invoiceDiscount,
      total: invoiceTotal,
      dueDate: new Date(dueDate),
    }
    
    // Add customerId for SALE (out) or supplierId for PURCHASE (in) invoices
    if (invoiceType === "out" && customerId) {
      submitData.customerId = Number(customerId) || (customerId as any)
    } else if (invoiceType === "in" && supplierId) {
      (submitData as any).supplierId = Number(supplierId) || (supplierId as any)
    }
    
    if (notes) {
      submitData.notes = notes
    }

    onSubmit(submitData)
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setCustomerId("")
    setSupplierId("")
    setInvoiceType("out")
    setStatus("draft")
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

  const handleSupplierCreated = async () => {
    if (!storeId) {
      toast({
        title: "Select a store first",
        description: "Suppliers are linked to a store. Choose a store before adding one.",
        variant: "destructive",
      })
      setIsSupplierDialogOpen(false)
      return
    }

    try {
      const res = await supplierApi.getByStore(Number(storeId))
      if (res.error) {
        toast({
          title: "Failed to load suppliers",
          description: res.error,
          variant: "destructive",
        })
        return
      }

      const updated = normalizeSuppliers(res.data)
      setLocalSuppliers(updated)
      const newest = updated[updated.length - 1]
      if (newest?.id) {
        setCustomerId(String(newest.id))
      }

      if (onSupplierCreated) {
        await onSupplierCreated(storeId)
      }

      toast({
        title: "Supplier added",
        description: "New supplier is ready to use in this invoice.",
      })
    } catch (error) {
      toast({
        title: "Error refreshing suppliers",
        description: "Unable to refresh supplier list after creation.",
        variant: "destructive",
      })
    } finally {
      setIsSupplierDialogOpen(false)
    }
  }

  useEffect(() => {
    setLocalCustomers(customers)
  }, [customers])

  useEffect(() => {
    setLocalSuppliers(normalizeSuppliers(suppliers))
  }, [suppliers])

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
              <DialogTitle className="text-2xl">{initialData ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
              <DialogDescription className="text-xs">
                {initialData ? "Update invoice details." : "Add items with individual tax rates and discounts. All calculations are automatic."}
              </DialogDescription>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
              #{initialData ? initialData.invoiceNumber : nextInvoiceNumber}
            </span>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header: Customer/Supplier, Type, Due Date, Status */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              <Label htmlFor="customer" className="text-xs font-semibold">
                {invoiceType === 'in' ? 'Supplier *' : 'Customer *'}
              </Label>
              <div className="flex gap-1.5">
                <Select 
                  value={invoiceType === 'in' ? supplierId : customerId} 
                  onValueChange={(value) => {
                    if (invoiceType === 'in') {
                      setSupplierId(value)
                    } else {
                      setCustomerId(value)
                    }
                  }} 
                  required
                >
                  <SelectTrigger className="flex-1 h-9 text-sm">
                    <SelectValue placeholder={invoiceType === 'in' ? 'Select supplier' : 'Select customer'} />
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceType === 'in' 
                      ? (Array.isArray(localSuppliers) ? localSuppliers : []).map((supplier) => (
                          <SelectItem key={supplier.id} value={String(supplier.id)}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      : localCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={String(customer.id)}>
                            {customer.name}
                          </SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (invoiceType === 'in') {
                      if (!storeId) {
                        toast({
                          title: "Store required",
                          description: "Select a store to add suppliers.",
                          variant: "destructive",
                        })
                        return
                      }
                      setIsSupplierDialogOpen(true)
                    } else {
                      setIsCustomerDialogOpen(true)
                    }
                  }}
                  className="h-9 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-semibold">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
                      {invoiceType === 'in' ? (
                        <>
                          <TableHead className="w-20 px-2 py-2 text-right font-semibold">Cost Price</TableHead>
                          <TableHead className="w-28 px-2 py-2 text-center font-semibold">Batch #</TableHead>
                          <TableHead className="w-24 px-2 py-2 text-center font-semibold">Expiry</TableHead>
                          <TableHead className="w-24 px-2 py-2 text-center font-semibold">Mfg Date</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="w-20 px-2 py-2 text-right font-semibold">Unit Price</TableHead>
                          <TableHead className="w-28 px-2 py-2 text-center font-semibold">Discount</TableHead>
                        </>
                      )}
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
                              value={item.quantity || ""}
                              onChange={(e) => updateItem(index, "quantity", toNumber(e.target.value, 1))}
                              placeholder="Qty"
                              className="h-7 w-full text-center text-xs p-1"
                            />
                          </TableCell>
                          
                          {invoiceType === 'in' ? (
                            <>
                              {/* Cost Price for PURCHASE */}
                              <TableCell className="px-2 py-1.5">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={(item as any).purchasePrice || ""}
                                  onChange={(e) => updateItem(index, "purchasePrice", toNumber(e.target.value, 0))}
                                  placeholder="0.00"
                                  className="h-7 w-full text-right text-xs p-1"
                                  placeholder="Cost"
                                />
                              </TableCell>
                              {/* Batch Number */}
                              <TableCell className="px-2 py-1.5">
                                <Input
                                  type="text"
                                  value={(item as any).batchNumber || ''}
                                  onChange={(e) => updateItem(index, "batchNumber", e.target.value)}
                                  className="h-7 w-full text-xs p-1"
                                  placeholder="BATCH-001"
                                />
                              </TableCell>
                              {/* Expiry Date */}
                              <TableCell className="px-2 py-1.5">
                                <Input
                                  type="date"
                                  value={(item as any).expiryDate || ''}
                                  onChange={(e) => updateItem(index, "expiryDate", e.target.value)}
                                  className="h-7 w-full text-xs p-1"
                                />
                              </TableCell>
                              {/* Manufacturing Date */}
                              <TableCell className="px-2 py-1.5">
                                <Input
                                  type="date"
                                  value={(item as any).manufactureDate || ''}
                                  onChange={(e) => updateItem(index, "manufactureDate", e.target.value)}
                                  className="h-7 w-full text-xs p-1"
                                />
                              </TableCell>
                            </>
                          ) : (
                            <>
                              {/* Unit Price for SALE */}
                              <TableCell className="px-2 py-1.5">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.unitPrice || ""}
                                  onChange={(e) => updateItem(index, "unitPrice", toNumber(e.target.value, 0))}
                                  placeholder="0.00"
                                  className="h-7 w-full text-right text-xs p-1"
                                />
                              </TableCell>
                              {/* Discount for SALE */}
                              <TableCell className="px-2 py-1.5">
                                <div className="flex gap-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.discount || ""}
                                    onChange={(e) => updateItem(index, "discount", toNumber(e.target.value, 0))}
                                    placeholder="0"
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
                            </>
                          )}
                          
                          <TableCell className="px-2 py-1.5">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={item.taxRate || ""}
                              onChange={(e) => updateItem(index, "taxRate", toNumber(e.target.value, 0))}
                              placeholder="0%"
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
                    value={discount || ""}
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
              disabled={
                items.length === 0 || 
                (invoiceType === 'out' && !customerId) ||
                (invoiceType === 'in' && !supplierId)
              }
              className="h-9 min-w-24"
            >
              {initialData ? "Save Changes" : "Create Invoice"}
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

      {/* Supplier Form Dialog */}
      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>Capture supplier details for intake invoices.</DialogDescription>
          </DialogHeader>
          {storeId ? (
            <SupplierForm storeId={storeId} onSubmitted={handleSupplierCreated} />
          ) : (
            <p className="text-sm text-muted-foreground">Select a store to add suppliers.</p>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
