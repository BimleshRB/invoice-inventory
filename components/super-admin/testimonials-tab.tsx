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
import { Star, Check, X } from "lucide-react"
import { API_BASE } from "@/lib/api-client"

export default function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchTestimonials()
  }, [statusFilter])

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const url = new URL(`${API_BASE}/super-admin/testimonials`)
      if (statusFilter && statusFilter !== "all") url.searchParams.append("status", statusFilter)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.data || [])
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (testimonialId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${API_BASE}/super-admin/testimonials/${testimonialId}/status`,
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
        toast({ title: "Success", description: "Testimonial status updated" })
        fetchTestimonials()
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update testimonial status",
        variant: "destructive",
      })
    }
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
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
        <p className="text-gray-600 mt-1">Review and manage customer testimonials</p>
      </div>

      <div className="mb-6 flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No testimonials found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.customerName}</h3>
                  <p className="text-sm text-gray-600">{testimonial.customerEmail}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                    testimonial.status
                  )}`}
                >
                  {testimonial.status}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-2">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-gray-600">
                  {testimonial.rating === 5 ? "Excellent" : testimonial.rating >= 4 ? "Great" : testimonial.rating >= 3 ? "Good" : "Fair"}
                </span>
              </div>

              <p className="text-gray-700 mb-4 text-sm">{testimonial.message}</p>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Submitted: {formatDate(testimonial.createdAt)}
                  {testimonial.approvedAt && (
                    <> • Approved: {formatDate(testimonial.approvedAt)}</>
                  )}
                </div>
                <div className="flex gap-2">
                  {testimonial.status !== "APPROVED" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleStatusUpdate(testimonial.id, "APPROVED")}
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  )}
                  {testimonial.status !== "REJECTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(testimonial.id, "REJECTED")}
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
