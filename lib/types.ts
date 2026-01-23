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
  id: string | number
  name: string
  description: string
  storeId: string | number
  createdAt: Date | string
}

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  categoryId: string | number
  category?: Category
  sellingPrice?: number
  minStockLevel: number
  unit: string
  barcode: string | null
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
  type?: "in" | "out"
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
  discountType: "percentage" | "fixed" // percentage or fixed amount
  discountValue: number // % or amount
  taxRate: number // % tax rate for this item
  subtotal: number // after discount: (qty × unitPrice) - discount
  taxAmount: number // subtotal × taxRate / 100
  total: number // subtotal + taxAmount
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
  totalInvoices: number
  totalRevenue: number
  totalRevenueChange: number
  inventoryValue: number
  averageProductValue: number
  pendingInvoices: number
  expiringProducts: number
  totalCustomers: number
}
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  STORE_OWNER = "STORE_OWNER",
  STORE_ADMIN = "STORE_ADMIN",
  USER = "USER",
}

export interface User {
  id: string
  username: string
  fullName: string
  storeName: string
  storeId: string
  phone: string
  email: string
  role: UserRole
  roleDescription: string
  createdAt?: Date
}

export interface CurrentUserInfo {
  username: string
  role: UserRole
  storeId: string
  isSuperAdmin: boolean
  isStoreOwner: boolean
  isStoreAdmin: boolean
}