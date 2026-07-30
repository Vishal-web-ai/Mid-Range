"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function CartSkeleton() {
  return (
    <main className="container-storefront py-8 md:py-12">
      <div className="bg-dark-grey mb-8 h-8 w-24 animate-pulse rounded" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-steel-gray/30 bg-white/5 flex gap-4 rounded-md border p-4">
            <div className="bg-dark-grey h-24 w-24 flex-shrink-0 animate-pulse rounded" />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="bg-dark-grey mb-2 h-5 w-40 animate-pulse rounded" />
                <div className="bg-dark-grey h-4 w-16 animate-pulse rounded" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="bg-dark-grey h-5 w-20 animate-pulse rounded" />
                <div className="bg-dark-grey h-4 w-14 animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-steel-gray/30 bg-white/5 mt-8 rounded-md border p-6">
        <div className="flex items-center justify-between">
          <div className="bg-dark-grey h-6 w-24 animate-pulse rounded" />
          <div className="bg-dark-grey h-6 w-20 animate-pulse rounded" />
        </div>
        <div className="bg-dark-grey mt-4 h-12 w-full animate-pulse rounded" />
      </div>
    </main>
  );
}

export default function CartPage() {
  const { items, removeItem, getCartTotal } = useCart();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <main className="container-storefront py-16 text-center">
        <h1 className="font-hero text-light-grey text-4xl">Cart</h1>
        <p className="text-steel-gray mt-4 text-lg">Your cart is empty.</p>
        <Link href="/" className="btn-primary mt-8 inline-block">
          Continue Shopping
        </Link>
      </main>
    );
  }

  const total = getCartTotal();

  return (
    <main className="container-storefront py-8 md:py-12">
      <h1 className="font-hero text-light-grey text-4xl">Cart</h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-steel-gray/30 bg-white/5 flex gap-4 rounded-md border p-4"
          >
            <div className="bg-dark-grey relative h-24 w-24 flex-shrink-0 overflow-hidden rounded">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="96px" />
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/products/${item.slug}`}
                  className="text-light-grey font-semibold hover:underline"
                >
                  {item.title}
                </Link>
                {item.size && (
                  <span className="text-steel-gray ml-2 text-sm">Size: {item.size}</span>
                )}
                <p className="text-steel-gray text-sm">Qty: {item.quantity}</p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.discountedPrice ? (
                    <>
                      <span className="text-steel-gray text-sm line-through">
                        ₹{(item.price / 100).toLocaleString("en-IN")}
                      </span>
                      <span className="text-signal-red font-semibold">
                        ₹{(item.discountedPrice / 100).toLocaleString("en-IN")}
                      </span>
                    </>
                  ) : (
                    <span className="text-light-grey font-semibold">
                      ₹{(item.price / 100).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-signal-red text-sm font-medium hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-steel-gray/30 bg-white/5 mt-8 rounded-md border p-6">
        <div className="flex items-center justify-between">
          <span className="text-light-grey text-lg font-semibold">Subtotal</span>
          <span className="text-light-grey text-lg font-bold">
            ₹{(total / 100).toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-steel-gray mt-1 text-sm">Shipping calculated at checkout.</p>

        <Link href="/checkout" className={cn("btn-primary mt-6 w-full")}>
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}
