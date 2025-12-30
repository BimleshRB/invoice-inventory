"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Building2 } from "lucide-react"
import type { Store } from "@/lib/types"

interface BusinessInformationProps {
  store: Store
  onSave: (data: Partial<Store> & { businessType?: string; timezone?: string; website?: string; city?: string; state?: string; postalCode?: string }) => void
}

const businessTypes = [
  { value: "retail", label: "Retail" },
  { value: "wholesale", label: "Wholesale" },
  { value: "services", label: "Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "distribution", label: "Distribution" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "other", label: "Other" },
]

const timezones = [
  { value: "UTC", label: "UTC (GMT+0)" },
  { value: "IST", label: "IST (GMT+5:30)" },
  { value: "PST", label: "PST (GMT-8)" },
  { value: "EST", label: "EST (GMT-5)" },
  { value: "CST", label: "CST (GMT-6)" },
  { value: "MST", label: "MST (GMT-7)" },
  { value: "CET", label: "CET (GMT+1)" },
  { value: "GST", label: "GST (GMT+4)" },
]

const countries = [
  { value: "india", label: "India" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "other", label: "Other" },
]

export function BusinessInformation({ store, onSave }: BusinessInformationProps) {
  const { toast } = useToast()
  const [fullName, setFullName] = useState((store as any).ownerName || "")
  const [email, setEmail] = useState(store.email)
  const [storeName, setStoreName] = useState(store.name)
  const [phone, setPhone] = useState(store.phone)
  const [website, setWebsite] = useState((store as any).website || "")
  const [address, setAddress] = useState(store.address)
  const [city, setCity] = useState((store as any).city || "")
  const [state, setState] = useState((store as any).state || "")
  const [postalCode, setPostalCode] = useState((store as any).postalCode || "")
  const [country, setCountry] = useState((store as any).country || "india")
  const [businessType, setBusinessType] = useState((store as any).businessType || "")
  const [taxId, setTaxId] = useState(store.taxId)
  const [currency, setCurrency] = useState(store.currency)
  const [timezone, setTimezone] = useState((store as any).timezone || "UTC")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!fullName || !email || !storeName || !phone) {
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
      name: storeName,
      email,
      phone: normalizedPhone,
      address,
      taxId,
      currency,
      website,
      businessType,
      timezone,
      city,
      state,
      postalCode,
      country,
      ownerName: fullName,
    }

    onSave(data)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <div>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>This information will appear on invoices and reports</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Full Name and Email */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Bimlesh"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="storeb@gmail.com"
                required
              />
            </div>
          </div>

          {/* Row 2: Business/Store Name */}
          <div className="space-y-2">
            <Label htmlFor="storeName">Business/Store Name *</Label>
            <Input
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Store B"
              required
            />
          </div>

          {/* Row 3: Phone and Website */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="8899887766"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Row 4: Business Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="bihar"
              rows={3}
            />
          </div>

          {/* Row 5: City and State */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City/Town</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="patna"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State/Province"
              />
            </div>
          </div>

          {/* Row 6: Postal Code and Country */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal/ZIP Code</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="ZIP Code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 7: Business Type and Tax ID */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={businessType || undefined} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / VAT Number</Label>
              <Input
                id="taxId"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="XX-XXXXXXXX"
              />
            </div>
          </div>

          {/* Row 8: Currency and Timezone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">$ USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">€ EUR - Euro</SelectItem>
                  <SelectItem value="GBP">£ GBP - British Pound</SelectItem>
                  <SelectItem value="INR">₹ INR - Indian Rupee</SelectItem>
                  <SelectItem value="JPY">¥ JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CAD">C$ CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">A$ AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Complete Setup
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
