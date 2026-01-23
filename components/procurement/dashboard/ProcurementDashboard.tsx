"use client";

import { useEffect, useState } from "react";
import { supplierApi, purchaseOrderApi, goodsReceiptApi } from "@/lib/api/procurement";

interface Props {
  storeId: number;
}

export function ProcurementDashboard({ storeId }: Props) {
  const [counts, setCounts] = useState({ suppliers: 0, purchaseOrders: 0, goodsReceipts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [suppliers, pos, grns] = await Promise.all([
          supplierApi.getByStore(storeId),
          purchaseOrderApi.getByStore(storeId),
          goodsReceiptApi.getByStore(storeId),
        ]);
        if (!mounted) return;
        setCounts({
          suppliers: Array.isArray(suppliers) ? suppliers.length : 0,
          purchaseOrders: Array.isArray(pos) ? pos.length : 0,
          goodsReceipts: Array.isArray(grns) ? grns.length : 0,
        });
      } catch (err) {
        console.error("Failed to load procurement dashboard", err);
        if (mounted) setError("Unable to load procurement overview");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [storeId]);

  if (loading) return <div className="p-4">Loading procurement overview…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div>
      <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <h2 className="text-lg font-semibold text-gray-900">Procurement Overview</h2>
        <div className="text-sm text-gray-600">Auto-updated snapshot</div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Suppliers" icon="🏢" value={counts.suppliers} hint="Active suppliers" color="blue" />
        <Card title="Purchase Orders" icon="📋" value={counts.purchaseOrders} hint="Total POs" color="amber" />
        <Card title="Goods Receipts" icon="📦" value={counts.goodsReceipts} hint="Total GRNs" color="emerald" />
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  value,
  hint,
  color,
}: {
  title: string;
  icon: string;
  value: number;
  hint?: string;
  color: "blue" | "amber" | "emerald";
}) {
  const bgColorMap = {
    blue: "bg-blue-50 border-blue-200",
    amber: "bg-amber-50 border-amber-200",
    emerald: "bg-emerald-50 border-emerald-200",
  };
  const textColorMap = {
    blue: "text-blue-900",
    amber: "text-amber-900",
    emerald: "text-emerald-900",
  };
  const hintColorMap = {
    blue: "text-blue-700",
    amber: "text-amber-700",
    emerald: "text-emerald-700",
  };

  return (
    <div className={`rounded-lg border p-5 shadow-sm transition hover:shadow-md ${bgColorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-sm font-semibold ${textColorMap[color]}`}>{title}</div>
          <div className="mt-2 text-4xl font-bold text-gray-900">{value}</div>
          {hint && <div className={`mt-1 text-xs ${hintColorMap[color]}`}>{hint}</div>}
        </div>
        <div className="text-4xl opacity-40">{icon}</div>
      </div>
    </div>
  );
}
