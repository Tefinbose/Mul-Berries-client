"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  RefreshCw,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ShoppingBag,
  CreditCard,
  User,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

interface OrderItem {
  product: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  total?: number;
  color?: string;
  size?: string;
}

interface ShippingAddress {
  name?: string;
  fullName?: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
}

interface StaffOrder {
  _id: string;
  user: OrderUser | null;
  customer: OrderCustomer;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCharge?: number;
  shippingFee?: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface StaffOrdersResponse {
  success: boolean;
  orders: StaffOrder[];
  pagination: Pagination;
  message?: string;
}

const statusOptions: Array<{
  value: "all" | OrderStatus;
  label: string;
}> = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatOrderId(id: string) {
  return `#${id.slice(-8).toUpperCase()}`;
}

function getStatusLabel(status: OrderStatus) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "confirmed":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "processing":
      return "bg-violet-50 text-violet-700 border-violet-200";

    case "shipped":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "out_for_delivery":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    case "returned":
      return "bg-gray-100 text-gray-700 border-gray-200";

    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getPaymentClasses(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700";

    case "pending":
      return "bg-amber-50 text-amber-700";

    case "failed":
      return "bg-red-50 text-red-700";

    case "refunded":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function StaffOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const [page, setPage] = useState(1);

  const loadOrders = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/staff/login");
          return;
        }

        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", "20");

        if (status !== "all") {
          params.set("status", status);
        }

        const response = await fetch(
          `${API_URL}/staff/orders?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data: StaffOrdersResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load staff orders"
          );
        }

        setOrders(data.orders || []);
        setPagination(data.pagination || null);
      } catch (error) {
        console.error("STAFF ORDERS ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load orders"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, status, router]
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const orderId = order._id.toLowerCase();

      const customerName =
        order.customer?.name?.toLowerCase() || "";

      const customerEmail =
        order.customer?.email?.toLowerCase() || "";

      const customerPhone =
        order.customer?.phone?.toLowerCase() || "";

      const productNames =
        order.items
          ?.map((item) => item.name?.toLowerCase() || "")
          .join(" ") || "";

      return (
        orderId.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        customerPhone.includes(query) ||
        productNames.includes(query)
      );
    });
  }, [orders, search]);

  const totalOrders = pagination?.total ?? orders.length;

  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );
  }, [filteredOrders]);

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setPage((current) => current - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setPage((current) => current + 1);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-gray-200" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="h-28 rounded-2xl bg-gray-200" />
              <div className="h-28 rounded-2xl bg-gray-200" />
              <div className="h-28 rounded-2xl bg-gray-200" />
            </div>

            <div className="h-16 rounded-2xl bg-gray-200" />

            <div className="h-[500px] rounded-2xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Package className="h-4 w-4" />
              Staff Panel
              <span>/</span>
              <span className="text-gray-800">Orders</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and process customer orders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => loadOrders(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalOrders}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Visible Orders
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {filteredOrders.length}
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3">
                <SlidersHorizontal className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Visible Value
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search order, customer, phone or product..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "all"
                      | OrderStatus
                  )
                }
                className="h-11 min-w-[190px] appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-700 outline-none focus:border-gray-400 focus:bg-white"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Items
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition hover:bg-gray-50/70"
                  >
                    {/* Order */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatOrderId(order._id)}
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {order.customer?.name ||
                              "Guest Customer"}
                          </p>

                          <p className="max-w-[190px] truncate text-xs text-gray-500">
                            {order.customer?.email || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.items?.length || 0}{" "}
                          {(order.items?.length || 0) === 1
                            ? "item"
                            : "items"}
                        </p>

                        <p className="mt-1 max-w-[220px] truncate text-xs text-gray-500">
                          {order.items
                            ?.map((item) => item.name)
                            .join(", ") || "No items"}
                        </p>
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium uppercase text-gray-700">
                          {order.paymentMethod}
                        </span>

                        <div>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getPaymentClasses(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm text-gray-700">
                        {formatDate(order.createdAt)}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/staff/orders/${order._id}`
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {filteredOrders.map((order) => (
              <div key={order._id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatOrderId(order._id)}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer?.name ||
                          "Guest Customer"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {order.customer?.email || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Payment
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                      {order.paymentMethod} ·{" "}
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500">
                    Items
                  </p>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                    {order.items
                      ?.map((item) => item.name)
                      .join(", ") || "No items"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/staff/orders/${order._id}`
                    )
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Eye className="h-4 w-4" />
                  View Order
                </button>
              </div>
            ))}
          </div>

          {/* Empty */}
          {!filteredOrders.length && !error && (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900">
                No orders found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Try changing your search or status filter.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of{" "}
                {pagination.totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPreviousPage}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!pagination.hasNextPage}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}