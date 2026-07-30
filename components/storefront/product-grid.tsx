import Link from "next/link";
import ProductCard from "@/components/storefront/product-card";

type ProductRow = {
  id: string; title: string; slug: string; price: number;
  discountedPrice: number | null; images: string[];
  size: string | null; status: string;
};

export default function ProductGrid({ products }: { products: ProductRow[] }) {

  if (products.length === 0) {
    return (
      <section className="section-spacing">
        <div className="container-wide">
          <div className="border-steel-gray/20 border-t pt-16">
            <h2 className="font-hero font-bold text-light-grey max-w-4xl text-3xl leading-[1.1] tracking-wide uppercase sm:text-5xl">
              Latest <span className="text-signal-red">Drops</span>
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing">
      <div className="container-wide">
        <div className="border-steel-gray/20 border-t pt-16">
          <div className="mb-8 flex items-end justify-between sm:mb-12">
            <div>
              <h2 className="font-hero font-bold text-light-grey max-w-4xl text-3xl leading-[1.1] tracking-wide uppercase sm:text-5xl">
                Latest <span className="text-signal-red">Drops</span>
              </h2>
            </div>

          </div>
          <div className="grid grid-cols-2 gap-1 sm:gap-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                slug={product.slug}
                price={product.price}
                discountedPrice={product.discountedPrice ?? undefined}
                images={product.images}
                size={product.size}
                status={product.status}
                delay={i * 80}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center sm:mt-12">
            <Link
              href="/collections"
              className="font-hero bg-signal-red text-light-grey px-8 py-3 text-xs font-bold tracking-widest uppercase transition-colors hover:opacity-90"
            >
              Load More Heat
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
