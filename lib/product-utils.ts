import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const PRODUCT_SELECT = {
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
  gender: true,
  details: true,
  specifications: true,
  video: true,
} as const;

export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.product.findUnique({
      where: { slug },
      select: PRODUCT_SELECT,
    });
  },
  ["product-by-slug"],
  { revalidate: 60, tags: ["products"] }
);
