"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
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

  useEffect(() => {
    setCount(getItemCount());
  }, [getItemCount]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);

  const ease = "power3.out";
  const NAV_H = 42;

  useEffect(() => {
    let cancelled = false;

    const layout = () => {
      if (cancelled) return;
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const white = pill.querySelector<HTMLElement>(".pill-label-hover");
        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const idx = circleRefs.current.indexOf(circle);
        if (idx === -1) return;

        tlRefs.current[idx]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
        }
        tlRefs.current[idx] = tl;
      });
    };

    layout();
    window.addEventListener("resize", layout);

    let fontsReadyAbort: (() => void) | null = null;
    if (document.fonts) {
      const controller = new AbortController();
      fontsReadyAbort = () => controller.abort();
      document.fonts.ready.then(() => {
        if (!cancelled) layout();
      }).catch(() => {});
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", layout);
      fontsReadyAbort?.();
      tlRefs.current.forEach((tl) => tl?.kill());
      activeTweenRefs.current.forEach((tween) => tween?.kill());
    };
  }, [ease]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const cssVars = {
    "--base": "#E11D2E",
    "--pill-bg": "#1a1a1a",
    "--hover-text": "#FFFFFF",
    "--pill-text": "#D8D8D6",
    "--nav-h": `${NAV_H}px`,
  } as React.CSSProperties;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full" suppressHydrationWarning>
        <div className="container-storefront relative flex h-12 items-center sm:h-14" style={cssVars}>
          <Link
            href="/"
            className="font-hero text-gradient-red relative z-10 shrink-0 text-xl font-bold tracking-widest uppercase sm:text-2xl"
          >
            MidRange
          </Link>

          <div
            className="absolute left-1/2 -translate-x-1/2 hidden items-center overflow-hidden rounded-full md:flex"
            style={{ height: "var(--nav-h)", background: "var(--pill-bg)" }}
          >
            <ul
              role="menubar"
              className="flex h-full list-none items-stretch m-0 p-[3px]"
              style={{ gap: "3px" }}
            >
              {NAV_ITEMS.map((item, i) => {
                return (
                  <li key={item.href} role="none" className="flex h-full">
                    <Link
                      role="menuitem"
                      href={item.href}
                      className="relative box-border flex cursor-pointer items-center justify-center overflow-hidden rounded-full px-[18px] py-0 text-[15px] font-semibold uppercase leading-none tracking-wide whitespace-nowrap no-underline"
                      style={{
                        background: "var(--pill-bg)",
                        color: "var(--pill-text)",
                        height: "var(--nav-h)",
                      }}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      <span
                        className="absolute left-1/2 bottom-0 z-[1] block rounded-full pointer-events-none"
                        style={{ background: "var(--base)", willChange: "transform" }}
                        aria-hidden="true"
                        ref={(el) => {
                          circleRefs.current[i] = el;
                        }}
                      />
                      <span className="label-stack relative z-[2] inline-block leading-none">
                        <span
                          className="pill-label relative z-[2] inline-block leading-none"
                          style={{ willChange: "transform" }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                          style={{ color: "var(--hover-text)", willChange: "transform, opacity" }}
                          aria-hidden="true"
                        >
                          {item.label}
                          </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
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
