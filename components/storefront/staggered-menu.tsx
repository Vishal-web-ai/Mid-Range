"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DEFAULT_NAV_ITEMS = [
  { label: "Collections", href: "/collections" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "About Us", href: "/about" },
];

interface NavItem {
  label: string;
  href: string;
}

interface StaggeredMenuProps {
  open: boolean;
  onClose: () => void;
  items?: NavItem[];
  accentColor?: string;
  layerColors?: [string, string, string];
  menuBg?: string;
  textColor?: string;
  showWishlist?: boolean;
}

type Phase = "closed" | "entering" | "open" | "closing";

export default function StaggeredMenu({
  open,
  onClose,
  items = DEFAULT_NAV_ITEMS,
  accentColor = "#E11D2E",
  layerColors = ["#E11D2E", "#FFFFFF", "#0A0A0A"],
  menuBg = "#FFFFFF",
  textColor = "#0A0A0A",
  showWishlist = true,
}: StaggeredMenuProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeouts = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    clearTimeouts();

    if (open) {
      setPhase("entering");
      // Panel finishes at 220ms + 500ms = 720ms
      timerRef.current = setTimeout(() => {
        setPhase("open");
      }, 720);
    } else {
      setPhase("closing");
      // Items + panel fade (300ms) then layers reverse out (500ms + 140ms = 640ms)
      timerRef.current = setTimeout(() => {
        setPhase("closed");
      }, 850);
    }

    return clearTimeouts;
  }, [open]);

  useEffect(() => {
    if (phase !== "closed") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  const isActive = phase !== "closed";
  const isEntering = phase === "entering";
  const isOpen = phase === "open";
  const isClosing = phase === "closing";
  const showItems = isOpen;
  const showPanel = isEntering || isOpen;

  return (
    <div
      className={`fixed inset-0 z-[60] md:hidden ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Layer 1 — Red */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: layerColors[0],
          transform:
            isEntering || isOpen
              ? "translateX(0)"
              : "translateX(100%)",
          transitionDelay:
            isEntering
              ? "0ms"
              : isClosing
                ? "340ms"
                : "0ms",
        }}
      />

      {/* Layer 2 — White */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: layerColors[1],
          transform:
            isEntering || isOpen
              ? "translateX(0)"
              : "translateX(100%)",
          transitionDelay:
            isEntering
              ? "70ms"
              : isClosing
                ? "270ms"
                : "0ms",
        }}
      />

      {/* Layer 3 — Black */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: layerColors[2],
          transform:
            isEntering || isOpen
              ? "translateX(0)"
              : "translateX(100%)",
          transitionDelay:
            isEntering
              ? "140ms"
              : isClosing
                ? "200ms"
                : "0ms",
        }}
      />

      {/* White menu panel — sweeps in on top of layers */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: menuBg,
          transform: showPanel ? "translateX(0)" : "translateX(100%)",
          transitionDelay: isEntering
            ? "220ms"
            : isClosing
              ? "0ms"
              : "0ms",
        }}
      />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className={`absolute top-5 right-6 cursor-pointer bg-transparent border-0 p-1 transition-opacity duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          showItems ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: showItems ? "200ms" : "0ms", zIndex: 11 }}
        aria-label="Close menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={textColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Nav links */}
      <nav className="absolute inset-0 flex flex-col justify-center px-10 sm:px-16" style={{ zIndex: 10 }}>
        <ul className="flex flex-col gap-5 list-none m-0 p-0">
          {items.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`block font-bold text-4xl sm:text-5xl uppercase tracking-tight no-underline transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                  showItems
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  color: textColor,
                  transitionDelay: showItems ? `${i * 100}ms` : "0ms",
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Wishlist */}
        {showWishlist && (
          <Link
            href="/wishlist"
            onClick={onClose}
            className={`flex items-center gap-2 mt-8 font-bold text-2xl uppercase tracking-tight no-underline transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] text-signal-red ${
              showItems ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: showItems ? "400ms" : "0ms" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Wishlist
          </Link>
        )}
      </nav>
    </div>
  );
}
