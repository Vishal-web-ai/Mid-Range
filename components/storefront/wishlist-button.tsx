"use client";

import { useState, useEffect } from "react";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("midrange_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("midrange_visitor_id", id);
  }
  return id;
}

interface WishlistButtonProps {
  productId: string;
}

export function WishlistButton({ productId }: WishlistButtonProps) {
  const [wished, setWished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;
    fetch(`/api/wishlist?visitorId=${visitorId}&productId=${productId}`)
      .then((r) => r.json())
      .then((data) => setWished(data.wished))
      .catch(() => {});
  }, [productId]);

  async function toggle() {
    const visitorId = getVisitorId();
    setLoading(true);
    try {
      if (wished) {
        await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, productId }),
        });
        setWished(false);
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, productId }),
        });
        setWished(true);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 text-sm font-semibold tracking-wider text-ink-black uppercase transition-colors hover:bg-light-grey disabled:opacity-50"
    >
      {wished ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          In Wishlist
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          Add to Wishlist
        </>
      )}
    </button>
  );
}
