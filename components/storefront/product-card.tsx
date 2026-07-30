"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

export type ProductCardProps = {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  size: string | null;
  status: string;
  delay?: number;
};

export default function ProductCard({
  id,
  title,
  slug,
  price,
  discountedPrice,
  images,
  size,
  status,
  delay = 0,
}: ProductCardProps) {
  const { addItem } = useCart();
  const isSold = status === "sold";
  const src = images[0] ?? "https://picsum.photos/seed/placeholder/400/500";
  const hasDiscount = discountedPrice != null && discountedPrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      title,
      slug,
      price,
      discountedPrice: hasDiscount ? discountedPrice : undefined,
      image: src,
      size: size ?? undefined,
      quantity: 1,
    });
    toast.success("Added to cart");
  }

  return (
    <ScrollReveal delay={delay}>
      <Link
        href={`/products/${slug}`}
        className={cn("product-card group block", isSold && "pointer-events-none opacity-70")}
      >
        <div className="bg-dark-grey relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {isSold && (
            <div className="bg-ink-black/60 absolute inset-0 flex items-center justify-center">
              <span className="font-hero bg-signal-red px-3 py-1 text-xs font-bold tracking-widest uppercase">
                SOLD
              </span>
            </div>
          )}

          {size && !isSold && (
            <span className="font-hero bg-signal-red text-light-grey absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              {size}
            </span>
          )}

          {!isSold && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-ink-black/50 hover:bg-ink-black/80 text-light-grey absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-3">
          <h3 className="text-light-grey truncate text-sm font-medium">{title}</h3>
          {hasDiscount ? (
            <div className="mt-1 flex items-center justify-between">
              <p className="text-steel-gray text-xs line-through">{formatPrice(price)}</p>
              <span className="font-hero bg-signal-red text-light-grey px-0.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                -{discountPercent}%
              </span>
            </div>
          ) : null}
          {hasDiscount ? (
            <p className="font-hero text-signal-red text-sm font-bold tracking-wider">
              {formatPrice(discountedPrice)}
            </p>
          ) : (
            <p className="font-hero text-steel-gray mt-1 text-sm font-bold tracking-wider">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </Link>
    </ScrollReveal>
  );
}
