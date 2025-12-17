"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Store } from "@/lib/types"
import { Upload, Building2 } from "lucide-react"

interface StoreSettingsProps {
  store: Store
  onSave: (data: Partial<Store>) => void
}

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
]

export function StoreSettings({ store, onSave }: StoreSettingsProps) {
  const [name, setName] = useState(store.name)
  const [address, setAddress] = useState(store.address)
  const [phone, setPhone] = useState(store.phone)
  const [email, setEmail] = useState(store.email)
  const [taxId, setTaxId] = useState(store.taxId)
  const [currency, setCurrency] = useState(store.currency)
  const [logo, setLogo] = useState<string | null>(store.logo)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Normalize phone to E.164 when saving
    let normalizedPhone = phone
    try {
      const { formatToE164 } = require("@/lib/phone") as typeof import("@/lib/phone")
      normalizedPhone = formatToE164(phone) || phone
    } catch (e) {
      // ignore
    }

    onSave({ name, address, phone: normalizedPhone, email, taxId, currency, logo })
  }

  const handleLocaleChange = (locale: string) => {
    try {
      const { setLocale, setCurrency } = require("@/lib/i18n") as typeof import("@/lib/i18n")
      setLocale(locale)
      if (locale === "en-IN") setCurrency("INR")
      if (locale === "en-US") setCurrency("USD")
    } catch (e) {
      // ignore
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Information</CardTitle>
        <CardDescription>Update your store details and branding</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={logo || undefined} alt={name} />
              <AvatarFallback className="bg-primary/10">
                <Building2 className="h-10 w-10 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Store/Company Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Store Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@store.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="12 MG Road, Bengaluru, Karnataka 560001"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / Business Number</Label>
              <Input id="taxId" value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="TAX-123456789" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={currency}
                onValueChange={(val) => {
                  setCurrency(val)
                  if (val === "INR") handleLocaleChange("en-IN")
                  if (val === "USD") handleLocaleChange("en-US")
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
