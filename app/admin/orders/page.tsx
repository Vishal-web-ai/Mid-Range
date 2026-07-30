import { prisma } from "@/lib/prisma";
import { OrderList } from "@/components/admin/order-list";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, buyerName: true, buyerPhone: true, buyerAddress: true,
      totalAmount: true, paymentStatus: true, orderStatus: true, createdAt: true,
      items: {
        select: {
          id: true, price: true,
          product: { select: { id: true, title: true, images: true } },
        },
      },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-light-grey font-hero text-2xl font-bold sm:text-3xl">Orders</h1>
        <p className="text-steel-gray mt-1 text-sm">
          {orders.length} order{orders.length !== 1 && "s"}
        </p>
      </div>
      <OrderList orders={orders} />
    </div>
  );
}
