"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  RefreshCw,
  Search,
  Eye,
  Truck,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ShipmentOrder {
  _id: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface Shipment {
  _id: string;
  order: ShipmentOrder;
  user: string | null;
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

interface ShipmentResponse {
  success: boolean;
  shipments: Shipment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  message?: string;
}

const shipmentStatusLabels: Record<string, string> = {
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

function getStatusStyle(status: string) {
  switch (status) {
    case "shipment_created":
    case "courier_assigned":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "awb_generated":
    case "label_generated":
    case "pickup_scheduled":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "picked_up":
    case "in_transit":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "out_for_delivery":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "ndr":
    case "rto":
    case "return_requested":
      return "bg-red-50 text-red-700 border-red-200";

    case "returned":
      return "bg-slate-100 text-slate-700 border-slate-200";

    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function formatStatus(status: string) {
  return (
    shipmentStatusLabels[status] ||
    status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function formatDate(date?: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date?: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StaffShipmentsPage() {
  const router = useRouter();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const loadShipments = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token = getToken();

        if (!token) {
          router.push("/staff/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/staff/shipments?page=${page}&limit=20`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: ShipmentResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load shipments"
          );
        }

        setShipments(data.shipments || []);
        setPagination(data.pagination);
      } catch (err) {
        console.error("LOAD STAFF SHIPMENTS ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load shipments"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, router]
  );

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const filteredShipments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesStatus =
        statusFilter === "all" ||
        shipment.shipmentStatus === statusFilter;

      if (!matchesStatus) return false;

      if (!query) return true;

      return (
        shipment._id.toLowerCase().includes(query) ||
        shipment.order?._id?.toLowerCase().includes(query) ||
        shipment.courierName?.toLowerCase().includes(query) ||
        shipment.courierProvider?.toLowerCase().includes(query) ||
        shipment.awbNumber?.toLowerCase().includes(query) ||
        shipment.trackingNumber?.toLowerCase().includes(query)
      );
    });
  }, [shipments, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: pagination.total,
      created: shipments.filter(
        (item) => item.shipmentStatus === "shipment_created"
      ).length,
      transit: shipments.filter(
        (item) =>
          item.shipmentStatus === "picked_up" ||
          item.shipmentStatus === "in_transit"
      ).length,
      delivered: shipments.filter(
        (item) => item.shipmentStatus === "delivered"
      ).length,
    };
  }, [shipments, pagination.total]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl bg-white"
              />
            ))}
          </div>

          <div className="h-16 rounded-2xl bg-white" />

          <div className="h-96 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Shipments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage courier shipments, AWB numbers and delivery status.
            </p>
          </div>

          <button
            onClick={() => loadShipments(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load shipments
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Package className="h-5 w-5 text-blue-600" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Total
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {stats.total}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total Shipments
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <Clock3 className="h-5 w-5 text-purple-600" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Pending
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {stats.created}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Shipment Created
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Truck className="h-5 w-5 text-amber-600" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Active
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {stats.transit}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              In Transit
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Completed
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {stats.delivered}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Delivered
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search shipment, order, courier, AWB..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All Statuses</option>
              <option value="shipment_created">
                Shipment Created
              </option>
              <option value="courier_assigned">
                Courier Assigned
              </option>
              <option value="awb_generated">
                AWB Generated
              </option>
              <option value="label_generated">
                Label Generated
              </option>
              <option value="pickup_scheduled">
                Pickup Scheduled
              </option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">
                Out for Delivery
              </option>
              <option value="delivered">Delivered</option>
              <option value="ndr">NDR</option>
              <option value="rto">RTO</option>
              <option value="return_requested">
                Return Requested
              </option>
              <option value="returned">Returned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Shipment list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Shipment
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Order
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Courier
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Delivery
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr
                      key={shipment._id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-mono text-xs font-semibold text-slate-900">
                            #{shipment._id.slice(-8).toUpperCase()}
                          </p>

                          {shipment.awbNumber ? (
                            <p className="mt-1 text-xs text-slate-500">
                              AWB:{" "}
                              <span className="font-medium text-slate-700">
                                {shipment.awbNumber}
                              </span>
                            </p>
                          ) : shipment.trackingNumber ? (
                            <p className="mt-1 text-xs text-slate-500">
                              Tracking:{" "}
                              <span className="font-medium text-slate-700">
                                {shipment.trackingNumber}
                              </span>
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-slate-400">
                              AWB not generated
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-mono text-xs font-semibold text-slate-800">
                          #{shipment.order?._id
                            ?.slice(-8)
                            .toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ₹
                          {shipment.order?.totalAmount?.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                            <Truck className="h-4 w-4 text-slate-600" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {shipment.courierName ||
                                "Not assigned"}
                            </p>

                            <p className="text-xs text-slate-500">
                              {shipment.courierService ||
                                shipment.courierProvider ||
                                "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            shipment.shipmentStatus
                          )}`}
                        >
                          {formatStatus(
                            shipment.shipmentStatus
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />

                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {formatDate(
                                shipment.estimatedDeliveryDate
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Estimated
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() =>
                            router.push(
                              `/staff/shipments/${shipment._id}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >
                      <Package className="mx-auto h-10 w-10 text-slate-300" />

                      <p className="mt-4 text-sm font-semibold text-slate-700">
                        No shipments found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredShipments.length > 0 ? (
              filteredShipments.map((shipment) => (
                <div key={shipment._id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-900">
                        #{shipment._id.slice(-8).toUpperCase()}
                      </p>

                      <p className="mt-1 font-mono text-xs text-slate-500">
                        Order #
                        {shipment.order?._id
                          ?.slice(-8)
                          .toUpperCase()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                        shipment.shipmentStatus
                      )}`}
                    >
                      {formatStatus(
                        shipment.shipmentStatus
                      )}
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Truck className="h-5 w-5 text-slate-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {shipment.courierName ||
                            "Courier not assigned"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {shipment.courierService ||
                            shipment.courierProvider ||
                            "Service not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-100 p-3">
                      <p className="text-xs text-slate-400">
                        Order Value
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        ₹
                        {shipment.order?.totalAmount?.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-3">
                      <p className="text-xs text-slate-400">
                        Delivery
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {formatDate(
                          shipment.estimatedDeliveryDate
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-100 p-3">
                    <p className="text-xs text-slate-400">
                      AWB / Tracking
                    </p>

                    <p className="mt-1 break-all font-mono text-xs font-semibold text-slate-700">
                      {shipment.awbNumber ||
                        shipment.trackingNumber ||
                        "Not generated"}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/staff/shipments/${shipment._id}`
                      )
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <Eye className="h-4 w-4" />
                    View Shipment
                  </button>
                </div>
              ))
            ) : (
              <div className="px-5 py-16 text-center">
                <Package className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No shipments found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or status filter.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
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
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  disabled={!pagination.hasPreviousPage}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  onClick={() =>
                    setPage((current) =>
                      pagination.hasNextPage
                        ? current + 1
                        : current
                    )
                  }
                  disabled={!pagination.hasNextPage}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer information */}
        {shipments.length > 0 && (
          <div className="mt-4 text-xs text-slate-400">
            Showing {filteredShipments.length} of{" "}
            {shipments.length} shipments on this page.
            <span className="ml-2">
              Last refreshed:{" "}
              {formatDateTime(shipments[0]?.updatedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 