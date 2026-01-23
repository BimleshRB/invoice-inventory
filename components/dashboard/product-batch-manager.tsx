"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Trash2, Edit2, Plus, AlertTriangle } from "lucide-react"
import { API_BASE } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface ProductBatch {
  id: number
  batchNumber: string
  quantity: number
  expiryDate: string
  costPrice?: number
  createdAt: string
  daysUntilExpiry?: number
}

interface ProductBatchManagerProps {
  productId: number
  productName: string
  batchWarningDays?: number
  onBatchesUpdate?: () => void
}

export function ProductBatchManager({
  productId,
  productName,
  batchWarningDays = 30,
  onBatchesUpdate,
}: ProductBatchManagerProps) {
  const [batches, setBatches] = useState<ProductBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    batchNumber: "",
    quantity: 0,
    expiryDate: "",
    costPrice: 0,
  })

  useEffect(() => {
    fetchBatches()
  }, [productId])

  const fetchBatches = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/products/${productId}/batches`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setBatches(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load batches",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddBatch = async () => {
    if (!formData.batchNumber || !formData.expiryDate || formData.quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Batch number, expiry date, and quantity (> 0) are required",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const payload = {
        batchNumber: formData.batchNumber.trim(),
        quantity: Math.max(1, parseInt(formData.quantity.toString()) || 0),
        expiryDate: formData.expiryDate,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice.toString()) : null,
      }

      console.log("[BATCH ADD] Sending payload:", payload)

      const res = await fetch(`${API_BASE}/products/${productId}/batches`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const responseData = await res.json()
      console.log("[BATCH ADD] Response:", res.status, responseData)

      if (res.ok) {
        toast({
          title: "Success",
          description: `Batch "${formData.batchNumber}" added with ${formData.quantity} units`,
        })
        resetForm()
        setIsAddDialogOpen(false)
        fetchBatches()
        onBatchesUpdate?.()
      } else {
        toast({
          title: "Error",
          description: responseData.error || responseData.message || "Failed to add batch",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[BATCH ADD] Exception:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add batch",
        variant: "destructive",
      })
    }
  }

  const handleEditBatch = async () => {
    if (!selectedBatch) return

    if (!formData.expiryDate || formData.quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Expiry date and quantity (> 0) are required",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const payload = {
        batchNumber: formData.batchNumber,
        quantity: Math.max(1, parseInt(formData.quantity.toString()) || 0),
        expiryDate: formData.expiryDate,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice.toString()) : null,
      }

      console.log("[BATCH EDIT] Sending payload:", payload, "for batch ID:", selectedBatch.id)

      const res = await fetch(`${API_BASE}/products/batches/${selectedBatch.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const responseData = await res.json()
      console.log("[BATCH EDIT] Response:", res.status, responseData)

      if (res.ok) {
        toast({
          title: "Success",
          description: "Batch updated successfully",
        })
        resetForm()
        setIsEditDialogOpen(false)
        fetchBatches()
        onBatchesUpdate?.()
      } else {
        toast({
          title: "Error",
          description: responseData.error || responseData.message || "Failed to update batch",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[BATCH EDIT] Exception:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update batch",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBatch = async (batchId: number) => {
    if (!confirm("Are you sure you want to delete this batch? This action cannot be undone.")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/products/batches/${batchId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Batch deleted successfully",
        })
        fetchBatches()
        onBatchesUpdate?.()
      } else {
        const responseData = await res.json()
        toast({
          title: "Error",
          description: responseData.error || "Cannot delete batch (may have stock movements)",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[BATCH DELETE] Exception:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete batch",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (batch: ProductBatch) => {
    setSelectedBatch(batch)
    setFormData({
      batchNumber: batch.batchNumber,
      quantity: batch.quantity,
      expiryDate: batch.expiryDate,
      costPrice: batch.costPrice || 0,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      batchNumber: "",
      quantity: 0,
      expiryDate: "",
      costPrice: 0,
    })
    setSelectedBatch(null)
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  const isExpiring = (expiryDate: string) => {
    const today = new Date()
    const warningDate = new Date(today.setDate(today.getDate() + batchWarningDays))
    const expiry = new Date(expiryDate)
    return expiry <= warningDate && !isExpired(expiryDate)
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diff = expiry.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return <div className="text-center py-4">Loading batches...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Batches</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Batch
        </Button>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No batches yet. Add a batch to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Number</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => {
                const expired = isExpired(batch.expiryDate)
                const expiring = isExpiring(batch.expiryDate)
                const daysLeft = getDaysUntilExpiry(batch.expiryDate)

                return (
                  <TableRow key={batch.id} className={expired ? "bg-red-50 dark:bg-red-950" : ""}>
                    <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {batch.expiryDate}
                        {expired && (
                          <AlertCircle className="h-4 w-4 text-red-600" title="Expired" />
                        )}
                        {expiring && !expired && (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" title={`Expires in ${daysLeft} days`} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${batch.costPrice?.toFixed(2) || "N/A"}</TableCell>
                    <TableCell>
                      {expired && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Expired</span>}
                      {expiring && !expired && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Expiring in {daysLeft}d
                        </span>
                      )}
                      {!expired && !expiring && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(batch)}
                          className="gap-1"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBatch(batch.id)}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Batch Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Batch</DialogTitle>
            <DialogDescription>
              Add a new batch for {productName}. Products cannot be sold after the expiry date.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="batchNumber">Batch Number *</Label>
              <Input
                id="batchNumber"
                placeholder="e.g., LOT-2025-001"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="costPrice">Cost Price (Optional)</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBatch}>Add Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Batch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>
              Update batch details for {productName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="editBatchNumber">Batch Number</Label>
              <Input
                id="editBatchNumber"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                disabled
              />
            </div>

            <div>
              <Label htmlFor="editQuantity">Quantity</Label>
              <Input
                id="editQuantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="editExpiryDate">Expiry Date</Label>
              <Input
                id="editExpiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="editCostPrice">Cost Price</Label>
              <Input
                id="editCostPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBatch}>Update Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
