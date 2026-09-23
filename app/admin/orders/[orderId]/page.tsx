"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

import { API_URL } from "@/services/api";

/* =========================================================
   TYPES
========================================================= */

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

type OrderItem = {
  _id?: string;
  product?: {
    _id?: string;
    name?: string;
    slug?: string;
    images?: string[];
    image?: string;
  } | null;
  productId?: string;
  productName?: string;
  name?: string;
  image?: string;
  quantity: number;
  price: number;
  total?: number;
  size?: string;
  color?: string;
  variant?: {
    name?: string;
    sku?: string;
    attributes?: Record<string, string>;
  };
};

type Customer = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

type Address = {
  name?: string;
  phone?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  postalCode?: string;
  country?: string;
};

type Payment = {
  method?: string;
  status?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  transactionId?: string;
};

type Order = {
  _id: string;

  orderNumber?: string;

  user?: Customer | string | null;

  customer?: Customer | null;

  items: OrderItem[];

  totalAmount?: number;
  subtotal?: number;
  shippingAmount?: number;
  shipping?: number;
  discount?: number;
  discountAmount?: number;
  tax?: number;

  paymentStatus?: PaymentStatus | string;
  paymentMethod?: string;

  payment?: Payment;

  orderStatus?: OrderStatus | string;
  status?: OrderStatus | string;

  shippingAddress?: Address;
  address?: Address;

  createdAt: string;
  updatedAt?: string;

  shipment?: {
    _id?: string;
    awbNumber?: string;
    trackingNumber?: string;
    courierName?: string;
    shipmentStatus?: string;
  } | null;
};

type OrderResponse = {
  success: boolean;
  order: Order;
  message?: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const orderStatusSteps: {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    status: "pending",
    label: "Order Placed",
    description: "Customer placed the order",
    icon: Clock3,
  },
  {
    status: "confirmed",
    label: "Order Confirmed",
    description: "Order has been confirmed",
    icon: CheckCircle2,
  },
  {
    status: "processing",
    label: "Processing",
    description: "Order is being prepared",
    icon: Package,
  },
  {
    status: "shipped",
    label: "Shipped",
    description: "Order handed over to courier",
    icon: Truck,
  },
  {
    status: "out_for_delivery",
    label: "Out for Delivery",
    description: "Courier is delivering the order",
    icon: Truck,
  },
  {
    status: "delivered",
    label: "Delivered",
    description: "Order delivered to customer",
    icon: CheckCircle2,
  },
];

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

/* =========================================================
   HELPERS
========================================================= */

function getToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

function formatPrice(value?: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeOrderStatus(
  status?: string
): OrderStatus {
  const value = String(status || "").toLowerCase();

  switch (value) {
    case "pending":
      return "pending";

    case "confirmed":
      return "confirmed";

    case "processing":
      return "processing";

    case "shipped":
      return "shipped";

    case "out_for_delivery":
      return "out_for_delivery";

    case "delivered":
      return "delivered";

    case "cancelled":
    case "canceled":
      return "cancelled";

    default:
      return "pending";
  }
}

function normalizePaymentStatus(
  status?: string
): PaymentStatus {
  const value = String(status || "").toLowerCase();

  switch (value) {
    case "paid":
      return "paid";

    case "failed":
      return "failed";

    case "refunded":
      return "refunded";

    case "pending":
    default:
      return "pending";
  }
}

function getOrderStatusLabel(status: OrderStatus) {
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

    default:
      return status;
  }
}

function getPaymentStatusLabel(
  status: PaymentStatus
) {
  switch (status) {
    case "paid":
      return "Paid";

    case "failed":
      return "Failed";

    case "refunded":
      return "Refunded";

    case "pending":
    default:
      return "Pending";
  }
}

function getOrderStatusClasses(
  status: OrderStatus
) {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "confirmed":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "processing":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "shipped":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "out_for_delivery":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "delivered":
      return "bg-green-50 text-green-700 border-green-200";

    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-neutral-50 text-neutral-600 border-neutral-200";
  }
}

function getPaymentStatusClasses(
  status: PaymentStatus
) {
  switch (status) {
    case "paid":
      return "bg-green-50 text-green-700 border-green-200";

    case "failed":
      return "bg-red-50 text-red-700 border-red-200";

    case "refunded":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "pending":
    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
}

function getStatusIndex(status: OrderStatus) {
  return statusOrder.indexOf(status);
}

function getCustomer(order: Order): Customer {
  if (order.customer) {
    return order.customer;
  }

  if (
    order.user &&
    typeof order.user === "object"
  ) {
    return order.user;
  }

  return {};
}

function getAddress(order: Order): Address {
  return order.shippingAddress || order.address || {};
}

function getItemName(item: OrderItem) {
  return (
    item.product?.name ||
    item.productName ||
    item.name ||
    "Product"
  );
}

function getItemImage(item: OrderItem) {
  return (
    item.image ||
    item.product?.image ||
    item.product?.images?.[0] ||
    ""
  );
}

function getItemTotal(item: OrderItem) {
  if (typeof item.total === "number") {
    return item.total;
  }

  return Number(item.price || 0) * Number(item.quantity || 0);
}

/* =========================================================
   BADGES
========================================================= */

function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getOrderStatusClasses(
        status
      )}`}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}

function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getPaymentStatusClasses(
        status
      )}`}
    >
      {getPaymentStatusLabel(status)}
    </span>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;

  const [order, setOrder] = useState<Order | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [cancelling, setCancelling] =
    useState(false);

  const [showStatusMenu, setShowStatusMenu] =
    useState(false);

  /* =====================================================
     FETCH ORDER
  ===================================================== */

  const fetchOrder = useCallback(
    async (showRefreshLoader = false) => {
      if (!orderId) {
        return;
      }

      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token = getToken();

        if (!token) {
          setError(
            "Authentication required. Please login again."
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/orders/admin/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data =
          (await response.json()) as OrderResponse;

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch order"
          );
        }

        setOrder(data.order);
      } catch (err) {
        console.error(
          "FETCH ADMIN ORDER ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load order"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [orderId]
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  /* =====================================================
     DERIVED VALUES
  ===================================================== */

/* =====================================================
   DERIVED VALUES
===================================================== */

const currentOrderStatus = useMemo(() => {
  return normalizeOrderStatus(
    order?.orderStatus || order?.status
  );
}, [order]);

const currentPaymentStatus = useMemo(() => {
  return normalizePaymentStatus(
    order?.paymentStatus ||
      order?.payment?.status
  );
}, [order]);

const currentStatusIndex =
  getStatusIndex(currentOrderStatus);

const customer = order
  ? getCustomer(order)
  : {};

const address = order
  ? getAddress(order)
  : {};

const subtotal =
  order?.subtotal ??
  order?.items?.reduce(
    (sum, item) => sum + getItemTotal(item),
    0
  ) ??
  0;

const shipping =
  order?.shippingAmount ??
  order?.shipping ??
  0;

const discount =
  order?.discountAmount ??
  order?.discount ??
  0;

const total =
  order?.totalAmount ??
  subtotal + shipping - discount;

  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const handleStatusUpdate = async (
    newStatus: OrderStatus
  ) => {
    if (!order) {
      return;
    }

    if (newStatus === currentOrderStatus) {
      setShowStatusMenu(false);
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/orders/admin/${order._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            orderStatus: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update order status"
        );
      }

      if (data.order) {
        setOrder(data.order);
      } else {
        await fetchOrder(true);
      }

      setShowStatusMenu(false);
    } catch (err) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update order status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =====================================================
     CANCEL ORDER
  ===================================================== */

  const handleCancelOrder = async () => {
    if (!order) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/orders/admin/${order._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to cancel order"
        );
      }

      if (data.order) {
        setOrder(data.order);
      } else {
        await fetchOrder(true);
      }
    } catch (err) {
      console.error(
        "CANCEL ORDER ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-700" />

          <p className="text-sm text-neutral-500">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR / NOT FOUND
  ===================================================== */

  if (error && !order) {
    return (
      <div className="min-h-[70vh] bg-neutral-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-xl font-semibold text-neutral-900">
            Unable to load order
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            {error}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => fetchOrder()}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mx-auto mb-8 max-w-7xl">
        <Link
          href="/admin/orders"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                Order #
                {order.orderNumber ||
                  order._id.slice(-8).toUpperCase()}
              </h1>

              <OrderStatusBadge
                status={currentOrderStatus}
              />
            </div>

            <p className="mt-2 text-sm text-neutral-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Refresh */}

            <button
              type="button"
              onClick={() => fetchOrder(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            {/* Update Status */}

            {currentOrderStatus !==
              "cancelled" &&
              currentOrderStatus !==
                "delivered" && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowStatusMenu(
                        (value) => !value
                      )
                    }
                    disabled={updatingStatus}
                    className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingStatus ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}

                    Update Status

                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </button>

                  {showStatusMenu && (
                    <>
                      <button
                        type="button"
                        aria-label="Close status menu"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() =>
                          setShowStatusMenu(false)
                        }
                      />

                      <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl">
                        {statusOrder.map(
                          (status) => {
                            const isActive =
                              status ===
                              currentOrderStatus;

                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() =>
                                  handleStatusUpdate(
                                    status
                                  )
                                }
                                disabled={isActive}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                                  isActive
                                    ? "bg-neutral-100 font-medium text-neutral-400"
                                    : "text-neutral-700 hover:bg-neutral-50"
                                }`}
                              >
                                <span>
                                  {getOrderStatusLabel(
                                    status
                                  )}
                                </span>

                                {isActive && (
                                  <CheckCircle2 className="h-4 w-4" />
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

            {/* Cancel */}

            {currentOrderStatus !==
              "cancelled" &&
              currentOrderStatus !==
                "delivered" && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}

                  Cancel Order
                </button>
              )}
          </div>
        </div>

        {/* API error while order exists */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-medium text-red-800">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="space-y-6">
          {/* ORDER ITEMS */}

          <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 px-5 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-neutral-950">
                    Order Items
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    {order.items?.length || 0} product
                    {(order.items?.length || 0) !==
                    1
                      ? "s"
                      : ""}{" "}
                    in this order
                  </p>
                </div>

                <Package className="h-5 w-5 text-neutral-400" />
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {order.items?.map(
                (item, index) => {
                  const image =
                    getItemImage(item);

                  return (
                    <div
                      key={
                        item._id ||
                        `${item.productId}-${index}`
                      }
                      className="flex gap-4 p-5"
                    >
                      {/* Image */}

                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                        {image ? (
                          <img
                            src={image}
                            alt={getItemName(item)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-7 w-7 text-neutral-300" />
                          </div>
                        )}
                      </div>

                      {/* Details */}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-neutral-950">
                          {getItemName(item)}
                        </h3>

                        {item.variant?.sku && (
                          <p className="mt-1 text-xs text-neutral-400">
                            SKU:{" "}
                            {item.variant.sku}
                          </p>
                        )}

                        {item.color && (
                          <p className="mt-2 text-sm text-neutral-500">
                            Color: {item.color}
                          </p>
                        )}

                        {item.size && (
                          <p className="text-sm text-neutral-500">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="mt-2 text-sm text-neutral-600">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      {/* Price */}

                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-neutral-950">
                          {formatPrice(
                            getItemTotal(item)
                          )}
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          {formatPrice(item.price)}{" "}
                          each
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* PRICE SUMMARY */}

            <div className="border-t border-neutral-100 px-5 py-5">
              <div className="ml-auto max-w-sm space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-neutral-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500">
                    Shipping
                  </span>

                  <span className="font-medium text-neutral-900">
                    {shipping === 0
                      ? "Free"
                      : formatPrice(shipping)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-neutral-500">
                      Discount
                    </span>

                    <span className="font-medium text-green-600">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}

                {typeof order.tax ===
                  "number" &&
                  order.tax > 0 && (
                    <div className="flex justify-between gap-4">
                      <span className="text-neutral-500">
                        Tax
                      </span>

                      <span className="font-medium text-neutral-900">
                        {formatPrice(order.tax)}
                      </span>
                    </div>
                  )}

                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-neutral-950">
                      Total
                    </span>

                    <span className="text-lg font-semibold text-neutral-950">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ORDER STATUS */}

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h2 className="font-semibold text-neutral-950">
                  Order Status
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Current status
                </p>
              </div>

              <OrderStatusBadge
                status={currentOrderStatus}
              />
            </div>

            {currentOrderStatus ===
              "cancelled" ? (
              <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex gap-3">
                  <XCircle className="h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Order Cancelled
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      This order has been cancelled.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                {orderStatusSteps.map(
                  (step, index) => {
                    const Icon = step.icon;

                    const completed =
                      currentStatusIndex >=
                      index;

                    const isCurrent =
                      currentOrderStatus ===
                      step.status;

                    return (
                      <div
                        key={step.status}
                        className="relative flex gap-4"
                      >
                        {/* Connector */}

                        {index !==
                          orderStatusSteps.length -
                            1 && (
                          <div
                            className={`absolute left-[15px] top-8 h-full w-px ${
                              currentStatusIndex >
                              index
                                ? "bg-neutral-900"
                                : "bg-neutral-200"
                            }`}
                          />
                        )}

                        {/* Icon */}

                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                            completed
                              ? "border-neutral-950 bg-neutral-950 text-white"
                              : "border-neutral-200 bg-white text-neutral-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Text */}

                        <div className="pb-8">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`text-sm font-semibold ${
                                completed
                                  ? "text-neutral-950"
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
                  }
                )}
              </div>
            )}
          </section>

          {/* PAYMENT */}

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-neutral-600" />

              <div>
                <h2 className="font-semibold text-neutral-950">
                  Payment
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Payment information for this order
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Payment Status
                </p>

                <div className="mt-2">
                  {/* IMPORTANT:
                      PaymentStatusBadge receives PaymentStatus,
                      NOT OrderStatus.
                  */}

                  <PaymentStatusBadge
                    status={currentPaymentStatus}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Payment Method
                </p>

                <p className="mt-2 text-sm font-medium text-neutral-900">
                  {order.paymentMethod ||
                    order.payment?.method ||
                    "Not specified"}
                </p>
              </div>

              {(order.payment
                ?.razorpayOrderId ||
                order.payment
                  ?.razorpayPaymentId ||
                order.payment
                  ?.transactionId) && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Transaction
                  </p>

                  <div className="mt-2 space-y-1 text-sm text-neutral-600">
                    {order.payment
                      ?.razorpayOrderId && (
                      <p>
                        Razorpay Order:{" "}
                        {
                          order.payment
                            .razorpayOrderId
                        }
                      </p>
                    )}

                    {order.payment
                      ?.razorpayPaymentId && (
                      <p>
                        Razorpay Payment:{" "}
                        {
                          order.payment
                            .razorpayPaymentId
                        }
                      </p>
                    )}

                    {order.payment
                      ?.transactionId && (
                      <p>
                        Transaction ID:{" "}
                        {
                          order.payment
                            .transactionId
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <div className="space-y-6">
          {/* CUSTOMER */}

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-neutral-600" />

              <h2 className="font-semibold text-neutral-950">
                Customer
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-semibold text-neutral-950">
                  {customer.name ||
                    "Unknown Customer"}
                </p>
              </div>

              {customer.email && (
                <div className="flex items-start gap-3 text-sm text-neutral-500">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />

                  <span className="break-all">
                    {customer.email}
                  </span>
                </div>
              )}

              {customer.phone && (
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <Phone className="h-4 w-4 shrink-0" />

                  <span>{customer.phone}</span>
                </div>
              )}
            </div>
          </section>

          {/* SHIPPING ADDRESS */}

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-neutral-600" />

              <h2 className="font-semibold text-neutral-950">
                Shipping Address
              </h2>
            </div>

            <div className="mt-5 space-y-3 text-sm text-neutral-600">
              {address.name && (
                <p className="font-medium text-neutral-950">
                  {address.name}
                </p>
              )}

              {address.phone && (
                <p>{address.phone}</p>
              )}

              {(address.address ||
                address.addressLine1) && (
                <p className="leading-6">
                  {address.address ||
                    address.addressLine1}

                  {address.addressLine2 && (
                    <>
                      <br />
                      {address.addressLine2}
                    </>
                  )}
                </p>
              )}

              {(address.city ||
                address.state ||
                address.pincode ||
                address.postalCode) && (
                <p>
                  {[
                    address.city,
                    address.state,
                    address.pincode ||
                      address.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              {address.country && (
                <p>{address.country}</p>
              )}
            </div>
          </section>

          {/* SHIPMENT */}

          {order.shipment && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-neutral-600" />

                <h2 className="font-semibold text-neutral-950">
                  Shipment
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                {order.shipment
                  .courierName && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Courier
                    </p>

                    <p className="mt-1 text-sm font-medium text-neutral-900">
                      {
                        order.shipment
                          .courierName
                      }
                    </p>
                  </div>
                )}

                {order.shipment
                  .awbNumber && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      AWB
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-neutral-900">
                      {
                        order.shipment
                          .awbNumber
                      }
                    </p>
                  </div>
                )}

                {order.shipment
                  .trackingNumber && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Tracking Number
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-neutral-900">
                      {
                        order.shipment
                          .trackingNumber
                      }
                    </p>
                  </div>
                )}

                {order.shipment
                  .shipmentStatus && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Shipment Status
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-neutral-900">
                      {order.shipment.shipmentStatus.replace(
                        /_/g,
                        " "
                      )}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ORDER INFORMATION */}

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-neutral-950">
              Order Information
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-neutral-500">
                  Order ID
                </span>

                <span className="max-w-[190px] break-all text-right text-xs font-medium text-neutral-700">
                  {order._id}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-neutral-500">
                  Created
                </span>

                <span className="text-right text-sm font-medium text-neutral-700">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              {order.updatedAt && (
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-neutral-500">
                    Updated
                  </span>

                  <span className="text-right text-sm font-medium text-neutral-700">
                    {formatDate(order.updatedAt)}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4 border-t border-neutral-100 pt-4">
                <span className="text-sm font-medium text-neutral-700">
                  Order Status
                </span>

                <OrderStatusBadge
                  status={currentOrderStatus}
                />
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm font-medium text-neutral-700">
                  Payment
                </span>

                <PaymentStatusBadge
                  status={currentPaymentStatus}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}