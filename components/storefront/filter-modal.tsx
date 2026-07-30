"use client";

import BottomSheet from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";

type FilterModalProps = {
  open: boolean;
  onClose: () => void;
  categories: string[];
  sizes: string[];
  conditions: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  selectedConditions: string[];
  priceRange: [number, number];
  onToggleCategory: (cat: string) => void;
  onToggleSize: (size: string) => void;
  onToggleCondition: (cond: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearAll: () => void;
  activeCount: number;
};

const PRICE_RANGES: { label: string; range: [number, number] }[] = [
  { label: "Under ₹500", range: [0, 50000] },
  { label: "₹500 – ₹1,000", range: [50000, 100000] },
  { label: "₹1,000 – ₹2,000", range: [100000, 200000] },
  { label: "₹2,000+", range: [200000, 999900] },
];

const NUMERIC_SIZES = ["28", "30", "32", "34", "36", "38", "40"];
const CONDITION_OPTIONS = ["1/10", "2/10", "3/10", "4/10", "5/10", "6/10", "7/10", "8/10", "9/10", "10/10"];

export default function FilterModal({
  open,
  onClose,
  categories,
  selectedCategories,
  selectedSizes,
  selectedConditions,
  priceRange,
  onToggleCategory,
  onToggleSize,
  onToggleCondition,
  onPriceRangeChange,
  onClearAll,
  activeCount,
}: FilterModalProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Filters">
      <div className="flex flex-col gap-6">

        {categories.length > 0 && (
          <div>
            <h3 className="font-hero text-signal-red mb-3 text-xs font-bold tracking-widest uppercase">
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onToggleCategory(cat)}
                  className={cn(
                    "font-hero px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors",
                    selectedCategories.includes(cat)
                      ? "bg-signal-red text-light-grey"
                      : "bg-dark-grey text-steel-gray hover:text-light-grey"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-hero text-signal-red mb-3 text-xs font-bold tracking-widest uppercase">
            Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {NUMERIC_SIZES.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => onToggleSize(sz)}
                className={cn(
                  "font-hero px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors",
                  selectedSizes.includes(sz)
                    ? "bg-signal-red text-light-grey"
                    : "bg-dark-grey text-steel-gray hover:text-light-grey"
                )}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-hero text-signal-red mb-3 text-xs font-bold tracking-widest uppercase">
            Condition
          </h3>
          <div className="flex flex-wrap gap-2">
            {CONDITION_OPTIONS.map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => onToggleCondition(cond)}
                className={cn(
                  "font-hero px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors",
                  selectedConditions.includes(cond)
                    ? "bg-signal-red text-light-grey"
                    : "bg-dark-grey text-steel-gray hover:text-light-grey"
                )}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-hero text-signal-red mb-3 text-xs font-bold tracking-widest uppercase">
            Price
          </h3>
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGES.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() =>
                  onPriceRangeChange(
                    priceRange[0] === r.range[0] && priceRange[1] === r.range[1]
                      ? [0, 999900]
                      : r.range
                  )
                }
                className={cn(
                  "font-hero px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors",
                  priceRange[0] === r.range[0] && priceRange[1] === r.range[1]
                    ? "bg-signal-red text-light-grey"
                    : "bg-dark-grey text-steel-gray hover:text-light-grey"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-steel-gray/10 border-t" />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClearAll}
            className="font-hero text-steel-gray flex-1 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors hover:text-light-grey"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="font-hero bg-signal-red text-light-grey flex-1 py-2.5 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90"
          >
            Show {activeCount} {activeCount === 1 ? "Result" : "Results"}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
