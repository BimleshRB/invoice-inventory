import type { Store, Product, Category, Customer, Invoice, StockMovement, ActivityLog } from "./types"

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

// Default store
const defaultStore: Store = {
  id: "store-1",
  name: "TechMart Electronics",
  logo: null,
  address: "123 Business Avenue, Mumbai, Maharashtra 400001",
  phone: "+91 98765 43210",
  email: "contact@techmart.in",
  taxId: "GSTIN-27AABCT1234F1ZN",
  currency: "INR",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
}

// Initial categories - now loaded from backend per store
const initialCategories: Category[] = []

// Initial products
const initialProducts: Product[] = [
  {
    id: "prod-1",
    sku: "SKU-001",
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-canceling wireless headphones",
    categoryId: "cat-1",
    costPrice: 79.99,
    sellingPrice: 149.99,
    quantity: 45,
    minStockLevel: 10,
    unit: "pcs",
    barcode: "1234567890123",
    expiryDate: null,
    imageUrl: null,
    storeId: "store-1",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "prod-2",
    sku: "SKU-002",
    name: "USB-C Hub Adapter",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
    categoryId: "cat-2",
    costPrice: 25.0,
    sellingPrice: 49.99,
    quantity: 8,
    minStockLevel: 15,
    unit: "pcs",
    barcode: "1234567890124",
    expiryDate: null,
    imageUrl: null,
    storeId: "store-1",
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "prod-3",
    sku: "SKU-003",
    name: "Mechanical Keyboard",
    description: "RGB mechanical gaming keyboard with blue switches",
    categoryId: "cat-4",
    costPrice: 45.0,
    sellingPrice: 89.99,
    quantity: 32,
    minStockLevel: 8,
    unit: "pcs",
    barcode: "1234567890125",
    expiryDate: null,
    imageUrl: null,
    storeId: "store-1",
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "prod-4",
    sku: "SKU-004",
    name: "Antivirus Software License",
    description: "1-year premium antivirus subscription",
    categoryId: "cat-3",
    costPrice: 15.0,
    sellingPrice: 39.99,
    quantity: 100,
    minStockLevel: 20,
    unit: "license",
    barcode: null,
    expiryDate: new Date("2025-02-01"),
    imageUrl: null,
    storeId: "store-1",
    isActive: true,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "prod-5",
    sku: "SKU-005",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with adjustable DPI",
    categoryId: "cat-2",
    costPrice: 12.0,
    sellingPrice: 29.99,
    quantity: 5,
    minStockLevel: 10,
    unit: "pcs",
    barcode: "1234567890126",
    expiryDate: null,
    imageUrl: null,
    storeId: "store-1",
    isActive: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "prod-6",
    sku: "SKU-006",
    name: '27" 4K Monitor',
    description: "Ultra HD IPS monitor with HDR support",
    categoryId: "cat-1",
    costPrice: 250.0,
    sellingPrice: 449.99,
    quantity: 12,
    minStockLevel: 5,
    unit: "pcs",
    barcode: "1234567890127",
    expiryDate: null,
    imageUrl: null,
    storeId: "store-1",
    isActive: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
]

// Initial customers
const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.in",
    phone: "+91 98765 43210",
    address: "12 MG Road, Bengaluru, Karnataka 560001",
    storeId: "store-1",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "cust-2",
    name: "Priya Sharma",
    email: "priya.sharma@example.in",
    phone: "+91 98123 45678",
    address: "22 Abids Road, Hyderabad, Telangana 500001",
    storeId: "store-1",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "cust-3",
    name: "Tech Solutions Pvt. Ltd.",
    email: "orders@techsolutions.in",
    phone: "+91 91234 56789",
    address: "101 Industrial Estate, Pune, Maharashtra 411001",
    storeId: "store-1",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "cust-4",
    name: "Suresh Patel",
    email: "suresh.patel@example.in",
    phone: "+91 98234 56701",
    address: "7 Residential Lane, Ahmedabad, Gujarat 380001",
    storeId: "store-1",
    createdAt: new Date("2024-02-01"),
  },
]

// Initial invoices
const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2024-001",
    customerId: "cust-1",
    storeId: "store-1",
    items: [
      {
        id: "item-1",
        invoiceId: "inv-1",
        productId: "prod-1",
        quantity: 2,
        unitPrice: 149.99,
        discount: 0,
        total: 299.98,
      },
      {
        id: "item-2",
        invoiceId: "inv-1",
        productId: "prod-3",
        quantity: 1,
        unitPrice: 89.99,
        discount: 0,
        total: 89.99,
      },
    ],
    subtotal: 389.97,
    taxRate: 8.5,
    taxAmount: 33.15,
    discount: 0,
    total: 423.12,
    status: "paid",
    dueDate: new Date("2024-02-15"),
    notes: "Thank you for your business!",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2024-002",
    customerId: "cust-3",
    storeId: "store-1",
    items: [
      {
        id: "item-3",
        invoiceId: "inv-2",
        productId: "prod-6",
        quantity: 5,
        unitPrice: 449.99,
        discount: 50,
        total: 2199.95,
      },
      {
        id: "item-4",
        invoiceId: "inv-2",
        productId: "prod-2",
        quantity: 10,
        unitPrice: 49.99,
        discount: 0,
        total: 499.9,
      },
    ],
    subtotal: 2699.85,
    taxRate: 8.5,
    taxAmount: 229.49,
    discount: 50,
    total: 2879.34,
    status: "sent",
    dueDate: new Date("2024-03-01"),
    notes: "Net 30 payment terms",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2024-003",
    customerId: "cust-2",
    storeId: "store-1",
    items: [
      {
        id: "item-5",
        invoiceId: "inv-3",
        productId: "prod-4",
        quantity: 5,
        unitPrice: 39.99,
        discount: 0,
        total: 199.95,
      },
    ],
    subtotal: 199.95,
    taxRate: 8.5,
    taxAmount: 17.0,
    discount: 0,
    total: 216.95,
    status: "overdue",
    dueDate: new Date("2024-02-20"),
    notes: "",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
]

// Initial stock movements
const initialStockMovements: StockMovement[] = [
  {
    id: "mov-1",
    productId: "prod-1",
    type: "in",
    quantity: 50,
    reason: "Initial stock",
    referenceId: null,
    referenceType: "manual",
    storeId: "store-1",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "mov-2",
    productId: "prod-1",
    type: "out",
    quantity: 2,
    reason: "Sale - INV-2024-001",
    referenceId: "inv-1",
    referenceType: "invoice",
    storeId: "store-1",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "mov-3",
    productId: "prod-3",
    type: "in",
    quantity: 35,
    reason: "Initial stock",
    referenceId: null,
    referenceType: "manual",
    storeId: "store-1",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "mov-4",
    productId: "prod-3",
    type: "out",
    quantity: 1,
    reason: "Sale - INV-2024-001",
    referenceId: "inv-1",
    referenceType: "invoice",
    storeId: "store-1",
    createdAt: new Date("2024-01-25"),
  },
]

// Initial activity logs
const initialActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    action: "Product Added",
    entityType: "product",
    entityId: "prod-1",
    details: "Added Wireless Bluetooth Headphones",
    storeId: "store-1",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "log-2",
    action: "Invoice Created",
    entityType: "invoice",
    entityId: "inv-1",
    details: "Created invoice INV-2024-001",
    storeId: "store-1",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "log-3",
    action: "Payment Received",
    entityType: "invoice",
    entityId: "inv-1",
    details: "Payment received for INV-2024-001",
    storeId: "store-1",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "log-4",
    action: "Low Stock Alert",
    entityType: "product",
    entityId: "prod-5",
    details: "Wireless Mouse is below minimum stock level",
    storeId: "store-1",
    createdAt: new Date("2024-02-15"),
  },
]

import { create } from 'zustand'

// Create an internal Zustand store to hold data in-memory and expose a compatibility API
const useInternalStore = create(() => ({
  store: defaultStore,
  categories: [...initialCategories],
  products: [...initialProducts],
  customers: [...initialCustomers],
  invoices: [...initialInvoices],
  stockMovements: [...initialStockMovements],
  activityLogs: [...initialActivityLogs],
}))

// Compatibility wrapper exposing the same API as the previous DataStore class
export const dataStore = {
  // Store methods
  getStore(): Store {
    return useInternalStore.getState().store
  },
  updateStore(data: Partial<Store>): Store {
    const prev = useInternalStore.getState().store
    const updated = { ...prev, ...data, updatedAt: new Date() }
    useInternalStore.setState({ store: updated })
    return updated
  },

  // Category methods
  getCategories(): Category[] {
    return useInternalStore.getState().categories
  },
  setCategories(categories: Category[]): void {
    useInternalStore.setState({ categories })
  },
  addCategory(data: Omit<Category, 'id' | 'createdAt'>): Category {
    const category: Category = { ...data, id: generateId(), createdAt: new Date() }
    useInternalStore.setState((s) => ({ categories: [...s.categories, category] }))
    return category
  },
  deleteCategory(id: string): boolean {
    const prev = useInternalStore.getState().categories
    const index = prev.findIndex((c) => c.id === id)
    if (index !== -1) {
      const next = prev.slice(0, index).concat(prev.slice(index + 1))
      useInternalStore.setState({ categories: next })
      return true
    }
    return false
  },

  // Product methods
  getProducts(): Product[] {
    const { products, categories } = useInternalStore.getState()
    return products.map((p) => ({ ...p, category: categories.find((c) => c.id === p.categoryId) }))
  },
  getProduct(id: string): Product | undefined {
    const { products, categories } = useInternalStore.getState()
    const product = products.find((p) => p.id === id)
    return product ? { ...product, category: categories.find((c) => c.id === product.categoryId) } : undefined
  },
  addProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const product: Product = { ...data, id: generateId(), createdAt: new Date(), updatedAt: new Date() }
    useInternalStore.setState((s) => ({ products: [...s.products, product] }))
    this.addActivityLog({ action: 'Product Added', entityType: 'product', entityId: product.id, details: `Added ${product.name}`, storeId: product.storeId })
    return product
  },
  updateProduct(id: string, data: Partial<Product>): Product | undefined {
    const { products } = useInternalStore.getState()
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return undefined
    const updated = { ...products[index], ...data, updatedAt: new Date() }
    useInternalStore.setState((s) => {
      const copy = s.products.slice()
      copy[index] = updated
      return { products: copy }
    })
    this.addActivityLog({ action: 'Product Updated', entityType: 'product', entityId: id, details: `Updated ${updated.name}`, storeId: updated.storeId })
    return updated
  },
  deleteProduct(id: string): boolean {
    const { products } = useInternalStore.getState()
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return false
    const product = products[index]
    useInternalStore.setState((s) => ({ products: s.products.filter((p) => p.id !== id) }))
    this.addActivityLog({ action: 'Product Deleted', entityType: 'product', entityId: id, details: `Deleted ${product.name}`, storeId: product.storeId })
    return true
  },
  addBulkProducts(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Product[] {
    const added = products.map((p) => this.addProduct(p))
    return added
  },
  getLowStockProducts(): Product[] {
    return useInternalStore.getState().products.filter((p) => p.quantity <= p.minStockLevel)
  },
  getExpiringProducts(days = 30): Product[] {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    return useInternalStore.getState().products.filter((p) => p.expiryDate && new Date(p.expiryDate) <= futureDate)
  },

  // Customer methods
  getCustomers(): Customer[] {
    return useInternalStore.getState().customers
  },
  getCustomer(id: string): Customer | undefined {
    return useInternalStore.getState().customers.find((c) => c.id === id)
  },
  addCustomer(data: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const customer: Customer = { ...data, id: generateId(), createdAt: new Date() }
    useInternalStore.setState((s) => ({ customers: [...s.customers, customer] }))
    return customer
  },
  updateCustomer(id: string, data: Partial<Customer>): Customer | undefined {
    const { customers } = useInternalStore.getState()
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return undefined
    const updated = { ...customers[index], ...data }
    useInternalStore.setState((s) => {
      const copy = s.customers.slice()
      copy[index] = updated
      return { customers: copy }
    })
    return updated
  },
  deleteCustomer(id: string): boolean {
    const { customers } = useInternalStore.getState()
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return false
    useInternalStore.setState((s) => ({ customers: s.customers.filter((c) => c.id !== id) }))
    return true
  },

  // Invoice methods
  getInvoices(): Invoice[] {
    const { invoices, customers, products } = useInternalStore.getState()
    return invoices.map((inv) => ({
      ...inv,
      customer: customers.find((c) => c.id === inv.customerId),
      store: useInternalStore.getState().store,
      items: inv.items.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })),
    }))
  },
  getInvoice(id: string): Invoice | undefined {
    const { invoices, customers, products } = useInternalStore.getState()
    const inv = invoices.find((i) => i.id === id)
    if (!inv) return undefined
    return {
      ...inv,
      customer: customers.find((c) => c.id === inv.customerId),
      store: useInternalStore.getState().store,
      items: inv.items.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })),
    }
  },
  addInvoice(data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Invoice {
    const { invoices } = useInternalStore.getState()
    const invoiceCount = invoices.length + 1
    const invoice: Invoice = { ...data, id: generateId(), invoiceNumber: `INV-${new Date().getFullYear()}-${invoiceCount.toString().padStart(3, '0')}`, createdAt: new Date(), updatedAt: new Date() }
    useInternalStore.setState((s) => ({ invoices: [...s.invoices, invoice] }))

    // update quantities and stock movements
    invoice.items.forEach((item) => {
      const product = useInternalStore.getState().products.find((p) => p.id === item.productId)
      if (product) {
        this.updateProduct(product.id, { quantity: product.quantity - item.quantity })
        this.addStockMovement({ productId: item.productId, type: 'out', quantity: item.quantity, reason: `Sale - ${invoice.invoiceNumber}`, referenceId: invoice.id, referenceType: 'invoice', storeId: invoice.storeId })
      }
    })

    this.addActivityLog({ action: 'Invoice Created', entityType: 'invoice', entityId: invoice.id, details: `Created invoice ${invoice.invoiceNumber}`, storeId: invoice.storeId })
    return invoice
  },
  updateInvoice(id: string, data: Partial<Invoice>): Invoice | undefined {
    const { invoices } = useInternalStore.getState()
    const index = invoices.findIndex((inv) => inv.id === id)
    if (index === -1) return undefined
    const updated = { ...invoices[index], ...data, updatedAt: new Date() }
    useInternalStore.setState((s) => {
      const copy = s.invoices.slice()
      copy[index] = updated
      return { invoices: copy }
    })
    this.addActivityLog({ action: 'Invoice Updated', entityType: 'invoice', entityId: id, details: `Updated invoice ${updated.invoiceNumber}`, storeId: updated.storeId })
    return updated
  },
  deleteInvoice(id: string): boolean {
    const { invoices } = useInternalStore.getState()
    const index = invoices.findIndex((inv) => inv.id === id)
    if (index === -1) return false
    const invoice = invoices[index]
    useInternalStore.setState((s) => ({ invoices: s.invoices.filter((i) => i.id !== id) }))
    this.addActivityLog({ action: 'Invoice Deleted', entityType: 'invoice', entityId: id, details: `Deleted invoice ${invoice.invoiceNumber}`, storeId: invoice.storeId })
    return true
  },
  getNextInvoiceNumber(): string {
    const invoiceCount = useInternalStore.getState().invoices.length + 1
    return `INV-${new Date().getFullYear()}-${invoiceCount.toString().padStart(3, '0')}`
  },

  // Stock movement methods
  getStockMovements(): StockMovement[] {
    const { stockMovements, products } = useInternalStore.getState()
    return stockMovements.map((m) => ({ ...m, product: products.find((p) => p.id === m.productId) }))
  },
  addStockMovement(data: Omit<StockMovement, 'id' | 'createdAt'>): StockMovement {
    const movement: StockMovement = { ...data, id: generateId(), createdAt: new Date() }
    useInternalStore.setState((s) => ({ stockMovements: [...s.stockMovements, movement] }))

    const product = useInternalStore.getState().products.find((p) => p.id === data.productId)
    if (product) {
      const newQuantity = data.type === 'in' ? product.quantity + data.quantity : data.type === 'out' ? product.quantity - data.quantity : data.quantity
      this.updateProduct(product.id, { quantity: newQuantity })
    }

    this.addActivityLog({ action: `Stock ${data.type === 'in' ? 'Added' : data.type === 'out' ? 'Removed' : 'Adjusted'}`, entityType: 'stock', entityId: movement.id, details: `${data.type === 'in' ? '+' : '-'}${product?.name || 'Unknown'} - ${data.reason}`, storeId: data.storeId })
    return movement
  },

  // Activity log methods
  getActivityLogs(): ActivityLog[] {
    return useInternalStore.getState().activityLogs.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },
  addActivityLog(data: Omit<ActivityLog, 'id' | 'createdAt'>): ActivityLog {
    const log: ActivityLog = { ...data, id: generateId(), createdAt: new Date() }
    useInternalStore.setState((s) => ({ activityLogs: [...s.activityLogs, log] }))
    return log
  },

  // Dashboard stats
  getDashboardStats() {
    const { invoices, products } = useInternalStore.getState()
    const paidInvoices = invoices.filter((inv) => inv.status === 'paid')
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)

    const recentSales: { date: string; amount: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dayInvoices = paidInvoices.filter((inv) => {
        const invDate = new Date(inv.createdAt)
        return invDate.toDateString() === date.toDateString()
      })
      recentSales.push({ date: dateStr, amount: dayInvoices.reduce((sum, inv) => sum + inv.total, 0) })
    }

    const productSales: { [key: string]: number } = {}
    invoices.forEach((inv) => {
      inv.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (product) productSales[product.name] = (productSales[product.name] || 0) + item.quantity
      })
    })
    const topProducts = Object.entries(productSales).map(([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity).slice(0, 5)

    return {
      totalProducts: products.length,
      lowStockProducts: this.getLowStockProducts().length,
      expiringProducts: this.getExpiringProducts().length,
      totalRevenue,
      pendingInvoices: invoices.filter((inv) => inv.status === 'sent' || inv.status === 'overdue').length,
      totalCustomers: useInternalStore.getState().customers.length,
      recentSales,
      topProducts,
    }
  },
}

// React hook alias for components to subscribe to the in-memory Zustand store
export const useDataStore = useInternalStore
