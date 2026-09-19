"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  Truck,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

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
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
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
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  order?: Order;
};

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("orderId");

        if (!orderId) {
          setError("Order ID is missing.");
          return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your order.");
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
            data.message || "Failed to load order details."
          );
        }

        setOrder(data.order);
      } catch (error) {
        console.error("FETCH ORDER ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPaymentMethod = (
    paymentMethod: Order["paymentMethod"]
  ) => {
    return paymentMethod === "razorpay"
      ? "Online Payment"
      : "Cash on Delivery";
  };

  const formatPaymentStatus = (
    paymentStatus: Order["paymentStatus"]
  ) => {
    switch (paymentStatus) {
      case "paid":
        return "Paid";

      case "pending":
        return "Pending";

      case "failed":
        return "Failed";

      case "refunded":
        return "Refunded";

      default:
        return paymentStatus;
    }
  };

  const formatOrderStatus = (
    orderStatus: Order["orderStatus"]
  ) => {
    switch (orderStatus) {
      case "pending":
        return "Order Pending";

      case "confirmed":
        return "Order Confirmed";

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
        return orderStatus;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />

            <p className="mt-4 text-sm text-neutral-500">
              Loading your order...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle
                size={34}
                className="text-red-600"
              />
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-neutral-900">
              Unable to load order
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              {error || "We could not find your order."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/account/orders"
                className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                View My Orders
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isConfirmed =
    order.orderStatus === "confirmed" ||
    order.orderStatus === "processing" ||
    order.orderStatus === "shipped" ||
    order.orderStatus === "out_for_delivery" ||
    order.orderStatus === "delivered";

  const isProcessing =
    order.orderStatus === "processing" ||
    order.orderStatus === "shipped" ||
    order.orderStatus === "out_for_delivery" ||
    order.orderStatus === "delivered";

  const isShipped =
    order.orderStatus === "shipped" ||
    order.orderStatus === "out_for_delivery" ||
    order.orderStatus === "delivered";

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-6 py-16">

        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              size={42}
              className="text-green-600"
            />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Order Confirmed
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-500">
            Your order has been successfully placed. We&apos;ll
            keep you updated about your shipment.
          </p>
        </div>

        {/* Order Information */}
        <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="grid gap-6 sm:grid-cols-3">

            {/* Order Number */}
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Order Number
              </p>

              <p className="mt-2 font-medium text-neutral-900">
                #{order._id}
              </p>
            </div>

            {/* Order Date */}
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Order Date
              </p>

              <p className="mt-2 font-medium text-neutral-900">
                {formatDate(order.createdAt)}
              </p>
            </div>

            {/* Payment */}
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Payment
              </p>

              <p className="mt-2 font-medium text-neutral-900">
                {formatPaymentMethod(order.paymentMethod)}
              </p>

              <p
                className={`mt-1 text-xs ${
                  order.paymentStatus === "paid"
                    ? "text-green-600"
                    : order.paymentStatus === "failed"
                    ? "text-red-600"
                    : "text-neutral-500"
                }`}
              >
                {formatPaymentStatus(order.paymentStatus)}
              </p>
            </div>

          </div>
        </div>

        {/* Order Status */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Order Status
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">

            {/* Confirmed */}
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isConfirmed
                    ? "bg-green-100"
                    : "bg-neutral-100"
                }`}
              >
                <CheckCircle2
                  size={19}
                  className={
                    isConfirmed
                      ? "text-green-600"
                      : "text-neutral-400"
                  }
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Order Confirmed
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {isConfirmed
                    ? "Your order has been received."
                    : formatOrderStatus(order.orderStatus)}
                </p>
              </div>
            </div>

            {/* Processing */}
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isProcessing
                    ? "bg-green-100"
                    : "bg-neutral-100"
                }`}
              >
                <Package
                  size={19}
                  className={
                    isProcessing
                      ? "text-green-600"
                      : "text-neutral-500"
                  }
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Processing
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {isProcessing
                    ? "We&apos;re preparing your order."
                    : "Your order will be prepared soon."}
                </p>
              </div>
            </div>

            {/* Shipping */}
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isShipped
                    ? "bg-green-100"
                    : "bg-neutral-100"
                }`}
              >
                <Truck
                  size={19}
                  className={
                    isShipped
                      ? "text-green-600"
                      : "text-neutral-500"
                  }
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Shipment
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {isShipped
                    ? formatOrderStatus(order.orderStatus)
                    : "Tracking will be available soon."}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-5">

            {order.items.map((item, index) => (
              <div
                key={`${item.product}-${index}`}
                className="flex items-center gap-4"
              >
                {/* Product Image */}
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package
                        size={22}
                        className="text-neutral-400"
                      />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">
                    {item.name}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-500">
                    {item.color && (
                      <span>
                        Color: {item.color}
                      </span>
                    )}

                    {item.size && (
                      <span>
                        Size: {item.size}
                      </span>
                    )}

                    <span>
                      × {item.quantity}
                    </span>
                  </div>
                </div>

                {/* Item Price */}
                <p className="font-medium text-neutral-900">
                  {formatCurrency(
                    item.price * item.quantity
                  )}
                </p>
              </div>
            ))}

          </div>

          {/* Total */}
          <div className="mt-6 border-t pt-5">

            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">
                Subtotal
              </span>

              <span>
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            {/* Shipping */}
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-neutral-500">
                Shipping
              </span>

              <span>
                {order.shippingCharge === 0
                  ? "Free"
                  : formatCurrency(
                      order.shippingCharge
                    )}
              </span>
            </div>

            {/* Discount */}
            {order.discount > 0 && (
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-neutral-500">
                  Discount
                </span>

                <span className="text-green-600">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}

            {/* Coupon */}
            {order.couponCode && (
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-neutral-500">
                  Coupon
                </span>

                <span className="font-medium text-neutral-900">
                  {order.couponCode}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="mt-4 flex justify-between border-t pt-4">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-xl font-semibold">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Delivery Address
          </h2>

          <div className="mt-4 text-sm leading-6 text-neutral-600">
            <p className="font-medium text-neutral-900">
              {order.shippingAddress.name}
            </p>

            <p>
              {order.shippingAddress.addressLine1}
            </p>

            {order.shippingAddress.addressLine2 && (
              <p>
                {order.shippingAddress.addressLine2}
              </p>
            )}

            <p>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}{" "}
              {order.shippingAddress.pincode}
            </p>

            <p>
              {order.shippingAddress.country ||
                "India"}
            </p>

            <p className="mt-2 text-neutral-500">
              Phone: {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Link
            href={`/account/orders/${order._id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <Package size={18} />
            View Order
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>

        </div>

        {/* Help */}
        <p className="mt-8 text-center text-xs text-neutral-400">
          Need help with your order? Contact our support team.
        </p>

      </div>
    </main>
  );
}