"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SignupDetailsPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: "",
    storeName: "",
    phone: "",
    address: "",
    taxId: "",
    currency: "USD",
    timezone: "UTC",
    businessType: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Not authenticated")
      setLoading(false)
      return
    }
    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Failed to save profile")
        setLoading(false)
        return
      }
      router.push("/dashboard")
    } catch (err) {
      alert("Network error")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-card p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Tell us about your business</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="storeName">Business name</Label>
            <Input id="storeName" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="taxId">Tax / VAT ID</Label>
            <Input id="taxId" value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label htmlFor="businessType">Business type</Label>
            <Input id="businessType" value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save and continue"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
