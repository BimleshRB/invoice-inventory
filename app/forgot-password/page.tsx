"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Loader2, ArrowLeft, CheckCircle, Mail, Shield, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const STORAGE_KEY = "forgot_password_form"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setEmail(stored)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (email) {
      localStorage.setItem(STORAGE_KEY, email)
    }
  }, [email])

  const clearForm = () => {
    setEmail("")
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    localStorage.removeItem(STORAGE_KEY)
    setIsLoading(false)
    setIsSubmitted(true)
  }

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
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">Forgot your password?</h1>
              <p className="text-lg text-primary-foreground/80 max-w-md">
                No worries! Enter your email and we&apos;ll send you instructions to reset your password.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-primary-foreground/90 font-medium">Check your inbox for the reset link</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-primary-foreground/90 font-medium">Link expires in 24 hours for security</span>
              </div>
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

        <div className="absolute -bottom-40 -right-40 w-125 h-125 rounded-full bg-primary-foreground/5" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-background">
        <header className="p-4 lg:p-6 flex justify-between items-center">
          <Link
            href="/login"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to login</span>
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">InventoryFlow</span>
              </Link>
            </div>

            {isSubmitted ? (
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
                <p className="text-muted-foreground mb-2">We&apos;ve sent a password reset link to</p>
                <p className="font-semibold text-foreground mb-6">{email}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Didn&apos;t receive the email? Check your spam folder or request another link.
                </p>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail("")
                    }}
                    className="w-full h-12 bg-transparent"
                  >
                    Try another email
                  </Button>
                  <Button asChild className="w-full h-12">
                    <Link href="/login">Back to login</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Reset your password</h2>
                  <p className="text-muted-foreground mt-2">Enter your email and we&apos;ll send you a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email">Email address</Label>
                      {email && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearForm}
                          className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 font-semibold" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-8">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:underline font-semibold">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
