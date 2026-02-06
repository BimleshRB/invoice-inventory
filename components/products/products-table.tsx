"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, Category } from "@/lib/types"
import Link from "next/link"
import { MoreHorizontal, Pencil, Trash2, Search, Package, History, Loader2 } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { API_BASE } from "@/lib/api-client"
import { useProductStock } from "@/hooks/use-product-stock"

interface ProductsTableProps {
  products: Product[]
  categories: Category[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onViewPriceHistory?: (product: Product) => void
}

// Component to display a single product row with ledger-based stock
function ProductRow({ product, categories, onEdit, onDelete, onViewPriceHistory }: {
  product: Product
  categories: Category[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onViewPriceHistory?: (product: Product) => void
}) {
  const { currentStock, loading } = useProductStock(product.id)

  return (
    <TableRow key={product.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted flex-shrink-0">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="min-w-0">
              <Link
                href={`/dashboard/products/${product.id}`}
                className="font-medium text-foreground truncate hover:underline"
              >
                {product.name}
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">{product.unit}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {categories.find((c) => c.id === product.categoryId)?.name || "---"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin inline-block" />
        ) : (
          <>
            <span
              className={cn(
                "font-medium",
                currentStock <= product.minStockLevel
                  ? "text-destructive"
                  : "text-foreground",
              )}
            >
              {currentStock}
            </span>
            <span className="text-muted-foreground"> / {product.minStockLevel}</span>
          </>
        )}
      </TableCell>
      <TableCell className="text-right text-sm text-muted-foreground">
        {product.reservedQuantity ?? 0}
      </TableCell>
      <TableCell>
        {loading ? (
          <Badge variant="outline">Loading...</Badge>
        ) : currentStock <= 0 ? (
          <Badge variant="destructive">Out of Stock</Badge>
        ) : currentStock <= product.minStockLevel ? (
          <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
        ) : (
          <Badge className="bg-success text-success-foreground">In Stock</Badge>
        )}
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
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {onViewPriceHistory ? (
              <DropdownMenuItem onClick={() => onViewPriceHistory(product)}>
                <History className="mr-2 h-4 w-4" />
                Price History
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(product)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

export function ProductsTable({ products, categories, onEdit, onDelete, onViewPriceHistory }: ProductsTableProps) {
  const [search, setSearch] = useState("")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Product</TableHead>
              <TableHead className="min-w-[100px]">SKU</TableHead>
              <TableHead className="min-w-[100px]">Category</TableHead>
              <TableHead className="text-right min-w-[80px]">Available</TableHead>
              <TableHead className="text-right min-w-[80px]">Reserved</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  categories={categories}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewPriceHistory={onViewPriceHistory}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
