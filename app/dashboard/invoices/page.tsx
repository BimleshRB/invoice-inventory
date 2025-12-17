"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { InvoicesTable } from "@/components/invoices/invoices-table"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { InvoicePreview } from "@/components/invoices/invoice-preview"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
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
  const { toast } = useToast()

  useEffect(() => {
    setInvoices(dataStore.getInvoices())
    setCustomers(dataStore.getCustomers())
    setProducts(dataStore.getProducts())
  }, [])

  const handleCreateInvoice = (data: Partial<Invoice>) => {
    const newInvoice = dataStore.addInvoice(data as Omit<Invoice, "id" | "invoiceNumber" | "createdAt" | "updatedAt">)
    setInvoices(dataStore.getInvoices())
    setProducts(dataStore.getProducts()) // Refresh products as stock changed
    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.invoiceNumber} has been created.`,
    })
  }

  const handleStatusChange = (invoice: Invoice, status: Invoice["status"]) => {
    dataStore.updateInvoice(invoice.id, { status })
    setInvoices(dataStore.getInvoices())
    toast({
      title: "Invoice Updated",
      description: `Invoice ${invoice.invoiceNumber} marked as ${status}.`,
    })
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
    let text = `
===============================================
                    INVOICE
===============================================
${store?.name || "Company"}
${store?.address || ""}
${store?.phone || ""} | ${store?.email || ""}

Invoice Number: ${invoice.invoiceNumber}
Date: ${new Date(invoice.createdAt).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Status: ${invoice.status.toUpperCase()}

-----------------------------------------------
BILL TO:
${customer?.name || "Customer"}
${customer?.email || ""}
${customer?.phone || ""}
${customer?.address || ""}

-----------------------------------------------
ITEMS:
`
    invoice.items.forEach((item) => {
      text += `
${item.product?.name || "Product"} (${item.product?.sku || ""})
  Qty: ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}
`
    })

    text += `
-----------------------------------------------
Subtotal:           $${invoice.subtotal.toFixed(2)}
Tax (${invoice.taxRate}%):        $${invoice.taxAmount.toFixed(2)}
${invoice.discount > 0 ? `Discount:           -$${invoice.discount.toFixed(2)}` : ""}
-----------------------------------------------
TOTAL:              $${invoice.total.toFixed(2)}
===============================================

${invoice.notes ? `Notes: ${invoice.notes}` : ""}

Thank you for your business!
`
    return text
  }

  return (
    <div className="flex flex-col">
      <Header title="Invoices" description="Create and manage invoices" />
      <div className="flex-1 space-y-4 p-4 lg:p-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
        <InvoicesTable
          invoices={invoices}
          onView={setPreviewInvoice}
          onStatusChange={handleStatusChange}
          onDownload={handleDownload}
        />
      </div>

      <InvoiceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        customers={customers}
        products={products}
        onSubmit={handleCreateInvoice}
        nextInvoiceNumber={dataStore.getNextInvoiceNumber()}
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
