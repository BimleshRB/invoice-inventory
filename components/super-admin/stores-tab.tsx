"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function StoresTab() {
  const [stores, setStores] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    currency: "USD",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/super-admin/stores", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setStores(data.data || [])
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch stores",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Error",
        description: "Store name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const url = editingId 
        ? `http://localhost:8080/api/super-admin/stores/${editingId}`
        : "http://localhost:8080/api/super-admin/stores"
      
      const method = editingId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingId ? "Store updated successfully" : "Store created successfully",
        })
        setIsOpen(false)
        setFormData({ name: "", currency: "USD" })
        setEditingId(null)
        fetchStores()
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this store?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/super-admin/stores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast({ title: "Success", description: "Store deleted successfully" })
        fetchStores()
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete store",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (store: any) => {
    setFormData({ name: store.name, currency: store.currency || "USD" })
    setEditingId(store.id)
    setIsOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: "", currency: "USD" })
    setEditingId(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stores</h2>
          <p className="text-gray-600 mt-1">Manage all business stores in the system</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Store" : "Create New Store"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the store information" : "Create a new business store"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Store Name</Label>
                <Input
                  placeholder="My Store"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Input
                  placeholder="USD"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingId ? "Update Store" : "Create Store"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No stores yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Store Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Owner</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Owner Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Currency</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{store.name}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {store.ownerName ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {store.ownerName}
                        </span>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-900 text-sm">{store.ownerEmail || "N/A"}</td>
                    <td className="py-3 px-4 text-gray-900">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {store.currency}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{store.phone || "N/A"}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(store)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Edit store"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(store.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete store"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
