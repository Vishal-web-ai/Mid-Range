import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CreateProductSchema, generateSlug } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const gender = searchParams.get("gender");

    const where: Record<string, unknown> = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (gender) where.gender = gender;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return Response.json(products, {
      headers: { "Cache-Control": "public, s-maxage=60, must-revalidate" },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateProductSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { slug, ...data } = parsed.data;
    const product = await prisma.product.create({
      data: {
        ...data,
        slug: slug ?? generateSlug(data.title),
      },
    });

    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/men");
    revalidatePath("/women");

    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
