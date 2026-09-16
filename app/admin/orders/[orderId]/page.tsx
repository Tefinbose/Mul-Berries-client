"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  XCircle,
  RefreshCw,
} from "lucide-react";

import { getProductBySlug } from "@/lib/products";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type OrderItem = {
  productSlug: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
};

type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  status: OrderStatus;
  paymentStatus: "Paid" | "Pending" | "Failed";
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
};

const orders: Order[] = [
  {
    id: "MB1024",
    customer: {
      name: "Anjali Menon",
      email: "anjali@example.com",
      phone: "+91 98765 43210",
    },
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "Razorpay",
    items: [
      {
        productSlug: "royal-red-kanjivaram-silk-saree",
        quantity: 1,
        price: 8999,
        size: "Free Size",
        color: "Red",
      },
      {
        productSlug: "aqua-gold-silk-saree",
        quantity: 1,
        price: 7499,
        size: "Free Size",
        color: "Aqua",
      },
    ],
    subtotal: 16498,
    shipping: 0,
    discount: 500,
    total: 15998,
    address: {
      name: "Anjali Menon",
      phone: "+91 98765 43210",
      address: "12 Rose Garden Road",
      city: "Kochi",
      state: "Kerala",
      pincode: "682020",
    },
    createdAt: "10 Sep 2026, 10:30 AM",
  },
  {
    id: "MB1025",
    customer: {
      name: "Rahul Nair",
      email: "rahul@example.com",
      phone: "+91 91234 56789",
    },
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    items: [
      {
        productSlug: "maroon-pure-silk-saree",
        quantity: 1,
        price: 8299,
        size: "Free Size",
        color: "Maroon",
      },
    ],
    subtotal: 8299,
    shipping: 0,
    discount: 0,
    total: 8299,
    address: {
      name: "Rahul Nair",
      phone: "+91 91234 56789",
      address: "45 MG Road",
      city: "Ernakulam",
      state: "Kerala",
      pincode: "682016",
    },
    createdAt: "9 Sep 2026, 3:15 PM",
  },
];

const statusSteps: {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    status: "Pending",
    label: "Order Placed",
    description: "Customer placed the order",
    icon: Clock3,
  },
  {
    status: "Confirmed",
    label: "Order Confirmed",
    description: "Payment and order confirmed",
    icon: CheckCircle2,
  },
  {
    status: "Processing",
    label: "Processing",
    description: "Order is being prepared",
    icon: Package,
  },
  {
    status: "Shipped",
    label: "Shipped",
    description: "Order handed over to courier",
    icon: Truck,
  },
  {
    status: "Delivered",
    label: "Delivered",
    description: "Order delivered to customer",
    icon: CheckCircle2,
  },
];

const statusOrder: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function getStatusIndex(status: OrderStatus) {
  return statusOrder.indexOf(status);
}

export default function AdminOrderDetailsPage() {
  const params = useParams();

  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;

  const order = orders.find(
    (item) => item.id.toLowerCase() === orderId?.toLowerCase()
  );

  if (!order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-neutral-400" />

          <h1 className="text-2xl font-semibold text-neutral-900">
            Order not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            The order you are looking for does not exist.
          </p>

          <Link
            href="/admin/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Order #{order.id}
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Placed on {order.createdAt}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                alert("Order status update will be connected to the backend.")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
            >
              <RefreshCw className="h-4 w-4" />
              Update Status
            </button>

            {order.status !== "Cancelled" &&
              order.status !== "Delivered" && (
                <button
                  type="button"
                  onClick={() =>
                    alert("Cancel order will be connected to the backend.")
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Order
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Order Items */}
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="font-semibold text-neutral-900">
                Order Items
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                {order.items.length} product
                {order.items.length !== 1 ? "s" : ""} in this order
              </p>
            </div>

            <div className="divide-y divide-neutral-100">
              {order.items.map((item, index) => {
                const product = getProductBySlug(item.productSlug);

                return (
                  <div
                    key={`${item.productSlug}-${index}`}
                    className="flex gap-4 p-5"
                  >
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                      {product?.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-neutral-900">
                        {product?.name || "Product"}
                      </h3>

                      <div className="mt-1 text-sm text-neutral-500">
                        Color: {item.color}
                      </div>

                      <div className="text-sm text-neutral-500">
                        Size: {item.size}
                      </div>

                      <div className="mt-2 text-sm text-neutral-600">
                        Qty: {item.quantity}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>

                      {item.quantity > 1 && (
                        <p className="mt-1 text-xs text-neutral-500">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Summary */}
            <div className="border-t border-neutral-100 px-5 py-5">
              <div className="ml-auto max-w-sm space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="font-medium text-neutral-900">
                    {order.shipping === 0
                      ? "Free"
                      : formatPrice(order.shipping)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-500">Discount</span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(order.discount)}
                  </span>
                </div>

                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-900">
                      Total
                    </span>

                    <span className="text-lg font-semibold text-neutral-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Order Timeline */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-neutral-900">
              Order Status
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Current status:{" "}
              <span className="font-medium text-neutral-900">
                {order.status}
              </span>
            </p>

            <div className="mt-8">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const completed =
                  currentStatusIndex >= index &&
                  order.status !== "Cancelled";

                const isCurrent =
                  currentStatusIndex === index &&
                  order.status !== "Cancelled";

                return (
                  <div key={step.status} className="relative flex gap-4">
                    {index !== statusSteps.length - 1 && (
                      <div
                        className={`absolute left-[15px] top-8 h-full w-px ${
                          completed && currentStatusIndex > index
                            ? "bg-neutral-900"
                            : "bg-neutral-200"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                        completed
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="pb-8">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-sm font-semibold ${
                            completed
                              ? "text-neutral-900"
                              : "text-neutral-400"
                          }`}
                        >
                          {step.label}
                        </h3>

                        {isCurrent && (
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-neutral-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-neutral-600" />

              <h2 className="font-semibold text-neutral-900">
                Customer
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {order.customer.name}
                </p>
              </div>

              <div className="flex items-center gap-3 text-sm text-neutral-500">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="break-all">
                  {order.customer.email}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-neutral-500">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{order.customer.phone}</span>
              </div>

              <Link
                href="/admin/customers"
                className="block pt-2 text-sm font-medium text-neutral-900 hover:underline"
              >
                View customer →
              </Link>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-neutral-600" />

              <h2 className="font-semibold text-neutral-900">
                Shipping Address
              </h2>
            </div>

            <div className="mt-5 space-y-1 text-sm text-neutral-600">
              <p className="font-medium text-neutral-900">
                {order.address.name}
              </p>

              <p>{order.address.address}</p>

              <p>
                {order.address.city}, {order.address.state}
              </p>

              <p>{order.address.pincode}</p>

              <p className="pt-2">{order.address.phone}</p>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-neutral-600" />

              <h2 className="font-semibold text-neutral-900">
                Payment
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  Status
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-50 text-green-700"
                      : order.paymentStatus === "Pending"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  Method
                </span>

                <span className="text-sm font-medium text-neutral-900">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <span className="text-sm text-neutral-500">
                  Amount
                </span>

                <span className="font-semibold text-neutral-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </section>

          {/* Shipping / Courier Placeholder */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-neutral-600" />

              <h2 className="font-semibold text-neutral-900">
                Shipment
              </h2>
            </div>

            <div className="mt-5 rounded-xl bg-neutral-50 p-4">
              <p className="text-sm font-medium text-neutral-900">
                Courier not assigned
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Courier selection, AWB generation, shipping label,
                pickup scheduling and tracking will be connected later.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                alert("Courier assignment will be connected later.")
              }
              className="mt-4 w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Assign Courier
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}