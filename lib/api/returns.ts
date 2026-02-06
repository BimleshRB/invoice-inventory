/**
 * Returns API Client
 * Handles all invoice returns operations:
 * - Create return requests
 * - Approve/complete/reject returns
 * - List and filter returns
 * - Refund/adjustment tracking
 */
import { apiRequest } from './api-client'
import type { InvoiceReturn, InvoiceReturnItem } from './types'

interface ListOptions {
  page?: number
  size?: number
  status?: string
  returnType?: string
  storeId?: string
}

interface ApiResponse<T> {
  data?: T
  error?: string
  status?: number
}

export const returnsApi = {
  /**
   * List all returns with optional filtering
   */
  async list(options: ListOptions = {}) {
    const params = new URLSearchParams()
    if (options.page !== undefined) params.append('page', options.page.toString())
    if (options.size !== undefined) params.append('size', options.size.toString())
    if (options.status) params.append('status', options.status)
    if (options.returnType) params.append('returnType', options.returnType)
    if (options.storeId) params.append('storeId', options.storeId)

    const queryStr = params.toString()
    const endpoint = `/invoices/returns${queryStr ? '?' + queryStr : ''}`

    return apiRequest<{ content: InvoiceReturn[] }>(endpoint, {
      method: 'GET',
    })
  },

  /**
   * Get a specific return by ID
   */
  async get(id: string | number) {
    return apiRequest<InvoiceReturn>(`/invoices/returns/${id}`, {
      method: 'GET',
    })
  },

  /**
   * Get a return by return number
   */
  async getByNumber(returnNumber: string) {
    return apiRequest<InvoiceReturn>(`/invoices/returns/number/${returnNumber}`, {
      method: 'GET',
    })
  },

  /**
   * Create a new return request
   */
  async create(returnData: InvoiceReturn) {
    return apiRequest<InvoiceReturn>('/invoices/returns', {
      method: 'POST',
      body: returnData,
    })
  },

  /**
   * Approve a pending return
   */
  async approve(id: string | number) {
    return apiRequest<{ return: InvoiceReturn; message: string }>(
      `/invoices/returns/${id}/approve`,
      {
        method: 'POST',
      }
    )
  },

  /**
   * Complete (finalize) an approved return
   */
  async complete(id: string | number) {
    return apiRequest<{ return: InvoiceReturn; message: string }>(
      `/invoices/returns/${id}/complete`,
      {
        method: 'POST',
      }
    )
  },

  /**
   * Reject a return request
   */
  async reject(id: string | number, reason: string) {
    return apiRequest<{ return: InvoiceReturn; message: string }>(
      `/invoices/returns/${id}/reject`,
      {
        method: 'POST',
        body: { reason },
      }
    )
  },

  /**
   * Get all returns for a specific invoice
   */
  async getByInvoice(invoiceId: string | number) {
    return apiRequest<InvoiceReturn[]>(`/invoices/returns/by-invoice/${invoiceId}`, {
      method: 'GET',
    })
  },

  /**
   * Get pending returns requiring approval
   */
  async getPending() {
    return apiRequest<{ count: number; returns: InvoiceReturn[] }>(
      '/invoices/returns/pending',
      {
        method: 'GET',
      }
    )
  },

  /**
   * Get return summary for dashboard
   */
  async getSummary(startDate?: string, endDate?: string) {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    const queryStr = params.toString()
    const endpoint = `/invoices/returns/summary${queryStr ? '?' + queryStr : ''}`

    return apiRequest<{
      pending: number
      approved: number
      completed: number
      byType: Record<string, { count: number; refundAmount: number }>
      totalRefundAmount: number
    }>(endpoint, {
      method: 'GET',
    })
  },
}
