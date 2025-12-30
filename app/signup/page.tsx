"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, Eye, EyeOff, Loader2, ArrowLeft, Check, X, Users, FileText, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { API_BASE } from "@/lib/api-client"

const STORAGE_KEY = "signup_form"

const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[A-Z]/, text: "One uppercase letter" },
  { regex: /[a-z]/, text: "One lowercase letter" },
  { regex: /[0-9]/, text: "One number" },
]

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    storeName: "",
    agreeTerms: false,
  })
  const { toast } = useToast()

  // Load form data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setFormData({ ...parsed, agreeTerms: false }) // Don't restore terms checkbox
      } catch {
        // Invalid JSON
      }
    }
  }, [])

  // Save form data to localStorage (excluding terms agreement)
  useEffect(() => {
    if (formData.name || formData.email || formData.storeName) {
      const { name, email, storeName, password } = formData
      const dataToStore = { name, email, storeName, password }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
    }
  }, [formData])

  const clearForm = () => {
    setFormData({ name: "", email: "", password: "", storeName: "", agreeTerms: false })
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, storeName: formData.storeName }),
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) {
        const message = data?.error || (res.status === 409 ? "User already exists" : "Signup failed")
        toast({
          title: "Sign-up error",
          description: message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      if (data.token) localStorage.setItem("token", data.token)
      localStorage.removeItem(STORAGE_KEY)
      // Store signup data for details page
      localStorage.setItem("signup_temp_data", JSON.stringify({
        name: formData.name,
        email: formData.email,
        storeName: formData.storeName,
      }))
      toast({
        title: "Account created",
        description: "Your account is ready. Let’s complete your profile.",
      })
      // check profile status and redirect accordingly
      try {
        const token = data.token
        const profileRes = await fetch(`${API_BASE}/profile/me`, {
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
          router.push("/signup/details")
        }
      } catch (err) {
        router.push("/signup/details")
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

  const checkRequirement = (regex: RegExp) => regex.test(formData.password)
  const allRequirementsMet = passwordRequirements.every((req) => checkRequirement(req.regex))
  const hasFormData = formData.name || formData.email || formData.storeName || formData.password

  const benefits = [
    { icon: Users, title: "50,000+", text: "Active businesses" },
    { icon: FileText, title: "10M+", text: "Invoices generated" },
    { icon: TrendingUp, title: "40%", text: "Average revenue growth" },
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
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">Start growing your business today</h1>
              <p className="text-lg text-primary-foreground/80 max-w-md">
                Join thousands of businesses using InventoryFlow to streamline operations and increase revenue.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                  <benefit.icon className="h-6 w-6 mb-2" />
                  <p className="text-2xl font-bold">{benefit.title}</p>
                  <p className="text-sm text-primary-foreground/70">{benefit.text}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`/professional-headshot.png?height=32&width=32&query=professional headshot ${i}`}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-primary bg-muted"
                  />
                ))}
              </div>
              <p className="text-sm text-primary-foreground/80">
                <span className="font-semibold">500+</span> businesses joined this week
              </p>
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

        <main className="flex-1 flex items-center justify-center p-6 overflow-auto">
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
              <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
              <p className="text-muted-foreground mt-2">Start your 14-day free trial</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeName">Business Name</Label>
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="Acme Inc"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
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
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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

                {formData.password && (
                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 rounded-lg bg-muted/50">
                    {passwordRequirements.map((req, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-1.5 text-xs transition-colors",
                          checkRequirement(req.regex) ? "text-success" : "text-muted-foreground",
                        )}
                      >
                        <Check
                          className={cn("h-3.5 w-3.5", checkRequirement(req.regex) ? "opacity-100" : "opacity-40")}
                        />
                        {req.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-normal cursor-pointer text-muted-foreground leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline font-medium">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {hasFormData && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearForm}
                    className="text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-semibold"
                disabled={isLoading || !formData.agreeTerms || !allRequirementsMet}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
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
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
