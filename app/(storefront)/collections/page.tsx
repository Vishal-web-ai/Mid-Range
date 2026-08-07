import { prisma } from "@/lib/prisma";
import CollectionPageClient from "@/components/storefront/collection-page-client";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Collections",
  description: "Browse all available thrift finds at MidRange. Curated secondhand clothing with honest prices.",
};

export default async function CollectionsPage() {
  const products = await prisma.product.findMany({
    where: { status: "available" },
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
      title="All Collections"
      accentWord="Collections"
    />
  );
}
