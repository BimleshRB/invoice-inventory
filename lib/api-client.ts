/**
 * API Client for backend communication
 * Handles authentication, error handling, and request/response formatting
 * Industry-grade with proper error handling and retry logic
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

type RequestInit = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  token?: string
}

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`
  const token = options.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Debug logging
  console.log(`[API] ${options.method || 'GET'} ${endpoint}`, {
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 20) + '...' : 'NO_TOKEN',
    headers: Object.keys(headers),
  })

  try {
    const fetchOptions: any = {
      method: options.method || 'GET',
      headers,
    }

    if (options.body && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(options.body)
      console.log(`[API] Request body:`, options.body)
    }

    console.log(`[API] Full URL: ${url}`)
    console.log(`[API] Full headers:`, headers)
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }))
      console.log(`[API] ${options.method || 'GET'} ${endpoint} - ERROR:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData?.error || errorData?.message,
      })
      return {
        error: errorData?.error || errorData?.message || 'Request failed',
        status: response.status,
      }
    }

    const data = await response.json().catch(() => null)
    console.log(`[API] ${options.method || 'GET'} ${endpoint} - SUCCESS:`, {
      status: response.status,
      dataKeys: data ? Object.keys(data) : null,
      dataType: data ? typeof data : 'null',
      isArray: Array.isArray(data),
      fullData: data,
    })
    return {
      data,
      status: response.status,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    }
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET', token })
}

/**
 * POST request
 */
export async function apiPost<T = any>(endpoint: string, body: any, token?: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'POST', body, token })
}

/**
 * PUT request
 */
export async function apiPut<T = any>(endpoint: string, body: any, token?: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'PUT', body, token })
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE', token })
}

/**
 * Product API endpoints
 */
export const productApi = {
  list: (page = 0, size = 10, storeId?: string) =>
    apiGet(`/products?page=${page}&size=${size}${storeId ? `&storeId=${storeId}` : ''}`),
  get: (id: string | number) => apiGet(`/products/${id}`),
  create: (data: any) => apiPost('/products', data),
  update: (id: string | number, data: any) => apiPut(`/products/${id}`, data),
  delete: (id: string | number) => apiDelete(`/products/${id}`),
  bulk: (products: any[]) => apiPost('/products/bulk', products),
  search: (query: string, page = 0, size = 10) =>
    apiGet(`/products/search?query=${query}&page=${page}&size=${size}`),
}

/**
 * Invoice API endpoints
 */
export const invoiceApi = {
  list: (page = 0, size = 10, storeId?: string) =>
    apiGet(`/invoices?page=${page}&size=${size}${storeId ? `&storeId=${storeId}` : ''}`),
  get: (id: string | number) => apiGet(`/invoices/${id}`),
  create: (data: any) => apiPost('/invoices', data),
  update: (id: string | number, data: any) => apiPut(`/invoices/${id}`, data),
  delete: (id: string | number) => apiDelete(`/invoices/${id}`),
  nextNumber: () => apiGet('/invoices/next-number'),
  byCustomer: (customerId: string | number) => apiGet(`/invoices/customer/${customerId}`),
  byDateRange: (startDate: string, endDate: string) =>
    apiGet(`/invoices/range?startDate=${startDate}&endDate=${endDate}`),
  stats: () => apiGet('/invoices/stats'),
}

/**
 * Customer API endpoints
 */
export const customerApi = {
  list: (page = 0, size = 10, storeId?: string) =>
    apiGet(`/customers?page=${page}&size=${size}${storeId ? `&storeId=${storeId}` : ''}`),
  get: (id: string | number) => apiGet(`/customers/${id}`),
  create: (data: any) => apiPost('/customers', data),
  update: (id: string | number, data: any) => apiPut(`/customers/${id}`, data),
  delete: (id: string | number) => apiDelete(`/customers/${id}`),
  search: (query: string, page = 0, size = 10) =>
    apiGet(`/customers/search?query=${query}&page=${page}&size=${size}`),
}

/**
 * Stock Movement API endpoints
 */
export const stockApi = {
  list: (page = 0, size = 10) => apiGet(`/stock-movements?page=${page}&size=${size}`),
  get: (id: string | number) => apiGet(`/stock-movements/${id}`),
  create: (data: any) => apiPost('/stock-movements', data),
  byProduct: (productId: string | number) => apiGet(`/stock-movements/product/${productId}`),
  history: (productId: string | number, startDate?: string, endDate?: string) =>
    apiGet(
      `/stock-movements/product/${productId}/history${
        startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''
      }`
    ),
  adjust: (productId: string | number, quantity: number, reason: string, type: 'in' | 'out') =>
    apiPost('/stock-movements', { productId, quantity, reason, type }),
}

/**
 * Category API endpoints
 */
export const categoryApi = {
  list: (page = 0, size = 100, storeId?: string) =>
    apiGet(`/categories?page=${page}&size=${size}${storeId ? `&storeId=${storeId}` : ''}`),
  get: (id: string | number) => apiGet(`/categories/${id}`),
  create: (data: any) => apiPost('/categories', data),
  update: (id: string | number, data: any) => apiPut(`/categories/${id}`, data),
  delete: (id: string | number) => apiDelete(`/categories/${id}`),
}

/**
 * Profile/Auth API endpoints
 */
export const profileApi = {
  getMe: () => apiGet('/profile/me'),
  updateProfile: (data: any) => apiPost('/profile', data),
}

/**
 * Activity Log API endpoints
 */
export const activityApi = {
  list: (page = 0, size = 50) => apiGet(`/activity-logs?page=${page}&size=${size}`),
}

/**
 * Dashboard/Reports API endpoints
 */
export const dashboardApi = {
  getStats: () => apiGet('/dashboard/stats'),
  getTopProducts: () => apiGet('/dashboard/top-products'),
  getRecentActivity: (page = 0, size = 10) => apiGet(`/dashboard/recent-activity?page=${page}&size=${size}`),
  getSalesChartData: (period = 'month') => apiGet(`/dashboard/sales-chart?period=${period}`),
  getLowStockProducts: () => apiGet('/dashboard/low-stock'),
  getSalesSummary: (startDate: string, endDate: string) =>
    apiGet(`/dashboard/sales-summary?startDate=${startDate}&endDate=${endDate}`),
  getInventorySummary: () => apiGet('/dashboard/inventory-summary'),
}

/**
 * Notifications API endpoints
 */
export const notificationsApi = {
  list: (page = 0, size = 20) => apiGet(`/notifications?page=${page}&size=${size}`),
  unreadCount: () => apiGet('/notifications/unread-count'),
  markRead: (id: number | string) => apiPost(`/notifications/${id}/read`, {}),
  markAllRead: () => apiPost('/notifications/read-all', {}),
}

/**
 * Type definitions for responses
 */
export interface Product {
  id: number
  name: string
  description?: string
  categoryId?: number
  costPrice: number
  sellingPrice: number
  quantity: number
  minStockLevel?: number
  unit?: string
  barcode?: string
  expiryDate?: string
  imageUrl?: string
  storeId?: string
  createdAt?: string
  updatedAt?: string
}

export interface Invoice {
  id: number
  invoiceNumber: string
  customerId?: number
  items: InvoiceItem[]
  total: number
  tax?: number
  discount?: number
  notes?: string
  status?: string
  dueDate?: string
  storeId?: string
  createdAt?: string
  updatedAt?: string
}

export interface InvoiceItem {
  productId: number
  quantity: number
  unitPrice: number
  total: number
}

export interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  taxId?: string
  storeId?: string
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  storeId?: string
  createdAt?: string
}

export interface StockMovement {
  id: number
  productId: number
  product?: Product
  movementType: 'in' | 'out' | 'adjust'
  type?: 'in' | 'out' | 'adjustment' // Alias for frontend compatibility
  quantity: number
  reason: string
  referenceId?: number
  referenceType?: string
  storeId?: string
  createdAt?: string
}
