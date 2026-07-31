"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder = "Select...", className }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex w-full items-center justify-between rounded border px-3 py-2 text-sm transition-colors",
          open
            ? "border-signal-red bg-ink-black"
            : "border-steel-gray bg-ink-black hover:border-light-grey",
          selected ? "text-light-grey" : "text-steel-gray",
        )}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <svg
          className={cn("ml-2 h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-steel-gray bg-dark-grey absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border shadow-lg" data-lenis-prevent>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-sm transition-colors",
                option.value === value
                  ? "bg-signal-red/10 text-signal-red"
                  : "text-light-grey hover:bg-ink-black",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
