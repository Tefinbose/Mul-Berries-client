"use client";

import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  CreditCard,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { API_URL } from "@/services/api";

type DailySale = {
  _id: string;
  sales: number;
  orders: number;
};

type PaymentStat = {
  _id: string;
  count: number;
};

type PaymentMethod = {
  _id: string;
  count: number;
  amount: number;
};

type TopProduct = {
  _id: string;
  productName?: string;
  quantitySold: number;
  revenue: number;
};

type LowStockProduct = {
  _id: string;
  name?: string;
  stock: number;
  price?: number;
  images?: string[];
};

type RecentOrder = {
  _id: string;
  totalAmount: number;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt: string;
  shippingAddress?: {
    name?: string;
    city?: string;
    state?: string;
  };
};

type AnalyticsResponse = {
  success: boolean;

  analytics?: {
    period?: {
      days: number;
      startDate: string;
      endDate: string;
    };

    orders?: {
      total: number;
      confirmed: number;
      processing: number;
      shipped: number;
      outForDelivery: number;
      delivered: number;
      cancelled: number;
    };

    sales?: {
      totalSales: number;
      averageOrderValue: number;
      deliveredOrders: number;
    };

    dailySales?: DailySale[];

    paymentStats?: PaymentStat[];

    paymentMethods?: PaymentMethod[];

    topProducts?: TopProduct[];

    inventory?: {
      totalProducts: number;
      totalStock: number;
      lowStock: number;
      outOfStock: number;
    };

    lowStockProducts?: LowStockProduct[];

    recentOrders?: RecentOrder[];
  };

  message?: string;
};

const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatDateShort = (date?: string) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
};

const formatStatus = (status?: string) => {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
};

const getStatusClasses = (
  status?: string
) => {
  switch (status) {
    case "delivered":
    case "paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "cancelled":
    case "failed":
      return "bg-red-50 text-red-700 border-red-100";

    case "processing":
    case "shipped":
    case "out_for_delivery":
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "pending":
    case "confirmed":
      return "bg-amber-50 text-amber-700 border-amber-100";

    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
};

export default function StaffAnalyticsPage() {
  const [days, setDays] = useState("30");

  const [analytics, setAnalytics] =
    useState<
      AnalyticsResponse["analytics"]
    >(undefined);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const fetchAnalytics = async (
    selectedDays = days,
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/staff/analytics?days=${selectedDays}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data =
        (await response.json()) as AnalyticsResponse;

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to load analytics. Status: ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load analytics."
        );
      }

      setAnalytics(data.analytics);
    } catch (error) {
      console.error(
        "STAFF ANALYTICS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  const orders = analytics?.orders || {
    total: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    outForDelivery: 0,
    delivered: 0,
    cancelled: 0,
  };

  const sales = analytics?.sales || {
    totalSales: 0,
    averageOrderValue: 0,
    deliveredOrders: 0,
  };

  const inventory =
    analytics?.inventory || {
      totalProducts: 0,
      totalStock: 0,
      lowStock: 0,
      outOfStock: 0,
    };

  const dailySales =
    analytics?.dailySales || [];

  const paymentStats =
    analytics?.paymentStats || [];

  const paymentMethods =
    analytics?.paymentMethods || [];

  const topProducts =
    analytics?.topProducts || [];

  const lowStockProducts =
    analytics?.lowStockProducts || [];

  const recentOrders =
    analytics?.recentOrders || [];

  const maxDailySales = useMemo(() => {
    if (!dailySales.length) {
      return 1;
    }

    return Math.max(
      ...dailySales.map(
        (item) => item.sales
      ),
      1
    );
  }, [dailySales]);

  const maxProductRevenue = useMemo(() => {
    if (!topProducts.length) {
      return 1;
    }

    return Math.max(
      ...topProducts.map(
        (item) => item.revenue
      ),
      1
    );
  }, [topProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-56 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-80 rounded bg-gray-200" />

            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-2xl bg-gray-200"
                />
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="h-96 rounded-2xl bg-gray-200" />
              <div className="h-96 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Staff Operations
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Analytics
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Monitor orders, sales, payments and
              inventory performance.
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={days}
              onChange={(event) =>
                setDays(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-gray-400"
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

              <option value="365">
                Last 365 days
              </option>
            </select>

            <button
              type="button"
              onClick={() =>
                fetchAnalytics(
                  days,
                  true
                )
              }
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Analytics failed to load
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* KPI CARDS */}

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-2.5">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>

              <Activity className="h-4 w-4 text-gray-300" />
            </div>

            <p className="mt-5 text-2xl font-semibold text-gray-900">
              {orders.total}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Total orders
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-2.5">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            </div>

            <p className="mt-5 text-2xl font-semibold text-gray-900">
              {formatCurrency(
                sales.totalSales
              )}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Delivered sales
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-50 p-2.5">
                <CreditCard className="h-5 w-5 text-violet-600" />
              </div>

              <BarChart3 className="h-4 w-4 text-gray-300" />
            </div>

            <p className="mt-5 text-2xl font-semibold text-gray-900">
              {formatCurrency(
                sales.averageOrderValue
              )}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Average order value
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-2.5">
                <Boxes className="h-5 w-5 text-amber-600" />
              </div>

              <AlertCircle className="h-4 w-4 text-amber-400" />
            </div>

            <p className="mt-5 text-2xl font-semibold text-gray-900">
              {inventory.lowStock +
                inventory.outOfStock}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Stock alerts
            </p>
          </div>
        </div>

        {/* ORDER STATUS */}

        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Order performance
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Order status distribution for the
                selected period.
              </p>
            </div>

            <Package className="h-5 w-5 text-gray-400" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {[
              {
                label: "Confirmed",
                value: orders.confirmed,
                icon: CheckCircle2,
              },
              {
                label: "Processing",
                value: orders.processing,
                icon: Activity,
              },
              {
                label: "Shipped",
                value: orders.shipped,
                icon: Package,
              },
              {
                label: "Out for delivery",
                value:
                  orders.outForDelivery,
                icon: TrendingUp,
              },
              {
                label: "Delivered",
                value: orders.delivered,
                icon: CheckCircle2,
              },
              {
                label: "Cancelled",
                value: orders.cancelled,
                icon: XCircle,
              },
              {
                label: "Total",
                value: orders.total,
                icon: ShoppingBag,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <Icon className="h-4 w-4 text-gray-400" />

                  <p className="mt-3 text-xl font-semibold text-gray-900">
                    {item.value}
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SALES + INVENTORY */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* DAILY SALES */}

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Daily sales
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Delivered sales by day.
                </p>
              </div>

              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>

            {dailySales.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-8 w-8 text-gray-300" />

                  <p className="mt-3 text-sm text-gray-500">
                    No sales data available.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex h-64 items-end gap-2 overflow-x-auto pb-6">
                {dailySales.map(
                  (item) => {
                    const height =
                      Math.max(
                        (item.sales /
                          maxDailySales) *
                          100,
                        item.sales > 0
                          ? 5
                          : 0
                      );

                    return (
                      <div
                        key={item._id}
                        className="group flex min-w-[32px] flex-1 flex-col items-center justify-end"
                      >
                        <div className="relative mb-2 opacity-0 transition group-hover:opacity-100">
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-[10px] text-white">
                            {formatCurrency(
                              item.sales
                            )}
                          </div>
                        </div>

                        <div
                          className="w-full min-w-[18px] max-w-[32px] rounded-t-md bg-gray-900 transition hover:bg-gray-700"
                          style={{
                            height: `${height}%`,
                          }}
                        />

                        <span className="mt-2 whitespace-nowrap text-[9px] text-gray-400">
                          {formatDateShort(
                            item._id
                          )}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* INVENTORY */}

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Inventory health
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Current inventory overview.
                </p>
              </div>

              <Boxes className="h-5 w-5 text-gray-400" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500">
                  Products
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {inventory.totalProducts}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500">
                  Stock units
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {inventory.totalStock}
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs text-amber-700">
                  Low stock
                </p>

                <p className="mt-2 text-2xl font-semibold text-amber-800">
                  {inventory.lowStock}
                </p>
              </div>

              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-xs text-red-700">
                  Out of stock
                </p>

                <p className="mt-2 text-2xl font-semibold text-red-800">
                  {inventory.outOfStock}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Stock availability
                </span>

                <span className="font-medium text-gray-700">
                  {inventory.totalProducts
                    ? Math.round(
                        ((inventory.totalProducts -
                          inventory.outOfStock) /
                          inventory.totalProducts) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900"
                  style={{
                    width: `${
                      inventory.totalProducts
                        ? Math.max(
                            0,
                            Math.min(
                              100,
                              ((inventory.totalProducts -
                                inventory.outOfStock) /
                                inventory.totalProducts) *
                                100
                            )
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </section>
        </div>

        {/* TOP PRODUCTS + PAYMENTS */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* TOP PRODUCTS */}

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Top products
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Best performing delivered products.
                </p>
              </div>

              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>

            <div className="mt-5 space-y-4">
              {topProducts.length ===
              0 ? (
                <div className="py-10 text-center">
                  <Package className="mx-auto h-8 w-8 text-gray-300" />

                  <p className="mt-3 text-sm text-gray-500">
                    No product sales data.
                  </p>
                </div>
              ) : (
                topProducts.map(
                  (product, index) => {
                    const width =
                      Math.max(
                        (product.revenue /
                          maxProductRevenue) *
                          100,
                        5
                      );

                    return (
                      <div
                        key={
                          product._id ||
                          index
                        }
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">
                              {index + 1}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-800">
                                {product.productName ||
                                  "Unknown product"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {
                                  product.quantitySold
                                }{" "}
                                units sold
                              </p>
                            </div>
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-gray-900">
                            {formatCurrency(
                              product.revenue
                            )}
                          </p>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-gray-900"
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </section>

          {/* PAYMENT */}

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Payments
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Payment status and methods.
                </p>
              </div>

              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {paymentStats.map(
                (item) => (
                  <div
                    key={item._id || "unknown"}
                    className="rounded-xl border border-gray-100 p-4"
                  >
                    <p className="text-xs text-gray-500">
                      {formatStatus(
                        item._id
                      )}
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                      {item.count}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="mt-5 space-y-3">
              {paymentMethods.map(
                (method) => (
                  <div
                    key={
                      method._id ||
                      "unknown"
                    }
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {formatStatus(
                          method._id
                        )}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {method.count} orders
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(
                        method.amount
                      )}
                    </p>
                  </div>
                )
              )}

              {paymentMethods.length ===
                0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                  No payment method data.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* LOW STOCK */}

        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Low stock alerts
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Products requiring inventory attention.
              </p>
            </div>

            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>

          {lowStockProducts.length ===
          0 ? (
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Inventory looks healthy
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    No active products are currently
                    below the low-stock threshold.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Product
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Stock
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Price
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockProducts.map(
                    (product) => (
                      <tr
                        key={product._id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-gray-800">
                            {product.name ||
                              "Unknown product"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {product.stock}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatCurrency(
                            product.price ||
                              0
                          )}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              product.stock <=
                              0
                                ? "border-red-100 bg-red-50 text-red-700"
                                : "border-amber-100 bg-amber-50 text-amber-700"
                            }`}
                          >
                            {product.stock <=
                            0
                              ? "Out of stock"
                              : "Low stock"}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RECENT ORDERS */}

        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Recent orders
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Latest orders in the selected period.
              </p>
            </div>

            <ShoppingBag className="h-5 w-5 text-gray-400" />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Order
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Date
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Amount
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Payment
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      No recent orders.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map(
                    (order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-gray-800">
                            #
                            {order._id.slice(
                              -8
                            )}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-500">
                          {formatDate(
                            order.createdAt
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(
                            order.totalAmount
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                              order.paymentStatus
                            )}`}
                          >
                            {formatStatus(
                              order.paymentStatus
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                              order.orderStatus
                            )}`}
                          >
                            {formatStatus(
                              order.orderStatus
                            )}
                          </span>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}