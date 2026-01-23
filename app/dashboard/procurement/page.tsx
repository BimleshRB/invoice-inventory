"use client";
import Link from "next/link";
import { ProcurementDashboard } from "@/components/procurement/dashboard/ProcurementDashboard";
import { useStoreContext } from "@/context/store-context";

export default function ProcurementPage() {
  const { storeId, loading } = useStoreContext();

  if (loading || !storeId) {
    return <div className="p-4">Loading store…</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Procurement</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage suppliers, purchase orders, and goods receipts for inventory flow.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Link href="/dashboard/procurement/suppliers">
          <div className="cursor-pointer rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-4 transition hover:shadow-md">
            <div className="text-sm font-medium text-blue-900">📋 Suppliers</div>
            <p className="mt-1 text-xs text-blue-800">Add, edit, and manage supplier details.</p>
          </div>
        </Link>
        <Link href="/dashboard/procurement/purchase-orders">
          <div className="cursor-pointer rounded-lg border bg-gradient-to-br from-amber-50 to-amber-100 p-4 transition hover:shadow-md">
            <div className="text-sm font-medium text-amber-900">📦 Purchase Orders</div>
            <p className="mt-1 text-xs text-amber-800">Create, submit, and track POs.</p>
          </div>
        </Link>
        <Link href="/dashboard/procurement/goods-receipts">
          <div className="cursor-pointer rounded-lg border bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 transition hover:shadow-md">
            <div className="text-sm font-medium text-emerald-900">✓ Goods Receipts</div>
            <p className="mt-1 text-xs text-emerald-800">Record & QC inbound deliveries.</p>
          </div>
        </Link>
      </div>

      <ProcurementDashboard storeId={storeId} />

      <div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <div className="font-semibold text-blue-900">Quick Start Guide</div>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-800">
              <li>Start by adding suppliers in the Suppliers tab</li>
              <li>Create purchase orders and link them to suppliers</li>
              <li>Submit and confirm POs to activate them</li>
              <li>When goods arrive, create a GRN against the PO</li>
              <li>Record received quantities and run QC</li>
              <li>Confirm receipt to update inventory</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
