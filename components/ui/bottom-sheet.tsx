"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="bg-ink-black/60 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        className={cn(
          "bg-ink-black border-steel-gray/20 fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto border-t animate-slide-up",
          className
        )}
        data-lenis-prevent
      >
        <div className="container-storefront">
          <div className="flex items-center justify-between py-4">
            <h2 className="font-hero text-light-grey text-sm font-bold tracking-widest uppercase">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-steel-gray hover:text-light-grey transition-colors"
              aria-label="Close"
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

          <div className="border-steel-gray/10 border-t" />

          <div className="py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
