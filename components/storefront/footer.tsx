"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="relative">
      <div className="h-[2px] bg-signal-red" />

      <div className={isHome ? "border-steel-gray/20 border-t py-12" : "border-steel-gray/20 border-t py-5"}>
        <div className="container-wide">
          <div className={isHome ? "mb-12" : "mb-4"}>
            <Link href="/" className="flex items-center" aria-label="MidRange">
              <Image
                src="/logo/logo.png"
                alt="MidRange"
                width={1536}
                height={1024}
                className={isHome ? "h-8 w-auto" : "h-6 w-auto"}
              />
            </Link>
            <p className={isHome
              ? "text-steel-gray mt-3 text-lg font-semibold leading-tight"
              : "text-steel-gray mt-1 text-xs font-semibold leading-tight"
            }>
              One-of-one thrift finds.
              <br />
              Bold style, honest prices.
            </p>
          </div>

          <div className={isHome ? "mb-12 grid grid-cols-2 gap-8 sm:grid-cols-3" : "mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3"}>
            <div>
              <h4 className={isHome
                ? "font-hero text-signal-red mb-4 text-sm font-bold tracking-widest uppercase"
                : "font-hero text-signal-red mb-1 text-[10px] font-bold tracking-widest uppercase"
              }>
                Policies
              </h4>
              <ul className={isHome ? "space-y-3" : "space-y-1"}>
                {[
                  { href: "/policies/terms", label: "Terms & Conditions" },
                  { href: "/policies/returns", label: "Return & Refund Policy" },
                  { href: "/policies/shipping", label: "Shipping Policy" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={isHome
                        ? "font-hero text-steel-gray hover:text-light-grey text-sm font-bold tracking-widest uppercase transition-colors"
                        : "font-hero text-steel-gray hover:text-light-grey text-[10px] font-bold tracking-widest uppercase transition-colors"
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={isHome
                ? "font-hero text-signal-red mb-4 text-sm font-bold tracking-widest uppercase"
                : "font-hero text-signal-red mb-1 text-[10px] font-bold tracking-widest uppercase"
              }>
                Company
              </h4>
              <ul className={isHome ? "space-y-3" : "space-y-1"}>
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact Us" },
                  { href: "/faq", label: "FAQ" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={isHome
                        ? "font-hero text-steel-gray hover:text-light-grey text-sm font-bold tracking-widest uppercase transition-colors"
                        : "font-hero text-steel-gray hover:text-light-grey text-[10px] font-bold tracking-widest uppercase transition-colors"
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={isHome
                ? "font-hero text-signal-red mb-4 text-sm font-bold tracking-widest uppercase"
                : "font-hero text-signal-red mb-1 text-[10px] font-bold tracking-widest uppercase"
              }>
                Follow Us
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-steel-gray hover:text-light-grey transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isHome ? "h-6 w-6" : "h-3 w-3"}
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/91XXXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-steel-gray hover:text-light-grey transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isHome ? "h-6 w-6" : "h-3 w-3"}
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className={isHome ? "border-steel-gray/20 border-t pt-6" : "border-steel-gray/20 border-t pt-3"}>
            <p className={isHome ? "text-steel-gray/50 text-sm" : "text-steel-gray/50 text-[10px]"}>
              &copy; {new Date().getFullYear()} MidRange. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
