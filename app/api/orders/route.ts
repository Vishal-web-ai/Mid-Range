import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateOrderSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return Response.json(orders, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return Response.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, ...orderData } = parsed.data;

    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    const order = await prisma.order.create({
      data: {
        ...orderData,
        totalAmount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            price: item.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    return Response.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return Response.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
