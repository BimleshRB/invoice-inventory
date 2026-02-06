"use client";

import { useState } from "react";
import { goodsReceiptApi } from "@/lib/api/procurement";
import { useToast } from "@/hooks/use-toast";

interface Props {
  storeId: number;
}

export function GoodsReceiptActions({ storeId }: Props) {
  const { toast } = useToast();
  const [poId, setPoId] = useState("");
  const [grnId, setGrnId] = useState<number | null>(null);
  const [itemsJson, setItemsJson] = useState("[]");
  const [qcJson, setQcJson] = useState(JSON.stringify({ accepted: [], rejected: [] }, null, 2));
  const [quickItem, setQuickItem] = useState({ itemId: "", quantityReceived: 1, remarks: "" });
  const [receivedBy, setReceivedBy] = useState("store-admin");

  const createGRN = async () => {
    if (!poId) {
      toast({ title: "Enter a PO ID first", variant: "destructive" });
      return;
    }
    try {
      const res = await goodsReceiptApi.create(Number(poId), storeId);
      setGrnId(res?.id ?? null);
      toast({ title: "GRN created", description: res?.grnNumber || `GRN #${res?.id}` });
    } catch (err) {
      toast({ title: "Failed to create GRN", variant: "destructive" });
    }
  };

  const pushQuickItem = () => {
    if (!grnId) {
      toast({ title: "Create a GRN first", variant: "destructive" });
      return;
    }
    try {
      const parsed = JSON.parse(itemsJson || "[]");
      const arr = Array.isArray(parsed) ? parsed : [];
      const next = [
        ...arr,
        {
          itemId: Number(quickItem.itemId),
          quantityReceived: Number(quickItem.quantityReceived || 0),
          remarks: quickItem.remarks || undefined,
        },
      ];
      setItemsJson(JSON.stringify(next, null, 2));
      setQuickItem({ itemId: "", quantityReceived: 1, remarks: "" });
    } catch (err) {
      toast({ title: "Could not add line", variant: "destructive" });
    }
  };

  const addItems = async () => {
    if (!grnId) return;
    try {
      const parsed = JSON.parse(itemsJson || "[]");
      await goodsReceiptApi.addItems(grnId, parsed);
      toast({ title: "Items added" });
    } catch (err) {
      toast({ title: "Add items failed", variant: "destructive" });
    }
  };

  const runQc = async () => {
    if (!grnId) return;
    try {
      const parsed = JSON.parse(qcJson || "{}");
      await goodsReceiptApi.qualityCheck(grnId, parsed);
      toast({ title: "QC completed" });
    } catch (err) {
      toast({ title: "QC failed", variant: "destructive" });
    }
  };

  const confirm = async (name: string) => {
    if (!grnId) return;
    try {
      await goodsReceiptApi.confirm(grnId, name || "store-admin");
      toast({ title: "Receipt confirmed" });
    } catch (err) {
      toast({ title: "Confirm failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5 rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Goods Receipt Actions</h2>
          <p className="text-sm text-gray-600">Create GRN from a PO, receive items, run QC, then confirm.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-700">
          <span className="rounded-full bg-blue-50 px-3 py-1">1. Create</span>
          <span className="rounded-full bg-amber-50 px-3 py-1">2. Receive</span>
          <span className="rounded-full bg-purple-50 px-3 py-1">3. QC</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1">4. Confirm</span>
        </div>
      </div>

      <div className="grid gap-4 rounded-md border bg-gray-50 p-4 md:grid-cols-3">
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Purchase Order ID</label>
          <input
            className={inputCls}
            placeholder="Enter PO that was delivered"
            value={poId}
            onChange={(e) => setPoId(e.target.value)}
          />
          <p className="text-xs text-gray-500">We create a GRN against this PO to keep traceability.</p>
        </div>
        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={createGRN}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:shadow-sm"
          >
            Create GRN
          </button>
        </div>
        {grnId && <div className="text-sm text-gray-700 md:col-span-3">Current GRN: #{grnId}</div>}
        {!grnId && <div className="text-sm text-gray-500 md:col-span-3">Create a GRN to unlock the next steps.</div>}
      </div>

      <div className="space-y-3 rounded-md border bg-gray-50 p-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">Receive line items</p>
            <p className="text-xs text-gray-600">Add received quantities for each PO line; optional remarks.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="rounded-full bg-white px-2 py-1">itemId</span>
            <span className="rounded-full bg-white px-2 py-1">quantityReceived</span>
            <span className="rounded-full bg-white px-2 py-1">remarks?</span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <input
            className={inputCls}
            placeholder="PO line item id"
            value={quickItem.itemId}
            onChange={(e) => setQuickItem((p) => ({ ...p, itemId: e.target.value }))}
          />
          <input
            className={inputCls}
            type="number"
            min={0}
            step="0.01"
            placeholder="Qty received"
            value={quickItem.quantityReceived || ""}
            onChange={(e) => setQuickItem((p) => ({ ...p, quantityReceived: e.target.value ? Number(e.target.value) : "" }))}
          />
          <input
            className={inputCls}
            placeholder="Remarks (optional)"
            value={quickItem.remarks}
            onChange={(e) => setQuickItem((p) => ({ ...p, remarks: e.target.value }))}
          />
          <button
            type="button"
            onClick={pushQuickItem}
            disabled={!grnId}
            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200 transition hover:ring-blue-300 disabled:opacity-60"
          >
            Add row to JSON
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Items JSON</label>
          <textarea
            className="w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
            rows={6}
            value={itemsJson}
            onChange={(e) => setItemsJson(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="rounded-full bg-white px-2 py-1">Format: [ {"{"} itemId, quantityReceived, remarks? {"}"} ]</span>
            <span className="rounded-full bg-white px-2 py-1">Use the PO line item id</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addItems}
            disabled={!grnId}
            className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition hover:shadow-sm disabled:opacity-60"
          >
            Add Items
          </button>
          <button
            type="button"
            onClick={() => setItemsJson("[]")}
            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 transition hover:ring-gray-300"
          >
            Clear JSON
          </button>
        </div>
      </div>

      <div className="space-y-3 rounded-md border bg-gray-50 p-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">Quality check</p>
            <p className="text-xs text-gray-600">Mark accepted vs rejected quantities; include reason for rejects.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="rounded-full bg-white px-2 py-1">accepted: []</span>
            <span className="rounded-full bg-white px-2 py-1">rejected: []</span>
            <span className="rounded-full bg-white px-2 py-1">reason?</span>
          </div>
        </div>
        <textarea
          className="w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
          rows={6}
          value={qcJson}
          onChange={(e) => setQcJson(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runQc}
            disabled={!grnId}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-sm disabled:opacity-60"
          >
            Run QC
          </button>
          <button
            type="button"
            onClick={() => setQcJson(JSON.stringify({ accepted: [], rejected: [] }, null, 2))}
            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 transition hover:ring-gray-300"
          >
            Reset QC JSON
          </button>
        </div>
      </div>

      <div className="space-y-3 rounded-md border bg-gray-50 p-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Received by</label>
          <input
            className={inputCls}
            placeholder="Name of receiver"
            value={receivedBy}
            onChange={(e) => setReceivedBy(e.target.value)}
          />
          <p className="text-xs text-gray-600">This is stored on the GRN for audit.</p>
        </div>
        <button
          type="button"
          onClick={() => confirm(receivedBy)}
          disabled={!grnId}
          className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-sm disabled:opacity-60 md:w-auto"
        >
          Confirm Receipt
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none";
