"use client";

import { useState } from "react";
import { supplierApi } from "@/lib/api/procurement";

interface Props {
  storeId: number;
}

export function SupplierForm({ storeId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setContactPerson("");
    setCity("");
    setCountry("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      const payload: any = {
        name: name.trim(),
        storeId,
      };
      if (email) payload.email = email.trim();
      if (phone) payload.phone = phone.trim();
      if (contactPerson) payload.contactPerson = contactPerson.trim();
      if (city) payload.city = city.trim();
      if (country) payload.country = country.trim();

      const res = await supplierApi.create(payload);
      if ((res as any)?.error) {
        setError((res as any).error || "Failed to create supplier");
      } else {
        setMessage("Supplier added successfully");
        reset();
        // Notify listeners (e.g., SupplierList) to refresh
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("supplier:created"));
        }
      }
    } catch (err) {
      console.error("Create supplier failed", err);
      setError("Unable to create supplier");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Add Supplier</h2>
      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Suryansh Traders Pvt Ltd"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            className="mt-1 w-full rounded border p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@suryansh.in"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Person</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            placeholder="Amit Kumar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mumbai"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="India"
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save Supplier"}
          </button>
          {message && <div className="text-green-700">{message}</div>}
          {error && <div className="text-red-700">{error}</div>}
        </div>
      </form>
    </div>
  );
}
