"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  loadingLabel?: string;
  danger?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmDialog({
  open,
  title,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  loadingLabel,
  danger = false,
  children,
}: ConfirmDialogProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, loading, onClose]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevOverflow = html.style.overflow;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;
    const scrollY = window.scrollY;

    if (open) {
      html.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";
    }

    return () => {
      if (open) {
        html.style.overflow = prevOverflow;
        body.style.position = prevPosition;
        body.style.top = prevTop;
        body.style.width = prevWidth;
        window.scrollTo(0, scrollY);
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="bg-ink-black/70 absolute inset-0 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="border-steel-gray/20 bg-dark-grey animate-dialog-in relative w-full max-w-md rounded-2xl border p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-hero text-signal-red text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="text-steel-gray hover:text-light-grey transition-colors disabled:opacity-50"
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

        <div className="mt-4">{children}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="border-steel-gray text-light-grey hover:bg-ink-black rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50",
              danger
                ? "bg-signal-red hover:bg-red-700"
                : "bg-signal-red hover:bg-red-700",
            )}
          >
            {loading
              ? loadingLabel ?? (danger ? "Deleting..." : "Working...")
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
