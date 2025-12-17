"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, MessageSquare, Clock, Loader2, CheckCircle, X, Building2, Headphones } from "lucide-react"

const STORAGE_KEY = "contact_form"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  // Load form data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setFormData(JSON.parse(stored))
      } catch {
        // Invalid JSON
      }
    }
  }, [])

  // Save form data to localStorage
  useEffect(() => {
    if (formData.name || formData.email || formData.message) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    }
  }, [formData])

  const clearForm = () => {
    setFormData({ name: "", email: "", subject: "", message: "" })
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    localStorage.removeItem(STORAGE_KEY) // Clear on success
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const hasFormData = formData.name || formData.email || formData.message

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Our team typically responds within 24 hours",
      primary: "support@inventoryflow.app",
      secondary: "sales@inventoryflow.app",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm EST",
      primary: "+1 (555) 123-4567",
      secondary: "Toll-free: 1-800-INV-FLOW",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      primary: "123 Business Avenue, Suite 100",
      secondary: "San Francisco, CA 94107",
    },
    {
      icon: Headphones,
      title: "Live Chat",
      description: "Available 24/7 for urgent issues",
      primary: "Start a conversation",
      secondary: "Average response: 2 minutes",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or need help? Our team is here to assist you. Reach out and we&apos;ll respond as soon as
              possible.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {contactMethods.map((method, i) => (
              <Card key={i} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{method.description}</p>
                  <p className="text-sm font-medium text-foreground">{method.primary}</p>
                  <p className="text-xs text-muted-foreground">{method.secondary}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Send us a message
                  </CardTitle>
                  <CardDescription>Fill out the form below and we&apos;ll get back to you shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-success" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for contacting us. We&apos;ll get back to you within 24 hours.
                      </p>
                      <Button
                        onClick={() => {
                          setIsSubmitted(false)
                          setFormData({ name: "", email: "", subject: "", message: "" })
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="sales">Sales Question</SelectItem>
                            <SelectItem value="billing">Billing Issue</SelectItem>
                            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="message">Message</Label>
                          {hasFormData && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={clearForm}
                              className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Clear form
                            </Button>
                          )}
                        </div>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help..."
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full h-11 font-medium" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">General Inquiries</span>
                    <span className="text-sm font-medium">24-48 hours</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">Technical Support</span>
                    <span className="text-sm font-medium">4-8 hours</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">Billing Issues</span>
                    <span className="text-sm font-medium">1-2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Enterprise Support</span>
                    <span className="text-sm font-medium text-success">Priority</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monday - Friday</span>
                    <span className="text-sm font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Saturday</span>
                    <span className="text-sm font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sunday</span>
                    <span className="text-sm font-medium text-muted-foreground">Closed</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
