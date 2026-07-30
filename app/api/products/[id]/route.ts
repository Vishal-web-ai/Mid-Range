import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { UpdateProductSchema } from "@/lib/schemas";

type RouteParams = Promise<{ id: string }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product, {
      headers: { "Cache-Control": "public, s-maxage=60, must-revalidate" },
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return Response.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateProductSchema.safeParse({ ...body, id });

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath(`/products/${product.slug}`);
    if (existing && existing.slug !== product.slug) {
      revalidatePath(`/products/${existing.slug}`);
    }
    revalidatePath("/men");
    revalidatePath("/women");

    return Response.json(product);
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: { featured: body.featured },
    });

    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/men");
    revalidatePath("/women");

    return Response.json(product);
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);
    return Response.json(
      { error: "Failed to update product" },
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
    const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
    await prisma.product.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/collections");
    if (existing) revalidatePath(`/products/${existing.slug}`);
    revalidatePath("/men");
    revalidatePath("/women");

    return Response.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
