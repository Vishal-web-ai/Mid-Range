"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import StaggeredMenu from "@/components/storefront/staggered-menu";

const NAV_ITEMS: readonly { href: string; label: string; disabled?: boolean }[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customize", label: "Customize" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="bg-ink-black text-light-grey min-h-screen">
      <header className="border-steel-gray bg-dark-grey flex items-center justify-between border-b px-4 py-3 lg:hidden">
        <Link href="/admin/dashboard" className="text-gradient-red font-hero text-lg font-bold">
          MidRange Admin
        </Link>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-[3px] text-light-grey"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block h-[2px] w-5 rounded bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
          <span className={`block h-[2px] w-5 rounded bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-[2px] w-5 rounded bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-52px)]">
        <aside className="border-steel-gray bg-dark-grey hidden w-56 shrink-0 border-r lg:block">
          <div className="sticky top-0 p-4">
            <Link
              href="/admin/products"
              className="text-gradient-red font-hero block text-lg font-bold"
            >
              MidRange Admin
            </Link>
            <nav className="mt-6 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "rounded-r border-l-2 px-3 py-2 text-sm font-medium transition-colors",
                    item.disabled
                      ? "text-steel-gray cursor-not-allowed border-transparent"
                      : isActive(item.href)
                        ? "border-signal-red bg-ink-black text-signal-red"
                        : "text-light-grey hover:bg-ink-black hover:text-signal-red border-transparent",
                  )}
                >
                  {item.label}
                  {item.disabled && <span className="text-steel-gray ml-1 text-xs">(Phase 3)</span>}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <StaggeredMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={NAV_ITEMS.map((item) => ({ label: item.label, href: item.href }))}
        showWishlist={false}
      />
    </div>
  );
}
