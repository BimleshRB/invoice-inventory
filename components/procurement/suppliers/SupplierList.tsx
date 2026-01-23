"use client";

import { useEffect, useState } from "react";
import { supplierApi } from "@/lib/api/procurement";

interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  city?: string;
  country?: string;
}

interface Props {
  storeId: number;
}

export function SupplierList({ storeId }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await supplierApi.getByStore(storeId);
        if (mounted) setSuppliers(Array.isArray(res?.data ?? res) ? (res as any).data ?? res : []);
      } catch (err) {
        console.error("Failed to load suppliers", err);
        if (mounted) setError("Unable to fetch suppliers");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();

    const onCreated = () => load();
    if (typeof window !== "undefined") {
      window.addEventListener("supplier:created", onCreated);
    }

    return () => {
      mounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("supplier:created", onCreated);
      }
    };
  }, [storeId]);

  if (loading) return <div className="p-4">Loading suppliers…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  if (!suppliers.length) {
    return (
      <div className="rounded-md border bg-gray-50 p-4 text-gray-700">
        <div className="font-semibold">No suppliers yet</div>
        <p className="text-sm text-gray-600">Add suppliers above to start creating purchase orders.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Suppliers List</h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((s) => (
          <div key={s.id} className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{s.name}</div>
                {s.contactPerson && <div className="text-xs text-gray-600">{s.contactPerson}</div>}
                {s.email && <a href={`mailto:${s.email}`} className="text-xs text-blue-600 hover:underline">{s.email}</a>}
                {s.phone && <div className="text-xs text-gray-600">{s.phone}</div>}
                {(s.city || s.country) && <div className="text-xs text-gray-500">{[s.city, s.country].filter(Boolean).join(", ")}</div>}
              </div>
              <div className="text-sm text-gray-400">#ID {s.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
