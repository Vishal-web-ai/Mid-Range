import { NextRequest } from "next/server";
import { RazorpayOrderSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RazorpayOrderSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { amount, receipt } = parsed.data;

    return Response.json({
      id: `order_stub_${Math.random().toString(36).substring(2, 10)}`,
      amount,
      currency: "INR",
      receipt: receipt ?? null,
    });
  } catch (error) {
    console.error("POST /api/razorpay/create-order error:", error);
    return Response.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
