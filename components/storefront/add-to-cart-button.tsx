"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

type AddToCartButtonProps = {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number | null;
  image: string;
  size?: string | null;
  className?: string;
};

export default function AddToCartButton({
  id,
  title,
  slug,
  price,
  discountedPrice,
  image,
  size,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id,
      title,
      slug,
      price,
      discountedPrice: discountedPrice ?? undefined,
      image,
      size: size ?? undefined,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={added}
      className={`btn-primary flex w-full items-center justify-center gap-2 px-2 text-[10px] tracking-wider uppercase whitespace-nowrap sm:px-6 sm:text-sm ${className}`}
    >
      {added ? (
        "Added!"
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="hidden h-4 w-4 shrink-0 sm:block sm:h-[22px] sm:w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}
