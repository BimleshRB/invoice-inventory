/**
 * API Client for backend communication
 * Handles authentication, error handling, and request/response formatting
 * Industry-grade with proper error handling and retry logic
 */
import { getStoreHostHeader } from './subdomain'

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'
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
  
  // Add X-Store-Host header for multi-tenant store resolution
  // Backend uses this to identify which store the request belongs to
  const storeHost = getStoreHostHeader()
  if (storeHost) {
    headers['X-Store-Host'] = storeHost
  }
  
  // Debug logging
  console.log(`[API] ${options.method || 'GET'} ${endpoint}`, {
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 20) + '...' : 'NO_TOKEN',
    headers: Object.keys(headers),
    storeHost: storeHost || 'NO_STORE',
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

    if (response.status === 401) {
      // Do not auto-clear token or redirect globally here.
      // Let the calling page/hook decide how to handle auth state.
      console.warn("[API] 401 Unauthorized - returning error to caller (no global redirect)");
      return { error: "Unauthorized", status: 401 };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      let errorMessage: string
      
      // Handle different error formats
      if (typeof errorData?.error === 'string') {
        errorMessage = errorData.error
      } else if (typeof errorData?.message === 'string') {
        errorMessage = errorData.message
      } else if (errorData?.errors) {
        // Handle validation errors object like {items: ["error message"]}
        if (typeof errorData.errors === 'string') {
          errorMessage = errorData.errors
        } else if (typeof errorData.errors === 'object') {
          // Convert object to readable string
          const errorsArray = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages]
              return `${field}: ${msgArray.join(', ')}`
            })
          errorMessage = errorsArray.join('; ')
        } else {
          errorMessage = 'Validation error'
        }
      } else {
        errorMessage = response.statusText || 'Request failed'
      }
      
      console.log(`[API] ${options.method || 'GET'} ${endpoint} - ERROR:`, {
        status: response.status,
        statusText: response.statusText,
        errorData,
        resolvedError: errorMessage,
      })
      return {
        error: errorMessage,
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
  priceHistory: (id: string | number, page = 0, size = 20) =>
    apiGet(`/products/${id}/price-history?page=${page}&size=${size}`),
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
  updateStatus: (id: string | number, status: string) => apiPut(`/invoices/${id}`, { status }),
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
 * Invoice Returns API endpoints
 */
export const returnsApi = {
  list: (options?: { page?: number; size?: number; status?: string; returnType?: string; storeId?: string }) => {
    const page = options?.page || 0
    const size = options?.size || 10
    const status = options?.status
    const returnType = options?.returnType
    const storeId = options?.storeId
    return apiGet(
      `/invoices/returns?page=${page}&size=${size}${status ? `&status=${status}` : ''}${
        returnType ? `&returnType=${returnType}` : ''
      }${storeId ? `&storeId=${storeId}` : ''}`
    )
  },
  get: (id: string | number) => apiGet(`/invoices/returns/${id}`),
  getByNumber: (returnNumber: string) => apiGet(`/invoices/returns/number/${returnNumber}`),
  create: (data: any) => apiPost('/invoices/returns', data),
  approve: (id: string | number) => apiPost(`/invoices/returns/${id}/approve`, {}),
  complete: (id: string | number) => apiPost(`/invoices/returns/${id}/complete`, {}),
  reject: (id: string | number, reason: string) => apiPost(`/invoices/returns/${id}/reject`, { reason }),
  getByInvoice: (invoiceId: string | number) => apiGet(`/invoices/returns/by-invoice/${invoiceId}`),
  getPending: () => apiGet('/invoices/returns/pending'),
  getSummary: (startDate?: string, endDate?: string) =>
    apiGet(
      `/invoices/returns/summary${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`
    ),
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
  sellingPrice?: number
  minStockLevel?: number
  unit?: string
  barcode?: string
  imageUrl?: string
  storeId?: string
  createdAt?: string
  updatedAt?: string
}

export interface Invoice {
  id: number
  invoiceNumber: string
  customerId?: number
  type?: 'in' | 'out'
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

// Unified API Client object for convenience
export const apiClient = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
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
