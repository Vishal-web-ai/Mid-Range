import { prisma } from "@/lib/prisma";
import CollectionPageClient from "@/components/storefront/collection-page-client";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Women's Collection",
  description: "Shop curated women's thrift finds at MidRange. Vintage and secondhand clothing with honest prices.",
};

export default async function WomenPage() {
  const products = await prisma.product.findMany({
    where: { status: "available", gender: "women" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      discountedPrice: true,
      images: true,
      size: true,
      tag: true,
      status: true,
      category: true,
      condition: true,
    },
  });

  return (
    <CollectionPageClient
      initialProducts={products}
      title="Women's Collection"
      accentWord="Collection"
    />
  );
}
