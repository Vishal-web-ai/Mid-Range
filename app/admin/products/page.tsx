import { prisma } from "@/lib/prisma";
import { ProductList } from "@/components/admin/product-list";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, slug: true, price: true, discountedPrice: true,
      size: true, category: true, condition: true, gender: true,
      details: true, images: true, status: true, createdAt: true,
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-light-grey font-hero text-2xl font-bold sm:text-3xl">Products</h1>
        <p className="text-steel-gray mt-1 text-sm">
          {products.length} product{products.length !== 1 && "s"}
        </p>
      </div>
      <ProductList products={products} />
    </div>
  );
}
