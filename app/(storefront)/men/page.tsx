import { prisma } from "@/lib/prisma";
import CollectionPageClient from "@/components/storefront/collection-page-client";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Men's Collection",
  description: "Shop curated men's thrift finds at MidRange. Vintage and secondhand clothing with honest prices.",
};

export default async function MenPage() {
  const products = await prisma.product.findMany({
    where: { status: "available", gender: "men" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      discountedPrice: true,
      images: true,
      size: true,
      status: true,
      category: true,
      condition: true,
    },
  });

  return (
    <CollectionPageClient
      initialProducts={products}
      title="Men's Collection"
      accentWord="Collection"
    />
  );
}
