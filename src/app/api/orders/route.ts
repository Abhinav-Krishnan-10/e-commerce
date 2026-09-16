import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateOrderNumber } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1, orderBy: { position: "asc" } } },
            },
            variant: true,
          },
        },
        statusHistory: { orderBy: { createdAt: "asc" } },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const {
      email,
      phone,
      shippingAddress,
      billingAddress,
      shippingMethodId,
      paymentMethodId,
      couponCode,
      notes,
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
    } = body;

    if (!email || !shippingAddress || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id,
        email,
        phone,
        status: "PENDING",
        paymentStatus: "PENDING",
        subtotal,
        tax,
        shipping,
        discount: discount || 0,
        total,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        },
        statusHistory: {
          create: { status: "PENDING", note: "Order placed", createdBy: session?.user?.id },
        },
      },
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1 } } },
            variant: true,
          },
        },
      },
    });

    if (session?.user?.id) {
      await prisma.cartItem.deleteMany({
        where: { cart: { userId: session.user.id } },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}