"use client";

import { useMemo } from "react";
import CollectionGrid from "@/components/storefront/collection-grid";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number | null;
  images: string[];
  size?: string | null;
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
  const pathname = usePathname();

  const categories = useMemo(() => [...new Set(initialProducts.map((p) => p.category).filter(Boolean))] as string[], [initialProducts]);
  const sizes = useMemo(() => [...new Set(initialProducts.map((p) => p.size).filter(Boolean))] as string[], [initialProducts]);
  const conditions = useMemo(() => [...new Set(initialProducts.map((p) => p.condition).filter(Boolean))] as string[], [initialProducts]);

  const activeTab = pathname.includes("/men") ? "men" : pathname.includes("/women") ? "women" : "all";

  return (
    <main className="py-1">
      <div className="container-wide">
        <div className="border-steel-gray/20 border-t pt-0">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="font-hero text-light-grey text-2xl font-bold tracking-wider uppercase sm:text-3xl md:text-5xl whitespace-nowrap">
              {accentWord ? (
                <>{title.split(accentWord)[0]}<span className="text-signal-red">{accentWord}</span>{title.split(accentWord)[1]}</>
              ) : title}
            </h1>
            <div className="font-hero flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase sm:text-xs">
              <Link href="/men" className={`${activeTab === "men" ? "bg-signal-red text-light-grey" : "bg-dark-grey text-steel-gray hover:text-light-grey"} px-2 py-1 sm:px-3 sm:py-1.5 transition-colors`}>
                Men
              </Link>
              <Link href="/women" className={`${activeTab === "women" ? "bg-signal-red text-light-grey" : "bg-dark-grey text-steel-gray hover:text-light-grey"} px-2 py-1 sm:px-3 sm:py-1.5 transition-colors`}>
                Women
              </Link>
              <Link href="/collections" className={`${activeTab === "all" ? "bg-signal-red text-light-grey" : "bg-dark-grey text-steel-gray hover:text-light-grey"} px-2 py-1 sm:px-3 sm:py-1.5 transition-colors`}>
                All
              </Link>
            </div>
          </div>
          <p className="text-steel-gray mb-4 text-sm sm:text-base">
            {initialProducts.length} {initialProducts.length === 1 ? "piece" : "pieces"} available
          </p>

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
