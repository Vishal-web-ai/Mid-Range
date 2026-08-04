"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("midrange_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("midrange_visitor_id", id);
  }
  return id;
}

export type WishlistProduct = {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number | null;
  size?: string | null;
  images: string[];
  status: string;
};

export type WishlistItem = {
  id: string;
  createdAt: string;
  product: WishlistProduct;
};

type WishlistContextValue = {
  ready: boolean;
  items: WishlistItem[];
  isWished: (productId: string) => boolean;
  toggle: (productId: string, product?: WishlistProduct) => void;
  ensureLoaded: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [ready, setReady] = useState(false);
  const inFlight = useRef<Set<string>>(new Set());
  const itemsRef = useRef<WishlistItem[]>([]);
  const loadedRef = useRef(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const fetchWishlist = useCallback(() => {
    const visitorId = getVisitorId();
    if (!visitorId) {
      setReady(true);
      return;
    }
    fetch(`/api/wishlist?visitorId=${visitorId}`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const ensureLoaded = useCallback(() => {
    if (loadedRef.current || loadingRef.current) return;
    loadingRef.current = true;
    loadedRef.current = true;
    fetchWishlist();
  }, [fetchWishlist]);

  const refetch = useCallback(() => {
    loadedRef.current = true;
    fetchWishlist();
  }, [fetchWishlist]);

  const isWished = useCallback(
    (productId: string) => items.some((i) => i.product.id === productId),
    [items],
  );

  const toggle = useCallback(
    (productId: string, product?: WishlistProduct) => {
      if (inFlight.current.has(productId)) return;
      inFlight.current.add(productId);

      const visitorId = getVisitorId();
      const finish = () => inFlight.current.delete(productId);
      if (!visitorId) {
        finish();
        return;
      }

      const existing = itemsRef.current.some((i) => i.product.id === productId);

      if (existing) {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
        fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, productId }),
        })
          .catch(() => refetch())
          .finally(finish);
      } else if (product) {
        setItems((prev) => [
          ...prev,
          { id: productId, createdAt: new Date().toISOString(), product },
        ]);
        fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, productId }),
        })
          .catch(() => refetch())
          .finally(finish);
      } else {
        fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, productId }),
        })
          .then(() => refetch())
          .catch(() => {})
          .finally(finish);
      }
    },
    [refetch],
  );

  return (
    <WishlistContext.Provider value={{ ready, items, isWished, toggle, ensureLoaded }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  const { ensureLoaded } = ctx;
  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);
  return ctx;
}
