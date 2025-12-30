"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { BusinessInformation } from "@/components/settings/business-information"
import { PersonalInformation } from "@/components/settings/personal-information"
import { StoreAdmins } from "@/components/settings/store-admins"
import { CategorySettings } from "@/components/settings/category-settings"
import { dataStore } from "@/lib/store"
import type { Store, Category } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

type ProfileResponse = {
  username: string
  fullName?: string
  storeName?: string
  storeId?: number
  phone?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  website?: string
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
              id: p.storeId?.toString() || "store-1",
              name: p.storeName || dataStore.getStore().name,
              logo: dataStore.getStore().logo,
              address: p.address || dataStore.getStore().address,
              phone: p.phone || dataStore.getStore().phone,
              email: p.username || dataStore.getStore().email,
              taxId: p.taxId || dataStore.getStore().taxId,
              currency: p.currency || dataStore.getStore().currency,
              createdAt: dataStore.getStore().createdAt,
              updatedAt: new Date(),
            }
            // Store additional fields
            if (p.fullName) (mapped as any).ownerName = p.fullName
            if (p.city) (mapped as any).city = p.city
            if (p.state) (mapped as any).state = p.state
            if (p.postalCode) (mapped as any).postalCode = p.postalCode
            if (p.country) (mapped as any).country = p.country
            if (p.website) (mapped as any).website = p.website
            if (p.businessType) (mapped as any).businessType = p.businessType
            if (p.timezone) (mapped as any).timezone = p.timezone
            setStore(mapped)
            // Also update local dataStore to persist changes
            dataStore.updateStore(mapped)
          } else {
            setStore(dataStore.getStore())
          }
        } catch (e) {
          setStore(dataStore.getStore())
        }
      } else {
        setStore(dataStore.getStore())
      }
      
      // Load categories from backend
      try {
        const catRes = await fetch("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (catRes.ok) {
          const cats: Category[] = await catRes.json()
          setCategories(cats)
          // Update local store
          dataStore.setCategories(cats)
        } else {
          setCategories(dataStore.getCategories())
        }
      } catch (e) {
        console.error("Failed to load categories:", e)
        setCategories(dataStore.getCategories())
      }
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
      // Backend requires fullName; fall back to store/company name when ownerName is not provided
      fullName: (data as any).fullName || (data as any).ownerName || data.name || (store?.name ?? ""),
      storeName: data.name || (store?.name ?? ""),
      phone: data.phone || "",
      address: data.address || "",
      city: (data as any).city || "",
      state: (data as any).state || "",
      postalCode: (data as any).postalCode || "",
      country: (data as any).country || "india",
      website: (data as any).website || "",
      taxId: data.taxId || "",
      currency: data.currency || "INR",
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
        // Try to parse validation errors from Spring
        let description = "Failed to save profile"
        try {
          const err = await res.json()
          description = err.error || err.message || description
        } catch (_) {
          // ignore
        }
        toast({ title: "Error", description, variant: "destructive" })
        return
      }
      
      // Reload profile to get updated storeId and role (in case user was promoted to STORE_OWNER)
      try {
        const profileRes = await fetch("http://localhost:8080/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (profileRes.ok) {
          const p: ProfileResponse = await profileRes.json()
          const mapped: Store = {
            id: p.storeId?.toString() || "store-1",
            name: p.storeName || dataStore.getStore().name,
            logo: dataStore.getStore().logo,
            address: p.address || dataStore.getStore().address,
            phone: p.phone || dataStore.getStore().phone,
            email: p.username || dataStore.getStore().email,
            taxId: p.taxId || dataStore.getStore().taxId,
            currency: p.currency || dataStore.getStore().currency,
            createdAt: dataStore.getStore().createdAt,
            updatedAt: new Date(),
          }
          // Store additional fields
          if (p.fullName) (mapped as any).ownerName = p.fullName
          if (p.city) (mapped as any).city = p.city
          if (p.state) (mapped as any).state = p.state
          if (p.postalCode) (mapped as any).postalCode = p.postalCode
          if (p.country) (mapped as any).country = p.country
          if (p.website) (mapped as any).website = p.website
          if (p.businessType) (mapped as any).businessType = p.businessType
          if (p.timezone) (mapped as any).timezone = p.timezone
          setStore(mapped)
          dataStore.updateStore(mapped)
        }
      } catch (e) {
        console.error('Failed to reload profile:', e)
      }
      
      // reflect saved changes locally
      const updated: Store = { ...dataStore.getStore(), ...data, updatedAt: new Date() }
      dataStore.updateStore(updated)
      setStore(dataStore.getStore())
      toast({ 
        title: "Settings Saved", 
        description: "Your store settings have been updated. Please refresh the page to see all features.",
        duration: 5000
      })
    } catch (e) {
      toast({ title: "Network error", description: "Could not reach server", variant: "destructive" })
    }
  }

  const handleAddCategory = async (data: { name: string; description: string }) => {
    const token = localStorage.getItem("token")
    if (!token) {
      // Fallback to local store if no token
      dataStore.addCategory({ ...data, storeId: "store-1" })
      setCategories(dataStore.getCategories())
      toast({
        title: "Category Added",
        description: `${data.name} has been added.`,
      })
      return
    }

    try {
      const res = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        let description = "Failed to add category"
        try {
          const err = await res.json()
          description = err.error || err.message || description
        } catch (_) {
          //
        }
        toast({ title: "Error", description, variant: "destructive" })
        return
      }

      const newCategory: Category = await res.json()
      setCategories([...categories, newCategory])
      dataStore.addCategory(newCategory)
      toast({
        title: "Category Added",
        description: `${data.name} has been added.`,
      })
    } catch (e) {
      toast({ title: "Network error", description: "Could not reach server", variant: "destructive" })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      // Fallback to local store if no token
      dataStore.deleteCategory(id)
      setCategories(dataStore.getCategories())
      toast({
        title: "Category Deleted",
        description: "Category has been removed.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch(`http://localhost:8080/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        let description = "Failed to delete category"
        try {
          const err = await res.json()
          description = err.error || err.message || description
        } catch (_) {
          //
        }
        toast({ title: "Error", description, variant: "destructive" })
        return
      }

      setCategories(categories.filter((c) => c.id !== id))
      dataStore.deleteCategory(id)
      toast({
        title: "Category Deleted",
        description: "Category has been removed.",
        variant: "destructive",
      })
    } catch (e) {
      toast({ title: "Network error", description: "Could not reach server", variant: "destructive" })
    }
  }

  if (!store) return null

  return (
    <div className="flex flex-col">
      <Header title="Settings" description="Manage your store settings and preferences" />
      <div className="flex-1 space-y-6 p-4 lg:p-6">
        <BusinessInformation store={store} onSave={handleSaveStore} />
        <PersonalInformation store={store} onSave={handleSaveStore} />
        <StoreAdmins storeId={store.id} />
        <CategorySettings categories={categories} onAdd={handleAddCategory} onDelete={handleDeleteCategory} />
      </div>
      <Toaster />
    </div>
  )
}
