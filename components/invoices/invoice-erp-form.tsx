"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, CheckCircle, Truck, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Invoice {
  id?: number
  number?: string
  customerId?: number
  storeId?: number
  type: "SALE" | "PURCHASE" | "SALE_RETURN" | "PURCHASE_RETURN"
  status: "DRAFT" | "CONFIRMED" | "FULFILLED" | "CANCELLED" | "PAID"
  items: InvoiceItem[]
  subtotal?: number
  totalTax?: number
  discount?: number
  grandTotal?: number
  dueDate?: string
  notes?: string
}

interface InvoiceItem {
  productId: number
  quantity: number
  unitPriceSnapshot?: number
  taxGroupSnapshot?: string
  taxAmount?: number
  lineTotal?: number
}

interface InvoiceErpFormProps {
  invoice?: Invoice
  onSave: (invoice: Invoice) => Promise<void>
  onConfirm?: (invoiceId: number) => Promise<void>
  onShip?: (invoiceId: number) => Promise<void>
  onReceive?: (invoiceId: number) => Promise<void>
  onCancel?: (invoiceId: number) => Promise<void>
  products: any[]
  customers: any[]
}

export function InvoiceErpForm({
  invoice,
  onSave,
  onConfirm,
  onShip,
  onReceive,
  onCancel,
  products,
  customers
}: InvoiceErpFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Invoice>({
    type: "SALE",
    status: "DRAFT",
    items: []
  })

  useEffect(() => {
    if (invoice) {
      setFormData(invoice)
    }
  }, [invoice])

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { productId: 0, quantity: 1, unitPriceSnapshot: 0 }
      ]
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const items = [...formData.items]
    items[index] = { ...items[index], [field]: value }
    setFormData({ ...formData, items })
  }

  const parseTaxSnapshot = (snapshot: string) => {
    try {
      return JSON.parse(snapshot || "{}")
    } catch {
      return {}
    }
  }

  const handleSubmit = async () => {
    if (!formData.items.length) {
      toast({
        title: "Error",
        description: "Add at least one item",
        variant: "destructive"
      })
      return
    }
    await onSave(formData)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      DRAFT: "secondary",
      CONFIRMED: "default",
      FULFILLED: "default",
      CANCELLED: "destructive",
      PAID: "default"
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const canConfirm = invoice && invoice.status === "DRAFT"
  const canShip = invoice && invoice.status === "CONFIRMED" && invoice.type === "SALE"
  const canReceive = invoice && invoice.status === "CONFIRMED" && invoice.type === "PURCHASE"
  const canCancel = invoice && invoice.status !== "FULFILLED"

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {invoice?.id ? `Invoice ${invoice.number}` : "New Invoice"}
          </CardTitle>
          {invoice && getStatusBadge(invoice.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              disabled={!!invoice?.id}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SALE">Sale</SelectItem>
                <SelectItem value="PURCHASE">Purchase</SelectItem>
                <SelectItem value="SALE_RETURN">Sale Return</SelectItem>
                <SelectItem value="PURCHASE_RETURN">Purchase Return</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Customer</Label>
            <Select
              value={formData.customerId?.toString()}
              onValueChange={(value) => setFormData({ ...formData, customerId: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Items</Label>
            <Button size="sm" onClick={addItem} disabled={invoice?.status !== "DRAFT" && !!invoice}>
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Tax Breakdown</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Line Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.items.map((item, idx) => {
                const product = products.find(p => p.id === item.productId)
                const taxBreakdown = parseTaxSnapshot(item.taxGroupSnapshot || "{}")

                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <Select
                        value={item.productId?.toString()}
                        onValueChange={(val) => {
                          const product = products.find(p => p.id === Number(val))
                          updateItem(idx, "productId", Number(val))
                          if (product) {
                            updateItem(idx, "unitPriceSnapshot", product.sellingPrice || 0)
                          }
                        }}
                        disabled={invoice?.status !== "DRAFT" && !!invoice}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(p => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(idx, "quantity", Number(e.target.value) || 0)}
                        placeholder="Qty"
                        className="w-20"
                        disabled={invoice?.status !== "DRAFT" && !!invoice}
                      />
                    </TableCell>
                    <TableCell>
                      {item.unitPriceSnapshot?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        {Object.entries(taxBreakdown).map(([key, value]) => (
                          <div key={key}>
                            {key}: ₹{Number(value).toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      ₹{item.taxAmount?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>
                      ₹{item.lineTotal?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(idx)}
                        disabled={invoice?.status !== "DRAFT" && !!invoice}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        {invoice && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Tax:</span>
              <span>₹{invoice.totalTax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>₹{invoice.discount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total:</span>
              <span>₹{invoice.grandTotal?.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!invoice && (
            <Button onClick={handleSubmit}>Create Draft</Button>
          )}
          
          {canConfirm && (
            <Button onClick={() => onConfirm?.(invoice.id!)}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirm Invoice
            </Button>
          )}

          {canShip && (
            <Button onClick={() => onShip?.(invoice.id!)}>
              <Truck className="h-4 w-4 mr-1" />
              Ship Order
            </Button>
          )}

          {canReceive && (
            <Button onClick={() => onReceive?.(invoice.id!)}>
              <Package className="h-4 w-4 mr-1" />
              Receive Goods
            </Button>
          )}

          {canCancel && (
            <Button variant="destructive" onClick={() => onCancel?.(invoice.id!)}>
              Cancel Invoice
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
