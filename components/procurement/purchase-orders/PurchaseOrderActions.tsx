"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { purchaseOrderApi } from "@/lib/api/procurement";

interface Props {
	storeId: number;
}

// Lightweight actions toolbar for Purchase Orders.
// Keeps UX responsive without forcing navigation or logout on API errors.
export function PurchaseOrderActions({ storeId }: Props) {
	const { toast } = useToast();
	const [creating, setCreating] = useState(false);

	const createDraftPo = async () => {
		setCreating(true);
		try {
			// Minimal draft payload. Backend may require supplier linkage later.
			const payload: any = {
				storeId,
				poStatus: "DRAFT",
			};

			const res = await purchaseOrderApi.create(payload);
			if ((res as any)?.error) {
				toast({ title: "Failed to create PO", description: (res as any).error, variant: "destructive" });
			} else {
				toast({ title: "Draft PO created", description: "You can add items and submit." });
				// Optional: refresh list
				if (typeof window !== "undefined") window.location.reload();
			}
		} catch (err: any) {
			const msg = err?.message || "Unknown error";
			toast({ title: "Failed to create PO", description: msg, variant: "destructive" });
		} finally {
			setCreating(false);
		}
	};

	return (
		<div className="flex items-center justify-between gap-3">
			<div className="text-sm text-gray-600">Store ID: {storeId}</div>
			<div className="flex items-center gap-2">
				<button
					onClick={() => (typeof window !== "undefined" ? window.location.reload() : null)}
					className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
				>
					Refresh
				</button>
				<button
					onClick={createDraftPo}
					disabled={creating}
					className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
				>
					{creating ? "Creating…" : "New Draft PO"}
				</button>
			</div>
		</div>
	);
}

