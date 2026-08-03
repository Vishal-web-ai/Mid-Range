"use client";

import {
  FaShirt,
  FaCircleCheck,
  FaTag,
  FaClipboardList,
  FaMoneyBillTrendUp,
} from "react-icons/fa6";
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
      icon: FaShirt,
    },
    {
      title: availableProducts.toLocaleString("en-IN"),
      description: "Currently available for sale",
      label: "Available",
      icon: FaCircleCheck,
    },
    {
      title: soldProducts.toLocaleString("en-IN"),
      description: "Successfully sold items",
      label: "Sold",
      icon: FaTag,
    },
    {
      title: totalOrders.toLocaleString("en-IN"),
      description: "Orders received",
      label: "Orders",
      icon: FaClipboardList,
    },
    {
      title: revenue,
      description: "Total revenue from paid orders",
      label: "Revenue",
      icon: FaMoneyBillTrendUp,
    },
  ];

  return <MagicBento cards={cards} />;
}
