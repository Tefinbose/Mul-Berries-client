"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Loader2,
  Package,
  ShoppingBag,
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

type PaymentMethod = "cod" | "razorpay";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

interface OrderItem {
  product: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  variantId?: string;
  color?: string;
  size?: string;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "Pending";

    case "confirmed":
      return "Confirmed";

    case "processing":
      return "Processing";

    case "shipped":
      return "Shipped";

    case "out_for_delivery":
      return "Out for Delivery";

    case "delivered":
      return "Delivered";

    case "cancelled":
      return "Cancelled";

    case "returned":
      return "Returned";

    default:
      return status;
  }
};

const getStatusClasses = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    case "returned":
      return "bg-purple-100 text-purple-700";

    case "out_for_delivery":
      return "bg-blue-100 text-blue-700";

    case "shipped":
      return "bg-indigo-100 text-indigo-700";

    case "confirmed":
    case "processing":
      return "bg-orange-100 text-orange-700";

    case "pending":
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your orders.");
          return;
        }

        const response = await fetch(`${API_URL}/orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error("FETCH ORDERS ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <p className="mb-2 text-sm text-gray-500">My Account</p>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View and track all your orders in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2
                size={30}
                className="animate-spin text-gray-700"
              />

              <p className="text-sm text-gray-500">
                Loading your orders...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Package size={24} className="text-red-500" />
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                Unable to load orders
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {error}
              </p>

              <Link
                href="/login"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag
                  size={28}
                  className="text-gray-600"
                />
              </div>

              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                No orders yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                You haven't placed any orders yet. Start shopping
                and your orders will appear here.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Start Shopping
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const firstItem = order.items?.[0];

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  {/* Order Header */}
                  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            Order ID
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            #{order._id}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <CalendarDays
                              size={15}
                              className="text-gray-400"
                            />

                            <p className="text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                            order.orderStatus
                          )}`}
                        >
                          {getStatusLabel(order.orderStatus)}
                        </span>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-400">
                          Order Total
                        </p>

                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="px-5 py-6 sm:px-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      {/* Product */}
                      <div className="flex min-w-0 flex-1 gap-4">
                        {firstItem?.image ? (
                          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-24">
                            <img
                              src={firstItem.image}
                              alt={firstItem.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 sm:h-28 sm:w-24">
                            <Package
                              size={28}
                              className="text-gray-400"
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h2 className="truncate font-medium text-gray-900">
                            {firstItem?.name || "Order Items"}
                          </h2>

                          {firstItem && (
                            <>
                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {firstItem.quantity}
                              </p>

                              {firstItem.size && (
                                <p className="mt-1 text-sm text-gray-500">
                                  Size: {firstItem.size}
                                </p>
                              )}

                              {firstItem.color && (
                                <p className="mt-1 text-sm text-gray-500">
                                  Color: {firstItem.color}
                                </p>
                              )}
                            </>
                          )}

                          {order.items.length > 1 && (
                            <p className="mt-2 text-sm font-medium text-gray-500">
                              + {order.items.length - 1} more{" "}
                              {order.items.length - 1 === 1
                                ? "item"
                                : "items"}
                            </p>
                          )}

                          <p className="mt-3 text-sm font-semibold text-gray-900">
                            {firstItem
                              ? formatCurrency(
                                  firstItem.price *
                                    firstItem.quantity
                                )
                              : formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="border-t border-gray-100 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Payment
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {order.paymentMethod === "razorpay"
                            ? "Online Payment"
                            : "Cash on Delivery"}
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "failed"
                                ? "bg-red-100 text-red-700"
                                : order.paymentStatus === "refunded"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus
                            .charAt(0)
                            .toUpperCase() +
                            order.paymentStatus.slice(1)}
                        </span>
                      </div>

                      {/* Action */}
                      <div className="border-t border-gray-100 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                        <Link
                          href={`/account/orders/${order._id}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
                        >
                          View Order
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Summary */}
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-gray-500">
                        <span>
                          {order.items.length}{" "}
                          {order.items.length === 1
                            ? "item"
                            : "items"}
                        </span>

                        <span>
                          Shipping:{" "}
                          {order.shippingCharge === 0
                            ? "FREE"
                            : formatCurrency(
                                order.shippingCharge
                              )}
                        </span>

                        {order.discount > 0 && (
                          <span className="text-green-600">
                            Discount: -
                            {formatCurrency(order.discount)}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/account/orders/${order._id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:underline"
                      >
                        View details
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}