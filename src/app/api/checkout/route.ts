import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, createPaymentIntent } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { orderId, paymentMethodId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true, variant: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (session?.user?.id && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentIntent = await createPaymentIntent(
      Number(order.total),
      order.currency.toLowerCase(),
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        email: order.email,
      }
    );

    await prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Checkout POST error:", error);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}