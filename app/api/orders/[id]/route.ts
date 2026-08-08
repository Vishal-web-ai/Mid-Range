import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { UpdateOrderStatusSchema } from "@/lib/schemas";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(order, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { orderStatus: parsed.data.orderStatus },
      include: { items: { include: { product: true } } },
    });

    return Response.json(order);
  } catch (error) {
    console.error("PUT /api/orders/[id] error:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { select: { productId: true } } },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.delete({ where: { id } });

      for (const item of order.items) {
        const otherSale = await tx.orderItem.findFirst({
          where: {
            productId: item.productId,
            order: { id: { not: id }, paymentStatus: "paid" },
          },
        });
        if (!otherSale) {
          await tx.product.updateMany({
            where: { id: item.productId, status: "sold" },
            data: { status: "available" },
          });
        }
      }
    });

    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/admin/products");

    return Response.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return Response.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
