"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDateShort, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  notes: string | null;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  shippingAddress: any;
  billingAddress: any;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    total: number;
    product: { id: string; slug: string; name: string; images: { url: string }[] };
    variant: { id: string; name: string; price: number | null } | null;
  }[];
  statusHistory: { id: string; status: string; note: string | null; createdAt: string }[];
  coupon: { code: string } | null;
}

const statusSteps = [
  { key: "PENDING", label: "Pending", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "PROCESSING", label: "Processing", icon: Clock },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
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
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "PROCESSING":
      case "CONFIRMED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const currentStatusIndex = statusSteps.findIndex((s) => s.key === order?.status);
  const isCancelled = order?.status === "CANCELLED" || order?.status === "REFUNDED";

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link href="/account/orders" className="mt-4 inline-block">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/account/orders">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-gray-600 dark:text-gray-400">Placed on {formatDateShort(order.createdAt)}</p>
        </div>
        <div className="ml-auto">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Order Progress</h2>
        </div>
        <div className="p-4">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= (currentStatusIndex === -1 ? 0 : currentStatusIndex);
                const isCurrent = index === currentStatusIndex && !isCancelled;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                      isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-white border-gray-300 text-gray-400 dark:bg-gray-900 dark:border-gray-600"
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="pt-1">
                      <p className={`font-medium ${isCompleted ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                        {step.label}
                      </p>
                      {isCurrent && <p className="text-sm text-primary">Current status</p>}
                    </div>
                  </div>
                );
              })}
              {isCancelled && (
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-red-100 border-red-300 text-red-600 dark:bg-red-900 dark:border-red-700">
                    <XCircle className="h-6 w-6" />
                  </div>
                  <div className="pt-1">
                    <p className="font-medium text-red-600 dark:text-red-400">Cancelled</p>
                    <p className="text-sm text-gray-500">Order was cancelled</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="border rounded-lg">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <h2 className="font-semibold">Items</h2>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <Link href={`/products/${item.product.slug}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0].url} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </Link>
                  <div className="flex-1">
                    <Link href={`/products/${item.product.slug}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    {item.variant && <p className="text-sm text-gray-500">{item.variant.name}</p>}
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="font-medium">{formatPrice(item.price)}</span>
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.total)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border rounded-lg">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <h2 className="font-semibold">Shipping Address</h2>
            </div>
            <div className="p-4">
              <address className="not-italic text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                {order.shippingAddress?.company ? `\n${order.shippingAddress.company}` : ""}
                {order.shippingAddress?.address1}
                {order.shippingAddress?.address2 ? `\n${order.shippingAddress.address2}` : ""}
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                {order.shippingAddress?.country}
                {order.shippingAddress?.phone ? `\n${order.shippingAddress.phone}` : ""}
              </address>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="border rounded-lg">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            <div className="p-4 space-y-3">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(order.subtotal)}</dd>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <dt>Discount{order.coupon ? ` (${order.coupon.code})` : ""}</dt>
                    <dd>-{formatPrice(order.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd>{formatPrice(order.shipping)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Tax</dt>
                  <dd>{formatPrice(order.tax)}</dd>
                </div>
              </dl>
              <div className="border-t pt-3 flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </div>
          </section>

          {order.notes && (
            <section className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Order Notes</h3>
              <p className="text-gray-600 dark:text-gray-400">{order.notes}</p>
            </section>
          )}

          <section className="border rounded-lg">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <h2 className="font-semibold">Status History</h2>
            </div>
            <div className="divide-y">
              {order.statusHistory.map((history) => (
                <div key={history.id} className="p-4 flex gap-4">
                  <div className="flex-shrink-0 w-10 text-center text-gray-400">
                    <div className="relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-gray-700" />
                      <div className="relative flex h-3 w-3 items-center justify-center rounded-full bg-primary border-2 border-white dark:border-gray-900" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{history.status}</p>
                    {history.note && <p className="text-sm text-gray-500">{history.note}</p>}
                    <p className="text-xs text-gray-400">{formatDateShort(history.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}