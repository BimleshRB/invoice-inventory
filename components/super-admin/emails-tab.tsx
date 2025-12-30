"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Mail, Eye } from "lucide-react"

export default function EmailsTab() {
  const [emails, setEmails] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEmail, setSelectedEmail] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchEmails()
  }, [typeFilter, statusFilter])

  const fetchEmails = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const url = new URL("http://localhost:8080/api/super-admin/emails")
      if (typeFilter && typeFilter !== "all") url.searchParams.append("type", typeFilter)
      if (statusFilter && statusFilter !== "all") url.searchParams.append("status", statusFilter)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setEmails(data.data || [])
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch emails",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (emailId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8080/api/super-admin/emails/${emailId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (response.ok) {
        toast({ title: "Success", description: "Email status updated" })
        fetchEmails()
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update email status",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: "bg-yellow-100 text-yellow-800",
      SENT: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      BOUNCED: "bg-orange-100 text-orange-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getTypeBadgeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      INVOICE: "bg-blue-100 text-blue-800",
      REMINDER: "bg-purple-100 text-purple-800",
      NOTIFICATION: "bg-indigo-100 text-indigo-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Emails</h2>
        <p className="text-gray-600 mt-1">Track all automated emails and their delivery status</p>
      </div>

      <div className="mb-6 flex gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="INVOICE">Invoice</SelectItem>
            <SelectItem value="REMINDER">Reminder</SelectItem>
            <SelectItem value="NOTIFICATION">Notification</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="BOUNCED">Bounced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : emails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No emails found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Recipient Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Sent Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr key={email.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 text-sm">{email.recipientEmail}</td>
                  <td className="py-3 px-4 text-gray-900 text-sm truncate max-w-xs">
                    {email.subject}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeColor(
                        email.type
                      )}`}
                    >
                      {email.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                        email.status
                      )}`}
                    >
                      {email.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {email.sentAt ? formatDate(email.sentAt) : "Not sent"}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      onChange={(e) => handleStatusUpdate(email.id, e.target.value)}
                      defaultValue={email.status}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Change status</option>
                      <option value="PENDING">Pending</option>
                      <option value="SENT">Sent</option>
                      <option value="FAILED">Failed</option>
                      <option value="BOUNCED">Bounced</option>
                    </select>
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
