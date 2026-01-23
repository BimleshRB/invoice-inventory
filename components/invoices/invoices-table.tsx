"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Invoice } from "@/lib/types"
import { MoreHorizontal, Eye, Download, Search, FileText, CheckCircle, Send, XCircle } from "lucide-react"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

interface InvoicesTableProps {
  invoices: Invoice[]
  onView: (invoice: Invoice) => void
  onStatusChange: (invoice: Invoice, status: Invoice["status"]) => void
  onDownload: (invoice: Invoice) => void
}

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground", icon: FileText },
  sent: { label: "Sent", className: "bg-primary/10 text-primary", icon: Send },
  paid: { label: "Paid", className: "bg-success text-success-foreground", icon: CheckCircle },
  overdue: { label: "Overdue", className: "bg-destructive text-destructive-foreground", icon: XCircle },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground line-through", icon: XCircle },
}

export function InvoicesTable({ invoices, onView, onStatusChange, onDownload }: InvoicesTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const safeFormatDate = (value: unknown) => {
    if (!value) return "-"
    try {
      const d = typeof value === "string" ? new Date(value) : (value as Date)
      if (isNaN(d.getTime())) return "-"
      return format(d, "MMM dd, yyyy")
    } catch {
      return "-"
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      (invoice.invoiceNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (invoice.customer?.name || "").toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    const matchesType = typeFilter === "all" || (invoice as any).type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="out">Outgoing</SelectItem>
              <SelectItem value="in">Intake</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-30">Invoice</TableHead>
              <TableHead className="min-w-[150px]">Customer</TableHead>
              <TableHead className="min-w-[90px]">Type</TableHead>
              <TableHead className="min-w-[100px]">Date</TableHead>
              <TableHead className="min-w-[100px]">Due Date</TableHead>
              <TableHead className="text-right min-w-[120px]">Amount</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No invoices found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => {
                const statusKey = (invoice.status && statusConfig[invoice.status]) ? invoice.status : "draft"
                const status = statusConfig[statusKey]
                return (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="font-mono font-medium text-foreground hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{invoice.customer?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{invoice.customer?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">{((invoice as any).type || 'out') === 'out' ? 'Outgoing' : 'Intake'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {safeFormatDate(invoice.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {safeFormatDate(invoice.dueDate)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.className}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(invoice)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDownload(invoice)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          {invoice.status === "draft" && (
                            <DropdownMenuItem onClick={() => onStatusChange(invoice, "sent")}>
                              <Send className="mr-2 h-4 w-4" />
                              Mark as Sent
                            </DropdownMenuItem>
                          )}
                          {(invoice.status === "sent" || invoice.status === "overdue") && (
                            <DropdownMenuItem onClick={() => onStatusChange(invoice, "paid")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {invoice.status !== "cancelled" && invoice.status !== "paid" && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onStatusChange(invoice, "cancelled")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Invoice
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
