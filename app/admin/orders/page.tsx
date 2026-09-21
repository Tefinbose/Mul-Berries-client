"use client";

import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://mull-berries-server.onrender.com/api";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type PaymentStatus = "paid" | "pending" | "failed";

type OrderItem = {
  product?: string;
  name?: string;
  image?: string;
  quantity: number;
  price: number;
};

type ShippingAddress = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

type Order = {
  _id: string;
  orderNumber?: string;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
};

type OrdersResponse = {
  success: boolean;
  orders: Order[];
  summary?: {
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
  };
};

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentOptions = [
  { value: "all", label: "All Payments" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "shipped":
    case "out_for_delivery":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "processing":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "confirmed":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";

    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getPaymentClasses(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "failed":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function getCustomerName(order: Order) {
  return order.shippingAddress?.name || "Guest Customer";
}

function getCustomerEmail(order: Order) {
  return order.shippingAddress?.email || "No email";
}

function getOrderNumber(order: Order) {
  return order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = async (showRefresh = false) => {
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
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(`${API_URL}/orders/admin/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const data: OrdersResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          (data as any)?.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("ADMIN ORDERS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName = getCustomerName(order).toLowerCase();
      const customerEmail = getCustomerEmail(order).toLowerCase();
      const orderNumber = getOrderNumber(order).toLowerCase();
      const phone =
        order.shippingAddress?.phone?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        orderNumber.includes(query) ||
        phone.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        order.orderStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        order.paymentStatus === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const summary = useMemo(() => {
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) =>
        order.orderStatus === "pending" ||
        order.orderStatus === "processing"
    ).length;

    const shippedOrders = orders.filter(
      (order) =>
        order.orderStatus === "shipped" ||
        order.orderStatus === "out_for_delivery"
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.orderStatus === "delivered"
    ).length;

    const totalRevenue = orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce(
        (total, order) =>
          total + Number(order.totalAmount || 0),
        0
      );

    return {
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue,
    };
  }, [orders]);

  const updateOrderStatus = async (
    orderId: string,
    orderStatus: OrderStatus
  ) => {
    try {
      setUpdatingOrder(orderId);
      setOpenMenu(null);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/orders/admin/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message || "Failed to update order status"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus,
              }
            : order
        )
      );
    } catch (err) {
      console.error("UPDATE ORDER STATUS ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const cancelOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setUpdatingOrder(orderId);
      setOpenMenu(null);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/orders/admin/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message || "Failed to cancel order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: "cancelled",
              }
            : order
        )
      );
    } catch (err) {
      console.error("CANCEL ORDER ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to cancel order"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Orders
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor all customer orders.
              </p>
            </div>

            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="font-medium text-red-800">
                  Failed to load orders
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchOrders()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            title="Total Orders"
            value={summary.totalOrders}
            icon={<Package className="h-5 w-5" />}
            iconClass="bg-gray-100 text-gray-700"
          />

          <SummaryCard
            title="Pending"
            value={summary.pendingOrders}
            icon={<Clock className="h-5 w-5" />}
            iconClass="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            title="Shipped"
            value={summary.shippedOrders}
            icon={<Truck className="h-5 w-5" />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            title="Delivered"
            value={summary.deliveredOrders}
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            title="Revenue"
            value={formatCurrency(summary.totalRevenue)}
            icon={<IndianRupee className="h-5 w-5" />}
            iconClass="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search order, customer, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="h-11 min-w-[180px] appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-9 text-sm text-gray-700 outline-none focus:border-gray-400"
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

            {/* Payment */}
            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value)
              }
              className="h-11 min-w-[170px] rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none focus:border-gray-400"
            >
              {paymentOptions.map((option) => (
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

        {/* Loading */}
        {loading ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-gray-400" />

            <p className="mt-3 text-sm text-gray-500">
              Loading orders...
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="mt-6 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>
                        <span className="sr-only">
                          Actions
                        </span>
                      </TableHead>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="font-medium text-gray-900 hover:text-black hover:underline"
                          >
                            {getOrderNumber(order)}
                          </Link>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {getCustomerName(order)}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {getCustomerEmail(order)}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {order.items?.length || 0}
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(
                              order.totalAmount
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getPaymentClasses(
                              order.paymentStatus
                            )}`}
                          >
                            {formatStatus(
                              order.paymentStatus
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                              order.orderStatus
                            )}`}
                          >
                            {formatStatus(
                              order.orderStatus
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <OrderActions
                            order={order}
                            openMenu={openMenu}
                            setOpenMenu={setOpenMenu}
                            updatingOrder={updatingOrder}
                            updateOrderStatus={
                              updateOrderStatus
                            }
                            cancelOrder={cancelOrder}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / tablet cards */}
            <div className="mt-6 grid gap-4 lg:hidden">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="font-semibold text-gray-900 hover:underline"
                      >
                        {getOrderNumber(order)}
                      </Link>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <OrderActions
                      order={order}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                      updatingOrder={updatingOrder}
                      updateOrderStatus={
                        updateOrderStatus
                      }
                      cancelOrder={cancelOrder}
                    />
                  </div>

                  <div className="mt-4">
                    <p className="font-medium text-gray-900">
                      {getCustomerName(order)}
                    </p>

                    <p className="text-sm text-gray-500">
                      {getCustomerEmail(order)}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Items
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {order.items?.length || 0}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Amount
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {formatCurrency(
                          order.totalAmount
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getPaymentClasses(
                        order.paymentStatus
                      )}`}
                    >
                      {formatStatus(
                        order.paymentStatus
                      )}
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        order.orderStatus
                      )}`}
                    >
                      {formatStatus(order.orderStatus)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty */}
            {filteredOrders.length === 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center">
                <Package className="mx-auto h-10 w-10 text-gray-300" />

                <h3 className="mt-4 font-medium text-gray-900">
                  No orders found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            {/* Result count */}
            {filteredOrders.length > 0 && (
              <p className="mt-4 text-sm text-gray-500">
                Showing {filteredOrders.length} of{" "}
                {orders.length} orders
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function SummaryCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">{title}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </th>
  );
}

function OrderActions({
  order,
  openMenu,
  setOpenMenu,
  updatingOrder,
  updateOrderStatus,
  cancelOrder,
}: {
  order: Order;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  updatingOrder: string | null;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus
  ) => void;
  cancelOrder: (orderId: string) => void;
}) {
  const isOpen = openMenu === order._id;
  const isUpdating = updatingOrder === order._id;

  return (
    <div className="relative flex items-center justify-end gap-1">
      <Link
        href={`/admin/orders/${order._id}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        title="View order"
      >
        <Eye className="h-4 w-4" />
      </Link>

      <button
        onClick={() =>
          setOpenMenu(isOpen ? null : order._id)
        }
        disabled={isUpdating}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
      >
        {isUpdating ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <MoreHorizontal className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
          <Link
            href={`/admin/orders/${order._id}`}
            onClick={() => setOpenMenu(null)}
            className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            View order
          </Link>

          <div className="my-1 border-t border-gray-100" />

          {order.orderStatus !== "processing" &&
            order.orderStatus !== "delivered" &&
            order.orderStatus !== "cancelled" && (
              <button
                onClick={() =>
                  updateOrderStatus(
                    order._id,
                    "processing"
                  )
                }
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Mark Processing
              </button>
            )}

          {order.orderStatus !== "shipped" &&
            order.orderStatus !== "delivered" &&
            order.orderStatus !== "cancelled" && (
              <button
                onClick={() =>
                  updateOrderStatus(
                    order._id,
                    "shipped"
                  )
                }
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Mark Shipped
              </button>
            )}

          {order.orderStatus !== "out_for_delivery" &&
            order.orderStatus !== "delivered" &&
            order.orderStatus !== "cancelled" && (
              <button
                onClick={() =>
                  updateOrderStatus(
                    order._id,
                    "out_for_delivery"
                  )
                }
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Mark Out for Delivery
              </button>
            )}

          {order.orderStatus !== "delivered" &&
            order.orderStatus !== "cancelled" && (
              <button
                onClick={() =>
                  updateOrderStatus(
                    order._id,
                    "delivered"
                  )
                }
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Mark Delivered
              </button>
            )}

          {order.orderStatus !== "cancelled" &&
            order.orderStatus !== "delivered" && (
              <>
                <div className="my-1 border-t border-gray-100" />

                <button
                  onClick={() =>
                    cancelOrder(order._id)
                  }
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Cancel Order
                </button>
              </>
            )}
        </div>
      )}
    </div>
  );
}