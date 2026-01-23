// Procurement API client: suppliers, purchase orders, goods receipts
// Uses shared api-client helpers so auth headers and base URL are consistent.
import { apiGet, apiPost, apiPut, apiDelete } from '../api-client'

// Supplier APIs
export const supplierApi = {
  create: (data: any) => apiPost('/procurement/suppliers', data),
  update: (id: number, data: any) => apiPut(`/procurement/suppliers/${id}`, data),
  getById: (id: number) => apiGet(`/procurement/suppliers/${id}`),
  // Backend expects storeId as query param on the base suppliers endpoint
  getByStore: (storeId: number) => apiGet(`/procurement/suppliers?storeId=${storeId}`),
  getActive: (storeId: number) => apiGet(`/procurement/suppliers/active?storeId=${storeId}`),
  search: (storeId: number, searchTerm: string) =>
    apiGet(`/procurement/suppliers/search?storeId=${storeId}&query=${encodeURIComponent(searchTerm)}`),
  delete: (id: number) => apiDelete(`/procurement/suppliers/${id}`),
}

// Purchase Order APIs
export const purchaseOrderApi = {
  create: (data: any) => apiPost('/procurement/purchase-orders', data),
  addItems: (poId: number, items: any) => apiPost(`/procurement/purchase-orders/${poId}/items`, items),
  update: (id: number, data: any) => apiPut(`/procurement/purchase-orders/${id}`, data),
  getById: (id: number) => apiGet(`/procurement/purchase-orders/${id}`),
  getByStore: (storeId: number) => apiGet(`/procurement/purchase-orders/store/${storeId}`),
  getByStatus: (storeId: number, status: string) =>
    apiGet(`/procurement/purchase-orders/store/${storeId}/status/${encodeURIComponent(status)}`),
  getByDateRange: (storeId: number, startDate: string, endDate: string) =>
    apiGet(`/procurement/purchase-orders/store/${storeId}/delivery-date?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),
  submit: (id: number) => apiPut(`/procurement/purchase-orders/${id}/submit`, {}),
  confirm: (id: number) => apiPut(`/procurement/purchase-orders/${id}/confirm`, {}),
  delete: (id: number) => apiDelete(`/procurement/purchase-orders/${id}`),
}

// Goods Receipt APIs
export const goodsReceiptApi = {
  create: (purchaseOrderId: number, storeId: number) =>
    apiPost(`/procurement/goods-receipts?purchaseOrderId=${purchaseOrderId}&storeId=${storeId}`, {}),
  addItems: (grnId: number, items: any) => apiPost(`/procurement/goods-receipts/${grnId}/items`, items),
  qualityCheck: (grnId: number, qcData: any) => apiPost(`/procurement/goods-receipts/${grnId}/quality-check`, qcData),
  confirm: (grnId: number, receivedBy: string) =>
    apiPost(`/procurement/goods-receipts/${grnId}/confirm?receivedBy=${encodeURIComponent(receivedBy)}`, {}),
  getById: (id: number) => apiGet(`/procurement/goods-receipts/${id}`),
  getByStore: (storeId: number) => apiGet(`/procurement/goods-receipts/store/${storeId}`),
  getByStatus: (storeId: number, status: string) =>
    apiGet(`/procurement/goods-receipts/store/${storeId}/status/${encodeURIComponent(status)}`),
  getByDateRange: (storeId: number, startDate: string, endDate: string) =>
    apiGet(`/procurement/goods-receipts/store/${storeId}/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),
  getByPurchaseOrder: (poId: number) => apiGet(`/procurement/goods-receipts/purchase-order/${poId}`),
  update: (id: number, data: any) => apiPut(`/procurement/goods-receipts/${id}`, data),
  delete: (id: number) => apiDelete(`/procurement/goods-receipts/${id}`),
}
