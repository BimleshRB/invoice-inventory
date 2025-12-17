"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import { dataStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import type { Invoice, Product } from "@/lib/types"
import { Download, TrendingUp, Package, IndianRupee, ShoppingCart } from "lucide-react"
import { format, subDays } from "date-fns"

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [period, setPeriod] = useState("30")

  useEffect(() => {
    setInvoices(dataStore.getInvoices())
    setProducts(dataStore.getProducts())
  }, [])

  // Calculate metrics
  const paidInvoices = invoices.filter((i) => i.status === "paid")
  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0)
  const totalSales = invoices.length
  const avgOrderValue = totalSales > 0 ? totalRevenue / paidInvoices.length : 0
  const totalProducts = products.length
  const lowStockCount = products.filter((p) => p.quantity <= p.minStockLevel).length

  // Revenue by day (last 7 days)
  const revenueByDay = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dayInvoices = paidInvoices.filter(
      (inv) => format(new Date(inv.createdAt), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
    )
    return {
      date: format(date, "EEE"),
      revenue: dayInvoices.reduce((sum, inv) => sum + inv.total, 0),
    }
  })

  // Invoice status distribution
  const statusCounts = invoices.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }))

  // Top selling products
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      const product = item.product
      if (product) {
        if (!productSales[product.id]) {
          productSales[product.id] = { name: product.name, quantity: 0, revenue: 0 }
        }
        productSales[product.id].quantity += item.quantity
        productSales[product.id].revenue += item.total
      }
    })
  })

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const exportReport = () => {
    const report = `
INVENTORY & SALES REPORT
Generated: ${format(new Date(), "MMMM dd, yyyy")}

==================================
SUMMARY
==================================
Total Revenue: ${formatCurrency(totalRevenue)}
Total Sales: ${totalSales}
Average Order Value: ${formatCurrency(avgOrderValue)}
Total Products: ${totalProducts}
Low Stock Items: ${lowStockCount}

==================================
TOP SELLING PRODUCTS
==================================
${topProducts.map((p, i) => `${i + 1}. ${p.name} - ${p.quantity} units - ${formatCurrency(p.revenue)}`).join("\n")}

==================================
INVOICE STATUS BREAKDOWN
==================================
${Object.entries(statusCounts)
  .map(([status, count]) => `${status.toUpperCase()}: ${count}`)
  .join("\n")}
`
    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${format(new Date(), "yyyy-MM-dd")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col">
      <Header title="Reports & Analytics" description="View business insights and export reports" />
      <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards - Responsive grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From {paidInvoices.length} paid invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Average Order</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(avgOrderValue)}</div>
              <p className="text-xs text-muted-foreground">Per invoice</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">{lowStockCount} low stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{totalSales}</div>
              <p className="text-xs text-muted-foreground">{paidInvoices.length} paid</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts - Responsive grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Revenue Trend</CardTitle>
              <CardDescription>Daily revenue over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }}
                className="h-62.5 sm:h-75"
              >
                <BarChart data={revenueByDay}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `₹${value}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Invoice Status</CardTitle>
              <CardDescription>Distribution of invoice statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ value: { label: "Count" } }} className="h-62.5 sm:h-75">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Top Selling Products</CardTitle>
            <CardDescription>Products with highest sales revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No sales data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(product.revenue)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
