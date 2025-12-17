"use client"

import { useEffect, useState } from "react"
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
} from "lucide-react"
import { dataStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import type { ActivityLog, Store } from "@/lib/types"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    expiringProducts: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    totalCustomers: 0,
    recentSales: [] as { date: string; amount: number }[],
    topProducts: [] as { name: string; quantity: number }[],
  })
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [storeInfo, setStoreInfo] = useState<Store | null>(null)

  useEffect(() => {
    setStats(dataStore.getDashboardStats())
    setActivities(dataStore.getActivityLogs())
    setStoreInfo(dataStore.getStore())
  }, [])

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" description="Overview of your inventory and sales" />
      <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
        {storeInfo && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-transparent overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {storeInfo.logo ? (
                    <img
                      src={storeInfo.logo || "/placeholder.svg"}
                      alt={storeInfo.name}
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover border-2 border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 flex-shrink-0">
                      <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">{storeInfo.name}</h2>
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
          <StatsCard title="Total Products" value={stats.totalProducts} icon={Package} description="in inventory" />
          <StatsCard
            title="Low Stock"
            value={stats.lowStockProducts}
            icon={AlertTriangle}
            description="need restock"
            className={stats.lowStockProducts > 0 ? "border-warning" : ""}
          />
          <StatsCard
            title="Expiring Soon"
            value={stats.expiringProducts}
            icon={Clock}
            description="within 30 days"
            className={stats.expiringProducts > 0 ? "border-destructive" : ""}
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={IndianRupee}
            trend={{ value: 12.5, isPositive: true }}
            description="from last month"
          />
          <StatsCard
            title="Pending Invoices"
            value={stats.pendingInvoices}
            icon={FileText}
            description="awaiting payment"
          />
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            trend={{ value: 8.2, isPositive: true }}
            description="from last month"
          />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesChart data={stats.recentSales} />
          </div>
          <div>
            <TopProducts products={stats.topProducts} />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  )
}
