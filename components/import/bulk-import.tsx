"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, CheckCircle, AlertTriangle } from "lucide-react"
import type { Product, Customer } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface BulkImportProps {
  onImportProducts: (products: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => void
  onImportCustomers: (customers: Omit<Customer, "id" | "createdAt">[]) => void
  categories: { id: string; name: string }[]
}

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

export function BulkImport({ onImportProducts, onImportCustomers, categories }: BulkImportProps) {
  const [productPreview, setProductPreview] = useState<Partial<Product>[]>([])
  const [customerPreview, setCustomerPreview] = useState<Partial<Customer>[]>([])
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [activeTab, setActiveTab] = useState("products")
  const productInputRef = useRef<HTMLInputElement>(null)
  const customerInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"))
    const data: Record<string, string>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
      if (values.length === headers.length) {
        const row: Record<string, string> = {}
        headers.forEach((header, index) => {
          row[header] = values[index]
        })
        data.push(row)
      }
    }
    return data
  }

  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const data = parseCSV(text)

      const products = data.map((row) => ({
        sku: row.sku || `SKU-${Date.now()}`,
        name: row.name || row.product_name || "",
        description: row.description || "",
        categoryId:
          categories.find((c) => c.name.toLowerCase() === row.category?.toLowerCase())?.id || categories[0]?.id || "",
        costPrice: Number.parseFloat(row.cost_price || row.cost || "0"),
        sellingPrice: Number.parseFloat(row.selling_price || row.price || "0"),
        quantity: Number.parseInt(row.quantity || row.stock || "0", 10),
        minStockLevel: Number.parseInt(row.min_stock || row.min_stock_level || "10", 10),
        unit: row.unit || "pcs",
        barcode: row.barcode || null,
        expiryDate: row.expiry_date ? new Date(row.expiry_date) : null,
        imageUrl: row.image_url || null,
        storeId: "store-1",
        isActive: true,
      }))

      setProductPreview(products)
      setImportResult(null)
    }
    reader.readAsText(file)
  }

  const handleCustomerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const data = parseCSV(text)

      const customers = data.map((row) => ({
        name: row.name || row.customer_name || "",
        email: row.email || "",
        phone: row.phone || row.phone_number || "",
        address: row.address || "",
        storeId: "store-1",
      }))

      setCustomerPreview(customers)
      setImportResult(null)
    }
    reader.readAsText(file)
  }

  const handleImportProducts = () => {
    const validProducts = productPreview.filter((p) => p.name && p.sellingPrice)
    const invalidCount = productPreview.length - validProducts.length

    onImportProducts(validProducts as Omit<Product, "id" | "createdAt" | "updatedAt">[])

    setImportResult({
      success: validProducts.length,
      failed: invalidCount,
      errors: invalidCount > 0 ? [`${invalidCount} products skipped due to missing required fields (name, price)`] : [],
    })
    setProductPreview([])
  }

  const handleImportCustomers = () => {
    const validCustomers = customerPreview.filter((c) => c.name && c.email)
    const invalidCount = customerPreview.length - validCustomers.length

    onImportCustomers(validCustomers as Omit<Customer, "id" | "createdAt">[])

    setImportResult({
      success: validCustomers.length,
      failed: invalidCount,
      errors:
        invalidCount > 0 ? [`${invalidCount} customers skipped due to missing required fields (name, email)`] : [],
    })
    setCustomerPreview([])
  }

  const downloadProductTemplate = () => {
    const template = `sku,name,description,category,cost_price,selling_price,quantity,min_stock,unit,barcode,expiry_date
SKU-001,Product Name,Product description,Electronics,1000.00,2500.00,100,10,pcs,1234567890123,2025-12-31
SKU-002,Another Product,Another description,Accessories,500.00,1500.00,50,5,pcs,1234567890124,`
    downloadFile(template, "products_template.csv")
  }

  const downloadCustomerTemplate = () => {
    const template = `name,email,phone,address
Rahul Sharma,rahul@example.com,+91 98765 43210,"123 MG Road, Mumbai, MH 400001"
Priya Patel,priya@example.com,+91 87654 32109,"456 Anna Salai, Chennai, TN 600001"`
    downloadFile(template, "customers_template.csv")
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import</CardTitle>
        <CardDescription>Import products or customers from CSV files</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <input
                  ref={productInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleProductFileUpload}
                  className="hidden"
                />
                <Button onClick={() => productInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
              </div>
              <Button variant="outline" onClick={downloadProductTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            {productPreview.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Preview ({productPreview.length} items)</h4>
                  <Button onClick={handleImportProducts}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Import All
                  </Button>
                </div>
                <div className="max-h-64 overflow-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productPreview.slice(0, 10).map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>{product.name || "-"}</TableCell>
                          <TableCell>{formatCurrency(product.sellingPrice || 0)}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            {product.name && product.sellingPrice ? (
                              <Badge className="bg-success text-success-foreground">Valid</Badge>
                            ) : (
                              <Badge variant="destructive">Invalid</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {productPreview.length > 10 && (
                  <p className="text-sm text-muted-foreground">Showing 10 of {productPreview.length} items</p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <input
                  ref={customerInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCustomerFileUpload}
                  className="hidden"
                />
                <Button onClick={() => customerInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
              </div>
              <Button variant="outline" onClick={downloadCustomerTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            {customerPreview.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Preview ({customerPreview.length} items)</h4>
                  <Button onClick={handleImportCustomers}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Import All
                  </Button>
                </div>
                <div className="max-h-64 overflow-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerPreview.slice(0, 10).map((customer, index) => (
                        <TableRow key={index}>
                          <TableCell>{customer.name || "-"}</TableCell>
                          <TableCell>{customer.email || "-"}</TableCell>
                          <TableCell>{customer.phone || "-"}</TableCell>
                          <TableCell>
                            {customer.name && customer.email ? (
                              <Badge className="bg-success text-success-foreground">Valid</Badge>
                            ) : (
                              <Badge variant="destructive">Invalid</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {importResult && (
          <Alert className={importResult.failed > 0 ? "border-warning mt-4" : "border-success mt-4"}>
            {importResult.failed > 0 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertTitle>Import Complete</AlertTitle>
            <AlertDescription>
              <p>Successfully imported {importResult.success} items.</p>
              {importResult.failed > 0 && <p className="text-warning">{importResult.errors.join(", ")}</p>}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
