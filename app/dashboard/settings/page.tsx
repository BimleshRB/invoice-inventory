"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { StoreSettings } from "@/components/settings/store-settings"
import { CategorySettings } from "@/components/settings/category-settings"
import { dataStore } from "@/lib/store"
import type { Store, Category } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

type ProfileResponse = {
  username: string
  fullName?: string
  storeName?: string
  phone?: string
  address?: string
  taxId?: string
  currency?: string
  timezone?: string
  businessType?: string
  profileCompleted?: boolean
}

export default function SettingsPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Try to load profile from backend if token available; fallback to local dataStore
    const load = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const res = await fetch("http://localhost:8080/api/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const p: ProfileResponse = await res.json()
            const mapped: Store = {
              id: "store-1",
              name: p.storeName || dataStore.getStore().name,
              logo: dataStore.getStore().logo,
              address: p.address || dataStore.getStore().address,
              phone: p.phone || dataStore.getStore().phone,
              email: dataStore.getStore().email,
              taxId: p.taxId || dataStore.getStore().taxId,
              currency: p.currency || dataStore.getStore().currency,
              createdAt: dataStore.getStore().createdAt,
              updatedAt: new Date(),
            }
            setStore(mapped)
          } else {
            setStore(dataStore.getStore())
          }
        } catch (e) {
          setStore(dataStore.getStore())
        }
      } else {
        setStore(dataStore.getStore())
      }
      setCategories(dataStore.getCategories())
    }
    load()
  }, [])

  const handleSaveStore = async (data: Partial<Store>) => {
    const token = localStorage.getItem("token")
    if (!token) {
      // fallback to local store
      dataStore.updateStore(data)
      setStore(dataStore.getStore())
      toast({ title: "Settings Saved", description: "Your store settings have been updated." })
      return
    }
    // map Store -> ProfileRequest
    const payload: any = {
      fullName: (data as any).ownerName || undefined,
      storeName: data.name,
      phone: data.phone,
      address: data.address,
      taxId: data.taxId,
      currency: data.currency,
      timezone: (data as any).timezone || "UTC",
      businessType: (data as any).businessType || "",
    }
    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed to save profile", variant: "destructive" })
        return
      }
      // reflect saved changes locally
      const updated: Store = { ...dataStore.getStore(), ...data, updatedAt: new Date() }
      dataStore.updateStore(updated)
      setStore(dataStore.getStore())
      toast({ title: "Settings Saved", description: "Your store settings have been updated." })
    } catch (e) {
      toast({ title: "Network error", description: "Could not reach server", variant: "destructive" })
    }
  }

  const handleAddCategory = (data: { name: string; description: string }) => {
    dataStore.addCategory({ ...data, storeId: "store-1" })
    setCategories(dataStore.getCategories())
    toast({
      title: "Category Added",
      description: `${data.name} has been added.`,
    })
  }

  const handleDeleteCategory = (id: string) => {
    dataStore.deleteCategory(id)
    setCategories(dataStore.getCategories())
    toast({
      title: "Category Deleted",
      description: "Category has been removed.",
      variant: "destructive",
    })
  }

  if (!store) return null

  return (
    <div className="flex flex-col">
      <Header title="Settings" description="Manage your store settings and preferences" />
      <div className="flex-1 space-y-6 p-4 lg:p-6">
        <StoreSettings store={store} onSave={handleSaveStore} />
        <CategorySettings categories={categories} onAdd={handleAddCategory} onDelete={handleDeleteCategory} />
      </div>
      <Toaster />
    </div>
  )
}
