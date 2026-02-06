"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Trash2, X } from "lucide-react"
import { API_BASE } from "@/lib/api-client"

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
      const response = await fetch(`${API_BASE}/super-admin/users`, {
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
      // Optimistically update UI
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u)
      )

      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/super-admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "User role updated successfully" })
      } else {
        // Revert on error
        fetchUsers()
        toast({
          title: "Error",
          description: "Failed to update user role",
          variant: "destructive",
        })
      }
    } catch (err) {
      // Revert on error
      fetchUsers()
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
      const response = await fetch(`${API_BASE}/super-admin/users/${userId}`, {
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
      // Optimistically update UI
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === userId ? { ...u, enabled: newStatus } : u)
      )

      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/super-admin/users/${userId}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.data.enabled ? "User activated successfully" : "User deactivated successfully",
        })
      } else {
        // Revert on error
        fetchUsers()
        toast({
          title: "Error",
          description: "Failed to change user status",
          variant: "destructive",
        })
      }
    } catch (err) {
      // Revert on error
      fetchUsers()
      toast({
        title: "Error",
        description: "Failed to change user status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground">Registered Users</h2>
        <p className="text-muted-foreground mt-1">Manage all registered users and their roles</p>
      </div>

      {/* Filters Card */}
      <div className="rounded-xl border bg-card shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-lg">Filters</h3>
          {(filters.email || filters.fullName || filters.role || filters.status) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Email</label>
            <Input
              placeholder="Search by email..."
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Full Name</label>
            <Input
              placeholder="Search by name..."
              value={filters.fullName}
              onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded text-sm bg-background"
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
            <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded text-sm bg-background"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Found: <strong>{filteredUsers.length}</strong> {filteredUsers.length === 1 ? "user" : "users"}
        </p>
      </div>

      {/* Users Table Card */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No users found</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No users match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/80">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm uppercase tracking-wider">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm uppercase tracking-wider">Full Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm uppercase tracking-wider">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm uppercase tracking-wider">Change Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 text-foreground font-medium">{user.username}</td>
                    <td className="py-4 px-6 text-foreground">{user.fullName || "N/A"}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-semibold uppercase tracking-wide">
                        {user.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                  <td className="py-4 px-6">
                    <select
                      value={user.enabled ? "active" : "inactive"}
                      onChange={(e) => {
                        if ((e.target.value === "active" && !user.enabled) || (e.target.value === "inactive" && user.enabled)) {
                          handleStatusChange(user.id, e.target.value === "active")
                        }
                      }}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium border-0 cursor-pointer transition-colors ${
                        user.enabled
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      value={user.role}
                      className="px-3 py-2 border border-border rounded-md text-sm bg-background hover:bg-muted transition-colors cursor-pointer focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select role</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="STORE_OWNER">Store Owner</option>
                      <option value="STORE_ADMIN">Store Admin</option>
                      <option value="USER">User</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
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
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
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
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Delete User</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to permanently delete <strong className="text-foreground">{deleteConfirm.userName}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end pt-2">
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
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
