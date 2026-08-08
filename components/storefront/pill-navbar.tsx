"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import StaggeredMenu from "@/components/storefront/staggered-menu";
import PillNavLinks from "@/components/storefront/pill-nav-links";

export default function PillNavbar() {
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [entered, setEntered] = useState(false);

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
      if (y <= 0) {
        setHidden(false);
      } else if (y > lastY) {
        setHidden(true);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`pill-navbar sticky top-0 z-50 w-full transition-transform duration-300 ${
          !entered ? "animate-nav-in" : ""
        } ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}`}
        onAnimationEnd={() => setEntered(true)}
      >
        <div className="container-storefront relative flex h-[56px] items-center sm:h-[64px]">
          <div className="pointer-events-none relative flex w-full items-center justify-between">
            <div
              className="pointer-events-none relative z-10 flex shrink-0 items-center max-[769px]:-ml-[2.5em] min-[770px]:max-[1439px]:-ml-[3em] min-[1440px]:-ml-[7em]"
              aria-label="MidRange"
            >
              <Image
                src="/logo/logo.png"
                alt="MidRange"
                width={1536}
                height={1024}
                priority
                unoptimized
                className="h-[135px] w-auto lg:h-[250px]"
              />
            </div>

            <div className="pointer-events-auto hidden items-center md:flex lg:-ml-[12em] lg:relative max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">
              <PillNavLinks />
            </div>

            <div className="pointer-events-auto flex shrink-0 items-center gap-[12px] sm:gap-[16px]">
            <Link
              href="/wishlist"
              className="nav-icon-link text-signal-red hidden items-center sm:flex"
              aria-label="Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[24px] w-[24px] sm:h-[28px] sm:w-[28px]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Link>

            <Link
              href="/cart"
              data-cart-icon
              className="nav-icon-link text-signal-red relative flex items-center"
              aria-label={`Cart (${count} items)`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[24px] w-[24px] sm:h-[28px] sm:w-[28px]">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z" />
              </svg>
              {count > 0 && (
                <span
                  key={count}
                  className="animate-badge-bump bg-signal-red font-hero text-light-grey absolute -top-1 -right-2 flex h-[20px] min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-bold"
                >
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="hamburger-btn flex flex-col items-center justify-center gap-[3px] md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`block h-[3px] w-[24px] rounded bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-[3px] w-[24px] rounded bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[3px] w-[24px] rounded bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
          </div>
        </div>
      </nav>

      <StaggeredMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
