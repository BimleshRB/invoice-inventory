"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { TopProducts } from "@/components/dashboard/top-products"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  AlertTriangle,
  Clock,
  IndianRupee,
  FileText,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react"
import { dashboardApi, profileApi } from "@/lib/api-client"
import { dataStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { useAuthGuard, getAuthUser } from "@/hooks/use-auth-guard"
import type { ActivityLog } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  useAuthGuard()

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    totalRevenueChange: 0,
    inventoryValue: 0,
    averageProductPrice: 0,
    paidInvoices: 0,
    avgOrderValue: 0,
  })
  const [topProducts, setTopProducts] = useState([])
  const [salesData, setSalesData] = useState<{ date: string; amount: number }[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [storeInfo, setStoreInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('[Dashboard] useEffect triggered')
    // Check if user is admin/super admin and redirect to admin dashboard
    const authUser = getAuthUser()
    console.log('[Dashboard] authUser:', authUser)
    if (authUser && (authUser.isAdmin || authUser.isSuperAdmin)) {
      console.log('[Dashboard] Redirecting to admin dashboard')
      router.push("/dashboard/admin")
      return
    }
    console.log('[Dashboard] Calling loadDashboardData()')
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    console.log('[Dashboard] Starting to load dashboard data...')
    console.log('[Dashboard] API_BASE from api-client:', 'http://localhost:8080/api')
    try {
      // Load stats
      console.log('[Dashboard] Fetching stats...')
      const statsRes = await dashboardApi.getStats()
      console.log('[Dashboard] Stats response FULL:', statsRes)
      console.log('[Dashboard] Stats response.data:', statsRes.data)
      console.log('[Dashboard] Stats response.error:', statsRes.error)
      console.log('[Dashboard] Stats response.status:', statsRes.status)
      
      const statsData = statsRes.data || {}
      console.log('[Dashboard] Stats data after default:', statsData)
      console.log('[Dashboard] Stats data.totalProducts:', statsData.totalProducts)
      console.log('[Dashboard] Type of totalProducts:', typeof statsData.totalProducts)
      
      const newStats = {
        totalProducts: Number(statsData.totalProducts || 0),
        lowStockProducts: Number(statsData.lowStockProducts || 0),
        totalInvoices: Number(statsData.totalInvoices || 0),
        totalRevenue: typeof statsData.totalRevenue === "string" ? parseFloat(statsData.totalRevenue) : Number(statsData.totalRevenue || 0),
        totalRevenueChange: typeof statsData.totalRevenueChange === "string" ? parseFloat(statsData.totalRevenueChange) : Number(statsData.totalRevenueChange || 0),
        inventoryValue: typeof statsData.inventoryValue === "string" ? parseFloat(statsData.inventoryValue) : Number(statsData.inventoryValue || 0),
        averageProductPrice: typeof statsData.averageProductPrice === "string" ? parseFloat(statsData.averageProductPrice) : Number(statsData.averageProductPrice || 0),
        paidInvoices: Number(statsData.paidInvoices || 0),
        avgOrderValue: typeof statsData.avgOrderValue === "string" ? parseFloat(statsData.avgOrderValue) : Number(statsData.avgOrderValue || 0),
      }
      console.log('[Dashboard] New stats object:', newStats)
      setStats(newStats)
      console.log('[Dashboard] Stats set successfully')

      // Load top products
      const topRes = await dashboardApi.getTopProducts()
      if (!topRes.error && Array.isArray(topRes.data)) {
        setTopProducts(topRes.data)
      }

      // Load sales chart data
      const salesRes = await dashboardApi.getSalesChartData("month")
      if (!salesRes.error && Array.isArray(salesRes.data)) {
        const mappedSales = salesRes.data.map((entry: any) => ({
          date: entry.name,
          amount: typeof entry.sales === "string" ? parseFloat(entry.sales) : Number(entry.sales || 0),
        }))
        setSalesData(mappedSales)
      }

      // Load recent activity
      const activityRes = await dashboardApi.getRecentActivity(0, 5)
      if (!activityRes.error && Array.isArray(activityRes.data)) {
        const mappedActivities = activityRes.data.map((item: any) => ({
          id: item.id?.toString() || crypto.randomUUID(),
          action: item.description || "Activity",
          entityType: item.type || "invoice",
          entityId: item.id?.toString() || "",
          details: item.status ? `${item.description || ""} - ${item.status}` : item.description || "",
          storeId: "",
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        }))
        setActivities(mappedActivities as ActivityLog[])
      }

      // Load store info
      const storeRes = await profileApi.getMe()
      if (!storeRes.error && storeRes.data) {
        setStoreInfo(storeRes.data)
      }
    } catch (error) {
      console.error("[Dashboard] Failed to load dashboard data:", error)
      console.error("[Dashboard] Error details:", error instanceof Error ? error.message : String(error))
      // Fallback to dataStore if API fails
      setStoreInfo(dataStore.getStore())
      setActivities(dataStore.getActivityLogs())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" description="Overview of your inventory and sales" />
      <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {storeInfo && (
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-transparent overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {storeInfo.logo ? (
                        <img
                          src={storeInfo.logo || "/placeholder.svg"}
                          alt={storeInfo.storeName}
                          className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover border-2 border-border flex-shrink-0"
                        />
                      ) : (
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 flex-shrink-0">
                          <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
                            {storeInfo.storeName || "Store"}
                          </h2>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            Active
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Welcome back! Here&apos;s what&apos;s happening with your business.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm border-t border-border/50 pt-4">
                      {storeInfo.email && (
                        <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{storeInfo.email}</span>
                        </div>
                      )}
                      {storeInfo.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{storeInfo.phone}</span>
                        </div>
                      )}
                      {storeInfo.address && (
                        <div className="flex items-center gap-2 text-muted-foreground min-w-0 flex-1">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{storeInfo.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              <StatsCard 
                title="Total Products" 
                value={stats.totalProducts} 
                icon={Package} 
                description="in inventory" 
              />
              <StatsCard
                title="Low Stock"
                value={stats.lowStockProducts}
                icon={AlertTriangle}
                description="need restock"
                className={stats.lowStockProducts > 0 ? "border-warning" : ""}
              />
              <StatsCard
                title="Total Invoices"
                value={stats.totalInvoices}
                icon={FileText}
                description="created"
              />
              <StatsCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={IndianRupee}
                trend={{ value: Number(stats.totalRevenueChange || 0), isPositive: Number(stats.totalRevenueChange || 0) >= 0 }}
                description="last 30d vs prev 30d"
              />
              <StatsCard
                title="Inventory Value"
                value={formatCurrency(stats.inventoryValue)}
                icon={Package}
                description="total value"
              />
              <StatsCard
                title="Avg Product Price"
                value={formatCurrency(stats.averageProductPrice)}
                icon={IndianRupee}
                description="per product"
              />
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SalesChart data={salesData} />
              </div>
              <div>
                <TopProducts products={topProducts} />
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
              <RecentActivity activities={activities} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
