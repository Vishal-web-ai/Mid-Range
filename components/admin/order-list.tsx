"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  price: number;
  product: {
    id: string;
    title: string;
    images: string[];
  };
}

interface Order {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date | string;
  items: OrderItem[];
}

function formatDate(dateVal: Date | string): string {
  return new Date(dateVal).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-steel-gray/30 text-steel-gray",
  shipped: "bg-blue-900/40 text-blue-400",
  delivered: "bg-green-900/40 text-green-400",
};

export function OrderList({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpdateStatus(id: string, newStatus: string) {
    const label = newStatus === "shipped" ? "shipped" : "delivered";
    if (!confirm(`Mark order as ${label}?`)) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      alert("Failed to update order status");
    } finally {
      setLoading(null);
    }
  }

  if (orders.length === 0) {
    return (
      <p className="border-steel-gray bg-dark-grey text-steel-gray rounded border p-8 text-center">
        No orders yet
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="border-steel-gray bg-dark-grey hidden overflow-x-auto rounded border lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-steel-gray text-steel-gray border-b text-xs uppercase">
              <th className="p-3">Order ID</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-steel-gray/50 border-b last:border-0">
                <td className="text-light-grey p-3 font-mono text-xs">{shortId(order.id)}</td>
                <td className="text-light-grey p-3">{order.buyerName}</td>
                <td className="text-light-grey p-3">{order.buyerPhone}</td>
                <td className="text-light-grey p-3">{order.items.length}</td>
                <td className="text-light-grey p-3 font-medium">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="p-3">
                  <span
                    className={cn(
                      "inline-block rounded px-2 py-0.5 text-xs font-medium capitalize",
                      STATUS_STYLES[order.orderStatus] ?? "bg-steel-gray/30 text-steel-gray",
                    )}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="text-steel-gray p-3">{formatDate(order.createdAt)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {order.orderStatus === "placed" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "shipped")}
                        disabled={loading === order.id}
                        className="text-light-grey hover:text-signal-red text-xs transition-colors disabled:opacity-50"
                      >
                        Ship
                      </button>
                    )}
                    {order.orderStatus === "shipped" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "delivered")}
                        disabled={loading === order.id}
                        className="text-light-grey hover:text-signal-red text-xs transition-colors disabled:opacity-50"
                      >
                        Deliver
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {orders.map((order) => (
          <div key={order.id} className="border-steel-gray bg-dark-grey rounded border p-3">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-steel-gray font-mono text-xs">#{shortId(order.id)}</span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-xs font-medium capitalize",
                      STATUS_STYLES[order.orderStatus] ?? "bg-steel-gray/30 text-steel-gray",
                    )}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-light-grey mt-1 text-sm font-medium">{order.buyerName}</p>
                <p className="text-steel-gray text-xs">{order.buyerPhone}</p>
              </div>
              <div className="text-right">
                <p className="text-light-grey text-sm font-medium">
                  {formatPrice(order.totalAmount)}
                </p>
                <p className="text-steel-gray text-xs">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div className="border-steel-gray/50 mt-2 border-t pt-2">
              <p className="text-steel-gray text-xs">
                {order.items.length} item{order.items.length !== 1 && "s"}:{" "}
                {order.items.map((item) => item.product.title).join(", ")}
              </p>
            </div>

            <div className="border-steel-gray/50 mt-2 flex items-center gap-3 border-t pt-2">
              {order.orderStatus === "placed" && (
                <button
                  onClick={() => handleUpdateStatus(order.id, "shipped")}
                  disabled={loading === order.id}
                  className="text-light-grey hover:text-signal-red text-xs transition-colors disabled:opacity-50"
                >
                  Mark Shipped
                </button>
              )}
              {order.orderStatus === "shipped" && (
                <button
                  onClick={() => handleUpdateStatus(order.id, "delivered")}
                  disabled={loading === order.id}
                  className="text-light-grey hover:text-signal-red text-xs transition-colors disabled:opacity-50"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
