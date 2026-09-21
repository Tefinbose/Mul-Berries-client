"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  Package,
  Truck,
  CreditCard,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mull-berries-server.onrender.com/api";

type OrderItem = {
  product: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  variantId?: string;
  color?: string;
  size?: string;
};

type ShippingAddress = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
};

type Order = {
  _id: string;

  customer: {
    name: string;
    email: string;
    phone: string;
  };

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  subtotal: number;
  shippingCharge: number;
  discount: number;
  totalAmount: number;

  paymentMethod: "cod" | "razorpay";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned";

  couponCode?: string;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;

  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  order?: Order;
};

type TrackingStep = {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  current?: boolean;
};

export default function OrderDetailsPage() {
  const params = useParams();

  const orderId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        if (!orderId) {
          setError("Order ID is missing.");
          return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view this order.");
          return;
        }

        const response = await fetch(
          `${API_URL}/orders/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success || !data.order) {
          throw new Error(
            data.message || "Failed to load order."
          );
        }

        setOrder(data.order);
      } catch (error) {
        console.error(
          "FETCH ORDER DETAILS ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatLongDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatOrderStatus = (
    status: Order["orderStatus"]
  ) => {
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

  const formatPaymentMethod = (
    method: Order["paymentMethod"]
  ) => {
    return method === "razorpay"
      ? "Online Payment"
      : "Cash on Delivery";
  };

  const formatPaymentStatus = (
    status: Order["paymentStatus"]
  ) => {
    switch (status) {
      case "paid":
        return "Paid";

      case "pending":
        return "Pending";

      case "failed":
        return "Failed";

      case "refunded":
        return "Refunded";

      default:
        return status;
    }
  };

  const getTrackingSteps = (
    currentStatus: Order["orderStatus"]
  ): TrackingStep[] => {
    const steps = [
      {
        key: "confirmed",
        title: "Order Confirmed",
        description:
          "Your order has been confirmed",
      },
      {
        key: "processing",
        title: "Processing",
        description:
          "Your order is being prepared",
      },
      {
        key: "shipped",
        title: "Shipped",
        description:
          "Your package has been shipped",
      },
      {
        key: "out_for_delivery",
        title: "Out for Delivery",
        description:
          "Your package is out for delivery",
      },
      {
        key: "delivered",
        title: "Delivered",
        description:
          "Your package has been delivered",
      },
    ];

    const statusOrder = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];

    const currentIndex =
      statusOrder.indexOf(currentStatus);

    return steps.map((step) => {
      const stepIndex = statusOrder.indexOf(
        step.key
      );

      const completed =
        currentIndex >= stepIndex &&
        currentIndex !== -1;

      return {
        title: step.title,
        description: step.description,
        date: completed
          ? formatDate(order?.updatedAt || "")
          : "",
        completed,
        current:
          step.key === currentStatus,
      };
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

            <p className="mt-4 text-sm text-gray-500">
              Loading order details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle
                size={32}
                className="text-red-600"
              />
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-gray-900">
              Unable to load order
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {error ||
                "We could not find this order."}
            </p>

            <Link
              href="/account/orders"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const trackingSteps =
    getTrackingSteps(order.orderStatus);

  const isCancelled =
    order.orderStatus === "cancelled";

  const isReturned =
    order.orderStatus === "returned";

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            href="/account/orders"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-black"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <p className="mb-2 text-sm text-gray-500">
                Order Details
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Order #{order._id}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Placed on{" "}
                {formatLongDate(order.createdAt)}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                isCancelled
                  ? "bg-red-100 text-red-700"
                  : isReturned
                  ? "bg-purple-100 text-purple-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {formatOrderStatus(
                order.orderStatus
              )}
            </span>

          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ================= LEFT SIDE ================= */}
          <div className="space-y-8 lg:col-span-2">

            {/* ================= TRACKING ================= */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-8 flex items-start justify-between">

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Track Your Order
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {isCancelled
                      ? "This order has been cancelled."
                      : isReturned
                      ? "This order has been returned."
                      : "Shipment tracking will be available after the order is shipped."}
                  </p>
                </div>

                <Truck
                  size={28}
                  className="hidden text-gray-700 sm:block"
                />

              </div>

              {/* Tracking Timeline */}
              {!isCancelled &&
                !isReturned && (
                  <div className="relative">

                    {trackingSteps.map(
                      (step, index) => {
                        const isLast =
                          index ===
                          trackingSteps.length - 1;

                        return (
                          <div
                            key={step.title}
                            className="relative flex gap-4 pb-8 last:pb-0"
                          >

                            {/* Vertical Line */}
                            {!isLast && (
                              <div
                                className={`absolute left-[15px] top-8 h-full w-px ${
                                  step.completed
                                    ? "bg-gray-900"
                                    : "bg-gray-200"
                                }`}
                              />
                            )}

                            {/* Circle */}
                            <div
                              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                step.completed
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-300 bg-white text-gray-400"
                              }`}
                            >
                              {step.completed ? (
                                <Check size={16} />
                              ) : (
                                <Clock3 size={15} />
                              )}
                            </div>

                            {/* Step Content */}
                            <div className="flex flex-1 justify-between gap-4">

                              <div>
                                <h3
                                  className={`text-sm font-semibold ${
                                    step.current
                                      ? "text-orange-600"
                                      : step.completed
                                      ? "text-gray-900"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step.title}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                  {step.description}
                                </p>
                              </div>

                              {step.date && (
                                <p className="shrink-0 text-xs text-gray-400">
                                  {step.date}
                                </p>
                              )}

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              {/* Courier Information */}
              <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Courier
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      Not assigned yet
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      AWB / Tracking Number
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      Not available yet
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* ================= ORDER ITEMS ================= */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6 flex items-center gap-3">

                <div className="rounded-full bg-gray-100 p-2">
                  <Package
                    size={20}
                    className="text-gray-700"
                  />
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Items in This Order
                </h2>

              </div>

              <div className="divide-y divide-gray-100">

                {order.items.map(
                  (item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex gap-4 py-5 first:pt-0 last:pb-0"
                    >

                      {/* Product Image */}
                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-24">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package
                              size={24}
                              className="text-gray-400"
                            />
                          </div>
                        )}

                      </div>

                      {/* Product Information */}
                      <div className="flex flex-1 flex-col justify-between">

                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>

                          {item.size && (
                            <p className="mt-1 text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                          )}

                          {item.color && (
                            <p className="mt-1 text-sm text-gray-500">
                              Color: {item.color}
                            </p>
                          )}

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="mt-3 font-semibold text-gray-900">
                          {formatCurrency(
                            item.price *
                              item.quantity
                          )}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* ================= SHIPPING ADDRESS ================= */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-5 flex items-center gap-3">

                <div className="rounded-full bg-gray-100 p-2">
                  <MapPin
                    size={20}
                    className="text-gray-700"
                  />
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>

              </div>

              <div className="text-sm leading-6 text-gray-600">

                <p className="font-medium text-gray-900">
                  {order.shippingAddress.name}
                </p>

                <p>
                  {
                    order.shippingAddress
                      .addressLine1
                  }
                </p>

                {order.shippingAddress
                  .addressLine2 && (
                  <p>
                    {
                      order.shippingAddress
                        .addressLine2
                    }
                  </p>
                )}

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                </p>

                <p>
                  PIN:{" "}
                  {order.shippingAddress.pincode}
                </p>

                <p className="mt-2">
                  Phone:{" "}
                  {order.shippingAddress.phone}
                </p>

                <p>
                  {order.shippingAddress.country ||
                    "India"}
                </p>

              </div>

            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <aside className="space-y-6">

            {/* ================= ORDER SUMMARY ================= */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    {formatCurrency(
                      order.subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>

                  <span>
                    {order.shippingCharge === 0
                      ? "FREE"
                      : formatCurrency(
                          order.shippingCharge
                        )}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>

                    <span className="text-green-600">
                      -
                      {formatCurrency(
                        order.discount
                      )}
                    </span>
                  </div>
                )}

                {order.couponCode && (
                  <div className="flex justify-between text-gray-600">
                    <span>Coupon</span>

                    <span>
                      {order.couponCode}
                    </span>
                  </div>
                )}

                <div className="border-t pt-4">

                  <div className="flex justify-between text-base font-semibold text-gray-900">

                    <span>Total</span>

                    <span>
                      {formatCurrency(
                        order.totalAmount
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= PAYMENT ================= */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-4 flex items-center gap-3">

                <div className="rounded-full bg-gray-100 p-2">
                  <CreditCard
                    size={19}
                    className="text-gray-700"
                  />
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Payment
                </h2>

              </div>

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm text-gray-500">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatPaymentMethod(
                      order.paymentMethod
                    )}
                  </p>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    order.paymentStatus ===
                    "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus ===
                        "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {formatPaymentStatus(
                    order.paymentStatus
                  )}
                </span>

              </div>

            </div>

            {/* ================= CUSTOMER ================= */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Customer
              </h2>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Name
                  </span>

                  <span className="text-right font-medium text-gray-900">
                    {order.customer.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Email
                  </span>

                  <span className="break-all text-right text-gray-900">
                    {order.customer.email}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Phone
                  </span>

                  <span className="text-right text-gray-900">
                    {order.customer.phone}
                  </span>
                </div>

              </div>

            </div>

            {/* ================= HELP ================= */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Need Help?
              </h2>

              <div className="space-y-3">

                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                >
                  Contact Support
                </Link>

                <Link
                  href="/products"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Continue Shopping
                  <ChevronRight size={16} />
                </Link>

              </div>

            </div>

          </aside>

        </div>

      </section>
    </main>
  );
}