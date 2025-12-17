"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DocsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Documentation" description="API reference and user guide" />
      <div className="flex-1 p-4 lg:p-6">
        <Tabs defaultValue="guide" className="space-y-4">
          <TabsList>
            <TabsTrigger value="guide">User Guide</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Learn how to use the Inventory Management System</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <ScrollArea className="h-150 pr-4">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-xl font-semibold text-foreground">Overview</h2>
                      <p className="text-muted-foreground">
                        This inventory management system helps you track products, manage stock levels, create invoices,
                        and analyze your business performance. It features a clean, professional interface with support
                        for both light and dark modes.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground">Features</h2>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                          <strong className="text-foreground">Dashboard</strong> - View key metrics, recent activity,
                          and sales charts
                        </li>
                        <li>
                          <strong className="text-foreground">Products</strong> - Add, edit, and manage your product
                          inventory
                        </li>
                        <li>
                          <strong className="text-foreground">Invoices</strong> - Create professional invoices and track
                          payments
                        </li>
                        <li>
                          <strong className="text-foreground">Customers</strong> - Manage your customer database
                        </li>
                        <li>
                          <strong className="text-foreground">Stock Management</strong> - Track stock movements and get
                          low stock alerts
                        </li>
                        <li>
                          <strong className="text-foreground">Bulk Import</strong> - Import products and customers from
                          CSV files
                        </li>
                        <li>
                          <strong className="text-foreground">Reports</strong> - Generate business analytics and export
                          reports
                        </li>
                        <li>
                          <strong className="text-foreground">Settings</strong> - Configure store information and
                          categories
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground">Adding Products</h2>
                      <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Navigate to the Products page from the sidebar</li>
                        <li>Click the "Add Product" button</li>
                        <li>Fill in the product details (name, SKU, price, quantity, etc.)</li>
                        <li>Select a category for the product</li>
                        <li>Click "Add Product" to save</li>
                      </ol>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground">Creating Invoices</h2>
                      <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Go to the Invoices page</li>
                        <li>Click "Create Invoice"</li>
                        <li>Select a customer from your database</li>
                        <li>Add products to the invoice using the "Add Item" button</li>
                        <li>Adjust quantities and discounts as needed</li>
                        <li>Set the tax rate and any additional discount</li>
                        <li>Add notes if necessary</li>
                        <li>Click "Create Invoice" to generate</li>
                      </ol>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground">Bulk Import</h2>
                      <p className="text-muted-foreground">
                        You can import products and customers in bulk using CSV files:
                      </p>
                      <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Go to the Bulk Import page</li>
                        <li>Download the CSV template to see the required format</li>
                        <li>Fill in your data following the template structure</li>
                        <li>Upload your CSV file</li>
                        <li>Preview the data and click "Import All"</li>
                      </ol>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground">Stock Management</h2>
                      <p className="text-muted-foreground">Track stock levels and movements:</p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                          <strong className="text-foreground">Low Stock Alerts</strong> - Products below minimum stock
                          level are highlighted
                        </li>
                        <li>
                          <strong className="text-foreground">Expiry Tracking</strong> - Products expiring within 30
                          days are shown
                        </li>
                        <li>
                          <strong className="text-foreground">Stock Adjustments</strong> - Manually add, remove, or set
                          stock quantities
                        </li>
                        <li>
                          <strong className="text-foreground">Movement History</strong> - View all stock changes with
                          reasons
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground">CSV Format Requirements</h2>
                      <h3 className="text-lg font-medium text-foreground mt-4">Products CSV</h3>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        {`sku,name,description,category,cost_price,selling_price,quantity,min_stock,unit,barcode,expiry_date
SKU-001,Product Name,Description,Electronics,10.00,25.00,100,10,pcs,1234567890,2025-12-31`}
                      </pre>

                      <h3 className="text-lg font-medium text-foreground mt-4">Customers CSV</h3>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        {`name,email,phone,address
John Smith,john@example.com,+1 555-123-4567,"123 Main St, City, ST 12345"`}
                      </pre>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>Data store methods and interfaces</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-150 pr-4">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-xl font-semibold text-foreground">Data Store API</h2>
                      <p className="text-muted-foreground mb-4">
                        The application uses an in-memory data store. Below are the available methods:
                      </p>

                      <div className="space-y-4">
                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge>GET</Badge>
                            <code className="text-sm font-mono text-foreground">getProducts()</code>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Returns all products with category information
                          </p>
                          <pre className="mt-2 bg-muted p-3 rounded text-xs overflow-x-auto">
                            {`// Returns: Product[]
const products = dataStore.getProducts()`}
                          </pre>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">POST</Badge>
                            <code className="text-sm font-mono text-foreground">addProduct(data)</code>
                          </div>
                          <p className="text-sm text-muted-foreground">Adds a new product to inventory</p>
                          <pre className="mt-2 bg-muted p-3 rounded text-xs overflow-x-auto">
                            {`// Parameters
interface ProductInput {
  sku: string
  name: string
  description: string
  categoryId: string
  costPrice: number
  sellingPrice: number
  quantity: number
  minStockLevel: number
  unit: string
  barcode?: string
  expiryDate?: Date
  imageUrl?: string
  storeId: string
  isActive: boolean
}

const newProduct = dataStore.addProduct(productData)`}
                          </pre>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-warning text-warning-foreground">PUT</Badge>
                            <code className="text-sm font-mono text-foreground">updateProduct(id, data)</code>
                          </div>
                          <p className="text-sm text-muted-foreground">Updates an existing product</p>
                          <pre className="mt-2 bg-muted p-3 rounded text-xs overflow-x-auto">
                            {`const updated = dataStore.updateProduct("prod-1", {
  name: "Updated Name",
  sellingPrice: 29.99
})`}
                          </pre>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="destructive">DELETE</Badge>
                            <code className="text-sm font-mono text-foreground">deleteProduct(id)</code>
                          </div>
                          <p className="text-sm text-muted-foreground">Deletes a product from inventory</p>
                          <pre className="mt-2 bg-muted p-3 rounded text-xs overflow-x-auto">
                            {`const success = dataStore.deleteProduct("prod-1")
// Returns: boolean`}
                          </pre>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">POST</Badge>
                            <code className="text-sm font-mono text-foreground">addBulkProducts(products)</code>
                          </div>
                          <p className="text-sm text-muted-foreground">Adds multiple products at once</p>
                          <pre className="mt-2 bg-muted p-3 rounded text-xs overflow-x-auto">
                            {`const added = dataStore.addBulkProducts([
  { name: "Product 1", ... },
  { name: "Product 2", ... }
])
// Returns: Product[]`}
                          </pre>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge>GET</Badge>
                            <code className="text-sm font-mono text-foreground">getLowStockProducts()</code>
                          </div>
                          <p className="text-sm text-muted-foreground">Returns products below minimum stock level</p>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge>GET</Badge>
                            <code className="text-sm font-mono text-foreground">getExpiringProducts(days)</code>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Returns products expiring within specified days
                          </p>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">POST</Badge>
                            <code className="text-sm font-mono text-foreground">addInvoice(data)</code>
                          </div>
                          <p className="text-sm text-muted-foreground">Creates a new invoice and updates stock</p>
                          <pre className="mt-2 bg-muted p-3 rounded text-xs overflow-x-auto">
                            {`interface InvoiceInput {
  customerId: string
  storeId: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  dueDate: Date
  notes: string
}

const invoice = dataStore.addInvoice(invoiceData)`}
                          </pre>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">POST</Badge>
                            <code className="text-sm font-mono text-foreground">addStockMovement(data)</code>
                          </div>
                          <p className="text-sm text-muted-foreground">Records a stock adjustment</p>
                          <pre className="mt-2 bg-muted p-3 rounded text-xs overflow-x-auto">
                            {`interface StockMovementInput {
  productId: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  referenceId?: string
  referenceType?: "invoice" | "purchase" | "manual"
  storeId: string
}

dataStore.addStockMovement(movementData)`}
                          </pre>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground">Data Types</h2>
                      <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                        {`// Store
interface Store {
  id: string
  name: string
  logo: string | null
  address: string
  phone: string
  email: string
  taxId: string
  currency: string
  createdAt: Date
  updatedAt: Date
}

// Product
interface Product {
  id: string
  sku: string
  name: string
  description: string
  categoryId: string
  category?: Category
  costPrice: number
  sellingPrice: number
  quantity: number
  minStockLevel: number
  unit: string
  barcode: string | null
  expiryDate: Date | null
  imageUrl: string | null
  storeId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Customer
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  storeId: string
  createdAt: Date
}

// Invoice
interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customer?: Customer
  storeId: string
  store?: Store
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  dueDate: Date
  notes: string
  createdAt: Date
  updatedAt: Date
}

// InvoiceItem
interface InvoiceItem {
  id: string
  invoiceId: string
  productId: string
  product?: Product
  quantity: number
  unitPrice: number
  discount: number
  total: number
}`}
                      </pre>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
