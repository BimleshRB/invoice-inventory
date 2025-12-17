"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { BulkImport } from "@/components/import/bulk-import"
import { dataStore } from "@/lib/store"
import type { Product, Customer, Category } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ImportPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setCategories(dataStore.getCategories())
  }, [])

  const handleImportProducts = (products: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => {
    dataStore.addBulkProducts(products)
    toast({
      title: "Products Imported",
      description: `${products.length} products have been added to inventory.`,
    })
  }

  const handleImportCustomers = (customers: Omit<Customer, "id" | "createdAt">[]) => {
    customers.forEach((customer) => dataStore.addCustomer(customer))
    toast({
      title: "Customers Imported",
      description: `${customers.length} customers have been added.`,
    })
  }

  return (
    <div className="flex flex-col">
      <Header title="Bulk Import" description="Import products and customers from CSV files" />
      <div className="flex-1 space-y-4 p-4 lg:p-6">
        <BulkImport
          onImportProducts={handleImportProducts}
          onImportCustomers={handleImportCustomers}
          categories={categories}
        />
      </div>
      <Toaster />
    </div>
  )
}
