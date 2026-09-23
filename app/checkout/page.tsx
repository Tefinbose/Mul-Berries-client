"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  getAddressesApi,
  type Address,
} from "@/services/addressApi";

import {
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
} from "@/services/paymentApi";

import { API_URL } from "@/services/api";

interface CartItem {
  _id?: string;

  product:
    | string
    | {
        _id: string;
        name?: string;
        images?: string[];
        price?: number;
      };

  name?: string;

  image?: string;

  quantity: number;

  price: number;

  variantId?: string;

  color?: string;

  size?: string;
}

interface CartResponse {
  success: boolean;

  cart?: {
    items: CartItem[];
  };

  items?: CartItem[];
}

type PaymentMethod =
  | "cod"
  | "razorpay";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CheckoutPage() {
  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState("");

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [addressForm, setAddressForm] =
    useState({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      type: "home" as
        | "home"
        | "work"
        | "other",
    });

  /*
   * --------------------------------------------------------
   * LOAD CHECKOUT DATA
   * --------------------------------------------------------
   */

  useEffect(() => {
    const loadCheckout = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          window.location.href =
            "/auth/login?redirect=/checkout";
          return;
        }

        const [
          addressResponse,
          cartResponse,
        ] = await Promise.all([
          getAddressesApi(token),

          fetch(
            `${API_URL}/cart`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              cache: "no-store",
            }
          ).then(async (response) => {
            const data =
              await response.json();

            if (!response.ok) {
              throw new Error(
                data?.message ||
                  "Failed to load cart"
              );
            }

            return data as CartResponse;
          }),
        ]);

        const loadedAddresses =
          addressResponse.addresses || [];

        const loadedCartItems =
          cartResponse.cart?.items ||
          cartResponse.items ||
          [];

        setAddresses(
          loadedAddresses
        );

        setCartItems(
          loadedCartItems
        );

        const defaultAddress =
          loadedAddresses.find(
            (address) =>
              address.isDefault
          );

        if (defaultAddress) {
          setSelectedAddressId(
            defaultAddress._id
          );
        } else if (
          loadedAddresses.length > 0
        ) {
          setSelectedAddressId(
            loadedAddresses[0]._id
          );
        }
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load checkout"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, []);

  /*
   * --------------------------------------------------------
   * TOTALS
   * --------------------------------------------------------
   */

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const shippingCharge =
    subtotal >= 5000 ? 0 : 100;

  const discount = 0;

  const totalAmount =
    subtotal +
    shippingCharge -
    discount;

  /*
   * --------------------------------------------------------
   * ADDRESS FORM
   * --------------------------------------------------------
   */

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = e.target;

    setAddressForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateAddress = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        window.location.href =
          "/auth/login?redirect=/checkout";
        return;
      }

      if (
        !addressForm.name ||
        !addressForm.phone ||
        !addressForm.addressLine1 ||
        !addressForm.city ||
        !addressForm.state ||
        !addressForm.pincode
      ) {
        setError(
          "Please fill all required address fields."
        );
        return;
      }

      if (
        !/^\d{6}$/.test(
          addressForm.pincode
        )
      ) {
        setError(
          "Please enter a valid 6-digit pincode."
        );
        return;
      }

      setPlacingOrder(true);

      const response =
        await fetch(
          `${API_URL}/addresses`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...addressForm,
              country: "India",
              isDefault:
                addresses.length === 0,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to create address"
        );
      }

      const newAddress =
        data.address as Address;

      setAddresses((previous) => [
        newAddress,
        ...previous,
      ]);

      setSelectedAddressId(
        newAddress._id
      );

      setShowAddressForm(false);

      setAddressForm({
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        type: "home",
      });

      setSuccess(
        "Address added successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create address"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  /*
   * --------------------------------------------------------
   * CREATE ORDER
   * --------------------------------------------------------
   */

  const createOrder = async (
    token: string
  ) => {
    const response =
      await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            addressId:
              selectedAddressId,

            paymentMethod,

            notes: "",
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to create order"
      );
    }

    if (!data.success) {
      throw new Error(
        data?.message ||
          "Failed to create order"
      );
    }

    return data;
  };

  /*
   * --------------------------------------------------------
   * RAZORPAY PAYMENT
   * --------------------------------------------------------
   */

  const startRazorpayPayment = async ({
    orderId,
    token,
  }: {
    orderId: string;
    token: string;
  }) => {
    const razorpayData =
      await createRazorpayOrderApi(
        orderId,
        token
      );

    if (
      !razorpayData.success
    ) {
      throw new Error(
        razorpayData.message ||
          "Unable to create Razorpay order"
      );
    }

    if (!window.Razorpay) {
      throw new Error(
        "Razorpay Checkout SDK is not loaded. Please refresh the page."
      );
    }

    const selectedAddress =
      addresses.find(
        (address) =>
          address._id ===
          selectedAddressId
      );

    const razorpay =
      new window.Razorpay({
        key:
          razorpayData.keyId,

        amount:
          razorpayData.payment.amount,

        currency:
          razorpayData.payment.currency,

        name: "Mulberries",

        description:
          `Mulberries Order #${orderId}`,

        order_id:
          razorpayData.payment
            .razorpayOrderId,

        prefill: {
          name:
            selectedAddress?.name ||
            "",

          contact:
            selectedAddress?.phone ||
            "",
        },

        notes: {
          orderId,
        },

        theme: {
          color: "#d63372",
        },

        handler: async (
          response
        ) => {
          try {
            setPlacingOrder(true);
            setError("");

            const verification =
              await verifyRazorpayPaymentApi(
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }
              );

            if (
              !verification.success
            ) {
              throw new Error(
                verification.message ||
                  "Payment verification failed"
              );
            }

            window.location.href =
              `/order-success?orderId=${orderId}`;
          } catch (err) {
            setPlacingOrder(false);

            setError(
              err instanceof Error
                ? err.message
                : "Payment verification failed"
            );
          }
        },

        modal: {
          ondismiss: () => {
            setPlacingOrder(false);
          },
        },
      });

    razorpay.open();
  };

  /*
   * --------------------------------------------------------
   * PLACE ORDER
   * --------------------------------------------------------
   */

  const handlePlaceOrder = async () => {
    try {
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        window.location.href =
          "/auth/login?redirect=/checkout";
        return;
      }

      if (!selectedAddressId) {
        setError(
          "Please select a delivery address."
        );
        return;
      }

      if (cartItems.length === 0) {
        setError(
          "Your cart is empty."
        );
        return;
      }

      setPlacingOrder(true);

      const orderData =
        await createOrder(token);

      const orderId =
        orderData?.order?._id ||
        orderData?.order?.id;

      if (!orderId) {
        throw new Error(
          "Order ID was not returned by the server."
        );
      }

      /*
       * COD
       */

      if (
        paymentMethod === "cod"
      ) {
        window.location.href =
          `/order-success?orderId=${orderId}`;

        return;
      }

      /*
       * RAZORPAY
       */

      await startRazorpayPayment({
        orderId,
        token,
      });
    } catch (err) {
      console.error(err);

      setPlacingOrder(false);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to place order"
      );
    }
  };

  /*
   * --------------------------------------------------------
   * LOADING
   * --------------------------------------------------------
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-gray-200" />

            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="h-[500px] rounded-2xl bg-white" />
              <div className="h-[400px] rounded-2xl bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * --------------------------------------------------------
   * EMPTY CART
   * --------------------------------------------------------
   */

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <Package
              size={42}
              className="mx-auto text-gray-400"
            />

            <h1 className="mt-5 text-2xl font-semibold">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Add some products before
              continuing to checkout.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * --------------------------------------------------------
   * CHECKOUT
   * --------------------------------------------------------
   */

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* HEADER */}

          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </Link>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900">
              Checkout
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Complete your order securely.
            </p>
          </div>

          {/* ERRORS */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            {/* LEFT */}

            <div className="space-y-6">
              {/* ADDRESS */}

              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Delivery Address
                      </h2>

                      <p className="text-xs text-gray-500">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowAddressForm(
                        (current) =>
                          !current
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50"
                  >
                    <Plus size={14} />
                    Add Address
                  </button>
                </div>

                {/* ADDRESS FORM */}

                {showAddressForm && (
                  <form
                    onSubmit={
                      handleCreateAddress
                    }
                    className="mt-6 grid gap-4 border-t border-gray-100 pt-6"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        name="name"
                        value={
                          addressForm.name
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="Full name"
                        className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                        required
                      />

                      <input
                        name="phone"
                        value={
                          addressForm.phone
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="Phone number"
                        className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                        required
                      />
                    </div>

                    <input
                      name="addressLine1"
                      value={
                        addressForm.addressLine1
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Address line 1"
                      className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                      required
                    />

                    <input
                      name="addressLine2"
                      value={
                        addressForm.addressLine2
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Address line 2 (optional)"
                      className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                    />

                    <input
                      name="landmark"
                      value={
                        addressForm.landmark
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Landmark (optional)"
                      className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                    />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <input
                        name="city"
                        value={
                          addressForm.city
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="City"
                        className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                        required
                      />

                      <input
                        name="state"
                        value={
                          addressForm.state
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="State"
                        className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                        required
                      />

                      <input
                        name="pincode"
                        value={
                          addressForm.pincode
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="Pincode"
                        inputMode="numeric"
                        maxLength={6}
                        className="h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-gray-900"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setShowAddressForm(
                            false
                          )
                        }
                        className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={
                          placingOrder
                        }
                        className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {/* ADDRESS LIST */}

                <div className="mt-6 space-y-3">
                  {addresses.length ===
                  0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                      <MapPin
                        size={28}
                        className="mx-auto text-gray-400"
                      />

                      <p className="mt-3 text-sm text-gray-600">
                        No saved addresses.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setShowAddressForm(
                            true
                          )
                        }
                        className="mt-3 text-sm font-medium text-[#d63372]"
                      >
                        Add your first address
                      </button>
                    </div>
                  ) : (
                    addresses.map(
                      (address) => (
                        <label
                          key={
                            address._id
                          }
                          className={`block cursor-pointer rounded-xl border p-4 transition ${
                            selectedAddressId ===
                            address._id
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={
                                selectedAddressId ===
                                address._id
                              }
                              onChange={() =>
                                setSelectedAddressId(
                                  address._id
                                )
                              }
                              className="mt-1"
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-gray-900">
                                  {
                                    address.name
                                  }
                                </p>

                                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium uppercase text-gray-600">
                                  {
                                    address.type
                                  }
                                </span>

                                {address.isDefault && (
                                  <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700">
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 text-sm text-gray-600">
                                {
                                  address.phone
                                }
                              </p>

                              <p className="mt-1 text-sm leading-6 text-gray-600">
                                {
                                  address.addressLine1
                                }

                                {address.addressLine2 &&
                                  `, ${address.addressLine2}`}

                                {address.landmark &&
                                  `, ${address.landmark}`}

                                {`, ${address.city}, ${address.state} - ${address.pincode}`}
                              </p>
                            </div>
                          </div>
                        </label>
                      )
                    )
                  )}
                </div>
              </section>

              {/* PAYMENT */}

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
                  {/* COD */}

                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${
                      paymentMethod ===
                      "cod"
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={
                        paymentMethod ===
                        "cod"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "cod"
                        )
                      }
                    />

                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Pay when your order arrives.
                      </p>
                    </div>

                    <Truck
                      size={20}
                      className="text-gray-500"
                    />
                  </label>

                  {/* RAZORPAY */}

                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${
                      paymentMethod ===
                      "razorpay"
                        ? "border-[#d63372] bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={
                        paymentMethod ===
                        "razorpay"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "razorpay"
                        )
                      }
                    />

                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Pay Online
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Secure payment using Razorpay.
                      </p>
                    </div>

                    <CreditCard
                      size={20}
                      className="text-[#d63372]"
                    />
                  </label>
                </div>
              </section>

              {/* SECURITY */}

              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={20}
                    className="text-green-600"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Your payment and personal information are protected.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT */}

            <aside className="h-fit lg:sticky lg:top-6">
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  {cartItems.map(
                    (item, index) => {
                      const product =
                        typeof item.product ===
                        "object"
                          ? item.product
                          : null;

                      const name =
                        item.name ||
                        product?.name ||
                        "Product";

                      const image =
                        item.image ||
                        product?.images?.[0];

                      return (
                        <div
                          key={
                            item._id ||
                            `${item.product}-${index}`
                          }
                          className="flex gap-3"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {image ? (
                              <img
                                src={image}
                                alt={name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package
                                  size={20}
                                  className="text-gray-400"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {name}
                            </p>

                            {item.size && (
                              <p className="mt-1 text-xs text-gray-500">
                                Size:{" "}
                                {item.size}
                              </p>
                            )}

                            <p className="mt-1 text-xs text-gray-500">
                              Qty:{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(
                              Number(
                                item.price
                              ) *
                                Number(
                                  item.quantity
                                )
                            )}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="my-6 border-t border-gray-100" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-900">
                      {formatPrice(
                        subtotal
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Delivery
                    </span>

                    <span className="font-medium text-gray-900">
                      {shippingCharge ===
                      0
                        ? "FREE"
                        : formatPrice(
                            shippingCharge
                          )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Discount
                      </span>

                      <span className="font-medium text-green-600">
                        -
                        {formatPrice(
                          discount
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {subtotal <
                  5000 && (
                  <div className="mt-5 rounded-xl bg-pink-50 p-4">
                    <p className="text-xs font-medium text-[#d63372]">
                      Add{" "}
                      {formatPrice(
                        5000 -
                          subtotal
                      )}{" "}
                      more for free delivery.
                    </p>
                  </div>
                )}

                <div className="my-6 border-t border-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-semibold text-gray-900">
                    {formatPrice(
                      totalAmount
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={
                    handlePlaceOrder
                  }
                  disabled={
                    placingOrder ||
                    !selectedAddressId ||
                    cartItems.length ===
                      0
                  }
                  className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#d63372] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#b92b62] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {placingOrder ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMethod ===
                      "razorpay"
                        ? "Pay Securely"
                        : "Place Order"}

                      <ChevronRight
                        size={17}
                      />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Check size={14} />

                  Secure checkout
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}