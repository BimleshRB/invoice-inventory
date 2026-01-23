"use client";

import { useEffect, useState } from "react";
import { goodsReceiptApi } from "@/lib/api/procurement";

interface GoodsReceipt {
  id: number;
  grnNumber?: string;
  grnStatus?: string;
  receiptDate?: string;
  purchaseOrderId?: number;
  createdAt?: string;
}

interface Props {
  storeId: number;
}

export function GoodsReceiptList({ storeId }: Props) {
  const [items, setItems] = useState<GoodsReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await goodsReceiptApi.getByStore(storeId);
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load goods receipts", err);
        if (mounted) setError("Unable to fetch goods receipts");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [storeId]);

  if (loading) return <div className="p-4">Loading goods receipts…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!items.length)
    return (
      <div className="rounded-md border bg-gray-50 p-4 text-gray-700">
        <div className="font-semibold">No goods receipts yet</div>
        <p className="text-sm text-gray-600">Create a GRN against a PO, add received lines, run QC, and confirm.</p>
      </div>
    );

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((grn) => (
        <div key={grn.id} className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">GRN {grn.grnNumber || `#${grn.id}`}</div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusChip(grn.grnStatus)}`}>
              {grn.grnStatus || "DRAFT"}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">PO</span>
              <span className="font-medium">{grn.purchaseOrderId || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Receipt date</span>
              <span className="font-medium">{displayDate(grn.receiptDate)}</span>
            </div>
            {grn.createdAt && (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Created</span>
                <span>{displayDate(grn.createdAt)}</span>
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
    case "QC_PASSED":
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "QC_PENDING":
    case "SUBMITTED":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    case "REJECTED":
    case "QC_FAILED":
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
