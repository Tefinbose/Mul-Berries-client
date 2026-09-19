"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Package,
  Truck,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  Hash,
  Loader2,
} from "lucide-react";

interface ShipmentOrder {
  _id: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface Shipment {
  _id: string;
  order?: ShipmentOrder | null;

  user?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  } | null;

  courierName?: string;
  courierProvider?: string;
  courierService?: string;

  awbNumber?: string;
  trackingNumber?: string;
  labelUrl?: string;

  shipmentStatus: string;

  pickupScheduledAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  estimatedDeliveryDate?: string;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const shipmentStatuses = [
  "shipment_created",
  "courier_assigned",
  "awb_generated",
  "label_generated",
  "pickup_scheduled",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "ndr",
  "rto",
  "return_requested",
  "returned",
  "cancelled",
];

const statusLabels: Record<string, string> = {
  shipment_created: "Shipment Created",
  courier_assigned: "Courier Assigned",
  awb_generated: "AWB Generated",
  label_generated: "Label Generated",
  pickup_scheduled: "Pickup Scheduled",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  ndr: "NDR",
  rto: "RTO",
  return_requested: "Return Requested",
  returned: "Returned",
  cancelled: "Cancelled",
};

function formatStatus(status: string) {
  return (
    statusLabels[status] ||
    status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function getStatusClasses(status: string) {
  switch (status) {
    case "shipment_created":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "courier_assigned":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "awb_generated":
      return "bg-violet-50 text-violet-700 border-violet-200";

    case "label_generated":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "pickup_scheduled":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "picked_up":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";

    case "in_transit":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "out_for_delivery":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "ndr":
      return "bg-red-50 text-red-700 border-red-200";

    case "rto":
      return "bg-rose-50 text-rose-700 border-rose-200";

    case "return_requested":
      return "bg-pink-50 text-pink-700 border-pink-200";

    case "returned":
      return "bg-gray-100 text-gray-700 border-gray-200";

    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount?: number) {
  if (typeof amount !== "number") {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function StaffShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [error, setError] = useState("");

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("accessToken")
    );
  };

  const fetchShipments = async (
    page = 1,
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getToken();

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/staff/shipments?page=${page}&limit=${pagination.limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch shipments"
        );
      }

      setShipments(data.shipments || []);

      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("FETCH STAFF SHIPMENTS ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load shipments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShipments(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      shipment._id.toLowerCase().includes(searchValue) ||
      shipment.order?._id
        ?.toLowerCase()
        .includes(searchValue) ||
      shipment.awbNumber
        ?.toLowerCase()
        .includes(searchValue) ||
      shipment.trackingNumber
        ?.toLowerCase()
        .includes(searchValue) ||
      shipment.courierName
        ?.toLowerCase()
        .includes(searchValue) ||
      shipment.courierProvider
        ?.toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "all" ||
      shipment.shipmentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePrevious = () => {
    if (!pagination.hasPreviousPage) {
      return;
    }

    fetchShipments(pagination.page - 1);
  };

  const handleNext = () => {
    if (!pagination.hasNextPage) {
      return;
    }

    fetchShipments(pagination.page + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <Truck className="h-4 w-4" />
                <span>Staff</span>
                <span>/</span>
                <span>Shipping</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Shipping
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage shipments, courier assignments, AWB and
                delivery status.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                fetchShipments(pagination.page, true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Shipments
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {pagination.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Created
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {
                    shipments.filter(
                      (item) =>
                        item.shipmentStatus ===
                        "shipment_created"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  In Transit
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {
                    shipments.filter(
                      (item) =>
                        item.shipmentStatus === "in_transit"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                <Truck className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Delivered
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {
                    shipments.filter(
                      (item) =>
                        item.shipmentStatus === "delivered"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <Truck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search shipment, order, AWB, tracking or courier..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div className="lg:w-64">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="all">All statuses</option>

                {shipmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-slate-500" />

              <p className="text-sm text-slate-500">
                Loading shipments...
              </p>
            </div>
          </div>
        ) : filteredShipments.length === 0 ? (
          /* EMPTY */
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Package className="h-7 w-7 text-slate-400" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No shipments found
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {search || statusFilter !== "all"
                ? "Try changing your search or filters."
                : "There are currently no shipments available."}
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Shipment
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Order
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Courier
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Delivery
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredShipments.map((shipment) => (
                      <tr
                        key={shipment._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        {/* SHIPMENT */}
                        <td className="px-5 py-5">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                              <Package className="h-5 w-5 text-slate-600" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900">
                                #{shipment._id.slice(-8)}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDate(shipment.createdAt)}
                              </div>

                              {shipment.awbNumber && (
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                  <Hash className="h-3.5 w-3.5" />
                                  {shipment.awbNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* ORDER */}
                        <td className="px-5 py-5">
                          {shipment.order ? (
                            <div>
                              <p className="font-medium text-slate-900">
                                #{shipment.order._id.slice(-8)}
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {formatCurrency(
                                  shipment.order.totalAmount
                                )}
                              </p>

                              <p className="mt-1 text-xs capitalize text-slate-500">
                                {shipment.order.paymentStatus}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              No order
                            </span>
                          )}
                        </td>

                        {/* COURIER */}
                        <td className="px-5 py-5">
                          <div>
                            <p className="font-medium text-slate-900">
                              {shipment.courierName ||
                                shipment.courierProvider ||
                                "Not assigned"}
                            </p>

                            {shipment.courierService && (
                              <p className="mt-1 text-xs text-slate-500">
                                {shipment.courierService}
                              </p>
                            )}

                            {shipment.trackingNumber && (
                              <p className="mt-1 text-xs text-slate-500">
                                Tracking:{" "}
                                {shipment.trackingNumber}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                              shipment.shipmentStatus
                            )}`}
                          >
                            {formatStatus(
                              shipment.shipmentStatus
                            )}
                          </span>
                        </td>

                        {/* DELIVERY */}
                        <td className="px-5 py-5">
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {shipment.estimatedDeliveryDate
                                  ? formatDate(
                                      shipment.estimatedDeliveryDate
                                    )
                                  : "Not available"}
                              </p>

                              {shipment.deliveredAt && (
                                <p className="mt-1 text-xs text-emerald-600">
                                  Delivered{" "}
                                  {formatDate(
                                    shipment.deliveredAt
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* VIEW */}
                        <td className="px-5 py-5 text-right">
                          <a
                            href={`/staff/shipping/${shipment._id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE */}
            <div className="space-y-4 lg:hidden">
              {filteredShipments.map((shipment) => (
                <div
                  key={shipment._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <Package className="h-5 w-5 text-slate-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          #{shipment._id.slice(-8)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Created {formatDate(shipment.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                        shipment.shipmentStatus
                      )}`}
                    >
                      {formatStatus(shipment.shipmentStatus)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Order
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {shipment.order
                          ? `#${shipment.order._id.slice(-8)}`
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {shipment.order
                          ? formatCurrency(
                              shipment.order.totalAmount
                            )
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Courier
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {shipment.courierName ||
                          shipment.courierProvider ||
                          "Not assigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Service
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {shipment.courierService || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        AWB
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                        {shipment.awbNumber || "Not generated"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Delivery
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {shipment.estimatedDeliveryDate
                          ? formatDate(
                              shipment.estimatedDeliveryDate
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {shipment.notes && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-400">
                        Notes
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {shipment.notes}
                      </p>
                    </div>
                  )}

                  {/* IMPORTANT: NORMAL BROWSER NAVIGATION */}
                  <div className="mt-5">
                    <a
                      href={`/staff/shipping/${shipment._id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Eye className="h-4 w-4" />
                      View Shipment
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAGINATION */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-700">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!pagination.hasPreviousPage}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {!loading && shipments.length > 0 && (
          <div className="mt-4 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {filteredShipments.length} of{" "}
              {shipments.length} shipments on this page
            </p>

            <p>Total shipments: {pagination.total}</p>
          </div>
        )}
      </main>
    </div>
  );
}