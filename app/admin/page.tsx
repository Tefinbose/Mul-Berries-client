"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹2,84,500",
    change: "+12.5%",
    description: "vs. last month",
    trend: "up",
    icon: IndianRupee,
  },
  {
    title: "Total Orders",
    value: "248",
    change: "+8.2%",
    description: "vs. last month",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    value: "1,284",
    change: "+14.3%",
    description: "vs. last month",
    trend: "up",
    icon: Users,
  },
  {
    title: "Products",
    value: "86",
    change: "-2.4%",
    description: "vs. last month",
    trend: "down",
    icon: Package,
  },
];

const recentOrders = [
  {
    id: "#MB1024",
    customer: "Arjun Kumar",
    date: "Sep 14, 2026",
    amount: "₹8,999",
    status: "Delivered",
  },
  {
    id: "#MB1023",
    customer: "Anjali Menon",
    date: "Sep 14, 2026",
    amount: "₹7,499",
    status: "Processing",
  },
  {
    id: "#MB1022",
    customer: "Rahul Nair",
    date: "Sep 13, 2026",
    amount: "₹12,299",
    status: "Shipped",
  },
  {
    id: "#MB1021",
    customer: "Meera Joseph",
    date: "Sep 13, 2026",
    amount: "₹5,499",
    status: "Processing",
  },
  {
    id: "#MB1020",
    customer: "Vishnu Raj",
    date: "Sep 12, 2026",
    amount: "₹9,999",
    status: "Delivered",
  },
];

const topProducts = [
  {
    name: "Royal Red Kanjivaram Silk Saree",
    category: "Silk Sarees",
    sold: 42,
    revenue: "₹3,77,958",
  },
  {
    name: "Royal Purple Banarasi Silk Saree",
    category: "Silk Sarees",
    sold: 35,
    revenue: "₹3,49,965",
  },
  {
    name: "Yellow & Pink Bridal Silk Saree",
    category: "Bridal",
    sold: 28,
    revenue: "₹2,65,972",
  },
  {
    name: "Maroon Pure Silk Saree",
    category: "Silk Sarees",
    sold: 24,
    revenue: "₹1,99,176",
  },
];

const lowStockProducts = [
  {
    name: "Royal Red Kanjivaram Silk Saree",
    stock: 3,
  },
  {
    name: "Teal Designer Silk Saree",
    stock: 4,
  },
  {
    name: "Kerala Kasavu Saree",
    stock: 5,
  },
];

const salesData = [
  { day: "Mon", value: 32000 },
  { day: "Tue", value: 45000 },
  { day: "Wed", value: 38000 },
  { day: "Thu", value: 52000 },
  { day: "Fri", value: 47000 },
  { day: "Sat", value: 68000 },
  { day: "Sun", value: 59000 },
];

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${Math.round(value / 1000)}K`;
  }

  return `₹${value}`;
}

function getStatusClasses(status: string) {
  switch (status) {
    case "Delivered":
      return "bg-green-50 text-green-700";

    case "Processing":
      return "bg-yellow-50 text-yellow-700";

    case "Shipped":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-stone-100 text-stone-700";
  }
}

export default function AdminDashboard() {
  const maxSales = Math.max(...salesData.map((item) => item.value));

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <p className="text-sm text-stone-500">
              Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Here's what's happening with your store.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              Sep 8 – Sep 14, 2026
            </button>

            <Link
              href="/admin/products"
              className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Add Product
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <section className="px-6 py-8 lg:px-10">

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100">
                    <Icon
                      size={20}
                      className="text-stone-700"
                    />
                  </div>

                  <button
                    type="button"
                    className="text-stone-400 hover:text-stone-700"
                    aria-label={`More options for ${stat.title}`}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <p className="mt-5 text-sm text-stone-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
                  {stat.value}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span
                    className={`flex items-center gap-1 font-medium ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}

                    {stat.change}
                  </span>

                  <span className="text-stone-400">
                    {stat.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sales Overview */}
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                Sales Overview
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Revenue generated during the selected period.
              </p>
            </div>

            <select
              defaultValue="7"
              className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          {/* Chart */}
          <div className="mt-8">
            <div className="flex h-64 items-end gap-3 sm:gap-6">
              {salesData.map((item) => {
                const height =
                  (item.value / maxSales) * 100;

                return (
                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="flex w-full flex-1 items-end justify-center">
                      <div
                        className="w-full max-w-12 rounded-t-lg bg-stone-900 transition-all duration-500 hover:bg-stone-700"
                        style={{
                          height: `${height}%`,
                        }}
                        title={`${item.day}: ${formatCurrency(
                          item.value
                        )}`}
                      />
                    </div>

                    <span className="text-xs text-stone-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-stone-100 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400">
                    Total sales
                  </p>

                  <p className="mt-1 text-lg font-semibold text-stone-900">
                    ₹3,41,000
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-stone-400">
                    Average daily sales
                  </p>

                  <p className="mt-1 text-lg font-semibold text-stone-900">
                    ₹48,714
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders + Low Stock */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">

          {/* Recent Orders */}
          <div className="rounded-2xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
              <div>
                <h2 className="font-semibold text-stone-900">
                  Recent Orders
                </h2>

                <p className="mt-1 text-xs text-stone-500">
                  Latest orders from your customers.
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="text-sm font-medium text-stone-700 hover:text-black"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-stone-100">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {order.id}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {order.customer} · {order.date}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <span className="text-sm font-semibold text-stone-900">
                      {order.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          <div className="rounded-2xl border border-stone-200 bg-white">
            <div className="border-b border-stone-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                  <AlertTriangle
                    size={18}
                    className="text-orange-600"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-900">
                    Low Stock
                  </h2>

                  <p className="text-xs text-stone-500">
                    Products that need attention.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {lowStockProducts.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between px-6 py-5"
                >
                  <p className="max-w-[220px] text-sm font-medium text-stone-800">
                    {product.name}
                  </p>

                  <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 p-5">
              <Link
                href="/admin/inventory"
                className="block text-center text-sm font-medium text-stone-700 hover:text-black"
              >
                Manage inventory →
              </Link>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
            <div>
              <h2 className="font-semibold text-stone-900">
                Top Products
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                Best performing products during this period.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="text-sm font-medium text-stone-700 hover:text-black"
            >
              View products
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 px-6 py-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-600">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-900">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {product.category}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-stone-900">
                    {product.sold} sold
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {product.revenue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}