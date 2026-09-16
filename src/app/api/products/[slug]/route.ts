import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
        variants: { orderBy: { position: "asc" } },
        reviews: {
          where: { isApproved: true },
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, image: true } } },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        NOT: { id: product.id },
      },
      take: 4,
      include: {
        images: { take: 1, orderBy: { position: "asc" } },
      },
    });

    return NextResponse.json({
      product: {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
      },
      relatedProducts,
    });
  } catch (error) {
    console.error("Product detail GET error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}