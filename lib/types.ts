export interface Store {
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

export interface Category {
  id: string
  name: string
  description: string
  storeId: string
  createdAt: Date
}

export interface Product {
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

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  storeId: string
  createdAt: Date
}

export interface Invoice {
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

export interface InvoiceItem {
  id: string
  invoiceId: string
  productId: string
  product?: Product
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

export interface StockMovement {
  id: string
  productId: string
  product?: Product
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  referenceId: string | null
  referenceType: "invoice" | "purchase" | "manual" | null
  storeId: string
  createdAt: Date
}

export interface ActivityLog {
  id: string
  action: string
  entityType: "product" | "invoice" | "customer" | "stock"
  entityId: string
  details: string
  storeId: string
  createdAt: Date
}

export interface DashboardStats {
  totalProducts: number
  lowStockProducts: number
  expiringProducts: number
  totalRevenue: number
  pendingInvoices: number
  totalCustomers: number
}
