"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  ShoppingBag,
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

      let profileResponse;
      let dashboardResponse;

      // -----------------------------------------
      // STAFF PROFILE
      // -----------------------------------------
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

      // -----------------------------------------
      // STAFF DASHBOARD
      // -----------------------------------------
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

  // -----------------------------------------
  // LOADING
  // -----------------------------------------
  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-2.5">
              <div className="h-3 w-32 rounded bg-neutral-200" />
              <div className="h-7 w-56 rounded bg-neutral-200" />
              <div className="h-4 w-44 rounded bg-neutral-200" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-8 lg:py-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-2xl border border-neutral-200 bg-white sm:h-32"
              />
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 rounded-2xl border border-neutral-200 bg-white sm:h-36"
              />
            ))}
          </div>

          <div className="h-80 rounded-2xl border border-neutral-200 bg-white" />
        </div>
      </main>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10 sm:p-6">
        <div
          role="alert"
          className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8"
        >
          <XCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-xl font-semibold tracking-tight text-neutral-900">
            Unable to load dashboard
          </h1>

          <p className="mt-2 break-words text-sm text-neutral-500">
            {error}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
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
  const permissions = dashboard.permissions || [];

  // -----------------------------------------
  // PERMISSION CHECK
  // -----------------------------------------
  const hasPermission = (permission: string) => {
    return (
      staff.role === "superadmin" ||
      permissions.includes(permission)
    );
  };

  const canViewOrders = hasPermission("orders.view");
  const canViewInventory = hasPermission("inventory.view");
  const canViewCustomers = hasPermission("customers.view");

  // -----------------------------------------
  // FORMAT HELPERS
  // -----------------------------------------
  const formatAmount = (value: unknown) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString("en-IN") : "-";

  const formatStatus = (value?: string) =>
    String(value || "").replaceAll("_", " ");

  // -----------------------------------------
  // KPI CARDS
  // -----------------------------------------
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

  // -----------------------------------------
  // STAFF OPERATIONS
  // -----------------------------------------
  const operations = [
    {
      title: "Orders",
      description: "View and process customer orders.",
      href: "/staff/orders",
      icon: ShoppingBag,
      show: hasPermission("orders.view"),
    },
    {
      title: "Inventory",
      description: "Check stock and update inventory.",
      href: "/staff/inventory",
      icon: Boxes,
      show: hasPermission("inventory.view"),
    },
    {
      title: "Shipping",
      description: "Manage shipments, AWB and delivery status.",
      href: "/staff/shipping",
      icon: Truck,
      show: hasPermission("shipping.view"),
    },
    {
      title: "Analytics",
      description: "Analyse sales, orders and store performance.",
      href: "/staff/analytics",
      icon: BarChart3,
      show: staff.role === "superadmin",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">

          <div className="min-w-0">
            <p className="text-xs font-medium text-neutral-500">
              Mulberries Management
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
              Staff Dashboard
            </h1>

            <p className="mt-1 truncate text-sm text-neutral-500">
              Welcome back, {staff.name}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            <button
              type="button"
              onClick={loadDashboard}
              aria-label="Refresh dashboard"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:px-4"
            >
              <RefreshCw size={16} />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white p-1 sm:py-1 sm:pl-1 sm:pr-4">

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                {(staff.name || "S").charAt(0).toUpperCase()}
              </span>

              <div className="hidden text-left leading-tight sm:block">
                <p className="text-sm font-semibold text-neutral-900">
                  {staff.name}
                </p>

                <p className="text-xs capitalize text-neutral-500">
                  {staff.role}
                </p>
              </div>

            </div>

          </div>

        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-8 lg:py-8">

        {/* ===================================================
            KPI CARDS
        ==================================================== */}
        <section aria-label="Key numbers">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

            {cards
              .filter((card) => card.show)
              .map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-2">

                      <p className="text-xs font-medium leading-snug text-neutral-500 sm:text-sm">
                        {card.title}
                      </p>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                        <Icon
                          size={18}
                          className="text-neutral-400"
                        />
                      </span>

                    </div>

                    <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-neutral-950 sm:mt-4 sm:text-3xl">
                      {card.value}
                    </p>
                  </div>
                );
              })}

          </div>
        </section>

        {/* ===================================================
            STAFF OPERATIONS NAVIGATION
        ==================================================== */}
        <section>

          <div className="mb-4">
            <h2 className="text-base font-semibold tracking-tight text-neutral-950">
              Staff Operations
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Manage orders, inventory, shipping and store analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">

            {operations
              .filter((operation) => operation.show)
              .map((operation) => {
                const Icon = operation.icon;

                return (
                  <a
                    key={operation.href}
                    href={operation.href}
                    className="group relative flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:flex-col sm:items-start sm:gap-0 sm:p-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 transition group-hover:bg-neutral-900">
                      <Icon className="h-5 w-5 text-neutral-700 transition group-hover:text-white" />
                    </span>

                    <div className="min-w-0 flex-1 sm:mt-5 sm:flex-none">
                      <h3 className="text-base font-semibold text-neutral-950">
                        {operation.title}
                      </h3>

                      <p className="mt-0.5 text-sm text-neutral-500 sm:mt-1">
                        {operation.description}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-neutral-700 sm:absolute sm:right-5 sm:top-5"
                    >
                      →
                    </span>
                  </a>
                );
              })}

          </div>
        </section>

        {/* ===================================================
            ORDER OVERVIEW + TODAY'S SUMMARY
        ==================================================== */}
        {canViewOrders && (
          <section className="grid gap-4 xl:grid-cols-3">

            {/* ORDER OVERVIEW */}
            <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm xl:col-span-2">

              <div className="border-b border-neutral-200 px-4 py-4 sm:px-5">

                <h2 className="text-base font-semibold tracking-tight text-neutral-950">
                  Order Overview
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Current order status across the store.
                </p>

              </div>

              <div className="grid flex-1 grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 lg:grid-cols-5">

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

            {/* TODAY'S SUMMARY */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-1">

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">

                <p className="text-sm font-medium text-neutral-500">
                  Orders today
                </p>

                <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-neutral-950">
                  {dashboard.today.orders}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Orders created today
                </p>

              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">

                <p className="text-sm font-medium text-neutral-500">
                  Completed today
                </p>

                <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-neutral-950">
                  {dashboard.today.completed}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Orders delivered today
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            RECENT ORDERS + LOW STOCK
        ==================================================== */}
        {(canViewOrders || canViewInventory) && (
          <section className="grid items-start gap-4 xl:grid-cols-3">

            {/* RECENT ORDERS */}
            {canViewOrders && (
              <div
                className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm ${
                  canViewInventory
                    ? "xl:col-span-2"
                    : "xl:col-span-3"
                }`}
              >

                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-4 py-4 sm:px-5">

                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-neutral-950">
                      Recent Orders
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                      Latest orders requiring staff attention.
                    </p>
                  </div>

                  <a
                    href="/staff/orders"
                    className="shrink-0 rounded-full border border-neutral-200 px-3.5 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    View all
                  </a>

                </div>

                {dashboard.recentOrders.length === 0 ? (

                  <div className="px-5 py-12 text-center">

                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
                      <Package className="h-7 w-7 text-neutral-300" />
                    </span>

                    <p className="mt-3 text-sm text-neutral-500">
                      No orders found.
                    </p>

                  </div>

                ) : (

                  <>
                    {/* MOBILE LIST */}
                    <ul className="divide-y divide-neutral-200 md:hidden">

                      {dashboard.recentOrders.map(
                        (order: any) => (
                          <li
                            key={order._id}
                            className="px-4 py-4 sm:px-5"
                          >

                            <div className="flex items-start justify-between gap-3">

                              <div className="min-w-0">

                                <p className="text-sm font-medium text-neutral-900">
                                  #{order._id?.slice(-8)}
                                </p>

                                <p className="mt-0.5 truncate text-sm text-neutral-700">
                                  {order.user?.name || "Guest"}
                                </p>

                                {canViewCustomers && (
                                  <p className="truncate text-xs text-neutral-500">
                                    {order.user?.email || "No email"}
                                  </p>
                                )}

                              </div>

                              <p className="shrink-0 text-sm font-semibold tabular-nums text-neutral-900">
                                {formatAmount(order.totalAmount)}
                              </p>

                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">

                              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium capitalize text-neutral-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                                {formatStatus(order.orderStatus)}
                              </span>

                              <span className="text-xs text-neutral-500">
                                {formatDate(order.createdAt)}
                              </span>

                            </div>

                          </li>
                        )
                      )}

                    </ul>

                    {/* DESKTOP TABLE */}
                    <div className="hidden overflow-x-auto md:block">

                      <table className="w-full text-left">

                        <thead className="bg-neutral-50">

                          <tr>

                            <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                              Order
                            </th>

                            <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                              Customer
                            </th>

                            <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                              Date
                            </th>

                            <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                              Status
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-medium text-neutral-500">
                              Amount
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

                                <td className="whitespace-nowrap px-5 py-4 align-middle">
                                  <span className="text-sm font-medium text-neutral-900">
                                    #{order._id?.slice(-8)}
                                  </span>
                                </td>

                                <td className="px-5 py-4 align-middle">

                                  <div className="max-w-[220px]">

                                    <p className="truncate text-sm font-medium text-neutral-900">
                                      {order.user?.name || "Guest"}
                                    </p>

                                    {canViewCustomers && (
                                      <p className="mt-0.5 truncate text-xs text-neutral-500">
                                        {order.user?.email || "No email"}
                                      </p>
                                    )}

                                  </div>

                                </td>

                                <td className="whitespace-nowrap px-5 py-4 align-middle text-sm text-neutral-500">
                                  {formatDate(order.createdAt)}
                                </td>

                                <td className="whitespace-nowrap px-5 py-4 align-middle">

                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium capitalize text-neutral-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                                    {formatStatus(order.orderStatus)}
                                  </span>

                                </td>

                                <td className="whitespace-nowrap px-5 py-4 text-right align-middle text-sm font-semibold tabular-nums text-neutral-900">
                                  {formatAmount(order.totalAmount)}
                                </td>

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>
                  </>

                )}

              </div>
            )}

            {/* LOW STOCK */}
            {canViewInventory && (
              <div
                className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm ${
                  canViewOrders
                    ? "xl:col-span-1"
                    : "xl:col-span-3"
                }`}
              >

                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-4 py-4 sm:px-5">

                  <div>

                    <h2 className="text-base font-semibold tracking-tight text-neutral-950">
                      Low Stock
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                      Products with 10 or fewer units remaining.
                    </p>

                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <AlertTriangle
                      size={18}
                      className="text-neutral-400"
                    />
                  </span>

                </div>

                {dashboard.lowStockProducts.length === 0 ? (

                  <div className="px-5 py-10 text-center">

                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
                      <CheckCircle2 className="h-7 w-7 text-neutral-300" />
                    </span>

                    <p className="mt-3 text-sm text-neutral-500">
                      No low-stock products.
                    </p>

                  </div>

                ) : (

                  <div className="max-h-[420px] divide-y divide-neutral-200 overflow-y-auto">

                    {dashboard.lowStockProducts.map(
                      (product: any) => (

                        <div
                          key={product._id}
                          className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5"
                        >

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-neutral-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs tabular-nums text-neutral-500">
                              {formatAmount(product.price)}
                            </p>

                          </div>

                          <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold tabular-nums text-neutral-700">
                            {product.stock} left
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>
            )}

          </section>
        )}

      </div>
    </main>
  );
}

/* =========================================================
   STATUS ITEM
========================================================= */

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
    <div className="rounded-xl bg-neutral-50 p-4">

      <div className="flex items-center gap-2 text-neutral-400">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-neutral-950">
        {value}
      </p>

    </div>
  );
}