import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    return Response.json(testimonials, {
      headers: { "Cache-Control": "public, s-maxage=60, must-revalidate" },
    });
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return Response.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, imageUrl, photos, text, rating, order } = body;

    if (!name || !text) {
      return Response.json(
        { error: "name and text are required" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        imageUrl: imageUrl ?? null,
        photos: Array.isArray(photos) ? photos.slice(0, 4) : [],
        text,
        rating: rating ?? 5,
        order: order ?? 0,
      },
    });

    revalidatePath("/");

    return Response.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return Response.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
