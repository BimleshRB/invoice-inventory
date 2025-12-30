"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { adminApi } from "@/lib/api"
import type { User, UserRole, CurrentUserInfo } from "@/lib/types"
import { Shield, Trash2, Edit2, Plus } from "lucide-react"
import { API_BASE } from "@/lib/api-client"

interface StoreAdminsProps {
  storeId: string
}

export function StoreAdmins({ storeId }: StoreAdminsProps) {
  const [admins, setAdmins] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<UserRole | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [newAdminFullName, setNewAdminFullName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])  // Remove storeId dependency since we get it from userInfo

  const loadData = async () => {
    setLoading(true)
    try {
      const userInfo = await adminApi.getMyRole()
      console.log('[Store Admins] Current user info:', userInfo)
      setCurrentUser(userInfo)
      
      // Only load admins if user has a storeId
      if (userInfo.storeId) {
        console.log('[Store Admins] Loading admins for storeId:', userInfo.storeId)
        const adminsData = await adminApi.getStoreAdmins(userInfo.storeId.toString())
        console.log('[Store Admins] Loaded admins:', adminsData)
        setAdmins(adminsData)
      } else {
        console.log('[Store Admins] No storeId found for user')
      }
    } catch (error: any) {
      console.error('[Store Admins] Error loading admins:', error)
      if (error.status !== 403) {
        toast({
          title: "Error",
          description: error.message || "Failed to load admins",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditRole = (admin: User) => {
    setSelectedAdmin(admin)
    setNewRole(admin.role)
    setEditDialogOpen(true)
  }

  const handleSaveRole = async () => {
    if (!selectedAdmin || !newRole) return

    try {
      const updated = await adminApi.assignRole(selectedAdmin.id, newRole)
      setAdmins(admins.map((a) => (a.id === updated.id ? updated : a)))
      setEditDialogOpen(false)
      toast({
        title: "Success",
        description: `${selectedAdmin.fullName} role updated to ${newRole}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      })
    }
  }

  const handleRemoveAdmin = async (admin: User) => {
    if (!confirm(`Remove admin role from ${admin.fullName}?`)) return

    try {
      const updated = await adminApi.removeAdminRole(admin.id)
      setAdmins(admins.filter((a) => a.id !== admin.id))
      toast({
        title: "Success",
        description: `${admin.fullName} has been demoted to regular user`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove admin role",
        variant: "destructive",
      })
    }
  }

  const handleCreateAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword || !newAdminFullName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/store/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newAdminEmail,
          password: newAdminPassword,
          fullName: newAdminFullName,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to create store admin")
      }

      const newAdmin = await res.json()
      await loadData()
      setCreateDialogOpen(false)
      setNewAdminEmail("")
      setNewAdminPassword("")
      setNewAdminFullName("")
      toast({
        title: "Success",
        description: `Store admin ${newAdminFullName} has been created`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create store admin",
        variant: "destructive",
      })
    }
  }

  // Only Store Owner or Store Admin can manage admins
  if (!currentUser || (!currentUser.isStoreOwner && !currentUser.isStoreAdmin)) {
    return null
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <div>
                <CardTitle>Store Admins</CardTitle>
                <CardDescription>
                  Admins created by the store owner to manage the store
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading admins...</p>
          ) : admins.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 px-6 py-8 text-center">
              <p className="text-sm text-muted-foreground">No admins assigned yet</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.fullName}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {admin.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {admin.role !== "STORE_OWNER" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditRole(admin)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveAdmin(admin)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Admin Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Store Admin</DialogTitle>
            <DialogDescription>
              Add a new admin to help manage your store
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={newAdminFullName}
                onChange={(e) => setNewAdminFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAdmin}>Create Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Admin Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedAdmin?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Role</label>
              <Select value={newRole || ""} onValueChange={(v) => setNewRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STORE_ADMIN">Store Admin</SelectItem>
                  <SelectItem value="USER">Regular User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
