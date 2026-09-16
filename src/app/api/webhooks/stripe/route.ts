import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, constructWebhookEvent } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail, orderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event;
    try {
      event = constructWebhookEvent(body, signature);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "SUCCEEDED",
              status: "CONFIRMED",
              stripeChargeId: paymentIntent.latest_charge as string,
            },
          });

          const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
              items: { include: { product: { include: { images: { take: 1 } } }, variant: true } },
              user: true,
            },
          });

          if (order) {
            await prisma.orderStatusHistory.create({
              data: {
                orderId: order.id,
                status: "CONFIRMED",
                note: "Payment confirmed",
              },
            });

            await sendEmail({
              to: order.email,
              subject: `Order Confirmation - ${order.orderNumber}`,
              html: orderConfirmationEmail(order, order.items),
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "FAILED", status: "CANCELLED" },
          });

          await prisma.orderStatusHistory.create({
            data: {
              orderId,
              status: "CANCELLED",
              note: `Payment failed: ${paymentIntent.last_payment_error?.message || "Unknown error"}`,
            },
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const paymentIntentId = charge.payment_intent as string;

        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: paymentIntentId },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "REFUNDED",
              status: "REFUNDED",
            },
          });

          await prisma.orderStatusHistory.create({
            data: {
              orderId: order.id,
              status: "REFUNDED",
              note: `Refunded: ${(charge.amount_refunded / 100).toFixed(2)} ${charge.currency.toUpperCase()}`,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}