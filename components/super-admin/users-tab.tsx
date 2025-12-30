"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Trash2, X } from "lucide-react"

interface ConfirmDialog {
  isOpen: boolean
  userId: number
  userName: string
  action: "delete" | "activate" | "deactivate"
}

interface FilterState {
  email: string
  fullName: string
  role: string
  status: string
}

export default function UsersTab() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    email: "",
    fullName: "",
    role: "",
    status: "",
  })
  const [deleteConfirm, setDeleteConfirm] = useState<ConfirmDialog>({
    isOpen: false,
    userId: 0,
    userName: "",
    action: "delete",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, filters])

  const applyFilters = () => {
    let filtered = users.filter((user) => {
      const emailMatch = user.username.toLowerCase().includes(filters.email.toLowerCase())
      const nameMatch = (user.fullName || "").toLowerCase().includes(filters.fullName.toLowerCase())
      const roleMatch = filters.role === "" || user.role === filters.role
      const statusMatch = filters.status === "" || (user.enabled && filters.status === "active") || (!user.enabled && filters.status === "inactive")
      
      return emailMatch && nameMatch && roleMatch && statusMatch
    })
    setFilteredUsers(filtered)
  }

  const clearFilters = () => {
    setFilters({
      email: "",
      fullName: "",
      role: "",
      status: "",
    })
  }

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/super-admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data || [])
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/super-admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "User role updated successfully" })
        fetchUsers()
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/super-admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast({ title: "Success", description: "User deleted successfully" })
        setDeleteConfirm({ isOpen: false, userId: 0, userName: "", action: "delete" })
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (userId: number, newStatus: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/super-admin/users/${userId}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.data.enabled ? "User activated successfully" : "User deactivated successfully",
        })
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: "Failed to change user status",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to change user status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Registered Users</h2>
        <p className="text-gray-600 mt-1">Manage all registered users and their roles</p>
      </div>

      {/* Filters Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {(filters.email || filters.fullName || filters.role || filters.status) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
            <Input
              placeholder="Search by email..."
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Full Name</label>
            <Input
              placeholder="Search by name..."
              value={filters.fullName}
              onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            >
              <option value="">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="STORE_ADMIN">Store Admin</option>
              <option value="USER">User</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Found: <strong>{filteredUsers.length}</strong> {filteredUsers.length === 1 ? "user" : "users"}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No users found</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No users match your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Full Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Change Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{user.username}</td>
                  <td className="py-3 px-4 text-gray-900">{user.fullName || "N/A"}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={user.enabled ? "active" : "inactive"}
                      onChange={(e) => {
                        if ((e.target.value === "active" && !user.enabled) || (e.target.value === "inactive" && user.enabled)) {
                          handleStatusChange(user.id, e.target.value === "active")
                        }
                      }}
                      className={`px-3 py-1 rounded text-sm font-medium border-0 cursor-pointer ${
                        user.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      defaultValue={user.role}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Select role</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="STORE_OWNER">Store Owner</option>
                      <option value="STORE_ADMIN">Store Admin</option>
                      <option value="USER">User</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          userId: user.id,
                          userName: user.username,
                          action: "delete",
                        })
                      }
                      className="text-red-600 hover:text-red-700"
                      title="Permanently delete user"
                    >
                      <Trash2 className="w-4 h-4" />
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete <strong>{deleteConfirm.userName}</strong>? This action cannot be undone. This user will be completely removed from the system.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: false,
                      userId: 0,
                      userName: "",
                      action: "delete",
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteConfirm.userId)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
