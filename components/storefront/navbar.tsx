"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const menuItems = [
  { label: "Collections", link: "/collections" },
  { label: "Men", link: "/men" },
  { label: "Women", link: "/women" },
  { label: "About Us", link: "/about" },
];

export default function Navbar() {
  const { getItemCount } = useCart();
  const count = getItemCount();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full">
        <div className="container-storefront relative flex h-12 items-center sm:h-14">
          <Link
            href="/"
            className="font-hero text-gradient-red text-xl font-bold tracking-widest uppercase sm:text-2xl"
          >
            MidRange
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-3 sm:flex sm:gap-4 md:gap-5 max-[770px]:left-[calc(50%+12px)]">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                className="text-light-grey text-xs font-medium tracking-wider uppercase transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-4 md:gap-5">
            <Link
              href="/wishlist"
              className="text-signal-red hidden items-center transition-colors hover:text-light-grey sm:flex"
              aria-label="Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center"
              aria-label={`Cart (${count} items)`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-signal-red h-5 w-5 sm:h-6 sm:w-6"
              >
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z" />
              </svg>
              {count > 0 && (
                <span className="bg-signal-red font-hero text-light-grey absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
