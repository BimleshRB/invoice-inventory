"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supplierApi } from "@/lib/api/procurement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  city?: string;
  country?: string;
  status?: string;
  active?: boolean;
}

export default function SupplierDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const supplierId = Number(params?.id);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await supplierApi.getById(supplierId);
        const supplierData = (res as any)?.data ?? res;
        if (mounted) {
          setSupplier(supplierData as Supplier);
          setForm({
            name: supplierData?.name || "",
            contactPerson: supplierData?.contactPerson || "",
            email: supplierData?.email || "",
            phone: supplierData?.phone || "",
            city: supplierData?.city || "",
            country: supplierData?.country || "",
          });
        }
      } catch (err) {
        console.error("Failed to load supplier", err);
        if (mounted) setError("Unable to load supplier");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (!Number.isNaN(supplierId)) {
      load();
    } else {
      setError("Invalid supplier id");
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [supplierId]);

  if (loading) return <div className="p-4">Loading supplier…</div>;
  if (error)
    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/procurement/suppliers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="font-semibold text-red-600">{error}</div>
        </div>
        <div className="text-sm text-muted-foreground">Try refreshing or return to the suppliers list.</div>
      </div>
    );

  if (!supplier) return null;
  const isActive = supplier.active ?? (supplier.status ? supplier.status.toUpperCase() === "ACTIVE" : true);

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/procurement/suppliers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{supplier.name}</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Supplier profile for procurement and purchase orders.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant={isActive ? "secondary" : "default"}
            disabled={statusSubmitting}
            onClick={async () => {
              setStatusSubmitting(true);
              try {
                const nextStatus = isActive ? "INACTIVE" : "ACTIVE";
                const res = await supplierApi.update(supplierId, { status: nextStatus });
                const data = (res as any)?.data ?? res;
                setSupplier((prev) => ({ ...(prev || {}), ...(data as Supplier), status: nextStatus }));
                toast({ title: `Supplier ${nextStatus.toLowerCase()}` });
                window.dispatchEvent(new CustomEvent("supplier:created"));
              } catch (err) {
                console.error("Toggle supplier status failed", err);
                toast({ title: "Failed to update status", description: "Please try again", variant: "destructive" });
              } finally {
                setStatusSubmitting(false);
              }
            }}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={deleteSubmitting}
            onClick={async () => {
              if (!window.confirm("Delete this supplier? This cannot be undone.")) return;
              setDeleteSubmitting(true);
              try {
                await supplierApi.delete(supplierId);
                toast({ title: "Supplier deleted" });
                window.dispatchEvent(new CustomEvent("supplier:created"));
                router.push("/dashboard/procurement/suppliers");
              } catch (err) {
                console.error("Delete supplier failed", err);
                toast({ title: "Failed to delete supplier", description: "Please try again", variant: "destructive" });
              } finally {
                setDeleteSubmitting(false);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Key information to reach and engage this supplier.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <DetailRow icon={<User className="h-4 w-4" />} label="Contact Person" value={supplier.contactPerson || "Not set"} />
          <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={supplier.email || "Not set"} />
          <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={supplier.phone || "Not set"} />
          <DetailRow
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={[supplier.city, supplier.country].filter(Boolean).join(", ") || "Not set"}
          />
          <DetailRow label="Supplier ID" value={supplier.id} />
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update supplier contact and location details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name"
            />
            <Input
              value={form.contactPerson}
              onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
              placeholder="Contact Person"
            />
            <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" />
            <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="City" />
              <Input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="Country" />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={editSubmitting || !form.name.trim()}
              onClick={async () => {
                setEditSubmitting(true);
                try {
                  const payload = { ...form, status: supplier.status ?? "ACTIVE" };
                  const res = await supplierApi.update(supplierId, payload);
                  const data = (res as any)?.data ?? res;
                  setSupplier(data as Supplier);
                  setEditOpen(false);
                  toast({ title: "Supplier updated" });
                  window.dispatchEvent(new CustomEvent("supplier:created"));
                } catch (err) {
                  console.error("Update supplier failed", err);
                  toast({ title: "Failed to update supplier", description: "Please try again", variant: "destructive" });
                } finally {
                  setEditSubmitting(false);
                }
              }}
            >
              {editSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface DetailRowProps {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border p-3">
      {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
