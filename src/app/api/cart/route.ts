import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    let cart;
    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { take: 1, orderBy: { position: "asc" } },
                  variants: true,
                },
              },
              variant: true,
            },
          },
        },
      });
    } else {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: cart?.items || [] });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { productId, variantId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.isActive) {
      return NextResponse.json({ error: "Product is not available" }, { status: 400 });
    }

    let cart;
    if (session?.user?.id) {
      cart = await prisma.cart.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id },
        update: {},
      });
    } else {
      return NextResponse.json({ error: "Please sign in to add items to cart" }, { status: 401 });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_variantId: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
        },
      },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { position: "asc" } },
              variants: true,
            },
          },
          variant: true,
        },
      });
    } else {
      const stock = variantId
        ? product.variants.find((v) => v.id === variantId)?.stock || 0
        : 0;

      if (product.trackInventory && quantity > stock && !variantId) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
      }

      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { position: "asc" } },
              variants: true,
            },
          },
          variant: true,
        },
      });
    }

    return NextResponse.json({ item: cartItem });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}