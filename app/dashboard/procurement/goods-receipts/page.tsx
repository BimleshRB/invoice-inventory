"use client";
import { GoodsReceiptList } from "@/components/procurement/goods-receipts/GoodsReceiptList";
import { GoodsReceiptActions } from "@/components/procurement/goods-receipts/GoodsReceiptActions";
import { useStoreContext } from "@/context/store-context";

export default function GoodsReceiptsPage() {
  const { storeId, loading } = useStoreContext();
  if (loading || !storeId) return <div className="p-4">Loading store…</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Goods Receipts</h1>
          <p className="text-sm text-gray-600">Record deliveries, run QC, and confirm receipt for inventory updates.</p>
        </div>
        <div className="rounded-md border bg-blue-50 p-3 text-sm text-blue-900">
          <div className="font-semibold">How to use</div>
          <p className="mt-1">
            1) Enter the PO ID and create a GRN. 2) Add received items (quick rows or JSON). 3) Run QC with accepted/rejected lines.
            4) Set the receiver name and confirm to post the receipt.
          </p>
        </div>
      </div>
      <GoodsReceiptActions storeId={storeId} />
      <GoodsReceiptList storeId={storeId} />
    </div>
  );
}
