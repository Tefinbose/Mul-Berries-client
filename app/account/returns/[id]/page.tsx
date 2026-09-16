"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Package,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";

const returnData = {
  id: "RET-2026-001",
  orderId: "MB-2026-00125",
  product: {
    name: "Classic Cotton Shirt",
    variant: "White / M",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80",
  },
  reason: "Size or fit issue",
  requestedDate: "September 12, 2026",
  refundAmount: 1899,
  refundMethod: "Original payment method",
  status: "Pickup Scheduled",
};

const returnSteps = [
  {
    title: "Request Submitted",
    description: "Your return request has been received.",
    icon: RotateCcw,
    status: "completed",
  },
  {
    title: "Under Review",
    description: "Our team reviewed your return request.",
    icon: Clock3,
    status: "completed",
  },
  {
    title: "Return Approved",
    description: "Your return request has been approved.",
    icon: CheckCircle2,
    status: "completed",
  },
  {
    title: "Pickup Scheduled",
    description: "A courier pickup has been scheduled.",
    icon: Truck,
    status: "current",
  },
  {
    title: "Product Received",
    description: "The returned product will be received and checked.",
    icon: Package,
    status: "pending",
  },
  {
    title: "Product Inspection",
    description: "The product will be inspected for return eligibility.",
    icon: Package,
    status: "pending",
  },
  {
    title: "Refund Completed",
    description: "Your refund will be processed after approval.",
    icon: CheckCircle2,
    status: "pending",
  },
];

export default function ReturnDetailsPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/account/returns"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white transition hover:bg-neutral-100"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <p className="text-sm text-neutral-500">
              Returns & Refunds
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Return Details
            </h1>
          </div>
        </div>

        {/* Status Header */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-400">
                Return Request
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                #{returnData.id}
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Order #{returnData.orderId}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
              <Truck size={16} className="text-blue-600" />

              <span className="text-sm font-medium text-blue-700">
                {returnData.status}
              </span>
            </div>

          </div>
        </div>

        {/* Product */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold">
            Returned Product
          </h2>

          <div className="mt-5 flex gap-4">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              <img
                src={returnData.product.image}
                alt={returnData.product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-neutral-900">
                {returnData.product.name}
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                {returnData.product.variant}
              </p>

              <p className="mt-2 font-medium">
                ₹
                {returnData.product.price.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 border-t pt-5 sm:grid-cols-3">

            <div>
              <p className="text-xs text-neutral-400">
                Return Reason
              </p>

              <p className="mt-1 text-sm font-medium">
                {returnData.reason}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                Requested On
              </p>

              <p className="mt-1 text-sm font-medium">
                {returnData.requestedDate}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                Refund Amount
              </p>

              <p className="mt-1 text-sm font-medium">
                ₹
                {returnData.refundAmount.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

          </div>
        </div>

        {/* Return Timeline */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold">
            Return Status
          </h2>

          <div className="mt-8">

            {returnSteps.map((step, index) => {
              const Icon = step.icon;

              const isCompleted =
                step.status === "completed";

              const isCurrent =
                step.status === "current";

              const isLast =
                index === returnSteps.length - 1;

              return (
                <div
                  key={step.title}
                  className="relative flex gap-4"
                >
                  {/* Vertical Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-5 top-10 h-full w-px ${
                        isCompleted
                          ? "bg-black"
                          : "bg-neutral-200"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isCompleted
                        ? "bg-black text-white"
                        : isCurrent
                        ? "bg-blue-100 text-blue-600 ring-4 ring-blue-50"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <div
                    className={`pb-8 ${
                      isLast ? "pb-0" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-medium ${
                          step.status === "pending"
                            ? "text-neutral-400"
                            : "text-neutral-900"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {isCurrent && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                          Current
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-1 text-sm ${
                        step.status === "pending"
                          ? "text-neutral-400"
                          : "text-neutral-500"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Pickup Information */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold">
            Pickup Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-400">
                Courier
              </p>

              <p className="mt-1 text-sm font-medium">
                Courier partner
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-400">
                Pickup Status
              </p>

              <p className="mt-1 text-sm font-medium">
                Scheduled
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-400">
                Pickup Date
              </p>

              <p className="mt-1 text-sm font-medium">
                September 14, 2026
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-400">
                Tracking
              </p>

              <p className="mt-1 text-sm font-medium">
                Available after pickup
              </p>
            </div>

          </div>
        </div>

        {/* Refund */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold">
            Refund Information
          </h2>

          <div className="mt-5 flex items-center justify-between border-b pb-4">
            <span className="text-sm text-neutral-500">
              Refund amount
            </span>

            <span className="font-semibold">
              ₹
              {returnData.refundAmount.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              Refund method
            </span>

            <span className="text-sm font-medium">
              {returnData.refundMethod}
            </span>
          </div>

          <div className="mt-5 rounded-xl bg-neutral-50 p-4">
            <p className="text-sm font-medium">
              Refund will be processed after inspection
            </p>

            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Once the returned product passes inspection, the
              refund will be initiated according to the final
              Mulberries refund policy.
            </p>
          </div>
        </div>

        {/* Help */}
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-6 text-center">
          <XCircle
            size={22}
            className="mx-auto text-neutral-400"
          />

          <h2 className="mt-3 text-sm font-semibold">
            Need help with your return?
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            Contact our support team if you have questions
            about your return.
          </p>

          <Link
            href="/contact"
            className="mt-4 inline-block rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-100"
          >
            Contact Support
          </Link>
        </div>

        {/* Demo Notice */}
        <p className="mt-6 text-center text-xs text-neutral-400">
          Return status shown here is demo data. Real status
          updates will come from the backend and courier
          webhooks.
        </p>

      </div>
    </main>
  );
}