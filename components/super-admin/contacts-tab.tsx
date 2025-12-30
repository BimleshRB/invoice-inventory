"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Edit2, Trash2, Plus } from "lucide-react"
import { API_BASE } from "@/lib/api-client"

export default function ContactsTab() {
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [admins, setAdmins] = useState([])
  const [formData, setFormData] = useState({
    status: "",
    priority: "",
    assignedToId: "",
    notes: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchContacts()
    fetchAdmins()
  }, [statusFilter, categoryFilter])

  const fetchContacts = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const url = new URL(`${API_BASE}/super-admin/contacts`)
      if (statusFilter && statusFilter !== "all") url.searchParams.append("status", statusFilter)
      if (categoryFilter && categoryFilter !== "all") url.searchParams.append("category", categoryFilter)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setContacts(data.data || [])
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/super-admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch admins")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.status || !formData.priority) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const updateData = {
        status: formData.status,
        priority: parseInt(formData.priority),
        notes: formData.notes,
        ...(formData.assignedToId && { assignedToId: parseInt(formData.assignedToId) }),
      }

      const response = await fetch(
        `${API_BASE}/super-admin/contacts/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      )

      if (response.ok) {
        toast({ title: "Success", description: "Contact updated successfully" })
        setIsOpen(false)
        resetForm()
        fetchContacts()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to update contact",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (contact) => {
    setEditingId(contact.id)
    setFormData({
      status: contact.status,
      priority: contact.priority?.toString() || "",
      assignedToId: contact.assignedToId?.toString() || "",
      notes: contact.notes || "",
    })
    setIsOpen(true)
  }

  const handleDelete = async (contactId: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${API_BASE}/super-admin/contacts/${contactId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        toast({ title: "Success", description: "Contact deleted successfully" })
        fetchContacts()
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      status: "",
      priority: "",
      assignedToId: "",
      notes: "",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      NEW: "bg-blue-100 text-blue-800",
      OPEN: "bg-green-100 text-green-800",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800",
      RESOLVED: "bg-purple-100 text-purple-800",
      CLOSED: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadgeColor = (priority: number) => {
    if (priority >= 5) return "bg-red-100 text-red-800"
    if (priority >= 4) return "bg-orange-100 text-orange-800"
    if (priority >= 3) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
          <p className="text-gray-600 mt-1">Manage customer inquiries and support tickets</p>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="GENERAL">General</SelectItem>
            <SelectItem value="SUPPORT">Support</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
            <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
            <SelectItem value="BUG_REPORT">Bug Report</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No contacts found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Assigned To</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{contact.name}</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{contact.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{contact.category}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                        contact.status
                      )}`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeColor(
                        contact.priority
                      )}`}
                    >
                      P{contact.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {contact.assignedToName || "Unassigned"}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <Dialog open={isOpen && editingId === contact.id} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(contact)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Contact</DialogTitle>
                          <DialogDescription>Update the contact details and assignment</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="status">Status *</Label>
                            <Select
                              value={formData.status}
                              onValueChange={(value) =>
                                setFormData({ ...formData, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NEW">New</SelectItem>
                                <SelectItem value="OPEN">Open</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="priority">Priority (1-5) *</Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) =>
                                setFormData({ ...formData, priority: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Low</SelectItem>
                                <SelectItem value="2">2 - Low-Medium</SelectItem>
                                <SelectItem value="3">3 - Medium</SelectItem>
                                <SelectItem value="4">4 - High</SelectItem>
                                <SelectItem value="5">5 - Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="assignedTo">Assign To</Label>
                            <Select
                              value={formData.assignedToId}
                              onValueChange={(value) =>
                                setFormData({ ...formData, assignedToId: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select admin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {admins.map((admin) => (
                                  <SelectItem key={admin.id} value={admin.id.toString()}>
                                    {admin.fullName || admin.username}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                              id="notes"
                              placeholder="Add notes about this contact"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={4}
                              value={formData.notes}
                              onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                              }
                            />
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            Update Contact
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-700"
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
  )
}
