"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Invoice } from "@/lib/types"
import { format } from "date-fns"
import { Download, Printer } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface InvoicePreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onDownload: (invoice: Invoice) => void
}

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-primary/10 text-primary" },
  paid: { label: "Paid", className: "bg-success text-success-foreground" },
  overdue: { label: "Overdue", className: "bg-destructive text-destructive-foreground" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
}

export function InvoicePreview({ open, onOpenChange, invoice, onDownload }: InvoicePreviewProps) {
  if (!invoice) return null

  const statusKey = invoice.status && statusConfig[invoice.status] ? invoice.status : "draft"
  const status = statusConfig[statusKey]

  const safeFormatDate = (value: unknown) => {
    if (!value) return "-"
    try {
      const d = typeof value === "string" ? new Date(value) : (value as Date)
      if (isNaN(d.getTime())) return "-"
      return format(d, "MMMM dd, yyyy")
    } catch {
      return "-"
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPrint = () => {
    onDownload(invoice)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-200 print:max-w-none print:max-h-none print:overflow-visible">
        <DialogHeader className="flex flex-row items-center justify-between print:hidden">
          <DialogTitle>Invoice Preview</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPrint}>
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </DialogHeader>

        <div
          className="rounded-lg border border-border bg-card p-4 sm:p-6 print:border-0 print:shadow-none print:p-0"
          id="invoice-content"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{invoice.store?.name || "Company Name"}</h2>
              <p className="text-sm text-muted-foreground">{invoice.store?.address}</p>
              <p className="text-sm text-muted-foreground">{invoice.store?.phone}</p>
              <p className="text-sm text-muted-foreground">{invoice.store?.email}</p>
            </div>
            <div className="text-left sm:text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">INVOICE</h1>
              <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-primary">{invoice.invoiceNumber || ""}</p>
              <Badge className={`mt-2 ${status.className}`}>{status.label}</Badge>
            </div>
          </div>

          <Separator className="my-4 sm:my-6" />

          {/* Bill To & Invoice Details */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Bill To</h3>
              <p className="font-medium text-foreground">{invoice.customer?.name}</p>
              <p className="text-sm text-muted-foreground">{invoice.customer?.email}</p>
              <p className="text-sm text-muted-foreground">{invoice.customer?.phone}</p>
              <p className="text-sm text-muted-foreground">{invoice.customer?.address}</p>
            </div>
            <div className="sm:text-right">
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">Invoice Date:</span>
                <span className="ml-2 font-medium text-foreground">
                  {safeFormatDate(invoice.createdAt)}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">Due Date:</span>
                <span className="ml-2 font-medium text-foreground">
                  {safeFormatDate(invoice.dueDate)}
                </span>
              </div>
              {invoice.store?.taxId && (
                <div>
                  <span className="text-sm text-muted-foreground">GSTIN:</span>
                  <span className="ml-2 font-medium text-foreground">{invoice.store.taxId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-4 sm:mt-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-semibold text-muted-foreground">Item</th>
                  <th className="pb-3 text-center text-sm font-semibold text-muted-foreground">Qty</th>
                  <th className="pb-3 text-right text-sm font-semibold text-muted-foreground">Price</th>
                  <th className="pb-3 text-right text-sm font-semibold text-muted-foreground hidden sm:table-cell">
                    Discount
                  </th>
                  <th className="pb-3 text-right text-sm font-semibold text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3">
                      <p className="font-medium text-foreground">{item.product?.name || "Product"}</p>
                      <p className="text-xs text-muted-foreground">{item.product?.sku}</p>
                    </td>
                    <td className="py-3 text-center text-foreground">{item.quantity}</td>
                    <td className="py-3 text-right text-foreground">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right text-foreground hidden sm:table-cell">
                      {item.discount > 0 ? `-${formatCurrency(item.discount)}` : "-"}
                    </td>
                    <td className="py-3 text-right font-medium text-foreground">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 sm:mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST ({invoice.taxRate}%)</span>
                <span className="font-medium text-foreground">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium text-destructive">-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-4 sm:mt-6 rounded-lg bg-muted p-4">
              <h4 className="mb-1 text-sm font-semibold text-foreground">Notes</h4>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm text-muted-foreground">Thank you for your business!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
