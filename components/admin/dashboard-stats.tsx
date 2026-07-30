"use client";

import MagicBento from "./magic-bento";

interface DashboardStatsProps {
  totalProducts: number;
  availableProducts: number;
  soldProducts: number;
  totalOrders: number;
  revenue: string;
}

export default function DashboardStats({
  totalProducts,
  availableProducts,
  soldProducts,
  totalOrders,
  revenue,
}: DashboardStatsProps) {
  const cards = [
    {
      title: totalProducts.toLocaleString("en-IN"),
      description: "Total products in inventory",
      label: "Products",
    },
    {
      title: availableProducts.toLocaleString("en-IN"),
      description: "Currently available for sale",
      label: "Available",
    },
    {
      title: soldProducts.toLocaleString("en-IN"),
      description: "Successfully sold items",
      label: "Sold",
    },
    {
      title: totalOrders.toLocaleString("en-IN"),
      description: "Orders received",
      label: "Orders",
    },
    {
      title: revenue,
      description: "Total revenue from paid orders",
      label: "Revenue",
    },
  ];

  return <MagicBento cards={cards} />;
}
