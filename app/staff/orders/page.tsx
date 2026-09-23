"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { API_URL } from "@/services/api";

type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | string;

type OrderItem = {
  product?: string;
  name?: string;
  quantity?: number;
  price?: number;
  image?: string;
};

type ShippingAddress = {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
};

type Order = {
  _id: string;
  orderNumber?: string;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items?: OrderItem[];
  totalAmount?: number;
  subtotal?: number;
  shippingCharge?: number;
  discount?: number;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus | string;
  shippingAddress?: ShippingAddress;
  createdAt?: string;
  updatedAt?: string;
};

type OrdersResponse = {
  success: boolean;
  orders?: Order[];
  total?: number;
  count?: number;
  message?: string;
};

type OrderDetailsResponse = {
  success: boolean;
  order?: Order;
  message?: string;
};

type UpdateStatusResponse = {
  success: boolean;
  order?: Order;
  message?: string;
};

const STATUS_OPTIONS = [
  "all",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const PAYMENT_OPTIONS = [
  "all",
  "pending",
  "paid",
  "failed",
  "refunded",
];

const STATUS_FLOW: OrderStatus[] = [
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [ordersPerPage] = useState(10);

  const fetchOrders = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/staff/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Failed to load orders. Status: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      const data: OrdersResponse = JSON.parse(responseText);

      if (!data.success) {
        throw new Error(
          data.message || "Failed to load orders."
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("STAFF ORDERS ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load orders.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setDetailsLoading(true);
      setStatusMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setStatusMessage("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/staff/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Failed to load order details. Status: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      const data: OrderDetailsResponse =
        JSON.parse(responseText);

      if (!data.success || !data.order) {
        throw new Error(
          data.message || "Order details not found."
        );
      }

      setSelectedOrder(data.order);
    } catch (err) {
      console.error("ORDER DETAILS ERROR:", err);

      if (err instanceof Error) {
        setStatusMessage(err.message);
      } else {
        setStatusMessage("Failed to load order details.");
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingStatus(true);
      setStatusMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setStatusMessage("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/staff/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderStatus: newStatus,
          }),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Failed to update order status. Status: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      const data: UpdateStatusResponse =
        JSON.parse(responseText);

      if (!data.success) {
        throw new Error(
          data.message || "Failed to update order status."
        );
      }

      setStatusMessage("Order status updated successfully.");

      await fetchOrders(true);

      if (data.order) {
        setSelectedOrder(data.order);
      } else {
        await fetchOrderDetails(orderId);
      }
    } catch (err) {
      console.error("UPDATE ORDER STATUS ERROR:", err);

      if (err instanceof Error) {
        setStatusMessage(err.message);
      } else {
        setStatusMessage("Failed to update order status.");
      }
    } finally {
      setUpdatingStatus(false);
    }
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

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status?: string) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusClasses = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";

      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "out_for_delivery":
        return "bg-orange-50 text-orange-700 border-orange-100";

      case "delivered":
        return "bg-green-50 text-green-700 border-green-100";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-100";

      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getPaymentClasses = (status?: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700";

      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "failed":
        return "bg-red-50 text-red-700";

      case "refunded":
        return "bg-purple-50 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCustomerName = (order: Order) => {
    return (
      order.user?.name ||
      order.customer?.name ||
      order.shippingAddress?.name ||
      "Customer"
    );
  };

  const getCustomerEmail = (order: Order) => {
    return (
      order.user?.email ||
      order.customer?.email ||
      "—"
    );
  };

  const getOrderNumber = (order: Order) => {
    if (order.orderNumber) {
      return order.orderNumber;
    }

    return `#${order._id.slice(-8).toUpperCase()}`;
  };

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderNumber = getOrderNumber(order).toLowerCase();

      const customerName =
        getCustomerName(order).toLowerCase();

      const customerEmail =
        getCustomerEmail(order).toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        orderNumber.includes(normalizedSearch) ||
        customerName.includes(normalizedSearch) ||
        customerEmail.includes(normalizedSearch);

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
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, paymentFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ordersPerPage)
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const totalOrderValue = filteredOrders.reduce(
    (total, order) =>
      total + (order.totalAmount || 0),
    0
  );

  const openOrder = async (order: Order) => {
    setSelectedOrder(order);

    await fetchOrderDetails(order._id);
  };

  const closeOrder = () => {
    setSelectedOrder(null);
    setStatusMessage("");
  };

  const getNextStatus = (
    currentStatus?: string
  ): OrderStatus | null => {
    if (!currentStatus) {
      return "processing";
    }

    const index = STATUS_FLOW.indexOf(
      currentStatus as OrderStatus
    );

    if (index === -1) {
      return null;
    }

    return STATUS_FLOW[index + 1] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-8 w-52 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="h-[600px] animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-red-900">
                  Unable to load orders
                </h2>

                <p className="mt-2 text-sm text-red-700">
                  {error}
                </p>

                <button
                  onClick={() => fetchOrders()}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-black p-2.5">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                    Staff Orders
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    View and process customer orders.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}

              Refresh
            </button>
          </div>

          {/* Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Orders
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {orders.length}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Filtered Orders
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {filteredOrders.length}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-3">
                  <Filter className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Filtered Value
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formatCurrency(totalOrderValue)}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-3">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_200px_200px]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search order, customer or email..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
                />
              </div>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Order Status"
                      : formatStatus(status)}
                  </option>
                ))}
              </select>

              {/* Payment */}
              <select
                value={paymentFilter}
                onChange={(event) =>
                  setPaymentFilter(event.target.value)
                }
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
              >
                {PAYMENT_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Payment Status"
                      : formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredOrders.length} order
                    {filteredOrders.length !== 1
                      ? "s"
                      : ""}{" "}
                    found
                  </p>
                </div>
              </div>
            </div>

            {paginatedOrders.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <ShoppingBag className="h-6 w-6 text-gray-400" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  No orders found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70 text-left">
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Order
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Customer
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Date
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Amount
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Payment
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-50 transition hover:bg-gray-50/70"
                        >
                          <td className="px-5 py-4">
                            <span className="font-mono text-sm font-medium text-gray-800">
                              {getOrderNumber(order)}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {getCustomerName(order)}
                              </p>

                              <p className="mt-1 max-w-[200px] truncate text-xs text-gray-500">
                                {getCustomerEmail(order)}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CalendarDays className="h-4 w-4 text-gray-400" />

                              {formatDate(order.createdAt)}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(
                                order.totalAmount || 0
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPaymentClasses(
                                  order.paymentStatus
                                )}`}
                              >
                                {order.paymentStatus ||
                                  "Unknown"}
                              </span>

                              {order.paymentMethod && (
                                <p className="mt-2 text-xs capitalize text-gray-400">
                                  {order.paymentMethod}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                                order.orderStatus
                              )}`}
                            >
                              {formatStatus(
                                order.orderStatus
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() =>
                                openOrder(order)
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
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

                {/* Pagination */}
                <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium text-gray-700">
                      {(currentPage - 1) *
                        ordersPerPage +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-700">
                      {Math.min(
                        currentPage * ordersPerPage,
                        filteredOrders.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">
                      {filteredOrders.length}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.max(1, page - 1)
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <span className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      disabled={
                        currentPage === totalPages
                      }
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(
                            totalPages,
                            page + 1
                          )
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Order Details
                </p>

                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  {getOrderNumber(selectedOrder)}
                </h2>
              </div>

              <button
                onClick={closeOrder}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 sm:p-6">
              {detailsLoading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-500" />

                    <p className="mt-3 text-sm text-gray-500">
                      Loading order details...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Status */}
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Current Status
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusClasses(
                            selectedOrder.orderStatus
                          )}`}
                        >
                          {formatStatus(
                            selectedOrder.orderStatus
                          )}
                        </span>
                      </div>

                      {selectedOrder.orderStatus !==
                        "cancelled" &&
                        selectedOrder.orderStatus !==
                          "delivered" && (
                          <div className="flex flex-col gap-2 sm:items-end">
                            <label className="text-xs font-medium text-gray-500">
                              Update Status
                            </label>

                            <select
                              value={
                                selectedOrder.orderStatus ||
                                ""
                              }
                              disabled={updatingStatus}
                              onChange={(event) => {
                                const value =
                                  event.target
                                    .value as OrderStatus;

                                updateOrderStatus(
                                  selectedOrder._id,
                                  value
                                );
                              }}
                              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400 disabled:opacity-50"
                            >
                              {STATUS_FLOW.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {formatStatus(
                                      status
                                    )}
                                  </option>
                                )
                              )}

                              <option value="cancelled">
                                Cancelled
                              </option>
                            </select>
                          </div>
                        )}
                    </div>

                    {statusMessage && (
                      <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-gray-600">
                        {statusMessage}
                      </p>
                    )}
                  </div>

                  {/* Customer */}
                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />

                      <h3 className="text-sm font-semibold text-gray-900">
                        Customer
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-100 p-5">
                      <p className="font-medium text-gray-900">
                        {getCustomerName(
                          selectedOrder
                        )}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {getCustomerEmail(
                          selectedOrder
                        )}
                      </p>

                      {(selectedOrder.user?.phone ||
                        selectedOrder.customer?.phone ||
                        selectedOrder.shippingAddress
                          ?.phone) && (
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedOrder.user?.phone ||
                            selectedOrder.customer
                              ?.phone ||
                            selectedOrder
                              .shippingAddress?.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {selectedOrder.shippingAddress && (
                    <div className="mt-6">
                      <div className="mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />

                        <h3 className="text-sm font-semibold text-gray-900">
                          Shipping Address
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-gray-100 p-5 text-sm text-gray-600">
                        {selectedOrder.shippingAddress
                          .name && (
                          <p className="font-medium text-gray-900">
                            {
                              selectedOrder
                                .shippingAddress.name
                            }
                          </p>
                        )}

                        {selectedOrder.shippingAddress
                          .address && (
                          <p className="mt-1">
                            {
                              selectedOrder
                                .shippingAddress.address
                            }
                          </p>
                        )}

                        <p className="mt-1">
                          {
                            selectedOrder
                              .shippingAddress.city
                          }
                          {selectedOrder.shippingAddress
                            .city &&
                            selectedOrder
                              .shippingAddress
                              .state &&
                            ", "}
                          {
                            selectedOrder
                              .shippingAddress.state
                          }
                        </p>

                        {selectedOrder.shippingAddress
                          .pincode && (
                          <p className="mt-1">
                            {
                              selectedOrder
                                .shippingAddress.pincode
                            }
                          </p>
                        )}

                        {selectedOrder.shippingAddress
                          .country && (
                          <p className="mt-1">
                            {
                              selectedOrder
                                .shippingAddress.country
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />

                      <h3 className="text-sm font-semibold text-gray-900">
                        Order Items
                      </h3>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100">
                      {selectedOrder.items &&
                      selectedOrder.items.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {selectedOrder.items.map(
                            (item, index) => (
                              <div
                                key={`${item.product || "item"}-${index}`}
                                className="flex items-center justify-between gap-4 p-4"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {item.name ||
                                      "Product"}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    Qty:{" "}
                                    {item.quantity ||
                                      0}
                                  </p>
                                </div>

                                <p className="shrink-0 text-sm font-semibold text-gray-900">
                                  {formatCurrency(
                                    (item.price ||
                                      0) *
                                      (item.quantity ||
                                        0)
                                  )}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="p-5 text-sm text-gray-500">
                          No item information available.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">
                      Payment
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                          Payment Method
                        </p>

                        <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                          {selectedOrder.paymentMethod ||
                            "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                          Payment Status
                        </p>

                        <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                          {selectedOrder.paymentStatus ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mt-6 rounded-2xl bg-black p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        Subtotal
                      </span>

                      <span className="text-sm">
                        {formatCurrency(
                          selectedOrder.subtotal ??
                            selectedOrder.totalAmount ??
                            0
                        )}
                      </span>
                    </div>

                    {selectedOrder.shippingCharge !==
                      undefined && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Shipping
                        </span>

                        <span className="text-sm">
                          {formatCurrency(
                            selectedOrder.shippingCharge
                          )}
                        </span>
                      </div>
                    )}

                    {selectedOrder.discount !==
                      undefined && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Discount
                        </span>

                        <span className="text-sm">
                          -{" "}
                          {formatCurrency(
                            selectedOrder.discount
                          )}
                        </span>
                      </div>
                    )}

                    <div className="mt-4 border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          Total
                        </span>

                        <span className="text-xl font-semibold">
                          {formatCurrency(
                            selectedOrder.totalAmount ||
                              0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-500">
                        Created
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDateTime(
                          selectedOrder.createdAt
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-500">
                        Last Updated
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDateTime(
                          selectedOrder.updatedAt
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 sm:px-6">
              <div>
                {selectedOrder.orderStatus &&
                  selectedOrder.orderStatus !==
                    "cancelled" &&
                  selectedOrder.orderStatus !==
                    "delivered" &&
                  getNextStatus(
                    selectedOrder.orderStatus
                  ) && (
                    <button
                      disabled={updatingStatus}
                      onClick={() => {
                        const nextStatus =
                          getNextStatus(
                            selectedOrder.orderStatus
                          );

                        if (nextStatus) {
                          updateOrderStatus(
                            selectedOrder._id,
                            nextStatus
                          );
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingStatus && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}

                      Move to{" "}
                      {formatStatus(
                        getNextStatus(
                          selectedOrder.orderStatus
                        ) || ""
                      )}
                    </button>
                  )}
              </div>

              <button
                onClick={closeOrder}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}