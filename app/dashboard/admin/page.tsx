"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminOverview from "@/components/super-admin/admin-overview"
import AdminsTab from "@/components/super-admin/admins-tab"
import StoresTab from "@/components/super-admin/stores-tab"
import UsersTab from "@/components/super-admin/users-tab"
import PaymentsTab from "@/components/super-admin/payments-tab"
import EmailsTab from "@/components/super-admin/emails-tab"
import TestimonialsTab from "@/components/super-admin/testimonials-tab"
import ContactsTab from "@/components/super-admin/contacts-tab"
import { Shield, AlertCircle } from "lucide-react"
import { useAuthGuard, getAuthUser } from "@/hooks/use-auth-guard"

export default function SuperAdminDashboard() {
  const router = useRouter()
  useAuthGuard()

  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    checkAuthorization()
  }, [])

  useEffect(() => {
    // Handle hash navigation
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      setActiveSection(hash || "overview")
    }
    
    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const checkAuthorization = async () => {
    try {
      const authUser = getAuthUser()
      if (!authUser) {
        router.push("/login")
        return
      }

      // Check if user is admin or super admin
      if (authUser.isSuperAdmin || authUser.isAdmin) {
        setIsAuthorized(true)
      } else {
        setError("You don't have permission to access this page. Only Super Admins and Admins can access the admin dashboard.")
        setIsLoading(false)
        return
      }
    } catch (err) {
      setError("Failed to verify authorization")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-red-900 mb-2">Access Denied</h1>
          <p className="text-center text-red-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />
      case "admins":
        return <AdminsTab />
      case "stores":
        return <StoresTab />
      case "users":
        return <UsersTab />
      case "payments":
        return <PaymentsTab />
      case "emails":
        return <EmailsTab />
      case "testimonials":
        return <TestimonialsTab />
      case "contacts":
        return <ContactsTab />
      default:
        return <AdminOverview />
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "overview":
        return "Dashboard Overview"
      case "admins":
        return "Manage Administrators"
      case "stores":
        return "Manage Stores"
      case "users":
        return "Manage Users"
      case "payments":
        return "Payment Records"
      case "emails":
        return "Email Communications"
      case "testimonials":
        return "Customer Testimonials"
      case "contacts":
        return "Contact Inquiries"
      default:
        return "Dashboard Overview"
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">{getSectionTitle()}</h1>
        </div>
        <p className="text-muted-foreground">
          {activeSection === "overview" 
            ? "Manage all system administrators, stores, users, and communications"
            : `View and manage ${activeSection}`
          }
        </p>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
        {renderContent()}
      </div>
    </>
  )
}
