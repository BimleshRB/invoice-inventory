"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { returnsApi, productApi } from "@/lib/api-client"
import type { Invoice, InvoiceItem, InvoiceReturn, InvoiceReturnItem } from "@/lib/types"

interface CreateReturnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice
  onReturnCreated?: (ret: InvoiceReturn) => void
}

export function CreateReturnDialog({
  open,
  onOpenChange,
  invoice,
  onReturnCreated,
}: CreateReturnDialogProps) {
  const normalizeInvoiceType = (type?: string) => {
    const normalized = (type || "").toUpperCase()
    if (normalized === "IN" || normalized === "PURCHASE") return "PURCHASE"
    if (normalized === "OUT" || normalized === "SALE") return "SALE"
    return "SALE"
  }

  const [returnType, setReturnType] = useState<"SALE_RETURN" | "PURCHASE_RETURN">(
    normalizeInvoiceType(invoice.type) === "PURCHASE" ? "PURCHASE_RETURN" : "SALE_RETURN"
  )
  const [returnReason, setReturnReason] = useState("")
  const [returnItems, setReturnItems] = useState<InvoiceReturnItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const { toast } = useToast()

  // Initialize return items with product data
  useEffect(() => {
    const initializeItems = async () => {
      if (!open) return
      setReturnType(
        normalizeInvoiceType(invoice.type) === "PURCHASE" ? "PURCHASE_RETURN" : "SALE_RETURN"
      )
      if (!invoice?.items) return
      
      setIsInitializing(true)
      try {
        const itemsWithProducts = await Promise.all(
          (invoice.items || []).map(async (item) => {
            // Get unit price from the correct field (unitPriceSnapshot or unitPrice)
            const unitPrice = (item as any).unitPriceSnapshot || item.unitPrice || 0
            
            // If product data is already populated, use it
            if (item.product?.name) {
              return {
                originalInvoiceItemId: item.id,
                productId: item.productId,
                product: item.product,
                quantityReturned: 0,
                unitPrice,
              }
            }
            
            // Otherwise, fetch product details
            try {
              const productRes = await productApi.get(String(item.productId))
              const productData = (productRes as any)?.data ?? productRes
              return {
                originalInvoiceItemId: item.id,
                productId: item.productId,
                product: productData || item.product,
                quantityReturned: 0,
                unitPrice,
              }
            } catch (err) {
              console.error(`Failed to fetch product ${item.productId}`, err)
              // Fallback to whatever product data we have
              return {
                originalInvoiceItemId: item.id,
                productId: item.productId,
                product: item.product || { id: item.productId, name: "Unknown" },
                quantityReturned: 0,
                unitPrice,
              }
            }
          })
        )
        
        setReturnItems(itemsWithProducts)
      } catch (err) {
        console.error("Error initializing return items", err)
        // Fallback to basic initialization
        setReturnItems(
          invoice.items?.map((item) => {
            const unitPrice = (item as any).unitPriceSnapshot || item.unitPrice || 0
            return {
              originalInvoiceItemId: item.id,
              productId: item.productId,
              product: item.product || { id: item.productId, name: "Unknown" },
              quantityReturned: 0,
              unitPrice,
            }
          }) || []
        )
      } finally {
        setIsInitializing(false)
      }
    }
    
    initializeItems()
  }, [open, invoice])

  const updateReturnQuantity = (index: number, quantity: number) => {
    const newItems = [...returnItems]
    newItems[index].quantityReturned = quantity
    setReturnItems(newItems)
  }

  const hasAnyReturns = returnItems.some((item) => item.quantityReturned > 0)

  const calculateTotals = () => {
    let subtotal = 0
    let totalTax = 0
    
    returnItems.forEach((item, index) => {
      const invoiceItem = invoice.items?.[index]
      const lineSubtotal = item.quantityReturned * (item.unitPrice || 0)
      const taxRate = invoiceItem?.taxRate || 0
      const lineTax = (lineSubtotal * taxRate) / 100
      
      subtotal += lineSubtotal
      totalTax += lineTax
    })
    
    return {
      subtotal,
      tax: totalTax,
      total: subtotal + totalTax
    }
  }

  const handleSubmit = async () => {
    if (!hasAnyReturns) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to return",
        variant: "destructive",
      })
      return
    }

    if (!returnReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for the return",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const totals = calculateTotals()
      
      const returnData: InvoiceReturn = {
        originalInvoiceId: invoice.id,
        storeId: invoice.storeId,
        returnType,
        reason: returnReason,
        status: "PENDING",
        subtotalAmount: totals.subtotal,
        taxAmount: totals.tax,
        totalAmount: totals.total,
        items: returnItems.filter((item) => item.quantityReturned > 0),
      }

      const res = await returnsApi.create(returnData)

      if (res.error) {
        toast({
          title: "Failed to create return",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Return created",
          description: `Return ${res.data?.returnNumber} has been created successfully.`,
        })
        onOpenChange(false)
        if (onReturnCreated && res.data) {
          onReturnCreated(res.data)
        }
        // Reset form
        setReturnItems(
          invoice.items?.map((item) => ({
            originalInvoiceItemId: item.id,
            productId: item.productId,
            product: item.product,
            quantityReturned: 0,
            unitPrice: item.unitPrice,
          })) || []
        )
        setReturnReason("")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to create return",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Invoice Return</DialogTitle>
          <DialogDescription>
            Create a return for invoice {invoice.invoiceNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto pr-2">
          {/* Return Type */}
          <div className="space-y-2">
            <Label>Return Type</Label>
            <Select
              value={returnType}
              onValueChange={(value: any) => setReturnType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(invoice.type === "out" || invoice.type === "OUT" || invoice.type === "SALE") && (
                  <SelectItem value="SALE_RETURN">Sale Return (Customer)</SelectItem>
                )}
                {(invoice.type === "in" || invoice.type === "IN" || invoice.type === "PURCHASE") && (
                  <SelectItem value="PURCHASE_RETURN">Purchase Return (Supplier)</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Return Reason */}
          <div className="space-y-2">
            <Label>Return Reason *</Label>
            <Textarea
              placeholder="e.g., Damaged goods, Wrong item, Defective, etc."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Return Items */}
          <div className="space-y-2">
            <Label>Items to Return</Label>
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Product</TableHead>
                    <TableHead className="text-center w-[100px]">Original Qty</TableHead>
                    <TableHead className="text-center w-[120px]">Return Qty *</TableHead>
                    <TableHead className="text-right w-[100px]">Unit Price</TableHead>
                    <TableHead className="text-right w-[80px]">Tax %</TableHead>
                    <TableHead className="text-right w-[120px]">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returnItems.map((item, index) => {
                    const invoiceItem = invoice.items?.[index]
                    const lineSubtotal = item.quantityReturned * (item.unitPrice || 0)
                    const taxRate = invoiceItem?.taxRate || 0
                    const lineTax = (lineSubtotal * taxRate) / 100
                    const lineTotal = lineSubtotal + lineTax
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-medium">{item.product?.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.product?.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {invoiceItem?.quantity || 0}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max={invoiceItem?.quantity || 0}
                            value={item.quantityReturned || ""}
                            onChange={(e) =>
                              updateReturnQuantity(index, e.target.value ? parseInt(e.target.value) : 0)
                            }
                            placeholder="0"
                            className="h-8 w-20 text-center"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{(item.unitPrice || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {taxRate.toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{lineTotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Summary */}
          {hasAnyReturns && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Return Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{calculateTotals().subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax:</span>
                  <span>₹{calculateTotals().tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-1 font-semibold">
                  <span>Total Return Amount:</span>
                  <span>₹{calculateTotals().total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!hasAnyReturns || isLoading || isInitializing}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create Return"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
