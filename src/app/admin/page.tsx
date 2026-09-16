import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from "lucide-react";

const statCards = [
  { title: "Total Products", value: "0", icon: Package, color: "bg-blue-500" },
  { title: "Total Orders", value: "0", icon: ShoppingBag, color: "bg-green-500" },
  { title: "Total Customers", value: "0", icon: Users, color: "bg-purple-500" },
  { title: "Total Revenue", value: "$0", icon: DollarSign, color: "bg-orange-500" },
];

export default async function AdminDashboardPage() {
  const [productsCount, ordersCount, usersCount, revenue] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      where: { paymentStatus: "SUCCEEDED" },
      _sum: { total: true },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const lowStockProducts = await prisma.productVariant.findMany({
    where: { stock: { lt: 10 }, product: { trackInventory: true } },
    take: 5,
    include: { product: { select: { name: true } } },
  });

  const stats = [
    { title: "Total Products", value: productsCount.toString(), icon: Package, color: "bg-blue-500" },
    { title: "Total Orders", value: ordersCount.toString(), icon: ShoppingBag, color: "bg-green-500" },
    { title: "Total Customers", value: usersCount.toString(), icon: Users, color: "bg-purple-500" },
    { title: "Total Revenue", value: formatPrice(Number(revenue._sum.total || 0)), icon: DollarSign, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your store performance</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border rounded-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-primary hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 px-4 font-medium">Order</th>
                  <th className="pb-3 px-4 font-medium">Customer</th>
                  <th className="pb-3 px-4 font-medium">Total</th>
                  <th className="pb-3 px-4 font-medium">Status</th>
                  <th className="pb-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-mono text-sm">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <p>{order.user?.name || "Guest"}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </td>
                    <td className="py-3 px-4 font-medium">{formatPrice(Number(order.total))}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                        order.status === "SHIPPED" ? "bg-blue-100 text-blue-800" :
                        order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border rounded-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Low Stock Alerts</h2>
            <a href="/admin/products" className="text-sm text-primary hover:underline">View All</a>
          </div>
          <div className="divide-y">
            {lowStockProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">All products well stocked!</div>
            ) : (
              lowStockProducts.map((variant) => (
                <div key={variant.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{variant.product.name}</p>
                    <p className="text-sm text-gray-500">{variant.name || "Default"} - {variant.stock} left</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Low Stock
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}