import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.saleSectionImage.findMany({
      orderBy: { order: "asc" },
    });
    return Response.json(images, {
      headers: { "Cache-Control": "public, s-maxage=60, must-revalidate" },
    });
  } catch (error) {
    console.error("GET /api/sale-images error:", error);
    return Response.json(
      { error: "Failed to fetch sale images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, altText, order } = body;

    if (!imageUrl) {
      return Response.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    const image = await prisma.saleSectionImage.create({
      data: {
        imageUrl,
        altText: altText ?? "",
        order: order ?? 0,
      },
    });

    revalidatePath("/");

    return Response.json(image, { status: 201 });
  } catch (error) {
    console.error("POST /api/sale-images error:", error);
    return Response.json(
      { error: "Failed to create sale image" },
      { status: 500 }
    );
  }
}
