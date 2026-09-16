"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Truck, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function CheckoutSuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  };

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">Thank you for your order!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          We&apos;ve received your order and will start processing it right away.
        </p>

        {order && (
          <div className="mt-8 text-left p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h2 className="font-semibold">Order Confirmation</h2>
            <p className="mt-2">Order Number: <span className="font-mono font-medium">{order.orderNumber}</span></p>
            <p>Email: <span className="font-medium">{order.email}</span></p>
            <p>Total: <span className="font-semibold">${order.total.toFixed(2)}</span></p>
            <p className="mt-2 text-sm text-gray-500">A confirmation email has been sent to {order.email}</p>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <Mail className="h-6 w-6 text-primary" />
            <span className="font-medium">Confirmation Email</span>
            <span className="text-sm text-gray-500">Check your inbox</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <Truck className="h-6 w-6 text-primary" />
            <span className="font-medium">Fast Shipping</span>
            <span className="text-sm text-gray-500">We&apos;ll notify you when it ships</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <ArrowRight className="h-6 w-6 text-primary" />
            <span className="font-medium">Track Order</span>
            <span className="text-sm text-gray-500">View status anytime</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href={`/account/orders/${orderId}`}>
            <Button variant="outline">View Order Details</Button>
          </Link>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessPageContent />
    </Suspense>
  );
}