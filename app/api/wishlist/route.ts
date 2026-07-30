import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");
    const productId = searchParams.get("productId");

    if (!visitorId) {
      return Response.json({ error: "visitorId required" }, { status: 400 });
    }

    if (productId) {
      const item = await prisma.wishlist.findUnique({
        where: { visitorId_productId: { visitorId, productId } },
      });
      return Response.json({ wished: !!item }, {
        headers: { "Cache-Control": "private, no-store" },
      });
    }

    const items = await prisma.wishlist.findMany({
      where: { visitorId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(items);
  } catch (error) {
    console.error("GET /api/wishlist error:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { visitorId, productId } = await request.json();

    if (!visitorId || !productId) {
      return Response.json({ error: "visitorId and productId required" }, { status: 400 });
    }

    const item = await prisma.wishlist.upsert({
      where: { visitorId_productId: { visitorId, productId } },
      update: {},
      create: { visitorId, productId },
    });

    return Response.json(item);
  } catch (error) {
    console.error("POST /api/wishlist error:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { visitorId, productId } = await request.json();

    if (!visitorId || !productId) {
      return Response.json({ error: "visitorId and productId required" }, { status: 400 });
    }

    await prisma.wishlist.deleteMany({
      where: { visitorId, productId },
    });

    return Response.json({ removed: true });
  } catch (error) {
    console.error("DELETE /api/wishlist error:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
