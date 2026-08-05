import { notFound } from "next/navigation";
import { Fragment } from "react";
import AddToCartButton from "@/components/storefront/add-to-cart-button";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import ShareCircle from "@/components/storefront/share-circle";
import ScrollReveal from "@/components/ui/scroll-reveal";
import ProductImageGallery from "@/components/storefront/product-image-gallery";
import { getProductBySlug } from "@/lib/product-utils";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  const price = product.discountedPrice ?? product.price;
  const description = `${product.title} — ${formatPrice(price)}${product.category ? ` | ${product.category}` : ""}${product.condition ? ` | ${product.condition}` : ""}${product.size ? ` | Size ${product.size}` : ""}. Shop thrift finds at MidRange.`;
  const image = product.images[0] ?? "/placeholder.png";

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      images: [{ url: image, width: 600, height: 750 }],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const mainImage = product.images[0] ?? "/placeholder.png";

  return (
    <main className="py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:gap-4">
          <ScrollReveal className="w-full md:w-1/2">
            <ProductImageGallery images={product.images} title={product.title} />
          </ScrollReveal>

          <ScrollReveal delay={100} className="w-full md:w-1/2">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <h1 className="font-hero text-light-grey text-2xl font-bold tracking-wider uppercase sm:text-3xl">
                  {product.title}
                </h1>
                <div className="md:hidden">
                  <ShareCircle title={product.title} />
                </div>
              </div>

              {product.discountedPrice ? (
                <div className="flex items-center gap-3">
                  <p className="text-steel-gray text-xl line-through">{formatPrice(product.price)}</p>
                  <p className="text-signal-red text-3xl font-bold">{formatPrice(product.discountedPrice)}</p>
                  <span className="bg-signal-red text-ink-black px-2 py-0.5 text-xs font-bold tracking-wider">
                    -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                  </span>
                  <div className="ml-[1.25em] hidden md:block">
                    <ShareCircle title={product.title} />
                  </div>
                </div>
              ) : (
                <p className="text-signal-red text-3xl font-bold">{formatPrice(product.price)}</p>
              )}

              <div className="flex flex-wrap gap-3">
                {product.size && (
                  <span className="bg-dark-grey border-steel-gray/50 text-light-grey rounded border px-4 py-2 text-sm font-medium">
                    Size : {product.size}
                  </span>
                )}
                {product.condition && (
                  <span className="bg-dark-grey border-steel-gray/50 text-light-grey rounded border px-4 py-2 text-sm font-medium">
                    Condition : {product.condition}
                  </span>
                )}
                {product.status === "sold" && (
                  <span className="bg-signal-red/20 text-signal-red rounded border border-signal-red/50 px-4 py-2 text-sm font-medium">
                    SOLD
                  </span>
                )}
              </div>

              {product.category && (
                <p className="text-steel-gray text-sm">Category: {product.category}</p>
              )}

              {product.status !== "sold" && (
                <div className="flex flex-col gap-3">
                  <WishlistButton productId={product.id} product={product} />
                  <AddToCartButton
                    id={product.id}
                    title={product.title}
                    slug={product.slug}
                    price={product.price}
                    discountedPrice={product.discountedPrice}
                    image={mainImage}
                    size={product.size}
                  />
                </div>
              )}

              {product.specifications && (product.specifications as { label: string; value: string }[]).length > 0 ? (
                <div className="border-steel-gray/40 grid grid-cols-[1fr_1px_1fr] gap-y-px border bg-steel-gray/40">
                  {(product.specifications as { label: string; value: string }[]).map((spec, i) => (
                    <Fragment key={i}>
                      <div className="bg-[#0F0F0F] px-4 py-2.5">
                        <span className="text-steel-gray text-sm">{spec.label}</span>
                      </div>
                      <div aria-hidden />
                      <div className="bg-[#0F0F0F] px-4 py-2.5 text-right">
                        <span className="text-light-grey text-sm font-medium">{spec.value}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              ) : product.details.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {product.details.map((detail, i) => (
                    <li key={i} className="text-light-grey flex items-start gap-2 text-sm">
                      <span className="text-signal-red mt-0.5">+</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
