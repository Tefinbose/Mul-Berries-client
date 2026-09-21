"use client";

import { useEffect, useMemo, useState } from "react";
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
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mull-berries-server.onrender.com/api";

type PeriodDays = 7 | 30 | 90;

interface DashboardData {
  period: {
    days: number;
    startDate: string;
    endDate: string;
    previousStartDate: string;
    previousEndDate: string;
  };

  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueChange: number;
    ordersChange: number;
    customersChange: number;
  };

  sales: {
    totalRevenue: number;
    averageOrderValue: number;
    deliveredOrders: number;
    dailySales: {
      _id: string;
      value: number;
      orders: number;
    }[];
  };

  orders: {
    total: number;
    confirmed: number;
    processing: number;
    shipped: number;
    outForDelivery: number;
    delivered: number;
    cancelled: number;
    returned: number;
  };

  recentOrders: {
    _id: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    items: {
      product: string;
      name: string;
      image?: string;
      quantity: number;
      price: number;
      color?: string;
      size?: string;
    }[];
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
  }[];

  topProducts: {
    _id: string;
    name: string;
    sold: number;
    revenue: number;
  }[];

  lowStockProducts: {
    _id: string;
    name: string;
    stock: number;
    price: number;
    images: string[];
  }[];

  inventory: {
    totalProducts: number;
    totalStock: number;
    lowStock: number;
    outOfStock: number;
  };
}

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  if (!Number.isFinite(value)) return "₹0";

  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${Math.round(value / 1000)}K`;
  }

  return `₹${Math.round(value)}`;
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function getStatusClasses(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-50 text-green-700";

    case "processing":
      return "bg-yellow-50 text-yellow-700";

    case "shipped":
      return "bg-blue-50 text-blue-700";

    case "out_for_delivery":
      return "bg-purple-50 text-purple-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    case "returned":
      return "bg-orange-50 text-orange-700";

    case "confirmed":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-stone-100 text-stone-700";
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminDashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [selectedDays, setSelectedDays] =
    useState<PeriodDays>(7);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  const loadDashboard = async (
    days: PeriodDays = selectedDays,
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/dashboard?days=${days}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load dashboard"
        );
      }

      setDashboard(data.dashboard);
    } catch (err) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadDashboard(7);
  }, []);

  /* =======================================================
     PERIOD CHANGE
  ======================================================= */

  const handlePeriodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const days = Number(
      event.target.value
    ) as PeriodDays;

    setSelectedDays(days);

    loadDashboard(days);
  };

  /* =======================================================
     SALES DATA
  ======================================================= */

  const salesData =
    dashboard?.sales.dailySales || [];

  const maxSales = useMemo(() => {
    if (!salesData.length) return 1;

    return Math.max(
      ...salesData.map(
        (item) => item.value
      ),
      1
    );
  }, [salesData]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading && !dashboard) {
    return (
      <main className="min-h-screen">
        <header className="border-b border-stone-200 bg-white">
          <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />

              <div className="mt-3 h-8 w-40 animate-pulse rounded bg-stone-200" />

              <div className="mt-2 h-4 w-72 animate-pulse rounded bg-stone-200" />
            </div>
          </div>
        </header>

        <section className="px-6 py-8 lg:px-10">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl bg-stone-100"
              />
            ))}
          </div>

          <div className="mt-6 h-96 animate-pulse rounded-2xl bg-stone-100" />
        </section>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !dashboard) {
    return (
      <main className="min-h-screen">
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle
                size={22}
                className="text-red-600"
              />
            </div>

            <h1 className="mt-4 text-lg font-semibold text-stone-900">
              Failed to load dashboard
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadDashboard(
                  selectedDays,
                  true
                )
              }
              className="mt-6 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return null;
  }

  /* =======================================================
     DYNAMIC STATS
  ======================================================= */

  const stats = [
    {
      title: "Total Revenue",
      value: formatCompactCurrency(
        dashboard.stats.totalRevenue
      ),
      change: dashboard.stats.revenueChange,
      description: "vs. previous period",
      icon: IndianRupee,
    },

    {
      title: "Total Orders",
      value: dashboard.stats.totalOrders.toLocaleString(
        "en-IN"
      ),
      change: dashboard.stats.ordersChange,
      description: "vs. previous period",
      icon: ShoppingCart,
    },

    {
      title: "Customers",
      value: dashboard.stats.totalCustomers.toLocaleString(
        "en-IN"
      ),
      change: dashboard.stats.customersChange,
      description: "vs. previous period",
      icon: Users,
    },

    {
      title: "Products",
      value: dashboard.stats.totalProducts.toLocaleString(
        "en-IN"
      ),
      change: 0,
      description: "active products",
      icon: Package,
    },
  ];

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-screen">
      {/* ===================================================
          HEADER
      =================================================== */}

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

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                loadDashboard(
                  selectedDays,
                  true
                )
              }
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
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

      {/* ===================================================
          CONTENT
      =================================================== */}

      <section className="px-6 py-8 lg:px-10">
        {/* =================================================
            ERROR BANNER
        ================================================= */}

        {error && dashboard && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadDashboard(
                  selectedDays,
                  true
                )
              }
              className="text-sm font-medium text-red-700 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            const isPositive =
              stat.change >= 0;

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
                  {stat.title !== "Products" ? (
                    <>
                      <span
                        className={`flex items-center gap-1 font-medium ${
                          isPositive
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}

                        {Math.abs(
                          stat.change
                        ).toFixed(1)}
                        %
                      </span>

                      <span className="text-stone-400">
                        {stat.description}
                      </span>
                    </>
                  ) : (
                    <span className="text-stone-400">
                      {stat.description}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            SALES OVERVIEW
        ================================================= */}

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
              value={selectedDays}
              onChange={handlePeriodChange}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 outline-none"
            >
              <option value="7">
                Last 7 days
              </option>

              <option value="30">
                Last 30 days
              </option>

              <option value="90">
                Last 90 days
              </option>
            </select>
          </div>

          {/* CHART */}

          <div className="mt-8">
            {salesData.length > 0 ? (
              <div className="flex h-64 items-end gap-2 sm:gap-4">
                {salesData.map((item) => {
                  const height =
                    (item.value /
                      maxSales) *
                    100;

                  return (
                    <div
                      key={item._id}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                    >
                      <div className="flex w-full flex-1 items-end justify-center">
                        <div
                          className="w-full max-w-12 rounded-t-lg bg-stone-900 transition-all duration-500 hover:bg-stone-700"
                          style={{
                            height: `${Math.max(
                              height,
                              3
                            )}%`,
                          }}
                          title={`${formatDate(
                            item._id
                          )}: ${formatCurrency(
                            item.value
                          )}`}
                        />
                      </div>

                      <span className="text-center text-[10px] text-stone-400 sm:text-xs">
                        {new Date(
                          item._id
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl bg-stone-50">
                <p className="text-sm text-stone-400">
                  No sales data for this period.
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-stone-100 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400">
                    Total sales
                  </p>

                  <p className="mt-1 text-lg font-semibold text-stone-900">
                    {formatCurrency(
                      dashboard.sales.totalRevenue
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-stone-400">
                    Average daily sales
                  </p>

                  <p className="mt-1 text-lg font-semibold text-stone-900">
                    {formatCurrency(
                      dashboard.period.days > 0
                        ? dashboard.sales.totalRevenue /
                            dashboard.period.days
                        : 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            ORDERS + LOW STOCK
        ================================================= */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* RECENT ORDERS */}

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
              {dashboard.recentOrders.length >
              0 ? (
                dashboard.recentOrders.map(
                  (order) => (
                    <div
                      key={order._id}
                      className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          #
                          {order._id.slice(
                            -6
                          ).toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {order.customer.name}{" "}
                          ·{" "}
                          {formatDate(
                            order.createdAt
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                            order.orderStatus
                          )}`}
                        >
                          {formatStatus(
                            order.orderStatus
                          )}
                        </span>

                        <span className="text-sm font-semibold text-stone-900">
                          {formatCurrency(
                            order.totalAmount
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-stone-400">
                    No orders found.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* LOW STOCK */}

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
              {dashboard.lowStockProducts
                .length > 0 ? (
                dashboard.lowStockProducts.map(
                  (product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between px-6 py-5"
                    >
                      <p className="max-w-[220px] text-sm font-medium text-stone-800">
                        {product.name}
                      </p>

                      <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                        {product.stock} left
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-green-600">
                    All products have sufficient stock.
                  </p>
                </div>
              )}
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

        {/* =================================================
            TOP PRODUCTS
        ================================================= */}

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
            {dashboard.topProducts.length >
            0 ? (
              dashboard.topProducts.map(
                (product, index) => (
                  <div
                    key={product._id}
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
                        Product
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium text-stone-900">
                        {product.sold} sold
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        {formatCurrency(
                          product.revenue
                        )}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-stone-400">
                  No product sales data for this period.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}