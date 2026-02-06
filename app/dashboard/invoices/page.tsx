"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { InvoicesTable } from "@/components/invoices/invoices-table"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { InvoicePreview } from "@/components/invoices/invoice-preview"
import { CreateReturnDialog } from "@/components/invoices/create-return-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { invoiceApi, customerApi, productApi } from "@/lib/api-client"
import { supplierApi } from "@/lib/api/procurement"
import { useStoreContext } from "@/context/store-context"
import type { Invoice, Customer, Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)
  const [returnInvoice, setReturnInvoice] = useState<Invoice | null>(null)
  const [isReturnOpen, setIsReturnOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("")
  const { storeId, loading: storeLoading } = useStoreContext()
  const { toast } = useToast()

  useEffect(() => {
    if (!storeLoading) {
      loadData()
    }
  }, [storeId, storeLoading])

  const loadData = async () => {
    setIsLoading(true)
    const activeStoreId = storeId ?? null
    try {
      // Load invoices
      const invoicesRes = await invoiceApi.list(0, 100, activeStoreId ? String(activeStoreId) : undefined)
      
      // Load customers
      const customersRes = await customerApi.list(0, 100, activeStoreId ? String(activeStoreId) : undefined)
      if (!customersRes.error) {
        setCustomers(customersRes.data?.content || [])
      }

      // Load suppliers (optional - don't fail if unavailable)
      const loadedSuppliers = await refreshSuppliers(activeStoreId)

      // Load products
      const productsRes = await productApi.list(0, 100, activeStoreId ? String(activeStoreId) : undefined)
      if (!productsRes.error) {
        setProducts(productsRes.data?.content || [])
      }

      // Get next invoice number
      const numberRes = await invoiceApi.nextNumber()
      if (!numberRes.error) {
        setNextInvoiceNumber(numberRes.data?.nextNumber || "INV-001")
      }

      // Process invoices after all data is loaded
      if (invoicesRes.error) {
        toast({
          title: "Failed to load invoices",
          description: invoicesRes.error,
          variant: "destructive",
        })
        setInvoices([])
      } else {
        try {
          const normalizedInvoices = (invoicesRes.data?.content || []).map((inv: any) => {
            const normalized: any = {
              ...inv,
              type: inv.type === 'PURCHASE' ? 'in' : inv.type === 'SALE' ? 'out' : inv.type
            }
            
            // Attach supplier info for PURCHASE invoices
            if (inv.type === 'PURCHASE' && inv.supplierId && Array.isArray(loadedSuppliers) && loadedSuppliers.length > 0) {
              const supplier = loadedSuppliers.find((s: any) => Number(s.id) === Number(inv.supplierId))
              if (supplier) {
                normalized.supplier = supplier
                normalized.supplierName = supplier.name
                normalized.supplierEmail = supplier.email
              }
            }
            
            return normalized
          })
          
          setInvoices(normalizedInvoices)
        } catch (err) {
          console.error('Error normalizing invoices:', err)
          // Set invoices without normalization if there's an error
          setInvoices(invoicesRes.data?.content || [])
        }
      }
    } catch (error) {
      console.error('Error in loadData:', error)
      toast({
        title: "Error loading data",
        description: error instanceof Error ? error.message : "Unable to load invoices and related data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSuppliers = async (activeStoreId?: number | null) => {
    const resolvedStoreId = activeStoreId ?? storeId ?? null
    if (!resolvedStoreId) {
      setSuppliers([])
      return []
    }

    try {
      const suppliersRes = await supplierApi.getByStore(Number(resolvedStoreId))
      
      if (!suppliersRes.error) {
        // Handle both array and paginated response formats
        let loadedSuppliers = suppliersRes.data || []
        
        // If it's a paginated response, extract the content
        if (loadedSuppliers.content && Array.isArray(loadedSuppliers.content)) {
          loadedSuppliers = loadedSuppliers.content
        }
        
        // Ensure it's an array
        if (!Array.isArray(loadedSuppliers)) {
          loadedSuppliers = []
        }
        
        setSuppliers(loadedSuppliers)
        return loadedSuppliers
      } else {
        setSuppliers([])
        return []
      }
    } catch (err) {
      console.error("Suppliers not loaded:", err)
      setSuppliers([])
      return []
    }
  }

  const handleCreateInvoice = async (data: Partial<Invoice>) => {
    setIsSaving(true)
    try {
      const invoiceData = {
        ...data,
        invoiceNumber: nextInvoiceNumber,
        status: data.status || "draft",
        items: data.items || [],
        storeId: storeId ?? undefined,
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

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsFormOpen(true)
  }

  const handleCreateReturn = async (invoice: Invoice) => {
    try {
      const res = await invoiceApi.get(invoice.id)
      if (res.error) {
        toast({
          title: "Failed to load invoice",
          description: res.error,
          variant: "destructive",
        })
        return
      }
      const fullInvoice = (res as any).data ?? res
      setReturnInvoice(fullInvoice)
      setIsReturnOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to load invoice for return",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (invoice: Invoice, status: Invoice["status"]) => {
    setIsSaving(true)
    try {
      const res = await invoiceApi.updateStatus(invoice.id, status)
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

  const handleUpdateInvoice = async (data: Partial<Invoice>) => {
    if (!editingInvoice) return
    setIsSaving(true)
    try {
      // Send only persisted fields; exclude items to avoid backend cascade issues
      const updateData: Partial<Invoice> = {
        customerId: data.customerId ? Number(data.customerId) : data.customerId,
        subtotal: Number(data.subtotal ?? 0),
        taxAmount: Number(data.taxAmount ?? 0),
        discount: Number(data.discount ?? 0),
        total: Number(data.total ?? 0),
        dueDate: data.dueDate,
        notes: data.notes,
        status: data.status,
        type: data.type,
      }
      const res = await invoiceApi.update(editingInvoice.id, updateData)
      if (res.error) {
        toast({
          title: "Failed to update invoice",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Invoice Updated",
          description: `Invoice ${editingInvoice.invoiceNumber} has been updated successfully.`,
        })
        // Optimistically update local state to avoid stale list if backend returns old totals
        if (res.data) {
          setInvoices((prev) => prev.map((inv) => (inv.id === editingInvoice.id ? { ...inv, ...res.data } : inv)))
        } else {
          setInvoices((prev) => prev.map((inv) => (inv.id === editingInvoice.id ? { ...inv, ...updateData } as Invoice : inv)))
        }
        setIsFormOpen(false)
        setEditingInvoice(null)
        await loadData()
      }
    } catch (error) {
      toast({
        title: "Error updating invoice",
        description: "Unable to update invoice",
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
            onEdit={handleEditInvoice}
            onStatusChange={handleStatusChange}
            onDownload={handleDownload}
            onDelete={handleDeleteInvoice}
            onCreateReturn={handleCreateReturn}
          />
        )}
      </div>

      <InvoiceForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingInvoice(null)
        }}
        customers={customers}
        suppliers={suppliers}
        products={products}
        onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
        nextInvoiceNumber={nextInvoiceNumber}
        isSaving={isSaving}
        initialData={editingInvoice || undefined}
        storeId={storeId ?? undefined}
        onSupplierCreated={refreshSuppliers}
      />

      <InvoicePreview
        open={!!previewInvoice}
        onOpenChange={() => setPreviewInvoice(null)}
        invoice={previewInvoice}
        onDownload={handleDownload}
      />

      {returnInvoice && (
        <CreateReturnDialog
          open={isReturnOpen}
          onOpenChange={(open) => {
            setIsReturnOpen(open)
            if (!open) setReturnInvoice(null)
          }}
          invoice={returnInvoice}
          onReturnCreated={() => {
            toast({
              title: "Return created",
              description: "Return request submitted for approval.",
            })
          }}
        />
      )}

      <Toaster />
    </div>
  )
}
