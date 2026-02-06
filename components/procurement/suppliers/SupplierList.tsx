"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supplierApi } from "@/lib/api/procurement";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  ArrowRight,
  Package,
  Loader2,
  ChevronRight
} from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  city?: string;
  country?: string;
  address?: string;
}

interface Props {
  storeId: number;
}

export function SupplierList({ storeId }: Props) {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await supplierApi.getByStore(storeId);
        if (mounted) {
          // Backend returns paginated response: { content: [...], pageable: {...}, ... }
          const suppliers = res?.content || res?.data?.content || res?.data || [];
          setSuppliers(Array.isArray(suppliers) ? suppliers : []);
        }
      } catch (err) {
        console.error("Failed to load suppliers", err);
        if (mounted) setError("Unable to fetch suppliers");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();

    const onCreated = () => load();
    if (typeof window !== "undefined") {
      window.addEventListener("supplier:created", onCreated);
    }

    return () => {
      mounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("supplier:created", onCreated);
      }
    };
  }, [storeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <Package className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suppliers.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2">No suppliers yet</CardTitle>
          <CardDescription>
            Add suppliers above to start creating purchase orders and managing your supply chain.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Suppliers List</h2>
        <Badge variant="secondary" className="font-normal">
          {suppliers.length} {suppliers.length === 1 ? 'Supplier' : 'Suppliers'}
        </Badge>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                onClick={() => router.push(`/dashboard/procurement/suppliers/${supplier.id}`)}
                className="group flex items-center justify-between px-4 py-4 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="rounded-lg bg-primary/10 p-2.5 shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">{supplier.name}</h3>
                      <Badge variant="outline" className="text-xs font-mono shrink-0">
                        #{supplier.id}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {supplier.contactPerson && (
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{supplier.contactPerson}</span>
                        </div>
                      )}
                      
                      {supplier.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{supplier.email}</span>
                        </div>
                      )}
                      
                      {supplier.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{supplier.phone}</span>
                        </div>
                      )}
                      
                      {(supplier.city || supplier.country) && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {[supplier.city, supplier.country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}

                      {!supplier.contactPerson && !supplier.email && !supplier.phone && (
                        <span className="italic text-muted-foreground/70">No contact details</span>
                      )}
                    </div>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
