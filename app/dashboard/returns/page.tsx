"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { returnsApi } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Loader2,
  TrendingDown,
  Package
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useStoreContext } from "@/context/store-context"
import { Toaster } from "@/components/ui/toaster"
import type { InvoiceReturn } from "@/lib/types"
import { format } from "date-fns"

export default function ReturnsPage() {
  const [returns, setReturns] = useState<InvoiceReturn[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { storeId, loading: storeLoading } = useStoreContext()
  const { toast } = useToast()

  useEffect(() => {
    if (storeLoading) return
    loadData()
  }, [statusFilter, typeFilter, storeId, storeLoading])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load returns
      const res = await returnsApi.list({
        page: 0,
        size: 100,
        status: statusFilter !== "all" ? statusFilter : undefined,
        returnType: typeFilter !== "all" ? typeFilter : undefined,
        storeId: storeId ? String(storeId) : undefined,
      })

      if (res.error) {
        toast({
          title: "Failed to load returns",
          description: res.error,
          variant: "destructive",
        })
        setReturns([])
      } else {
        setReturns(res.data?.content || [])
      }

      // Load summary
      const summaryRes = await returnsApi.getSummary()
      if (!summaryRes.error) {
        setSummary(summaryRes.data)
      }
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Unable to load returns data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (returnId: string | number) => {
    try {
      const res = await returnsApi.approve(returnId)
      if (res.error) {
        toast({
          title: "Failed to approve return",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Return approved",
          description: "Return has been approved successfully.",
        })
        await loadData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to approve return",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (returnId: string | number) => {
    const reason = prompt("Enter rejection reason:")
    if (!reason) return

    try {
      const res = await returnsApi.reject(returnId, reason)
      if (res.error) {
        toast({
          title: "Failed to reject return",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Return rejected",
          description: "Return has been rejected.",
        })
        await loadData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to reject return",
        variant: "destructive",
      })
    }
  }

  const handleComplete = async (returnId: string | number) => {
    try {
      const res = await returnsApi.complete(returnId)
      if (res.error) {
        toast({
          title: "Failed to complete return",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Return completed",
          description: "Return has been completed successfully.",
        })
        await loadData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to complete return",
        variant: "destructive",
      })
    }
  }

  const filteredReturns = returns.filter((r) => {
    const matchesSearch =
      r.returnNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.originalInvoice?.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "APPROVED":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "SALE_RETURN" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-purple-100 text-purple-800"
  }

  return (
    <div className="flex flex-col">
      <Header title="Invoice Returns" description="Manage customer and supplier returns" />
      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* Pending Returns */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-yellow-500" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{summary?.pending || 0}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approved Returns */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{summary?.approved || 0}</div>
                  <p className="text-xs text-muted-foreground">Awaiting processing</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Returns */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Package className="h-4 w-4 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{summary?.completed || 0}</div>
                  <p className="text-xs text-muted-foreground">Processed</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Refund Amount */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Total Refunds
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    ₹{(summary?.totalRefundAmount || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">Total value</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-card p-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search return number or invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="SALE_RETURN">Sale Return</SelectItem>
                <SelectItem value="PURCHASE_RETURN">Purchase Return</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Returns Table */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return #</TableHead>
                <TableHead>Original Invoice</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Refund Amount</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : filteredReturns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No returns found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReturns.map((ret) => (
                  <TableRow key={ret.id}>
                    <TableCell className="font-medium">{ret.returnNumber}</TableCell>
                    <TableCell>{ret.originalInvoice?.invoiceNumber || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeColor(ret.returnType)}>
                        {ret.returnType === "SALE_RETURN" ? "Customer Return" : "Supplier Return"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ret.status)}>
                        {ret.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{(ret.totalAmount || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {ret.totalQuantity || 0}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {ret.createdAt ? format(new Date(ret.createdAt), "MMM dd, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="space-x-1">
                      {ret.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleApprove(ret.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-red-600"
                            onClick={() => handleReject(ret.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {ret.status === "APPROVED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleComplete(ret.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
