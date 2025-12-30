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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X } from "lucide-react"

export default function AdminsTab() {
  const [admins, setAdmins] = useState([])
  const [stores, setStores] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: 0,
    email: "",
  })
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    storeId: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchAdmins()
    fetchStores()
  }, [])

  const fetchAdmins = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/super-admin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.data || [])
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch admins",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/super-admin/stores", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setStores(data.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch stores")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.fullName) {
      toast({
        title: "Error",
        description: "Email, password, and full name are required",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const url = editingId
        ? `http://localhost:8080/api/super-admin/admins/${editingId}`
        : "http://localhost:8080/api/super-admin/admins"

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
          description: editingId ? "Admin updated successfully" : "Admin created successfully",
        })
        setIsOpen(false)
        setFormData({ email: "", password: "", fullName: "", storeId: "" })
        setEditingId(null)
        fetchAdmins()
      } else {
        const err = await response.json()
        toast({
          title: "Error",
          description: err.error || "Failed to save admin",
          variant: "destructive",
        })
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
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/super-admin/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast({ title: "Success", description: "Admin disabled successfully" })
        setDeleteConfirm({ isOpen: false, id: 0, email: "" })
        fetchAdmins()
      } else {
        toast({
          title: "Error",
          description: "Failed to disable admin",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to disable admin",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (adminId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/super-admin/users/${adminId}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.data.enabled ? "Admin enabled successfully" : "Admin disabled successfully",
        })
        fetchAdmins()
      } else {
        toast({
          title: "Error",
          description: "Failed to toggle admin status",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to toggle admin status",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (admin: any) => {
    setFormData({
      email: admin.username,
      password: "",
      fullName: admin.fullName,
      storeId: admin.storeId || "",
    })
    setEditingId(admin.id)
    setIsOpen(true)
  }

  const resetForm = () => {
    setFormData({ email: "", password: "", fullName: "", storeId: "" })
    setEditingId(null)
  }

  const getStoreInfo = (storeId: string) => {
    // System Admins don't have a specific store - they manage all stores
    if (!storeId || storeId === "" || storeId === "null") {
      return "All Stores"
    }
    const store = stores.find((s) => s.id === parseInt(storeId))
    return store?.name || "All Stores"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Admins</h2>
          <p className="text-gray-600 mt-1">Manage store administrators and system admins</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Admin" : "Create New Admin"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the admin information" : "Create a new system or store administrator"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!!editingId}
                />
              </div>

              {!editingId && (
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> System Admins have access to manage all stores in the system.
                </p>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingId ? "Update Admin" : "Create Admin"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No admins found. Create one to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Full Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Store</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{admin.username}</td>
                  <td className="py-3 px-4 text-gray-900">{admin.fullName}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {getStoreInfo(admin.storeId)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {admin.enabled ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                        <X className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(admin)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          id: admin.id,
                          email: admin.username,
                        })
                      }
                      className="text-red-600 hover:text-red-700"
                      title="Disable admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(admin.id)}
                      className={admin.enabled ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                      title={admin.enabled ? "Disable admin" : "Enable admin"}
                    >
                      {admin.enabled ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Disable Admin</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to disable <strong>{deleteConfirm.email}</strong>? This admin will no longer be able to access the system.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: false,
                      id: 0,
                      email: "",
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Disable Admin
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
