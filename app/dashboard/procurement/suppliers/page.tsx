"use client";
import { SupplierList } from "@/components/procurement/suppliers/SupplierList";
import { SupplierForm } from "@/components/procurement/suppliers/SupplierForm";
import { useStoreContext } from "@/context/store-context";

export default function SuppliersPage() {
  const { storeId, loading } = useStoreContext();
  if (loading || !storeId) return <div className="p-4">Loading store…</div>;

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <p className="mt-1 text-sm text-gray-600">Add and manage suppliers for POs and material sourcing.</p>
      </div>
      <SupplierForm storeId={storeId} />
      <SupplierList storeId={storeId} />
    </div>
  );
}
