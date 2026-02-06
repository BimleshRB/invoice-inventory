"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Package, Calendar, DollarSign, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { API_BASE } from "@/lib/api-client"
import { format } from "date-fns"
import { Toaster } from "@/components/ui/toaster"
import { InventoryIntakeDialog } from "@/components/products/inventory-intake-dialog"

interface ProductBatch {
  id: string
  productId: string
  productName: string
  batchNumber: string
  purchaseCost: number
  sellingPrice?: number
  expiryDate: string
  createdAt: string
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<ProductBatch[]>([])
  const [filteredBatches, setFilteredBatches] = useState<ProductBatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [intakeOpen, setIntakeOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadBatches()
  }, [])

  useEffect(() => {
    filterAndSort()
  }, [batches, searchTerm, sortBy])

  const loadBatches = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login first",
          variant: "destructive",
        })
        return
      }

      const res = await fetch(`${API_BASE}/products/batches/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        const batchList = Array.isArray(data) ? data : data.content || data.data || []
        
        // Transform the data to our format
        const transformedBatches = batchList.map((batch: any) => ({
          id: batch.id,
          productId: batch.productId || batch.product?.id,
          productName: batch.product?.name || batch.productName || "Unknown",
          batchNumber: batch.batchNumber,
          purchaseCost: batch.purchaseCost || 0,
          sellingPrice: batch.product?.sellingPrice || batch.sellingPrice || 0,
          expiryDate: batch.expiryDate,
          createdAt: batch.createdAt,
        }))
        
        setBatches(transformedBatches)
      } else {
        toast({
          title: "Failed to load batches",
          description: "Could not fetch product batches",
          variant: "destructive",
        })
        setBatches([])
      }
    } catch (error) {
      console.error("Failed to load batches:", error)
      toast({
        title: "Error",
        description: "Failed to load batches",
        variant: "destructive",
      })
      setBatches([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSort = () => {
    let filtered = batches

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (batch) =>
          batch.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    if (sortBy === "expiry-soon") {
      filtered.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    } else if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredBatches(filtered)
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
  }

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    return expiry < today
  }

  const getTotalCost = () => {
    return filteredBatches.reduce((sum, batch) => sum + batch.purchaseCost, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Product Batches" description="Manage inventory batches and track expiry dates" />

      <div className="container mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Batches</p>
                <p className="text-3xl font-bold">{filteredBatches.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Expiring Soon
                </p>
                <p className="text-3xl font-bold">
                  {filteredBatches.filter((b) => isExpiringSoon(b.expiryDate)).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Expired
                </p>
                <p className="text-3xl font-bold">
                  {filteredBatches.filter((b) => isExpired(b.expiryDate)).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">Batch Inventory</CardTitle>
                <p className="text-sm text-muted-foreground">View and manage all product batches</p>
              </div>
              <Button onClick={() => setIntakeOpen(true)} className="gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                New Intake
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 mt-6 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or batch number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="expiry-soon">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Loading batches...</p>
              </div>
            ) : filteredBatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm font-medium text-muted-foreground mb-4">No batches found</p>
                <Button onClick={() => setIntakeOpen(true)} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Batch
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Batch Number</TableHead>
                      <TableHead className="text-right">Purchase Cost</TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="text-right">Added On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          <Link href={`/dashboard/batches/${encodeURIComponent(batch.batchNumber)}`} className="hover:underline">
                            {batch.batchNumber}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(batch.purchaseCost)}</TableCell>
                        <TableCell>
                          {isExpired(batch.expiryDate) ? (
                            <Badge variant="destructive" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              Expired
                            </Badge>
                          ) : isExpiringSoon(batch.expiryDate) ? (
                            <Badge variant="secondary" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              Expiring Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {format(new Date(batch.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventory Intake Dialog */}
      <InventoryIntakeDialog open={intakeOpen} onOpenChange={setIntakeOpen} categories={[]} onSuccess={loadBatches} />

      <Toaster />
    </div>
  )
}
