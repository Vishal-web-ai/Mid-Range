"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { useWishlist, type WishlistProduct } from "@/lib/wishlist-context";

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

function WishlistToggle({ product }: { product: WishlistProduct }) {
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.id);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id, product);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      className="bg-ink-black/50 hover:bg-ink-black/80 absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
    >
      {wished ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-signal-red">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-grey">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
    </button>
  );
}

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
  const isSold = status === "sold";
  const src = images[0] ?? "/placeholder.png";
  const hasDiscount = discountedPrice != null && discountedPrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;

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
            <WishlistToggle
              product={{ id, title, slug, price, discountedPrice, size, images, status }}
            />
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
            <p className="font-sans text-signal-red text-sm font-bold tracking-wider">
              {formatPrice(discountedPrice)}
            </p>
          ) : (
            <p className="font-sans text-steel-gray mt-1 text-sm font-bold tracking-wider">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </Link>
    </ScrollReveal>
  );
}
