"use client";

import { useEffect, useState } from "react";
import { purchaseOrderApi } from "@/lib/api/procurement";

interface PurchaseOrder {
  id: number;
  poStatus?: string;
  supplierName?: string;
  invoiceNumber?: string;
  expectedDeliveryDate?: string;
  createdAt?: string;
}

interface Props {
  storeId: number;
}

export function PurchaseOrderList({ storeId }: Props) {
  const [items, setItems] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await purchaseOrderApi.getByStore(storeId);
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load purchase orders", err);
        if (mounted) setError("Unable to fetch purchase orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [storeId]);

  if (loading) return <div className="p-4">Loading purchase orders…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!items.length)
    return (
      <div className="rounded-md border bg-gray-50 p-4 text-gray-700">
        <div className="font-semibold">No purchase orders yet</div>
        <p className="text-sm text-gray-600">Create a PO, add items, then submit and confirm to move inventory.</p>
      </div>
    );

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((po) => (
        <div key={po.id} className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">PO #{po.id}</div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusChip(po.poStatus)}`}>
              {po.poStatus || "DRAFT"}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Supplier</span>
              <span className="font-medium">{po.supplierName || ""}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Invoice #</span>
              <span className="font-medium">{po.invoiceNumber || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expected delivery</span>
              <span className="font-medium">{displayDate(po.expectedDeliveryDate)}</span>
            </div>
            {po.createdAt && (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Created</span>
                <span>{displayDate(po.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function statusChip(status?: string) {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "SUBMITTED":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function displayDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}
