"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { InvoicesTable } from "@/components/invoices/invoices-table"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { InvoicePreview } from "@/components/invoices/invoice-preview"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { invoiceApi, customerApi, productApi } from "@/lib/api-client"
import { dataStore } from "@/lib/store"
import type { Invoice, Customer, Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load invoices
      const invoicesRes = await invoiceApi.list(0, 100)
      if (invoicesRes.error) {
        toast({
          title: "Failed to load invoices",
          description: invoicesRes.error,
          variant: "destructive",
        })
        setInvoices([])
      } else {
        setInvoices(invoicesRes.data?.content || [])
      }

      // Load customers
      const customersRes = await customerApi.list(0, 100)
      if (!customersRes.error) {
        setCustomers(customersRes.data?.content || [])
      }

      // Load products
      const productsRes = await productApi.list(0, 100)
      if (!productsRes.error) {
        setProducts(productsRes.data?.content || [])
      }

      // Get next invoice number
      const numberRes = await invoiceApi.nextNumber()
      if (!numberRes.error) {
        setNextInvoiceNumber(numberRes.data?.nextNumber || "INV-001")
      }
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Unable to load invoices and related data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateInvoice = async (data: Partial<Invoice>) => {
    setIsSaving(true)
    try {
      const invoiceData = {
        ...data,
        invoiceNumber: nextInvoiceNumber,
        status: "pending",
        items: data.items || []
      }
      
      const res = await invoiceApi.create(invoiceData)
      if (res.error) {
        toast({
          title: "Failed to create invoice",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Invoice Created",
          description: `Invoice ${nextInvoiceNumber} has been created successfully.`,
        })
        setIsFormOpen(false)
        // Reload data to sync with backend
        await loadData()
      }
    } catch (error) {
      toast({
        title: "Error creating invoice",
        description: "Unable to create invoice",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (invoice: Invoice, status: Invoice["status"]) => {
    setIsSaving(true)
    try {
      const res = await invoiceApi.update(invoice.id, { ...invoice, status })
      if (res.error) {
        toast({
          title: "Failed to update invoice",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Invoice Updated",
          description: `Invoice ${invoice.invoiceNumber} marked as ${status}.`,
        })
        await loadData()
      }
    } catch (error) {
      toast({
        title: "Error updating invoice",
        description: "Unable to update invoice status",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (confirm("Are you sure you want to delete this invoice? This will reverse all stock adjustments.")) {
      setIsSaving(true)
      try {
        const res = await invoiceApi.delete(invoiceId)
        if (res.error) {
          toast({
            title: "Failed to delete invoice",
            description: res.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Invoice Deleted",
            description: "Invoice has been deleted and stock has been reversed.",
          })
          await loadData()
        }
      } catch (error) {
        toast({
          title: "Error deleting invoice",
          description: "Unable to delete invoice",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleDownload = (invoice: Invoice) => {
    // Generate and download invoice as text file (PDF would require a library)
    const content = generateInvoiceText(invoice)
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${invoice.invoiceNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoice.invoiceNumber} has been downloaded.`,
    })
  }

  const generateInvoiceText = (invoice: Invoice) => {
    const store = invoice.store
    const customer = invoice.customer
    const safeDate = (value: unknown) => {
      if (!value) return "-"
      try {
        const d = typeof value === "string" ? new Date(value) : (value as Date)
        if (isNaN(d.getTime())) return "-"
        return d.toLocaleDateString()
      } catch {
        return "-"
      }
    }
    const num = (value: any) => {
      const n = Number(value)
      return isNaN(n) ? "0.00" : n.toFixed(2)
    }
    const lines: string[] = []
    lines.push("===============================================")
    lines.push("                    INVOICE")
    lines.push("===============================================")
    lines.push(`${store?.name || "Company"}`)
    lines.push(`${store?.address || ""}`)
    lines.push(`${store?.phone || ""} | ${store?.email || ""}`)
    lines.push("")
    lines.push(`Invoice Number: ${invoice.invoiceNumber || ""}`)
    lines.push(`Date: ${safeDate(invoice.createdAt)}`)
    lines.push(`Due Date: ${safeDate(invoice.dueDate)}`)
    lines.push(`Status: ${(invoice.status || "draft").toUpperCase()}`)
    lines.push("")
    lines.push("-----------------------------------------------")
    lines.push("BILL TO:")
    lines.push(`${customer?.name || "Customer"}`)
    lines.push(`${customer?.email || ""}`)
    lines.push(`${customer?.phone || ""}`)
    lines.push(`${customer?.address || ""}`)
    lines.push("")
    lines.push("-----------------------------------------------")
    lines.push("ITEMS:")
    ;(invoice.items || []).forEach((item) => {
      lines.push(`${item.product?.name || "Product"} (${item.product?.sku || ""})`)
      lines.push(`  Qty: ${num(item.quantity)} x $${num(item.unitPrice)} = $${num(item.total)}`)
    })

    lines.push("")
    lines.push("-----------------------------------------------")
    lines.push(`Subtotal:           $${num((invoice as any).subtotal ?? 0)}`)
    lines.push(`Tax (${num((invoice as any).taxRate ?? 0)}%):        $${num((invoice as any).taxAmount ?? invoice.tax ?? 0)}`)
    if (Number((invoice as any).discount ?? 0) > 0) {
      lines.push(`Discount:           -$${num((invoice as any).discount)}`)
    }
    lines.push("-----------------------------------------------")
    lines.push(`TOTAL:              $${num((invoice as any).total ?? (invoice as any).subtotal ?? 0)}`)
    lines.push("===============================================")
    lines.push("")
    if (invoice.notes) {
      lines.push(`Notes: ${invoice.notes}`)
      lines.push("")
    }
    lines.push("Thank you for your business!")
    return lines.join("\n")
  }

  return (
    <div className="flex flex-col">
      <Header title="Invoices" description="Create and manage invoices" />
      <div className="flex-1 space-y-4 p-4 lg:p-6">
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsFormOpen(true)}
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create Invoice
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <InvoicesTable
            invoices={invoices}
            onView={setPreviewInvoice}
            onStatusChange={handleStatusChange}
            onDownload={handleDownload}
            onDelete={handleDeleteInvoice}
          />
        )}
      </div>

      <InvoiceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        customers={customers}
        products={products}
        onSubmit={handleCreateInvoice}
        nextInvoiceNumber={nextInvoiceNumber}
        isSaving={isSaving}
      />

      <InvoicePreview
        open={!!previewInvoice}
        onOpenChange={() => setPreviewInvoice(null)}
        invoice={previewInvoice}
        onDownload={handleDownload}
      />

      <Toaster />
    </div>
  )
}
