"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "./product-form";

interface EditProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice: number | null;
  size: string | null;
  tag: string | null;
  category: string | null;
  condition: string | null;
  gender: string | null;
  details: string[];
  specifications: { label: string; value: string }[];
  images: string[];
  video: string | null;
  status: string;
  createdAt: Date | string;
}

interface ProductEditModalProps {
  product: EditProduct;
  onClose: () => void;
  onSaved: () => void;
}

export function ProductEditModal({ product, onClose, onSaved }: ProductEditModalProps) {
  const [tick, setTick] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !tick) onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tick, onClose]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevOverflow = html.style.overflow;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;
    const scrollY = window.scrollY;

    html.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = prevOverflow;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);

  function handleSaved() {
    setTick(true);
    setTimeout(() => onSaved(), 1300);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="bg-ink-black/70 fixed inset-0 backdrop-blur-sm"
        onClick={tick ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit product"
        className="border-steel-gray/20 bg-dark-grey animate-dialog-in relative max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl border p-5 shadow-2xl sm:p-6 scrollbar-invisible"
        data-lenis-prevent
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-hero text-signal-red text-lg font-bold">Edit Product</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={tick}
            aria-label="Close"
            className="text-signal-red hover:text-light-grey transition-colors disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ProductForm product={product} onSaved={handleSaved} />
      </div>

      {tick && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-4 bg-black/80">
          <div className="animate-check-pop bg-green-500 flex h-24 w-24 items-center justify-center rounded-full shadow-lg shadow-green-500/40">
            <svg
              className="check-draw h-12 w-12 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="text-light-grey text-sm font-medium tracking-wide uppercase">Saved</p>
        </div>
      )}
    </div>
  );
}
