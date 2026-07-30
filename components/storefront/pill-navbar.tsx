"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import StaggeredMenu from "@/components/storefront/staggered-menu";

const NAV_ITEMS = [
  { label: "Collections", href: "/collections" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "About Us", href: "/about" },
];

export default function PillNavbar() {
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setCount(getItemCount());
  }, [getItemCount]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 0) { setHidden(false); lastY = 0; return; }
      setHidden(y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="container-storefront relative flex h-12 items-center sm:h-14">
          <Link
            href="/"
            className="font-hero text-gradient-red relative z-10 shrink-0 text-xl font-bold tracking-widest uppercase sm:text-2xl"
          >
            MidRange
          </Link>

          <div
            className="absolute left-1/2 -translate-x-[40%] hidden items-center md:flex"
          >
            <div className="flex items-center md:gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link text-light-grey text-xs md:text-base font-medium tracking-wider uppercase transition-colors hover:text-signal-red"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-signal-red h-5 w-5 sm:h-6 sm:w-6">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z" />
              </svg>
              {count > 0 && (
                <span className="bg-signal-red font-hero text-light-grey absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="flex flex-col items-center justify-center gap-[3px] md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`block h-[2px] w-5 rounded bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`block h-[2px] w-5 rounded bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] w-5 rounded bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      <StaggeredMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
