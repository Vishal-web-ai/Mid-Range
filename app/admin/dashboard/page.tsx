import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/admin/dashboard-stats";

export const dynamic = "force-dynamic";

function formatPaise(amount: number) {
  return `₹${(amount / 100).toLocaleString("en-IN")}`;
}

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    availableProducts,
    soldProducts,
    totalOrders,
    revenueResult,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "available" } }),
    prisma.product.count({ where: { status: "sold" } }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "paid" },
    }),
    prisma.order.groupBy({
      by: ["orderStatus"],
      _count: { orderStatus: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, buyerName: true, buyerPhone: true, buyerAddress: true,
        totalAmount: true, paymentStatus: true, orderStatus: true, createdAt: true,
        items: {
          select: {
            id: true, price: true,
            product: { select: { id: true, title: true } },
          },
        },
      },
    }),
  ]);

  const totalRevenue = revenueResult._sum.totalAmount ?? 0;

  const statusMap: Record<string, number> = { placed: 0, shipped: 0, delivered: 0 };
  for (const row of ordersByStatus) {
    statusMap[row.orderStatus] = row._count.orderStatus;
  }

  const statusCards = [
    { label: "Placed", value: statusMap.placed, accent: "text-amber-400" },
    { label: "Shipped", value: statusMap.shipped, accent: "text-blue-400" },
    { label: "Delivered", value: statusMap.delivered, accent: "text-emerald-400" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-light-grey font-hero text-2xl font-bold sm:text-3xl">Dashboard</h1>
      </div>

      <DashboardStats
        totalProducts={totalProducts}
        availableProducts={availableProducts}
        soldProducts={soldProducts}
        totalOrders={totalOrders}
        revenue={formatPaise(totalRevenue)}
      />

      <div className="mt-6">
        <h2 className="text-light-grey font-hero text-xl font-bold">Orders by Status</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {statusCards.map((card) => (
            <div
              key={card.label}
              className="bg-dark-grey rounded-lg border border-steel-gray/20 p-4"
            >
              <p className="font-hero text-signal-red text-sm font-bold uppercase tracking-wider">{card.label}</p>
              <p className="mt-1 font-hero text-2xl font-bold text-light-grey">
                {card.value.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-light-grey font-hero text-lg font-bold">Recent Orders</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-steel-gray/20">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-dark-grey border-b border-steel-gray/20">
                <th className="text-signal-red px-4 py-3 font-medium">Order</th>
                <th className="text-signal-red px-4 py-3 font-medium">Customer</th>
                <th className="text-signal-red px-4 py-3 font-medium">Items</th>
                <th className="text-signal-red px-4 py-3 font-medium">Amount</th>
                <th className="text-signal-red px-4 py-3 font-medium">Payment</th>
                <th className="text-signal-red px-4 py-3 font-medium">Status</th>
                <th className="text-signal-red px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-steel-gray px-4 py-6 text-center">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-steel-gray/10 last:border-b-0"
                  >
                    <td className="text-light-grey px-4 py-3 font-mono text-xs">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="text-light-grey px-4 py-3">
                      <div>{order.buyerName}</div>
                      <div className="text-steel-gray text-xs">{order.buyerPhone}</div>
                    </td>
                    <td className="text-light-grey px-4 py-3">{order.items.length}</td>
                    <td className="text-light-grey px-4 py-3 font-medium">
                      {formatPaise(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-900/40 text-emerald-400"
                            : order.paymentStatus === "failed"
                              ? "bg-signal-red/20 text-signal-red"
                              : "bg-amber-900/40 text-amber-400"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          order.orderStatus === "delivered"
                            ? "bg-emerald-900/40 text-emerald-400"
                            : order.orderStatus === "shipped"
                              ? "bg-blue-900/40 text-blue-400"
                              : "bg-amber-900/40 text-amber-400"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="text-steel-gray px-4 py-3 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
