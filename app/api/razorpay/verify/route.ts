import { NextRequest } from "next/server";
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

    return Response.json({
      verified: true,
      status: "stubbed",
    });
  } catch (error) {
    console.error("POST /api/razorpay/verify error:", error);
    return Response.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
