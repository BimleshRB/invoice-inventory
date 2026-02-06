"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, UserCog, CreditCard, TrendingUp, Activity } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { API_BASE } from "@/lib/api-client"

interface AdminStats {
  totalUsers: number
  totalStores: number
  totalAdmins: number
  totalPayments: number
  recentPayments: any[]
}

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStores: 0,
    totalAdmins: 0,
    totalPayments: 0,
    recentPayments: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAdminStats()
  }, [])

  const loadAdminStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      // Fetch all admin stats
      const [usersRes, storesRes, adminsRes, paymentsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/admin/stores`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/admin/admins`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/admin/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const users = usersRes.ok ? await usersRes.json() : []
      const stores = storesRes.ok ? await storesRes.json() : []
      const admins = adminsRes.ok ? await adminsRes.json() : []
      const payments = paymentsRes.ok ? await paymentsRes.json() : []

      setStats({
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalStores: Array.isArray(stores) ? stores.length : 0,
        totalAdmins: Array.isArray(admins) ? admins.length : 0,
        totalPayments: Array.isArray(payments) ? payments.length : 0,
        recentPayments: Array.isArray(payments) ? payments.slice(0, 5) : [],
      })
    } catch (error) {
      console.error("Failed to load admin stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-foreground">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalUsers}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Active user accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Total Stores</CardTitle>
            <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.totalStores}</div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Registered stores</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Total Admins</CardTitle>
            <UserCog className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalAdmins}</div>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">System administrators</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">Total Payments</CardTitle>
            <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.totalPayments}</div>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Payment records</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card className="bg-card shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            Recent Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {stats.recentPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">No payment records yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentPayments.map((payment: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 hover:border-primary/50 transition-all"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {payment.storeName || payment.userName || `Payment #${payment.id}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {payment.description || payment.method || "Payment transaction"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      {formatCurrency(payment.amount || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-card">
          <CardHeader>
            <CardTitle className="text-base">System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor system-wide user activity and trends
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-card">
          <CardHeader>
            <CardTitle className="text-base">Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track total revenue and payment analytics
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-card">
          <CardHeader>
            <CardTitle className="text-base">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View user engagement metrics and insights
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
