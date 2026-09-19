"use client";

import { useEffect, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Package,
    RefreshCw,
    Truck,
    XCircle,
} from "lucide-react";

import {
    getStaffDashboardApi,
    getStaffProfileApi,
    type StaffDashboardResponse,
    type StaffUser,
} from "@/services/staffApi";

export default function StaffDashboardPage() {
    const [staff, setStaff] = useState<StaffUser | null>(null);

    const [dashboard, setDashboard] =
        useState<StaffDashboardResponse["dashboard"] | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const loadDashboard = async () => {
  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required");
      return;
    }

    // Load dashboard independently
    let profileResponse;
    let dashboardResponse;

    try {
      profileResponse = await getStaffProfileApi(token);

      console.log("STAFF PROFILE RESPONSE:", profileResponse);

      if (!profileResponse?.staff) {
        throw new Error("Staff profile data is missing");
      }

      setStaff(profileResponse.staff);
    } catch (profileError) {
      console.error("STAFF PROFILE ERROR:", profileError);

      throw new Error(
        profileError instanceof Error
          ? `Profile: ${profileError.message}`
          : "Failed to load staff profile"
      );
    }

    try {
      dashboardResponse = await getStaffDashboardApi(token);

      console.log("STAFF DASHBOARD RESPONSE:", dashboardResponse);

      if (!dashboardResponse?.dashboard) {
        throw new Error("Dashboard data is missing");
      }

      setDashboard(dashboardResponse.dashboard);
    } catch (dashboardError) {
      console.error("STAFF DASHBOARD API ERROR:", dashboardError);

      throw new Error(
        dashboardError instanceof Error
          ? `Dashboard: ${dashboardError.message}`
          : "Failed to load staff dashboard"
      );
    }
  } catch (error) {
    console.error("STAFF PAGE ERROR:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Failed to load staff dashboard"
    );
  } finally {
    setLoading(false);
  }
};

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-neutral-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-64 rounded bg-neutral-200" />

                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-32 rounded-xl bg-white"
                                />
                            ))}
                        </div>

                        <div className="h-80 rounded-xl bg-white" />
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
                <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <XCircle className="mx-auto h-12 w-12 text-red-500" />

                    <h1 className="mt-4 text-xl font-semibold text-neutral-900">
                        Unable to load dashboard
                    </h1>

                    <p className="mt-2 text-sm text-neutral-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadDashboard}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    if (!dashboard || !staff) {
        return null;
    }

    const stats = dashboard.orderStats;

    const permissions = dashboard.permissions;

    const hasPermission = (permission: string) => {
        return (
            staff.role === "superadmin" ||
            permissions.includes(permission)
        );
    };

    const cards = [
        {
            title: "Today's Orders",
            value: dashboard.today.orders,
            icon: Package,
            show: hasPermission("orders.view"),
        },
        {
            title: "Pending Orders",
            value: stats.pending,
            icon: Clock3,
            show: hasPermission("orders.view"),
        },
        {
            title: "Processing",
            value: stats.processing,
            icon: RefreshCw,
            show: hasPermission("orders.view"),
        },
        {
            title: "Shipped",
            value: stats.shipped,
            icon: Truck,
            show: hasPermission("shipping.view"),
        },
    ];

    return (
        <main className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="border-b border-neutral-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                            Mulberries Management
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
                            Staff Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-neutral-500">
                            Welcome back, {staff.name}
                        </p>
                    </div>

                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold text-neutral-900">
                            {staff.name}
                        </p>

                        <p className="text-xs capitalize text-neutral-500">
                            {staff.role}
                        </p>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* KPI Cards */}
                <section>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {cards
                            .filter((card) => card.show)
                            .map((card) => {
                                const Icon = card.icon;

                                return (
                                    <div
                                        key={card.title}
                                        className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-neutral-500">
                                                {card.title}
                                            </p>

                                            <Icon
                                                size={20}
                                                className="text-neutral-400"
                                            />
                                        </div>

                                        <p className="mt-4 text-3xl font-semibold text-neutral-950">
                                            {card.value}
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                </section>

                {/* Order Overview */}
                {hasPermission("orders.view") && (
                    <section className="mt-6">
                        <div className="rounded-xl border border-neutral-200 bg-white">
                            <div className="border-b border-neutral-200 px-5 py-4">
                                <h2 className="text-base font-semibold text-neutral-950">
                                    Order Overview
                                </h2>

                                <p className="mt-1 text-xs text-neutral-500">
                                    Current order status across the store.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 divide-x divide-y divide-neutral-200 sm:grid-cols-3 lg:grid-cols-5">
                                <StatusItem
                                    label="Pending"
                                    value={stats.pending}
                                    icon={<Clock3 size={17} />}
                                />

                                <StatusItem
                                    label="Confirmed"
                                    value={stats.confirmed}
                                    icon={<CheckCircle2 size={17} />}
                                />

                                <StatusItem
                                    label="Processing"
                                    value={stats.processing}
                                    icon={<RefreshCw size={17} />}
                                />

                                <StatusItem
                                    label="Shipped"
                                    value={stats.shipped}
                                    icon={<Truck size={17} />}
                                />

                                <StatusItem
                                    label="Delivered"
                                    value={stats.delivered}
                                    icon={<CheckCircle2 size={17} />}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Today's Summary */}
                {hasPermission("orders.view") && (
                    <section className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-neutral-200 bg-white p-5">
                            <p className="text-sm text-neutral-500">
                                Orders today
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-neutral-950">
                                {dashboard.today.orders}
                            </p>

                            <p className="mt-2 text-xs text-neutral-500">
                                Orders created today
                            </p>
                        </div>

                        <div className="rounded-xl border border-neutral-200 bg-white p-5">
                            <p className="text-sm text-neutral-500">
                                Completed today
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-neutral-950">
                                {dashboard.today.completed}
                            </p>

                            <p className="mt-2 text-xs text-neutral-500">
                                Orders delivered today
                            </p>
                        </div>
                    </section>
                )}

                {/* Recent Orders */}
                {hasPermission("orders.view") && (
                    <section className="mt-6">
                        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                            <div className="border-b border-neutral-200 px-5 py-4">
                                <h2 className="text-base font-semibold text-neutral-950">
                                    Recent Orders
                                </h2>

                                <p className="mt-1 text-xs text-neutral-500">
                                    Latest orders requiring staff attention.
                                </p>
                            </div>

                            {dashboard.recentOrders.length === 0 ? (
                                <div className="px-5 py-12 text-center">
                                    <Package className="mx-auto h-10 w-10 text-neutral-300" />

                                    <p className="mt-3 text-sm text-neutral-500">
                                        No orders found.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[700px] text-left">
                                        <thead className="bg-neutral-50">
                                            <tr>
                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                                    Order
                                                </th>

                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                                    Customer
                                                </th>

                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                                    Amount
                                                </th>

                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                                    Status
                                                </th>

                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-neutral-200">
                                            {dashboard.recentOrders.map(
                                                (order: any) => (
                                                    <tr
                                                        key={order._id}
                                                        className="transition hover:bg-neutral-50"
                                                    >
                                                        <td className="px-5 py-4">
                                                            <span className="text-sm font-medium text-neutral-900">
                                                                #{order._id?.slice(-8)}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div>
                                                                <p className="text-sm font-medium text-neutral-900">
                                                                    {order.user?.name ||
                                                                        "Guest"}
                                                                </p>

                                                                {hasPermission(
                                                                    "customers.view"
                                                                ) && (
                                                                        <p className="mt-0.5 text-xs text-neutral-500">
                                                                            {order.user?.email ||
                                                                                "No email"}
                                                                        </p>
                                                                    )}
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                                                            ₹
                                                            {Number(
                                                                order.totalAmount || 0
                                                            ).toLocaleString("en-IN")}
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium capitalize text-neutral-700">
                                                                {String(
                                                                    order.orderStatus || ""
                                                                ).replaceAll("_", " ")}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4 text-xs text-neutral-500">
                                                            {order.createdAt
                                                                ? new Date(
                                                                    order.createdAt
                                                                ).toLocaleDateString(
                                                                    "en-IN"
                                                                )
                                                                : "-"}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Low Stock */}
                {hasPermission("inventory.view") && (
                    <section className="mt-6 pb-10">
                        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-950">
                                        Low Stock
                                    </h2>

                                    <p className="mt-1 text-xs text-neutral-500">
                                        Products with 10 or fewer units remaining.
                                    </p>
                                </div>

                                <AlertTriangle
                                    size={20}
                                    className="text-neutral-400"
                                />
                            </div>

                            {dashboard.lowStockProducts.length === 0 ? (
                                <div className="px-5 py-10 text-center">
                                    <CheckCircle2 className="mx-auto h-9 w-9 text-neutral-300" />

                                    <p className="mt-3 text-sm text-neutral-500">
                                        No low-stock products.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-200">
                                    {dashboard.lowStockProducts.map(
                                        (product: any) => (
                                            <div
                                                key={product._id}
                                                className="flex items-center justify-between gap-4 px-5 py-4"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-neutral-900">
                                                        {product.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-neutral-500">
                                                        ₹
                                                        {Number(
                                                            product.price || 0
                                                        ).toLocaleString("en-IN")}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                                                    {product.stock} left
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

function StatusItem({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="px-5 py-5">
            <div className="flex items-center gap-2 text-neutral-400">
                {icon}

                <span className="text-xs font-medium">
                    {label}
                </span>
            </div>

            <p className="mt-2 text-2xl font-semibold text-neutral-950">
                {value}
            </p>
        </div>
    );
}