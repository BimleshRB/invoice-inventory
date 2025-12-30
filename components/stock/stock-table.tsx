"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StockMovement } from "@/lib/types"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw } from "lucide-react"
import { format } from "date-fns"

interface StockTableProps {
  movements: StockMovement[]
}

const typeConfig = {
  in: { label: "Stock In", className: "bg-success text-success-foreground", icon: ArrowUp },
  out: { label: "Stock Out", className: "bg-destructive text-destructive-foreground", icon: ArrowDown },
  adjustment: { label: "Adjustment", className: "bg-primary/10 text-primary", icon: RotateCcw },
}

export function StockTable({ movements }: StockTableProps) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.product?.name.toLowerCase().includes(search.toLowerCase()) ||
      movement.reason.toLowerCase().includes(search.toLowerCase())
    // Handle both 'type' (normalized) and 'movementType' (from backend) fields
    const movementType = movement.type || movement.movementType
    const matchesType = typeFilter === "all" || movementType === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="in">Stock In</SelectItem>
            <SelectItem value="out">Stock Out</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ArrowUpDown className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No stock movements found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements.map((movement) => {
                const movementType = movement.type || movement.movementType
                const type = typeConfig[movementType as keyof typeof typeConfig] || typeConfig.in
                const TypeIcon = type.icon
                return (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{movement.product?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{movement.product?.sku}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={type.className}>
                        <TypeIcon className="mr-1 h-3 w-3" />
                        {type.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          movementType === "in"
                            ? "text-success font-medium"
                            : movementType === "out"
                              ? "text-destructive font-medium"
                              : "text-foreground font-medium"
                        }
                      >
                        {movementType === "in" ? "+" : movementType === "out" ? "-" : ""}
                        {movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{movement.reason}</TableCell>
                    <TableCell>
                      {movement.referenceType && (
                        <Badge variant="outline" className="capitalize">
                          {movement.referenceType}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(movement.createdAt), "MMM dd, yyyy HH:mm")}
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
