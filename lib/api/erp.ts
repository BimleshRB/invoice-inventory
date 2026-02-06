import { apiClient } from "../api-client"

export const erpApi = {
  // Tax Management
  tax: {
    getCodes: (storeId?: number) => 
      apiClient.get(`/tax/codes${storeId ? `?storeId=${storeId}` : ""}`),
    
    createCode: (data: any) => 
      apiClient.post("/tax/codes", data),
    
    getGroups: (storeId?: number) => 
      apiClient.get(`/tax/groups${storeId ? `?storeId=${storeId}` : ""}`),
    
    createGroup: (data: any) => 
      apiClient.post("/tax/groups", data),
    
    addGroupComponent: (groupId: number, taxCodeId: number) =>
      apiClient.post(`/tax/groups/${groupId}/components`, { taxCodeId })
  },

  // Invoice ERP Flow
  invoices: {
    getAll: (storeId?: number, page = 0, size = 20) =>
      apiClient.get(`/invoices-erp?${storeId ? `storeId=${storeId}&` : ""}page=${page}&size=${size}`),
    
    getById: (id: number) =>
      apiClient.get(`/invoices-erp/${id}`),
    
    create: (invoice: any) =>
      apiClient.post("/invoices-erp", invoice),
    
    confirm: (id: number) =>
      apiClient.post(`/invoices-erp/${id}/confirm`),
    
    cancel: (id: number) =>
      apiClient.post(`/invoices-erp/${id}/cancel`),
    
    getNextNumber: () =>
      apiClient.get("/invoices-erp/next-number")
  },

  // Shipment
  shipments: {
    ship: (invoiceId: number) =>
      apiClient.post(`/shipments/invoice/${invoiceId}`)
  },

  // Goods Receipt
  goodsReceipts: {
    receive: (invoiceId: number) =>
      apiClient.post(`/goods-receipts-new/invoice/${invoiceId}`)
  },

  // Stock (Ledger-based)
  products: {
    getStock: (productId: number) =>
      apiClient.get(`/products/${productId}/stock`)
  }
}

export default erpApi
