"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

export default function OrderSuccessPage() {
  const orderNumber = "MB-2026-00126";

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

            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Order Number
              </p>

              <p className="mt-2 font-medium text-neutral-900">
                #{orderNumber}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Order Date
              </p>

              <p className="mt-2 font-medium text-neutral-900">
                September 12, 2026
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Payment
              </p>

              <p className="mt-2 font-medium text-neutral-900">
                Cash on Delivery
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2
                  size={19}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Order Confirmed
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Your order has been received.
                </p>
              </div>
            </div>

            {/* Processing */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <Package
                  size={19}
                  className="text-neutral-500"
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Processing
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  We&apos;re preparing your order.
                </p>
              </div>
            </div>

            {/* Shipping */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <Truck
                  size={19}
                  className="text-neutral-500"
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Shipment
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Tracking will be available soon.
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

            {/* Item 1 */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-16 overflow-hidden rounded-lg bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80"
                  alt="Classic Cotton Shirt"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium text-neutral-900">
                  Classic Cotton Shirt
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  White / M × 1
                </p>
              </div>

              <p className="font-medium text-neutral-900">
                ₹1,899
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-16 overflow-hidden rounded-lg bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80"
                  alt="Premium T-Shirt"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium text-neutral-900">
                  Premium T-Shirt
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Black / M × 1
                </p>
              </div>

              <p className="font-medium text-neutral-900">
                ₹1,299
              </p>
            </div>

          </div>

          {/* Total */}
          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">
                Subtotal
              </span>

              <span>
                ₹3,198
              </span>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-neutral-500">
                Shipping
              </span>

              <span>
                ₹99
              </span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-xl font-semibold">
                ₹3,297
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
              Tefin Bose
            </p>

            <p>123 Main Street</p>
            <p>Kochi, Kerala 682001</p>
            <p>India</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Link
            href={`/account/orders/${orderNumber}`}
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

        {/* Demo Notice */}
        <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-center text-xs text-neutral-400">
          Order information shown here is demo data. Real order
          details will come from the backend after checkout is
          connected.
        </div>

      </div>
    </main>
  );
}