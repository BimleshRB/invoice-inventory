"use client";
import { useState } from "react";
import { SupplierList } from "@/components/procurement/suppliers/SupplierList";
import { SupplierForm } from "@/components/procurement/suppliers/SupplierForm";
import { useStoreContext } from "@/context/store-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const { storeId, loading } = useStoreContext();
  if (loading || !storeId) return <div className="p-4">Loading store…</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="mt-1 text-sm text-gray-600">Add and manage suppliers for POs and material sourcing.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Supplier</DialogTitle>
              <DialogDescription>Capture supplier details to use across purchase orders and procurement.</DialogDescription>
            </DialogHeader>
            <SupplierForm storeId={storeId} onSubmitted={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <SupplierList storeId={storeId} />
    </div>
  );
}
