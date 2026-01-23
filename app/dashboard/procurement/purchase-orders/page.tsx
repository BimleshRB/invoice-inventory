"use client";
import { PurchaseOrderList } from "@/components/procurement/purchase-orders/PurchaseOrderList";
import { PurchaseOrderActions } from "@/components/procurement/purchase-orders/PurchaseOrderActions";
import { useStoreContext } from "@/context/store-context";

export default function PurchaseOrdersPage() {
  const { storeId, loading } = useStoreContext();
  if (loading || !storeId) return <div className="p-4">Loading store…</div>;

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Purchase Orders</h1>
        <p className="text-sm text-gray-600">Track and action POs.</p>
      </div>
      <PurchaseOrderActions storeId={storeId} />
      <PurchaseOrderList storeId={storeId} />
    </div>
  );
}
