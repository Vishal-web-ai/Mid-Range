"use client";

import { useCart } from "@/lib/cart-context";
import { useButtonEffects } from "@/components/ui/use-button-effects";

type AddToCartButtonProps = {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number | null;
  image: string;
  size?: string | null;
  className?: string;
  showIcon?: boolean;
};

function flyToCart(from: HTMLElement) {
  const target = document.querySelector<HTMLElement>("[data-cart-icon]");
  if (!target) return;

  const fromRect = from.getBoundingClientRect();
  const toRect = target.getBoundingClientRect();
  const x0 = fromRect.left + fromRect.width / 2;
  const y0 = fromRect.top + fromRect.height / 2;
  const dx = toRect.left + toRect.width / 2 - x0;
  const dy = toRect.top + toRect.height / 2 - y0;

  const dot = document.createElement("span");
  dot.className = "fly-dot";
  dot.style.left = `${x0}px`;
  dot.style.top = `${y0}px`;
  document.body.appendChild(dot);

  const anim = dot.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.1)`, opacity: 0.2 },
    ],
    { duration: 650, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
  );
  anim.onfinish = () => dot.remove();
  window.setTimeout(() => dot.remove(), 900);
}

export default function AddToCartButton({
  id,
  title,
  slug,
  price,
  discountedPrice,
  image,
  size,
  className = "",
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem, removeItem, items } = useCart();
  const effects = useButtonEffects();
  const added = items.some(
    (i) => i.id === id && i.size === (size ?? undefined)
  );

  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    effects.onClick(e);
    if (added) {
      removeItem(id);
      return;
    }
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
    flyToCart(e.currentTarget);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={effects.onPointerDown}
      className={`btn-primary btn-sweep flex w-full items-center justify-center gap-2 px-4 text-sm font-semibold tracking-wider uppercase whitespace-nowrap ${className}`}
    >
      {showIcon && icon}
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
