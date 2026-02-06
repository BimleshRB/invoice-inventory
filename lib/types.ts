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
  availableQuantity?: number // DEPRECATED: Use GET /api/products/{id}/stock instead
  reservedQuantity?: number
  isDeleted?: boolean
  minStockLevel: number
  unit: string
  barcode: string | null
  manufacturingDate?: string | null
  expiryDate?: string | null
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
  isDeleted?: boolean
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
  movementType?: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  referenceId: string | null
  referenceType: "invoice" | "purchase" | "manual" | null
  storeId: string
  createdAt: Date
}

export interface PriceHistory {
  id: string
  productId: string
  oldPrice: number | null
  newPrice: number | null
  reason?: string | null
  changedBy?: string | number | null
  changedAt: string
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

// ============================================================================
// INVOICE RETURNS TYPES
// ============================================================================

export interface InvoiceReturnItem {
  id?: string
  invoiceReturnId?: string
  originalInvoiceItemId: string
  productId: string
  product?: Product
  batchId?: string
  quantityReturned: number
  quantityAccepted?: number
  quantityRejected?: number
  unitPrice: number
  lineTotal?: number
  qcNotes?: string
  itemStatus?: "PENDING" | "APPROVED" | "REJECTED"
}

export interface InvoiceReturn {
  id?: string
  returnNumber?: string
  originalInvoiceId: string
  originalInvoice?: Invoice
  storeId?: string
  returnType: "SALE_RETURN" | "PURCHASE_RETURN"
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "PARTIAL"
  reason?: string
  totalQuantity?: number
  subtotalAmount?: number
  taxAmount?: number
  totalAmount?: number
  approvedBy?: string
  approvedAt?: string
  createdBy?: string
  items: InvoiceReturnItem[]
  createdAt?: string
  updatedAt?: string
}