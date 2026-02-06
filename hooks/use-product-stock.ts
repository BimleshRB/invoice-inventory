/**
 * Hook to fetch product stock from ERP ledger API
 * NEVER use product.quantity - always use this hook instead
 */
import { useState, useEffect } from 'react'
import { erpApi } from '@/lib/api/erp'

export interface ProductStock {
  productId: number
  sku: string
  name: string
  currentStock: number
  unit: string
  batches: BatchStock[]
}

export interface BatchStock {
  batchId: number
  batchNumber: string
  expiryDate: string | null
  currentStock: number
  purchaseCost: number | null
  manufactureDate: string | null
}

export function useProductStock(productId: number | null | undefined) {
  const [stock, setStock] = useState<ProductStock | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productId) {
      setStock(null)
      setLoading(false)
      setError(null)
      return
    }

    const fetchStock = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await erpApi.products.getStock(productId)
        
        if (response.error) {
          setError(response.error)
          setStock(null)
        } else if (response.data) {
          setStock(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock')
        setStock(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStock()
  }, [productId])

  const refetch = async () => {
    if (!productId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await erpApi.products.getStock(productId)
      
      if (response.error) {
        setError(response.error)
        setStock(null)
      } else if (response.data) {
        setStock(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock')
      setStock(null)
    } finally {
      setLoading(false)
    }
  }

  return {
    stock,
    loading,
    error,
    refetch,
    currentStock: stock?.currentStock ?? 0,
    batches: stock?.batches ?? [],
  }
}
