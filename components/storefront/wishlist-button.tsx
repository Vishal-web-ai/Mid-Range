"use client";

import { useWishlist, type WishlistProduct } from "@/lib/wishlist-context";
import { useButtonEffects } from "@/components/ui/use-button-effects";

interface WishlistButtonProps {
  productId: string;
  product: WishlistProduct;
}

export function WishlistButton({ productId, product }: WishlistButtonProps) {
  const { isWished, toggle } = useWishlist();
  const effects = useButtonEffects();
  const wished = isWished(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        effects.onClick(e);
        toggle(productId, product);
      }}
      onPointerDown={effects.onPointerDown}
      className="btn-sweep flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 text-sm font-semibold tracking-wider text-ink-black uppercase transition-colors hover:bg-light-grey [--sweep-color:rgba(225,29,46,0.18)] [--ripple-color:rgba(225,29,46,0.25)]"
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
