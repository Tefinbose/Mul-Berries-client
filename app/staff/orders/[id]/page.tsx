"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    CreditCard,
    RefreshCw,
    CheckCircle2,
    Clock,
    Truck,
    XCircle,
    RotateCcw,
    Save,
} from "lucide-react";

import { API_URL } from "@/services/api";

type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned";

type PaymentStatus =
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

interface OrderUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
}

interface OrderCustomer {
    name: string;
    email: string;
    phone: string;
}

interface OrderItem {
    product: string | { _id: string };
    name: string;
    image?: string;
    quantity: number;
    price: number;
    total?: number;
    variantId?: string;
    color?: string;
    size?: string;
}

interface ShippingAddress {
    name?: string;
    fullName?: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    landmark?: string;
}

interface StaffOrder {
    _id: string;
    user: OrderUser | null;
    customer: OrderCustomer;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    subtotal: number;
    shippingCharge?: number;
    shippingFee?: number;
    discount: number;
    totalAmount: number;
    paymentMethod: "cod" | "razorpay";
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface OrderResponse {
    success: boolean;
    order: StaffOrder;
    message?: string;
}

const statusOptions: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

function formatOrderId(id: string) {
    return `#${id.slice(-8).toUpperCase()}`;
}

function getStatusLabel(status: OrderStatus) {
    return status
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
}

function getStatusClasses(status: OrderStatus) {
    switch (status) {
        case "pending":
            return "bg-amber-50 text-amber-700 border-amber-200";

        case "confirmed":
            return "bg-blue-50 text-blue-700 border-blue-200";

        case "processing":
            return "bg-violet-50 text-violet-700 border-violet-200";

        case "shipped":
            return "bg-indigo-50 text-indigo-700 border-indigo-200";

        case "out_for_delivery":
            return "bg-orange-50 text-orange-700 border-orange-200";

        case "delivered":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";

        case "cancelled":
            return "bg-red-50 text-red-700 border-red-200";

        case "returned":
            return "bg-gray-100 text-gray-700 border-gray-200";

        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
}

function getPaymentClasses(status: PaymentStatus) {
    switch (status) {
        case "paid":
            return "bg-emerald-50 text-emerald-700";

        case "pending":
            return "bg-amber-50 text-amber-700";

        case "failed":
            return "bg-red-50 text-red-700";

        case "refunded":
            return "bg-blue-50 text-blue-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
}

function getStatusIcon(status: OrderStatus) {
    switch (status) {
        case "pending":
            return Clock;

        case "confirmed":
            return CheckCircle2;

        case "processing":
            return Package;

        case "shipped":
            return Truck;

        case "out_for_delivery":
            return Truck;

        case "delivered":
            return CheckCircle2;

        case "cancelled":
            return XCircle;

        case "returned":
            return RotateCcw;

        default:
            return Clock;
    }
}

export default function StaffOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const orderId = params.id as string;

    const [order, setOrder] =
        useState<StaffOrder | null>(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] = useState("");

    const [selectedStatus, setSelectedStatus] =
        useState<OrderStatus | "">("");

    const [updatingStatus, setUpdatingStatus] =
        useState(false);

    const [statusSuccess, setStatusSuccess] =
        useState("");

    const loadOrder = useCallback(
        async (showRefreshLoader = false) => {
            try {
                if (showRefreshLoader) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");
                setStatusSuccess("");

                const token = localStorage.getItem("token");

                if (!token) {
                    router.push("/staff/login");
                    return;
                }

                const response = await fetch(
                    `${API_URL}/staff/orders/${orderId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        cache: "no-store",
                    }
                );

                const data: OrderResponse =
                    await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                        "Failed to load order"
                    );
                }

                setOrder(data.order);

                setSelectedStatus(
                    data.order.orderStatus
                );
            } catch (error) {
                console.error(
                    "STAFF ORDER DETAILS ERROR:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load order"
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [orderId, router]
    );

    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    const updateStatus = async () => {
        if (!order || !selectedStatus) {
            return;
        }

        if (selectedStatus === order.orderStatus) {
            return;
        }

        try {
            setUpdatingStatus(true);
            setError("");
            setStatusSuccess("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/staff/login");
                return;
            }

            const response = await fetch(
                `${API_URL}/staff/orders/${order._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orderStatus: selectedStatus,
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

                setSelectedStatus(
                    data.order.orderStatus
                );
            } else {
                setOrder((previous) =>
                    previous
                        ? {
                            ...previous,
                            orderStatus: selectedStatus,
                        }
                        : previous
                );
            }

            setStatusSuccess(
                "Order status updated successfully."
            );
        } catch (error) {
            console.error(
                "UPDATE ORDER STATUS ERROR:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update order status"
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl animate-pulse space-y-6">
                    <div className="h-8 w-48 rounded-lg bg-gray-200" />

                    <div className="h-32 rounded-2xl bg-gray-200" />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="h-[500px] rounded-2xl bg-gray-200 lg:col-span-2" />
                        <div className="h-[500px] rounded-2xl bg-gray-200" />
                    </div>
                </div>
            </main>
        );
    }

    if (error && !order) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] p-6">
                <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <XCircle className="mx-auto h-12 w-12 text-red-500" />

                    <h1 className="mt-4 text-xl font-semibold text-gray-900">
                        Unable to load order
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => loadOrder()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    if (!order) {
        return null;
    }

    const StatusIcon = getStatusIcon(
        order.orderStatus
    );

    const shipping =
        order.shippingCharge ??
        order.shippingFee ??
        0;

    const customerName =
        order.customer?.name ||
        order.user?.name ||
        "Guest Customer";

    const customerEmail =
        order.customer?.email ||
        order.user?.email ||
        "—";

    const customerPhone =
        order.customer?.phone ||
        order.user?.phone ||
        "—";

    const addressName =
        order.shippingAddress?.name ||
        order.shippingAddress?.fullName ||
        customerName;

    return (
        <main className="min-h-screen bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={() =>
                                router.push("/staff/orders")
                            }
                            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Orders
                        </button>

                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                                Order {formatOrderId(order._id)}
                            </h1>

                            <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                                    order.orderStatus
                                )}`}
                            >
                                <StatusIcon className="h-3.5 w-3.5" />
                                {getStatusLabel(
                                    order.orderStatus
                                )}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadOrder(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${refreshing
                                    ? "animate-spin"
                                    : ""
                                }`}
                        />
                        Refresh
                    </button>
                </div>

                {/* Errors / success */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {statusSuccess && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {statusSuccess}
                    </div>
                )}

                {/* Main grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Customer */}
                        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-gray-100 p-2.5">
                                        <User className="h-5 w-5 text-gray-600" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-gray-900">
                                            Customer
                                        </h2>

                                        <p className="text-xs text-gray-500">
                                            Customer information
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Name
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {customerName}
                                    </p>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">
                                        Email
                                    </p>

                                    <p className="mt-1 truncate text-sm font-medium text-gray-900">
                                        {customerEmail}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {customerPhone}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Items */}
                        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-gray-100 p-2.5">
                                        <Package className="h-5 w-5 text-gray-600" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-gray-900">
                                            Order Items
                                        </h2>

                                        <p className="text-xs text-gray-500">
                                            {order.items.length}{" "}
                                            {order.items.length === 1
                                                ? "item"
                                                : "items"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {order.items.map(
                                    (item, index) => (
                                        <div
                                            key={`${String(
                                                item.product
                                            )}-${index}`}
                                            className="flex gap-4 p-5"
                                        >
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-gray-900">
                                                    {item.name}
                                                </h3>

                                                {item.color && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Color: {item.color}
                                                    </p>
                                                )}

                                                {item.size && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Size: {item.size}
                                                    </p>
                                                )}

                                                {item.variantId && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Variant: {item.variantId}
                                                    </p>
                                                )}

                                                <p className="mt-2 text-sm text-gray-500">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {formatCurrency(
                                                        item.price *
                                                        item.quantity
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {formatCurrency(
                                                        item.price
                                                    )}{" "}
                                                    each
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>

                        {/* Shipping Address */}
                        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-gray-100 p-2.5">
                                        <MapPin className="h-5 w-5 text-gray-600" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-gray-900">
                                            Shipping Address
                                        </h2>

                                        <p className="text-xs text-gray-500">
                                            Delivery information
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 text-sm leading-6 text-gray-600">
                                <p className="font-medium text-gray-900">
                                    {addressName}
                                </p>

                                <p>
                                    {order.shippingAddress.addressLine1}
                                </p>

                                {order.shippingAddress.addressLine2 && (
                                    <p>
                                        {
                                            order.shippingAddress
                                                .addressLine2
                                        }
                                    </p>
                                )}

                                {order.shippingAddress.landmark && (
                                    <p>
                                        Landmark:{" "}
                                        {
                                            order.shippingAddress
                                                .landmark
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
                            </div>
                        </section>
                    </div>

                    {/* Right */}
                    <div className="space-y-6">
                        {/* Update status */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h2 className="font-semibold text-gray-900">
                                Update Order Status
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Change the current order status.
                            </p>

                            <div className="mt-4">
                                <select
                                    value={selectedStatus}
                                    onChange={(event) =>
                                        setSelectedStatus(
                                            event.target
                                                .value as OrderStatus
                                        )
                                    }
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:border-gray-400 focus:bg-white"
                                >
                                    {statusOptions.map(
                                        (status) => (
                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {getStatusLabel(status)}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={updateStatus}
                                disabled={
                                    updatingStatus ||
                                    !selectedStatus ||
                                    selectedStatus ===
                                    order.orderStatus
                                }
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {updatingStatus ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Update Status
                                    </>
                                )}
                            </button>
                        </section>

                        {/* Summary */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-gray-100 p-2.5">
                                    <CreditCard className="h-5 w-5 text-gray-600" />
                                </div>

                                <h2 className="font-semibold text-gray-900">
                                    Order Summary
                                </h2>
                            </div>

                            <div className="mt-5 space-y-4 text-sm">
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
                                        {shipping === 0
                                            ? "FREE"
                                            : formatCurrency(
                                                shipping
                                            )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Discount</span>

                                    <span>
                                        -{" "}
                                        {formatCurrency(
                                            order.discount || 0
                                        )}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-gray-900">
                                            Total
                                        </span>

                                        <span className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(
                                                order.totalAmount
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h2 className="font-semibold text-gray-900">
                                Payment
                            </h2>

                            <div className="mt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Method
                                    </span>

                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase text-gray-700">
                                        {order.paymentMethod}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Status
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPaymentClasses(
                                            order.paymentStatus
                                        )}`}
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </div>

                                {order.razorpayOrderId && (
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Razorpay Order ID
                                        </p>

                                        <p className="mt-1 break-all text-xs text-gray-700">
                                            {order.razorpayOrderId}
                                        </p>
                                    </div>
                                )}

                                {order.razorpayPaymentId && (
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Razorpay Payment ID
                                        </p>

                                        <p className="mt-1 break-all text-xs text-gray-700">
                                            {order.razorpayPaymentId}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Notes */}
                        {order.notes && (
                            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <h2 className="font-semibold text-gray-900">
                                    Order Notes
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                    {order.notes}
                                </p>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}