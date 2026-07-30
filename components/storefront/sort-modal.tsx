"use client";

import BottomSheet from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
  { value: "name-za", label: "Name: Z to A" },
] as const;

type SortModalProps = {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
};

export default function SortModal({
  open,
  onClose,
  value,
  onChange,
}: SortModalProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Sort By">
      <div className="flex flex-col gap-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value);
              onClose();
            }}
            className={cn(
              "font-hero flex items-center justify-between px-3 py-3 text-[11px] font-bold tracking-wider uppercase transition-colors",
              value === opt.value
                ? "text-signal-red"
                : "text-light-grey hover:bg-dark-grey"
            )}
          >
            <span>{opt.label}</span>
            {value === opt.value && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
