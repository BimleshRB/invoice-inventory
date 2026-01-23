"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { invoiceApi } from "@/lib/api-client"
import type { Invoice } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"

type Props = { params: Promise<{ id: string }> }

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-primary/10 text-primary" },
  paid: { label: "Paid", className: "bg-success text-success-foreground" },
  overdue: { label: "Overdue", className: "bg-destructive text-destructive-foreground" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
}

export default function InvoicePage({ params }: Props) {
  const { id } = use(params)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadInvoice()
  }, [id])

  const loadInvoice = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await invoiceApi.get(id)
      if (res.error) {
        setError(res.error)
        setInvoice(null)
      } else if (res.data) {
        setInvoice(res.data)
      }
    } catch (err) {
      setError("Failed to load invoice")
      setInvoice(null)
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleDownload = () => {
    if (!invoice) return
    // Create a printable version
    window.print()
  }

  const handleBack = () => {
    router.push("/dashboard/invoices")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading invoice...</span>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-muted-foreground mb-4">404</h1>
          <p className="text-lg text-muted-foreground mb-6">{error || "Invoice not found"}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
        </div>
      </div>
    )
  }

  const statusKey = invoice.status && statusConfig[invoice.status] ? invoice.status : "draft"
  const status = statusConfig[statusKey]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 sm:py-10">
        {/* Action Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8 print:border-0 print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {invoice.store?.name || "Company Name"}
              </h2>
              <p className="text-sm text-muted-foreground">{invoice.store?.address}</p>
              <p className="text-sm text-muted-foreground">{invoice.store?.phone}</p>
              <p className="text-sm text-muted-foreground">{invoice.store?.email}</p>
            </div>
            <div className="text-left sm:text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">INVOICE</h1>
              <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-primary">
                {invoice.invoiceNumber || ""}
              </p>
              <Badge className={`mt-2 ${status.className}`}>{status.label}</Badge>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Bill To & Invoice Details */}
          <div className="grid gap-6 sm:grid-cols-2">
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
                <span className="ml-2 font-medium text-foreground">{safeFormatDate(invoice.createdAt)}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">Due Date:</span>
                <span className="ml-2 font-medium text-foreground">{safeFormatDate(invoice.dueDate)}</span>
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
          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-semibold text-muted-foreground">Item</th>
                  <th className="pb-3 text-center text-sm font-semibold text-muted-foreground">Qty</th>
                  <th className="pb-3 text-right text-sm font-semibold text-muted-foreground">Price</th>
                  <th className="pb-3 text-right text-sm font-semibold text-muted-foreground hidden sm:table-cell">
                    Discount
                  </th>
                  <th className="pb-3 text-right text-sm font-semibold text-muted-foreground hidden sm:table-cell">
                    Tax
                  </th>
                  <th className="pb-3 text-right text-sm font-semibold text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((item, index) => {
                  const qty = item.quantity || 0
                  const price = item.unitPrice || 0
                  const discount = item.discount || 0
                  const taxRate = item.taxRate || 0
                  const discountType = item.discountType || "percentage"

                  let lineSubtotal = qty * price
                  let discountAmount = 0
                  if (discountType === "percentage") {
                    discountAmount = (lineSubtotal * discount) / 100
                  } else {
                    discountAmount = discount
                  }
                  const subtotalAfterDiscount = lineSubtotal - discountAmount
                  const taxAmount = (subtotalAfterDiscount * taxRate) / 100

                  return (
                    <tr key={index} className="border-b border-border">
                      <td className="py-3">
                        <p className="font-medium text-foreground">{item.product?.name || "Product"}</p>
                        <p className="text-xs text-muted-foreground">{item.product?.sku}</p>
                      </td>
                      <td className="py-3 text-center text-foreground">{item.quantity}</td>
                      <td className="py-3 text-right text-foreground">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 text-right text-foreground hidden sm:table-cell">
                        {discountAmount > 0
                          ? `-${formatCurrency(discountAmount)} ${discountType === "percentage" ? `(${discount}%)` : ""}`
                          : "-"}
                      </td>
                      <td className="py-3 text-right text-foreground hidden sm:table-cell">
                        {taxAmount > 0 ? `${formatCurrency(taxAmount)} (${taxRate}%)` : "-"}
                      </td>
                      <td className="py-3 text-right font-medium text-foreground">{formatCurrency(item.total)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
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
            <div className="mt-6 rounded-lg bg-muted p-4">
              <h4 className="mb-1 text-sm font-semibold text-foreground">Notes</h4>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
