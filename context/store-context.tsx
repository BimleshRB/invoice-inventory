"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/lib/api-client";

interface StoreContextValue {
  storeId: number | null;
  storeName: string;
  loading: boolean;
  setStoreId: (id: number) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [storeId, setStoreIdState] = useState<number | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Persist storeId locally so page reloads keep selection
  const setStoreId = (id: number) => {
    setStoreIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeStoreId", String(id));
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const local = typeof window !== "undefined" ? localStorage.getItem("activeStoreId") : null;
        if (local) {
          setStoreIdState(Number(local));
        }

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          console.warn("[StoreProvider] No token found in localStorage");
          return;
        }

        console.log("[StoreProvider] Fetching profile with token:", token.substring(0, 20) + "...");
        const res = await fetch(`${API_BASE}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.status === 401) {
          console.error("[StoreProvider] 401 Unauthorized on /profile/me - token may be expired");
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("activeStoreId");
            window.location.href = "/login";
          }
          return;
        }
        
        if (res.ok) {
          const profile = await res.json();
          console.log("[StoreProvider] Profile loaded:", profile);
          if (mounted) {
            const resolvedId = profile.storeId ?? profile.store?.id ?? storeId ?? local ?? null;
            if (resolvedId) setStoreId(Number(resolvedId));
            setStoreName(profile.storeName || profile.store?.name || "My Store");
          }
        } else {
          console.error("[StoreProvider] Failed to fetch profile:", res.status, res.statusText);
        }
      } catch (e) {
        console.error("[StoreProvider] Error loading profile:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({ storeId, storeName, loading, setStoreId }), [storeId, storeName, loading]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStoreContext() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStoreContext must be used within StoreProvider");
  return ctx;
}
