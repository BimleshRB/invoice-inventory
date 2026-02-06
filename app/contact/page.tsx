"use client"

import { useState } from "react"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  MessageSquare,
  Clock,
  Building2,
  CheckCircle,
  ArrowRight,
  Loader2,
  X,
} from "lucide-react"

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Send us an email anytime",
    primary: "support@inventoryflow.com",
    secondary: "Response in 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    description: "Call our support team",
    primary: "+1 (555) 123-4567",
    secondary: "Mon-Fri, 9 AM - 6 PM EST",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with us in real-time",
    primary: "Available 24/7",
    secondary: "Average response: 2 mins",
  },
  {
    icon: MapPin,
    title: "Address",
    description: "Visit our office",
    primary: "San Francisco, CA",
    secondary: "By appointment",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasFormData =
    formData.name.trim() !== "" ||
    formData.email.trim() !== "" ||
    formData.subject !== "" ||
    formData.message.trim() !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Save to localStorage
    localStorage.setItem("contactFormData", JSON.stringify(formData))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after 3 seconds for demo
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
      localStorage.removeItem("contactFormData")
    }, 3000)
  }

  const clearForm = () => {
    setFormData({ name: "", email: "", subject: "", message: "" })
    localStorage.removeItem("contactFormData")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <LandingHeader />

      <main className="flex-1 pt-16 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              💬 Get in Touch
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 text-balance">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question? Reach out and we'll respond within 24 hours.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {contactMethods.map((method, i) => (
              <Card key={i} className="group border-2 border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-5">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1">{method.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{method.description}</p>
                  <p className="text-sm font-semibold text-foreground">{method.primary}</p>
                  <p className="text-xs text-muted-foreground">{method.secondary}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="border-2 border-border/60">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-sm">Fill out the form and we'll respond within 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {isSubmitted ? (
                    <div className="text-center py-10">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-success" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-5 text-sm">
                        Thank you for contacting us. We'll respond within 24 hours.
                      </p>
                      <Button
                        onClick={() => {
                          setIsSubmitted(false)
                          setFormData({ name: "", email: "", subject: "", message: "" })
                        }}
                        size="sm"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="h-10 border-border/60 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="h-10 border-border/60 text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-semibold">Subject</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        >
                          <SelectTrigger className="h-10 border-border/60 text-sm">
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
                          <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
                          {hasFormData && (
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
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          className="resize-none border-border/60 text-sm"
                        />
                      </div>
                      <Button type="submit" className="w-full h-10 font-semibold text-sm" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-2 border-border/60 hover:border-border transition-colors">
                <CardHeader className="border-b border-border/50 pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between py-2 px-2 rounded text-sm">
                    <span className="text-xs text-muted-foreground">General</span>
                    <span className="text-xs font-semibold text-foreground">24-48 hrs</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-2 rounded text-sm">
                    <span className="text-xs text-muted-foreground">Technical</span>
                    <span className="text-xs font-semibold text-foreground">4-8 hrs</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-2 rounded text-sm">
                    <span className="text-xs text-muted-foreground">Billing</span>
                    <span className="text-xs font-semibold text-success">1-2 hrs</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-2 rounded text-sm">
                    <span className="text-xs text-muted-foreground">Enterprise</span>
                    <span className="text-xs font-semibold text-primary">Priority</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/60 hover:border-border transition-colors">
                <CardHeader className="border-b border-border/50 pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-primary" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between py-2 px-2 rounded text-sm">
                    <span className="text-xs text-muted-foreground">Mon - Fri</span>
                    <span className="text-xs font-semibold text-foreground">9 AM - 6 PM</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-2 rounded text-sm">
                    <span className="text-xs text-muted-foreground">Saturday</span>
                    <span className="text-xs font-semibold text-foreground">10 AM - 4 PM</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-2 rounded text-sm">
                    <span className="text-xs text-muted-foreground">Sunday</span>
                    <span className="text-xs font-semibold text-muted-foreground">Closed</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">💡 Tip</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Check our Help Center for instant answers.
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
