"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateShort, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: {
    quantity: number;
    product: { name: string; images: { url: string }[] };
    variant: { name: string } | null;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">View your order history and track shipments</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">When you place an order, it will appear here.</p>
          <Link href="/products" className="mt-6 inline-block">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4" role="list">
          {orders.map((order) => (
            <article key={order.id} className="border rounded-lg overflow-hidden" role="listitem">
              <div className="p-4 border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Order <span className="font-mono">{order.orderNumber}</span></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Placed on {formatDateShort(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <Link key={index} href={`/products/${item.product.images[0]?.url || "#"}`} className="flex items-center gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                        {item.product.images[0] ? (
                          <img src={item.product.images[0].url} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                        {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </Link>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center justify-center h-16 w-16 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-t flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold">{formatPrice(order.total)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}