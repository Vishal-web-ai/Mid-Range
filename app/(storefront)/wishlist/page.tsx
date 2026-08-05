"use client";

import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/storefront/add-to-cart-button";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistPage() {
  const { ready, items, toggle } = useWishlist();

  return (
    <main className="py-8 sm:py-12">
      <div className="container-wide">
        <h1 className="font-hero text-light-grey mb-2 text-3xl font-bold tracking-wider uppercase sm:text-5xl">
          My <span className="text-signal-red">Wishlist</span>
        </h1>

        {!ready ? (
          <div className="mt-8">
            <div className="bg-dark-grey mb-8 h-4 w-16 animate-pulse rounded" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="bg-dark-grey aspect-[3/4] animate-pulse rounded-lg" />
                  <div className="mt-2 flex flex-col gap-1.5">
                    <div className="bg-dark-grey h-4 w-3/4 animate-pulse rounded" />
                    <div className="bg-dark-grey h-4 w-1/3 animate-pulse rounded" />
                    <div className="flex gap-2">
                      <div className="bg-dark-grey h-9 flex-1 animate-pulse rounded" />
                      <div className="bg-dark-grey h-9 w-9 animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-steel-gray">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <p className="text-steel-gray text-sm">Your wishlist is empty</p>
            <Link href="/collections" className="btn-primary text-sm tracking-wider uppercase">
              Browse Collections
            </Link>
          </div>
        ) : (
          <>
            <p className="text-steel-gray mb-8 text-sm font-semibold">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
              {items.map((item) => {
                const p = item.product;
                return (
                <div key={item.id} className="group relative">
                  <Link href={`/products/${p.slug}`}>
                    <div className="bg-dark-grey relative aspect-[3/4] overflow-hidden rounded-lg">
                      <Image
                        src={p.images[0] || "https://picsum.photos/seed/placeholder/400/533"}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {p.discountedPrice && (
                        <span className="bg-signal-red text-ink-black absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold tracking-wider">
                          -{Math.round(((p.price - p.discountedPrice) / p.price) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="mt-2 flex flex-col gap-1">
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="text-light-grey truncate text-sm font-medium tracking-wider uppercase">
                        {p.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      {p.discountedPrice ? (
                        <>
                          <span className="text-steel-gray text-xs line-through">{formatPrice(p.price)}</span>
                          <span className="text-signal-red text-sm font-bold">{formatPrice(p.discountedPrice)}</span>
                        </>
                      ) : (
                        <span className="text-signal-red text-sm font-bold">{formatPrice(p.price)}</span>
                      )}
                    </div>
                    <div className="mt-1 flex gap-2">
                      {p.status !== "sold" && (
                        <AddToCartButton
                          id={p.id}
                          title={p.title}
                          slug={p.slug}
                          price={p.price}
                          discountedPrice={p.discountedPrice}
                          image={p.images[0] || "https://picsum.photos/seed/placeholder/400/533"}
                          size={p.size}
                          className="flex-1 min-w-0"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => toggle(p.id)}
                        className="bg-dark-grey hover:bg-signal-red/20 text-steel-gray hover:text-signal-red flex items-center justify-center rounded px-3 py-2 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
