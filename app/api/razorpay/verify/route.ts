import { createHmac } from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { RazorpayVerifySchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RazorpayVerifySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

    const order = await prisma.order.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
      include: { items: true },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret) {
      const expected = createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      if (expected !== razorpay_signature) {
        return Response.json({ verified: false }, { status: 400 });
      }
    }

    const productIds = order.items.map((item) => item.productId);

    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "paid" },
      }),
      prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: "sold" },
      }),
    ]);

    return Response.json({ verified: true });
  } catch (error) {
    console.error("POST /api/razorpay/verify error:", error);
    return Response.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
