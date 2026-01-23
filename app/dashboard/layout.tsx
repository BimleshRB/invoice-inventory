"use client"

import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { StoreProvider } from "@/context/store-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useAuthGuard()

  return (
    <StoreProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-64">{children}</main>
      </div>
    </StoreProvider>
  )
}
