"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  image: string;
  size?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  validateCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "midrange-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const itemsRef = useRef<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(items);
  }, [items, hydrated]);

  const validateCart = useCallback(() => {
    if (itemsRef.current.length === 0) return;
    fetch("/api/products", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((products: { id: string; status: string }[]) => {
        const validIds = new Set(
          products.filter((p) => p.status !== "sold").map((p) => p.id)
        );
        setItems((prev) => {
          const next = prev.filter((i) => validIds.has(i.id));
          return next.length === prev.length ? prev : next;
        });
      })
      .catch(() => {
        // network/API error — keep cart as-is
      });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    validateCart();
    const onVisible = () => {
      if (document.visibilityState === "visible") validateCart();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [hydrated, validateCart]);

  const addItem = useCallback((incoming: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === incoming.id && i.size === incoming.size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === incoming.id && i.size === incoming.size
            ? { ...i, quantity: Math.min(i.quantity + 1, 1) }
            : i
        );
      }
      return [...prev, { ...incoming, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((sum, i) => sum + (i.discountedPrice ?? i.price) * i.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        validateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
