"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User } from "lucide-react"
import type { Store } from "@/lib/types"

interface PersonalInformationProps {
  store: Store
  onSave: (data: Partial<Store> & { fullName?: string }) => void
}

export function PersonalInformation({ store, onSave }: PersonalInformationProps) {
  const { toast } = useToast()
  const [fullName, setFullName] = useState((store as any).ownerName || "")
  const [email, setEmail] = useState(store.email)
  const [phone, setPhone] = useState(store.phone)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!fullName || !email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Normalize phone to E.164 when saving
    let normalizedPhone = phone
    try {
      const { formatToE164 } = require("@/lib/phone") as typeof import("@/lib/phone")
      normalizedPhone = formatToE164(phone) || phone
    } catch (e) {
      // ignore
    }

    const data = {
      email,
      phone: normalizedPhone,
      fullName,
      ownerName: fullName,
    }

    onSave(data)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Manage your personal account details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
