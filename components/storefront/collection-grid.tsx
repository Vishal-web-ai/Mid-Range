"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import ProductCard from "@/components/storefront/product-card";
import FilterModal from "@/components/storefront/filter-modal";
import SortModal from "@/components/storefront/sort-modal";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number | null;
  images: string[];
  size: string | null;
  status: string;
  category: string | null;
  condition: string | null;
};

function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "name-za":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "oldest":
      return sorted;
    case "newest":
    default:
      return sorted.reverse();
  }
}

export default function CollectionGrid({
  products,
  categories,
  sizes,
  conditions,
}: {
  products: Product[];
  categories: string[];
  sizes: string[];
  conditions: string[];
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999900]);
  const [sortBy, setSortBy] = useState("newest");

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  function toggleCondition(cond: string) {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  }

  function clearAll() {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setPriceRange([0, 999900]);
  }

  const filtered = products.filter((p) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category ?? "")) return false;
    if (selectedSizes.length > 0 && !selectedSizes.includes(p.size ?? "")) return false;
    if (selectedConditions.length > 0 && p.condition != null && !selectedConditions.includes(p.condition)) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  });

  const sorted = sortProducts(filtered, sortBy);

  const filterHash = useMemo(
    () =>
      `${sortBy}-${selectedCategories.join()}-${selectedSizes.join()}-${selectedConditions.join()}-${priceRange[0]}-${priceRange[1]}`,
    [sortBy, selectedCategories, selectedSizes, selectedConditions, priceRange],
  );

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-product]");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 60, scale: 0.95, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
        clearProps: "transform,filter",
      },
    );
  }, [filterHash]);

  const activeFilterCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedConditions.length +
    (priceRange[0] !== 0 || priceRange[1] !== 999900 ? 1 : 0);

  return (
    <>
      <div className="mb-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="font-hero bg-dark-grey text-light-grey border-steel-gray/30 flex items-center gap-2 border px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors hover:border-signal-red"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Filter
          {activeFilterCount > 0 && (
            <span className="bg-signal-red text-light-grey flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px]">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSortOpen(true)}
          className="font-hero bg-dark-grey text-light-grey border-steel-gray/30 flex items-center gap-2 border px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors hover:border-signal-red"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 16 4 4 4-4" /><path d="M7 20V4" />
            <path d="m21 8-4-4-4 4" /><path d="M17 4v16" />
          </svg>
          Sort
        </button>

        <p className="text-steel-gray text-xs font-semibold sm:text-sm">
          {sorted.length} {sorted.length === 1 ? "Piece" : "Pieces"} Available
        </p>
      </div>

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        sizes={sizes}
        conditions={conditions}
        selectedCategories={selectedCategories}
        selectedSizes={selectedSizes}
        selectedConditions={selectedConditions}
        priceRange={priceRange}
        onToggleCategory={toggleCategory}
        onToggleSize={toggleSize}
        onToggleCondition={toggleCondition}
        onPriceRangeChange={setPriceRange}
        onClearAll={clearAll}
        activeCount={sorted.length}
      />

      <SortModal
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={sortBy}
        onChange={setSortBy}
      />

      {sorted.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-hero text-steel-gray text-lg tracking-wider uppercase">
            No items match your filters
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="font-hero text-signal-red mt-4 text-sm font-bold tracking-wider uppercase hover:opacity-80"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-2 gap-1 sm:gap-2 md:grid-cols-3 lg:grid-cols-4">
          {sorted.map((product, i) => (
            <div key={product.id} data-product>
              <ProductCard
                id={product.id}
                title={product.title}
                slug={product.slug}
                price={product.price}
                discountedPrice={product.discountedPrice ?? undefined}
                images={product.images}
                size={product.size}
                status={product.status}
                delay={i * 60}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
