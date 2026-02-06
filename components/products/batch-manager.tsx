"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Package,
  MoreHorizontal,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { API_BASE } from "@/lib/api-client"
import { formatCurrency } from "@/lib/utils"

interface ProductBatch {
  id: number
  batchNumber: string
  quantity: number
  expiryDate: string
  costPrice: number
  daysUntilExpiry?: number
  isExpired?: boolean
  isExpiring?: boolean
}

interface ProductBatchManagerProps {
  productId: number
  storeId: number
  onBatchesUpdated?: () => void
}

export function ProductBatchManager({
  productId,
  storeId,
  onBatchesUpdated,
}: ProductBatchManagerProps) {
  const [batches, setBatches] = useState<ProductBatch[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batchNumber: "",
    quantity: "",
    expiryDate: "",
    costPrice: "",
    sellingPrice: "",
  })

  useEffect(() => {
    loadBatches()
  }, [productId])

  const loadBatches = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/products/batches/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Calculate days until expiry
        const enrichedBatches = data.map((batch: ProductBatch) => {
          const today = new Date()
          const expiry = new Date(batch.expiryDate)
          const daysUntilExpiry = Math.ceil(
            (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          )
          return {
            ...batch,
            daysUntilExpiry,
            isExpired: daysUntilExpiry < 0,
            isExpiring: daysUntilExpiry > 0 && daysUntilExpiry <= 30,
          }
        })
        setBatches(enrichedBatches)
      }
    } catch (error) {
      console.error("Failed to load batches:", error)
    }
  }

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.batchNumber || !formData.quantity || !formData.expiryDate) {
      toast({
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/products/batches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
          batchNumber: formData.batchNumber,
          quantity: parseInt(formData.quantity),
          expiryDate: formData.expiryDate,
          costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
          sellingPrice: formData.sellingPrice ? parseFloat(formData.sellingPrice) : null,
        }),
      })

      if (response.ok) {
        toast({
          description: "Batch added successfully",
        })
        setFormData({ batchNumber: "", quantity: "", expiryDate: "", costPrice: "", sellingPrice: "" })
        setShowAddDialog(false)
        await loadBatches()
        onBatchesUpdated?.()
      } else {
        const error = await response.json()
        toast({
          description: error.error || "Failed to add batch",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        description: "Failed to add batch",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBatch = async (batchId: number) => {
    if (!confirm("Are you sure you want to delete this batch?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/products/batches/${batchId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          description: "Batch deleted successfully",
        })
        await loadBatches()
        onBatchesUpdated?.()
      } else {
        const error = await response.json()
        toast({
          description: error.error || "Failed to delete batch",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        description: "Failed to delete batch",
        variant: "destructive",
      })
    }
  }

  const expiredCount = batches.filter((b) => b.isExpired).length
  const expiringCount = batches.filter((b) => b.isExpiring).length
  const totalQuantity = batches
    .filter((b) => !b.isExpired)
    .reduce((sum, b) => sum + b.quantity, 0)

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 border rounded-lg">
          <p className="text-xs text-muted-foreground">Total Stock</p>
          <p className="text-2xl font-bold">{totalQuantity}</p>
        </div>
        <div className="p-3 border rounded-lg">
          <p className="text-xs text-muted-foreground">Batches</p>
          <p className="text-2xl font-bold">{batches.length}</p>
        </div>
        {expiringCount > 0 && (
          <div className="p-3 border rounded-lg bg-warning/10 border-warning">
            <p className="text-xs text-warning">Expiring Soon</p>
            <p className="text-2xl font-bold text-warning">{expiringCount}</p>
          </div>
        )}
        {expiredCount > 0 && (
          <div className="p-3 border rounded-lg bg-destructive/10 border-destructive">
            <p className="text-xs text-destructive">Expired</p>
            <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
          </div>
        )}
      </div>

      {/* Warnings */}
      {expiredCount > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {expiredCount} expired batch(es) found. These cannot be sold. Remove them to clean up inventory.
          </AlertDescription>
        </Alert>
      )}

      {expiringCount > 0 && (
        <Alert className="bg-warning/10 border-warning">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            {expiringCount} batch(es) expiring within 30 days. Consider prioritizing their sales.
          </AlertDescription>
        </Alert>
      )}

      {/* Add Batch Button */}
      <Button onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Add Batch
      </Button>

      {/* Batches Table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch #</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead className="text-right">Cost Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No batches added yet</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-mono text-sm">{batch.batchNumber}</TableCell>
                  <TableCell className="text-right font-medium">{batch.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(batch.expiryDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        batch.isExpired
                          ? "text-destructive"
                          : batch.isExpiring
                          ? "text-warning"
                          : "text-foreground"
                      }`}
                    >
                      {batch.daysUntilExpiry}d
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {batch.costPrice ? formatCurrency(batch.costPrice) : "---"}
                  </TableCell>
                  <TableCell>
                    {batch.isExpired ? (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    ) : batch.isExpiring ? (
                      <Badge className="bg-warning text-warning-foreground text-xs">
                        Expiring Soon
                      </Badge>
                    ) : (
                      <Badge className="bg-success text-success-foreground text-xs">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteBatch(batch.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Batch Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Batch</DialogTitle>
            <DialogDescription>
              Add a new batch/lot with specific expiry date and quantity
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddBatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Batch Number *</Label>
              <Input
                id="batchNumber"
                placeholder="e.g., LOT-2025-001"
                value={formData.batchNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, batchNumber: e.target.value }))
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Unique identifier for this batch/lot
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="e.g., 100"
                value={formData.quantity || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quantity: e.target.value ? parseInt(e.target.value) : "" }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Products cannot be sold after this date
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price (Optional)</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                placeholder="e.g., 10.50"
                value={formData.costPrice || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, costPrice: e.target.value ? parseFloat(e.target.value) : "" }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (Optional)</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                placeholder="e.g., 12.99"
                value={formData.sellingPrice || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sellingPrice: e.target.value ? parseFloat(e.target.value) : "" }))
                }
              />
              <p className="text-xs text-muted-foreground">
                If provided, this updates the product's current selling price.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Batch"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
