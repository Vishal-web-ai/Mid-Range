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
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.altText !== undefined) data.altText = body.altText;
    if (body.order !== undefined) data.order = body.order;
    if (body.active !== undefined) data.active = body.active;

    const image = await prisma.saleSectionImage.update({
      where: { id },
      data,
    });

    revalidatePath("/");

    return Response.json(image);
  } catch (error) {
    console.error("PUT /api/sale-images/[id] error:", error);
    return Response.json(
      { error: "Failed to update sale image" },
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
    await prisma.saleSectionImage.delete({ where: { id } });

    revalidatePath("/");

    return Response.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/sale-images/[id] error:", error);
    return Response.json(
      { error: "Failed to delete sale image" },
      { status: 500 }
    );
  }
}
