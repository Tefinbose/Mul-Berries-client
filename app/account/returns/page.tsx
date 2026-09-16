"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  RotateCcw,
} from "lucide-react";

type ReturnItem = {
  id: number;
  name: string;
  orderId: string;
  date: string;
  price: number;
  image: string;
};

const orders: ReturnItem[] = [
  {
    id: 1,
    name: "Classic Cotton Shirt",
    orderId: "MB-2026-00125",
    date: "September 8, 2026",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Premium T-Shirt",
    orderId: "MB-2026-00124",
    date: "September 5, 2026",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
  },
];

export default function ReturnsPage() {
  const [selectedItem, setSelectedItem] =
    useState<ReturnItem | null>(null);

  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedItem || !reason) {
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:bg-neutral-100"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <p className="text-sm text-neutral-500">
              My Account
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Returns & Refunds
            </h1>
          </div>
        </div>

        {/* Success */}
        {submitted ? (
          <div className="mt-10 rounded-2xl border bg-white p-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                size={34}
                className="text-green-600"
              />
            </div>

            <h2 className="mt-5 text-2xl font-semibold">
              Return request submitted
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
              Your return request has been received. Our team
              will review the request and update you about the
              next steps.
            </p>

            <div className="mt-6 rounded-xl bg-neutral-50 p-4 text-left">
              <p className="text-xs text-neutral-400">
                Request ID
              </p>

              <p className="mt-1 font-medium">
                RET-2026-001
              </p>

              <p className="mt-4 text-xs text-neutral-400">
                Product
              </p>

              <p className="mt-1 font-medium">
                {selectedItem?.name}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/account/orders"
                className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
              >
                View My Orders
              </Link>

              <Link
                href="/products"
                className="rounded-full border px-6 py-3 text-sm font-medium hover:bg-neutral-100"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Intro */}
            <div className="mt-8 rounded-2xl border bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <RotateCcw size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Request a return or refund
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Select an eligible product from your recent
                    orders and tell us why you want to return it.
                  </p>
                </div>
              </div>
            </div>

            {/* Orders */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold">
                Select a Product
              </h2>

              <div className="mt-4 space-y-4">
                {orders.map((item) => {
                  const selected =
                    selectedItem?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className={`flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition ${
                        selected
                          ? "border-black ring-1 ring-black"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                          Order #{item.orderId}
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          Purchased {item.date}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>

                        {selected && (
                          <CheckCircle2
                            size={20}
                            className="ml-auto mt-2"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Return Form */}
            {selectedItem && (
              <div className="mt-8 rounded-2xl border bg-white p-6">

                <h2 className="text-lg font-semibold">
                  Return Details
                </h2>

                {/* Reason */}
                <div className="mt-6">
                  <label className="text-sm font-medium">
                    Reason for return
                  </label>

                  <select
                    value={reason}
                    onChange={(e) =>
                      setReason(e.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-black"
                  >
                    <option value="">
                      Select a reason
                    </option>
                    <option value="damaged">
                      Product arrived damaged
                    </option>
                    <option value="wrong-product">
                      Wrong product received
                    </option>
                    <option value="size">
                      Size or fit issue
                    </option>
                    <option value="quality">
                      Product quality issue
                    </option>
                    <option value="changed-mind">
                      Changed my mind
                    </option>
                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Comments */}
                <div className="mt-5">
                  <label className="text-sm font-medium">
                    Additional comments
                  </label>

                  <textarea
                    value={comments}
                    onChange={(e) =>
                      setComments(e.target.value)
                    }
                    rows={4}
                    placeholder="Tell us more about the issue..."
                    className="mt-2 w-full resize-none rounded-xl border border-neutral-300 p-3 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* Refund Method */}
                <div className="mt-5">
                  <label className="text-sm font-medium">
                    Refund method
                  </label>

                  <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-sm font-medium">
                      Original payment method
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Refund will be processed after the returned
                      product is inspected.
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!reason}
                  className={`mt-6 w-full rounded-full py-4 text-sm font-medium transition ${
                    reason
                      ? "bg-black text-white hover:bg-neutral-800"
                      : "cursor-not-allowed bg-neutral-200 text-neutral-400"
                  }`}
                >
                  Submit Return Request
                </button>

              </div>
            )}

            {/* Policy */}
            <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 p-5">
              <div className="flex items-start gap-3">
                <Package
                  size={18}
                  className="mt-0.5 text-neutral-500"
                />

                <div>
                  <h3 className="text-sm font-medium">
                    Return policy
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Return eligibility, pickup, inspection and
                    refund timelines will be determined according
                    to the final Mulberries return policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo */}
            {/* <p className="mt-6 text-center text-xs text-neutral-400">
              Return information shown here is demo data. Real
              return requests will be processed by the backend.
            </p> */}
          </>
        )}
      </div>
    </main>
  );
}