"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, Eye, EyeOff, Loader2, ArrowLeft, Shield, Zap, BarChart3, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const STORAGE_KEY = "login_form"

function getRoleFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || "ROLE_USER"
  } catch {
    return "ROLE_USER"
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })
  const { toast } = useToast()

  // Load form data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setFormData(parsed)
      } catch {
        // Invalid JSON
      }
    }
  }, [])

  // Save form data to localStorage
  useEffect(() => {
    if (formData.email || formData.password) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    }
  }, [formData])

  const clearForm = () => {
    setFormData({ email: "", password: "", remember: false })
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.email, password: formData.password }),
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) {
        const message = data?.error || (res.status === 401 ? "Invalid credentials" : res.status === 404 ? "User not found" : "Login failed")
        toast({
          title: "Sign-in error",
          description: message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      // persist token and clear stored form
      if (data.token) {
        localStorage.setItem("token", data.token)
        const role = getRoleFromToken(data.token)
        localStorage.setItem("userRole", role)
      }
      localStorage.removeItem(STORAGE_KEY)
      toast({
        title: "Welcome back",
        description: "Signed in successfully. Redirecting...",
      })
      // Redirect based on role
      const role = getRoleFromToken(data.token)
      if (role === "ROLE_SUPER_ADMIN" || role === "ROLE_ADMIN") {
        router.push("/dashboard/admin")
      } else {
        // check profile status for non-admin users
        try {
          const token = data.token
          const profileRes = await fetch("http://localhost:8080/api/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (profileRes.ok) {
            const profile = await profileRes.json()
            if (profile.profileCompleted) {
              router.push("/dashboard")
            } else {
              router.push("/signup/details")
            }
          } else {
            // if profile endpoint not accessible, go to dashboard
            router.push("/dashboard")
          }
        } catch (err) {
          router.push("/dashboard")
        }
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: "Unable to reach the server. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const benefits = [
    { icon: Shield, text: "Enterprise-grade security" },
    { icon: Zap, text: "Lightning-fast performance" },
    { icon: BarChart3, text: "Real-time analytics" },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground w-full">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-11 w-11 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">InventoryFlow</span>
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">Welcome back to your business hub</h1>
              <p className="text-lg text-primary-foreground/80 max-w-md">
                Continue managing your inventory, tracking sales, and growing your business.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <span className="text-primary-foreground/90 font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-primary-foreground transition-colors">
              Terms
            </Link>
            <span>·</span>
            <Link href="/help" className="hover:text-primary-foreground transition-colors">
              Help
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-40 -right-40 w-125 h-125 rounded-full bg-primary-foreground/5" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-background">
        <header className="p-4 lg:p-6 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <Toaster />
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">InventoryFlow</span>
              </Link>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Sign in to your account</h2>
              <p className="text-muted-foreground mt-2">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={formData.remember}
                    onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-muted-foreground">
                    Remember me
                  </Label>
                </div>
                {(formData.email || formData.password) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearForm}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear form
                  </Button>
                )}
              </div>

              <Button type="submit" className="w-full h-12 font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="h-12 bg-transparent font-medium">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button" className="h-12 bg-transparent font-medium">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-semibold">
                Create account
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
