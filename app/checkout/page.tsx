"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  CreditCard,
  MapPin,
  Package,
  Tag,
  Truck,
  X,
} from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type Coupon = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minimumOrder: number;
};

const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Classic Collection",
    price: 1999,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Premium Essentials",
    price: 1499,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
  },
];

const availableCoupons: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minimumOrder: 1000,
  },
  {
    code: "SAVE500",
    type: "fixed",
    value: 500,
    minimumOrder: 3000,
  },
  {
    code: "MULBERRIES20",
    type: "percentage",
    value: 20,
    minimumOrder: 2500,
  },
];

export default function CheckoutPage() {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] =
    useState<Coupon | null>(null);

  const [couponError, setCouponError] = useState("");

  const [shippingMethod, setShippingMethod] =
    useState("standard");

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, []);

  const shippingCost = shippingMethod === "express" ? 199 : 99;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;

    if (subtotal < appliedCoupon.minimumOrder) {
      return 0;
    }

    if (appliedCoupon.type === "percentage") {
      return Math.round(
        (subtotal * appliedCoupon.value) / 100
      );
    }

    return Math.min(appliedCoupon.value, subtotal);
  }, [appliedCoupon, subtotal]);

  const total = subtotal + shippingCost - discount;

  const handleApplyCoupon = () => {
    setCouponError("");

    const enteredCode = couponCode.trim().toUpperCase();

    if (!enteredCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const coupon = availableCoupons.find(
      (item) => item.code === enteredCode
    );

    if (!coupon) {
      setCouponError("Invalid coupon code.");
      return;
    }

    if (subtotal < coupon.minimumOrder) {
      setCouponError(
        `Minimum order value is ₹${coupon.minimumOrder.toLocaleString(
          "en-IN"
        )}.`
      );
      return;
    }

    setAppliedCoupon(coupon);
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handlePlaceOrder = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-16">
          <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check
                size={30}
                className="text-green-600"
              />
            </div>

            <h1 className="mt-6 text-3xl font-semibold text-gray-900">
              Order Placed Successfully
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Thank you for shopping with Mulberries. Your
              order has been received successfully.
            </p>

            <div className="mt-8 rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Order Total
              </p>

              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ₹{total.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/account/orders"
                className="rounded-full bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                View Orders
              </Link>

              <Link
                href="/products"
                className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ChevronLeft size={16} />
            Back to Cart
          </Link>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Complete your order securely.
          </p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-8 lg:grid-cols-[1.5fr_1fr]"
        >
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Contact Information */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <CreditCard size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Contact Information
                  </h2>

                  <p className="text-xs text-gray-500">
                    We'll use this to contact you about your
                    order.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                />

                <input
                  type="text"
                  required
                  placeholder="Last name"
                  className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                />

                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900 sm:col-span-2"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone number"
                  className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900 sm:col-span-2"
                />
              </div>
            </section>

            {/* Shipping Address */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <MapPin size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Shipping Address
                  </h2>

                  <p className="text-xs text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Address"
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                  />

                  <input
                    type="text"
                    required
                    placeholder="State"
                    className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Truck size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Shipping Method
                  </h2>

                  <p className="text-xs text-gray-500">
                    Select your preferred delivery option.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-gray-400">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={
                        shippingMethod === "standard"
                      }
                      onChange={(e) =>
                        setShippingMethod(e.target.value)
                      }
                    />

                    <div>
                      <p className="text-sm font-medium">
                        Standard Delivery
                      </p>

                      <p className="text-xs text-gray-500">
                        5–7 business days
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-medium">
                    ₹99
                  </span>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-gray-400">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={
                        shippingMethod === "express"
                      }
                      onChange={(e) =>
                        setShippingMethod(e.target.value)
                      }
                    />

                    <div>
                      <p className="text-sm font-medium">
                        Express Delivery
                      </p>

                      <p className="text-xs text-gray-500">
                        2–3 business days
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-medium">
                    ₹199
                  </span>
                </label>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <CreditCard size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Payment Method
                  </h2>

                  <p className="text-xs text-gray-500">
                    Choose how you want to pay.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-gray-400">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Cash on Delivery
                    </p>

                    <p className="text-xs text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-gray-400">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Online Payment
                    </p>

                    <p className="text-xs text-gray-500">
                      Pay securely online.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              {/* Products */}
              <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-medium">
                        ₹
                        {(
                          item.price * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mt-8 border-t pt-6">
                <div className="flex items-center gap-2">
                  <Tag size={17} />

                  <h3 className="text-sm font-semibold text-gray-900">
                    Have a coupon?
                  </h3>
                </div>

                {!appliedCoupon ? (
                  <>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(
                            e.target.value.toUpperCase()
                          );
                          setCouponError("");
                        }}
                        placeholder="Enter coupon code"
                        className="h-11 min-w-0 flex-1 rounded-xl border border-gray-300 px-4 text-sm uppercase outline-none focus:border-gray-900"
                      />

                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="rounded-xl bg-gray-950 px-5 text-sm font-medium text-white transition hover:bg-gray-800"
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <p className="mt-2 text-xs text-red-600">
                        {couponError}
                      </p>
                    )}

                    {/* Available Coupons */}
                    <div className="mt-4 rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-700">
                        Available coupons
                      </p>

                      <div className="mt-3 space-y-2">
                        {availableCoupons.map(
                          (coupon) => (
                            <button
                              key={coupon.code}
                              type="button"
                              onClick={() => {
                                setCouponCode(
                                  coupon.code
                                );
                                setCouponError("");
                              }}
                              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left transition hover:border-gray-400"
                            >
                              <div>
                                <p className="text-xs font-semibold">
                                  {coupon.code}
                                </p>

                                <p className="mt-1 text-[11px] text-gray-500">
                                  {coupon.type ===
                                  "percentage"
                                    ? `${coupon.value}% off`
                                    : `₹${coupon.value} off`}{" "}
                                  • Min ₹
                                  {coupon.minimumOrder.toLocaleString(
                                    "en-IN"
                                  )}
                                </p>
                              </div>

                              <span className="text-xs font-medium text-gray-500">
                                Use
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Check
                          size={16}
                          className="text-green-600"
                        />

                        <p className="text-sm font-semibold text-green-700">
                          {appliedCoupon.code}
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-green-600">
                        Coupon applied successfully
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="rounded-lg p-2 text-green-700 transition hover:bg-green-100"
                      aria-label="Remove coupon"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>

                  <span>
                    ₹{shippingCost.toLocaleString("en-IN")}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="mt-3 flex justify-between text-sm text-green-600">
                    <span>Coupon Discount</span>

                    <span>
                      -₹{discount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="mt-5 border-t pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-semibold text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order */}
              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <Package size={18} />
                Place Order
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                By placing your order, you agree to our
                terms and conditions.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}