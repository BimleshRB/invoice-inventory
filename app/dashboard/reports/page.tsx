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
import { dashboardApi } from "@/lib/api-client"
import { formatCurrency } from "@/lib/utils"
import { Download, TrendingUp, Package, IndianRupee, ShoppingCart } from "lucide-react"
import { format } from "date-fns"

interface DashboardStats {
  totalInvoices: number
  totalRevenue: number | string
  paidInvoices: number
  avgOrderValue: number | string
  totalProducts: number
  lowStockCount: number
}

interface TopProduct {
  name: string
  quantity: number
  revenue: number | string
}

interface SalesChartData {
  name: string
  sales: number | string
}

interface RecentActivity {
  id: string | number
  type: string
  description: string
  amount: number | string
  status: string
  createdAt: string
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [chartData, setChartData] = useState<SalesChartData[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [period, setPeriod] = useState("month")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsRes, productsRes, chartRes, activityRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getTopProducts(),
          dashboardApi.getSalesChartData(period),
          dashboardApi.getRecentActivity(0, 10),
        ])

        setStats(statsRes)
        // Ensure all responses are arrays
        setTopProducts(Array.isArray(productsRes) ? productsRes : [])
        setChartData(Array.isArray(chartRes) ? chartRes : [])
        setRecentActivity(Array.isArray(activityRes) ? activityRes : [])
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // Reset to empty arrays on error
        setStats(null)
        setTopProducts([])
        setChartData([])
        setRecentActivity([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [period])

  // Safe numeric conversion
  const totalRevenue = typeof stats?.totalRevenue === "string"
    ? parseFloat(stats.totalRevenue)
    : stats?.totalRevenue || 0
  const avgOrderValue = typeof stats?.avgOrderValue === "string"
    ? parseFloat(stats.avgOrderValue)
    : stats?.avgOrderValue || 0

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
Total Invoices: ${stats?.totalInvoices || 0}
Paid Invoices: ${stats?.paidInvoices || 0}
Average Order Value: ${formatCurrency(avgOrderValue)}
Total Products: ${stats?.totalProducts || 0}
Low Stock Items: ${stats?.lowStockCount || 0}

==================================
TOP SELLING PRODUCTS
==================================
${topProducts.map((p, i) => {
  const revenue = typeof p.revenue === "string" ? parseFloat(p.revenue) : p.revenue
  return `${i + 1}. ${p.name} - ${p.quantity} units - ${formatCurrency(revenue)}`
}).join("\n")}

==================================
RECENT ACTIVITY
==================================
${recentActivity.map((a) => `${a.createdAt}: ${a.description} - ${a.status}`).join("\n")}
    `.trim()

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
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} disabled={loading}>
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
              <p className="text-xs text-muted-foreground">From {stats?.paidInvoices || 0} paid invoices</p>
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
              <div className="text-lg sm:text-2xl font-bold text-foreground">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.lowStockCount || 0} low stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{stats?.totalInvoices || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.paidInvoices || 0} paid</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts - Responsive grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Sales Trend</CardTitle>
              <CardDescription>Revenue trend ({period})</CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(chartData) && chartData.length > 0 ? (
                <ChartContainer
                  config={{ sales: { label: "Sales", color: "hsl(var(--primary))" } }}
                  className="h-72"
                >
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Top Products</CardTitle>
              <CardDescription>By revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(topProducts) && topProducts.length > 0 ? (
                  topProducts.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{product.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{product.quantity || 0} units sold</p>
                      </div>
                      <p className="font-bold text-sm">
                        {formatCurrency(typeof product.revenue === "string" ? parseFloat(product.revenue) : product.revenue || 0)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No product data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Description</TableHead>
                    <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(recentActivity) && recentActivity.length > 0 ? (
                    recentActivity.slice(0, 10).map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs sm:text-sm">{activity.description || 'N/A'}</TableCell>
                        <TableCell className="text-xs sm:text-sm font-medium">
                          {formatCurrency(typeof activity.amount === "string" ? parseFloat(activity.amount) : activity.amount || 0)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <Badge variant={activity.status === "paid" ? "default" : "secondary"}>
                            {activity.status || 'unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{format(new Date(activity.createdAt), "MMM dd, yyyy")}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-xs sm:text-sm text-muted-foreground py-4">
                        No activity records available
                      </TableCell>
                    </TableRow>
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
