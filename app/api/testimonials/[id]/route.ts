import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type RouteParams = Promise<{ id: string }>;

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.text !== undefined) data.text = body.text;
    if (body.rating !== undefined) data.rating = body.rating;
    if (body.order !== undefined) data.order = body.order;
    if (body.active !== undefined) data.active = body.active;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });

    revalidatePath("/");

    return Response.json(testimonial);
  } catch (error) {
    console.error("PUT /api/testimonials/[id] error:", error);
    return Response.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });

    revalidatePath("/");

    return Response.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/testimonials/[id] error:", error);
    return Response.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
