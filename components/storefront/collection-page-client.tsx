"use client";

import { useMemo } from "react";
import CollectionGrid from "@/components/storefront/collection-grid";
import { CATEGORIES } from "@/lib/categories";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number | null;
  images: string[];
  size?: string | null;
  tag?: string | null;
  status: string;
  category?: string | null;
  condition?: string | null;
}

interface Props {
  initialProducts: Product[];
  title: string;
  accentWord?: string;
}

export default function CollectionPageClient({ initialProducts, title, accentWord }: Props) {
  const categories = useMemo(
    () =>
      [...new Set([...CATEGORIES, ...initialProducts.map((p) => p.category).filter(Boolean)])] as string[],
    [initialProducts],
  );
  const sizes = useMemo(() => [...new Set(initialProducts.map((p) => p.size).filter(Boolean))] as string[], [initialProducts]);
  const conditions = useMemo(() => [...new Set(initialProducts.map((p) => p.condition).filter(Boolean))] as string[], [initialProducts]);

  return (
    <main className="py-1">
      <div className="container-wide">
        <div className="border-steel-gray/20 border-t pt-0">
          <div className="mb-3 flex justify-center">
            <h1 className="font-hero text-light-grey text-2xl font-bold tracking-wider uppercase sm:text-3xl md:text-5xl whitespace-nowrap">
              {accentWord ? (
                <>{title.split(accentWord)[0]}<span className="text-signal-red">{accentWord}</span>{title.split(accentWord)[1]}</>
              ) : title}
            </h1>
          </div>

          <CollectionGrid
            products={initialProducts}
            categories={categories}
            sizes={sizes}
            conditions={conditions}
          />
        </div>
      </div>
    </main>
  );
}
