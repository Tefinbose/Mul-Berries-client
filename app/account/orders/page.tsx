"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

const order = {
  id: "MB-2026-00125",
  date: "September 10, 2026",
  status: "In Transit",
  estimatedDelivery: "September 14, 2026",

  items: [
    {
      id: 1,
      name: "Classic Linen Shirt",
      size: "M",
      quantity: 1,
      price: 1499,
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Leather Handbag",
      size: "Standard",
      quantity: 1,
      price: 1899,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    },
  ],

  shippingAddress: {
    name: "John Doe",
    address: "24 MG Road",
    city: "Kochi",
    state: "Kerala",
    pincode: "682016",
    phone: "+91 98765 43210",
  },

  payment: {
    method: "Online Payment",
    status: "Paid",
  },

  shipping: {
    courier: "Mulberries Express",
    awb: "MB123456789",
  },
};

const trackingSteps = [
  {
    title: "Order Confirmed",
    description: "Your order has been confirmed",
    date: "Sep 10, 2026",
    completed: true,
  },
  {
    title: "Shipment Created",
    description: "Shipment information has been created",
    date: "Sep 10, 2026",
    completed: true,
  },
  {
    title: "Courier Assigned",
    description: "Courier has been assigned to your shipment",
    date: "Sep 11, 2026",
    completed: true,
  },
  {
    title: "Picked Up",
    description: "Your package has been picked up",
    date: "Sep 11, 2026",
    completed: true,
  },
  {
    title: "In Transit",
    description: "Your package is on its way",
    date: "Sep 12, 2026",
    completed: true,
    current: true,
  },
  {
    title: "Out for Delivery",
    description: "Your package will be delivered today",
    date: "",
    completed: false,
  },
  {
    title: "Delivered",
    description: "Your package has been delivered",
    date: "",
    completed: false,
  },
];

export default function OrderDetailsPage() {
  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingCharge = subtotal >= 3000 ? 0 : 99;
  const total = subtotal + shippingCharge;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <p className="mb-2 text-sm text-gray-500">Order Details</p>

              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Order #{order.id}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Placed on {order.date}
              </p>
            </div>

            <div className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
              {order.status}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Tracking */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Track Your Order
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Estimated delivery:{" "}
                    <span className="font-medium text-gray-900">
                      {order.estimatedDelivery}
                    </span>
                  </p>
                </div>

                <Truck className="hidden text-gray-700 sm:block" size={28} />
              </div>

              {/* Timeline */}
              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const isLast = index === trackingSteps.length - 1;

                  return (
                    <div
                      key={step.title}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {/* Vertical Line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[15px] top-8 h-full w-px ${
                            step.completed ? "bg-gray-900" : "bg-gray-200"
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

                      {/* Content */}
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
                })}
              </div>

              {/* Courier Information */}
              <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Courier
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {order.shipping.courier}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      AWB / Tracking Number
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {order.shipping.awb}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Items in This Order
              </h2>

              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-24">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Size: {item.size}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="mt-3 font-semibold text-gray-900">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  <MapPin size={20} className="text-gray-700" />
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <div className="text-sm leading-6 text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.name}
                </p>

                <p>{order.shippingAddress.address}</p>

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                </p>

                <p>PIN: {order.shippingAddress.pincode}</p>

                <p className="mt-2">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Order Summary */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  <Package size={20} className="text-gray-700" />
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>

                  <span>
                    {shippingCharge === 0
                      ? "FREE"
                      : `₹${shippingCharge}`}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Payment
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {order.payment.method}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {order.payment.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Need Help?
              </h2>

              <div className="space-y-3">
                <button className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900">
                  Contact Support
                </button>

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