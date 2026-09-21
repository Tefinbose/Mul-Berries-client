"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  Truck,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mull-berries-server.onrender.com/api";

type Shipment = {
  _id: string;

  order?: {
    _id?: string;
    totalAmount?: number;
    orderStatus?: string;
  } | null;

  orderId?: string;

  courier?: string;
  courierName?: string;
  courierProvider?: string;
  courierService?: string;
  provider?: string;

  awb?: string;
  trackingNumber?: string;
  trackingId?: string;

  labelUrl?: string;

  status?: string;
  shipmentStatus?: string;
  trackingStatus?: string;

  pickupDate?: string;
  pickupScheduledAt?: string;
  estimatedDelivery?: string;
  estimatedDeliveryDate?: string;
  deliveryDate?: string;

  createdAt?: string;
  updatedAt?: string;

  notes?: string;

  shippingAddress?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

type ShipmentListResponse = {
  success: boolean;
  shipments?: Shipment[];
  message?: string;
};

type ShipmentDetailsResponse = {
  success: boolean;
  shipment?: Shipment;
  message?: string;
};

type ShipmentCreateResponse = {
  success: boolean;
  shipment?: Shipment;
  message?: string;
};

type ShipmentUpdateResponse = {
  success: boolean;
  shipment?: Shipment;
  message?: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "shipment_created", label: "Shipment Created" },
  { value: "courier_assigned", label: "Courier Assigned" },
  { value: "awb_generated", label: "AWB Generated" },
  { value: "label_generated", label: "Label Generated" },
  { value: "pickup_scheduled", label: "Pickup Scheduled" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_FLOW = [
  "shipment_created",
  "courier_assigned",
  "awb_generated",
  "label_generated",
  "pickup_scheduled",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export default function StaffShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedShipment, setSelectedShipment] =
    useState<Shipment | null>(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [creatingShipment, setCreatingShipment] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [courierName, setCourierName] = useState("");
  const [awb, setAwb] = useState("");

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token");
  };

  const fetchShipments = async (
    showRefreshLoader = false
  ) => {
    try {
      if (showRefreshLoader) {
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
        `${API_URL}/staff/shipments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data: ShipmentListResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          `Failed to load shipments. Status: ${response.status}`
        );
      }

      setShipments(data.shipments || []);
    } catch (error) {
      console.error(
        "STAFF SHIPPING ERROR:",
        error
      );

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
    fetchShipments();
  }, []);

  /*
   * IMPORTANT:
   * We fetch shipment details from the backend.
   *
   * We DO NOT do:
   * router.push(`/staff/shipments/${shipmentId}`)
   *
   * because that Next.js route does not exist.
   */
  const fetchShipmentDetails = async (
    shipmentId: string
  ) => {
    try {
      setDetailLoading(true);
      setStatusMessage("");

      const token = getToken();

      if (!token) {
        setStatusMessage(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/staff/shipments/${shipmentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data: ShipmentDetailsResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          `Failed to load shipment details. Status: ${response.status}`
        );
      }

      if (!data.shipment) {
        throw new Error(
          "Shipment details not found."
        );
      }

      setSelectedShipment(data.shipment);
    } catch (error) {
      console.error(
        "SHIPMENT DETAILS ERROR:",
        error
      );

      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to load shipment details."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const openShipment = async (
    shipment: Shipment
  ) => {
    setSelectedShipment(shipment);

    await fetchShipmentDetails(
      shipment._id
    );
  };

  const closeShipment = () => {
    setSelectedShipment(null);
    setStatusMessage("");
  };

  const updateShipmentStatus = async (
    status: string
  ) => {
    if (!selectedShipment) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setStatusMessage("");

      const token = getToken();

      if (!token) {
        setStatusMessage(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/staff/shipments/${selectedShipment._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipmentStatus: status,
          }),
        }
      );

      const data: ShipmentUpdateResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          `Failed to update shipment status. Status: ${response.status}`
        );
      }

      setStatusMessage(
        "Shipment status updated successfully."
      );

      if (data.shipment) {
        setSelectedShipment(
          data.shipment
        );
      } else {
        await fetchShipmentDetails(
          selectedShipment._id
        );
      }

      await fetchShipments(true);
    } catch (error) {
      console.error(
        "UPDATE SHIPMENT STATUS ERROR:",
        error
      );

      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to update shipment status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const createShipment = async () => {
    if (!orderId.trim()) {
      return;
    }

    try {
      setCreatingShipment(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token not found."
        );
        return;
      }

      const body: Record<string, string> = {
        orderId: orderId.trim(),
      };

      if (courierName.trim()) {
        body.courierName =
          courierName.trim();
      }

      if (awb.trim()) {
        body.awb = awb.trim();
      }

      const response = await fetch(
        `${API_URL}/staff/shipments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data: ShipmentCreateResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          `Failed to create shipment. Status: ${response.status}`
        );
      }

      setCreateOpen(false);

      setOrderId("");
      setCourierName("");
      setAwb("");

      await fetchShipments(true);
    } catch (error) {
      console.error(
        "CREATE SHIPMENT ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create shipment."
      );
    } finally {
      setCreatingShipment(false);
    }
  };

  const getShipmentStatus = (
    shipment: Shipment
  ) => {
    return (
      shipment.shipmentStatus ||
      shipment.status ||
      shipment.trackingStatus ||
      "shipment_created"
    ).toLowerCase();
  };

  const getStatusLabel = (
    status: string
  ) => {
    const option =
      STATUS_OPTIONS.find(
        (item) =>
          item.value === status
      );

    if (option) {
      return option.label;
    }

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getStatusClasses = (
    status: string
  ) => {
    switch (status) {
      case "delivered":
        return "border-green-100 bg-green-50 text-green-700";

      case "out_for_delivery":
        return "border-blue-100 bg-blue-50 text-blue-700";

      case "in_transit":
        return "border-purple-100 bg-purple-50 text-purple-700";

      case "picked_up":
      case "pickup_scheduled":
        return "border-indigo-100 bg-indigo-50 text-indigo-700";

      case "cancelled":
        return "border-red-100 bg-red-50 text-red-700";

      case "awb_generated":
      case "label_generated":
        return "border-cyan-100 bg-cyan-50 text-cyan-700";

      case "courier_assigned":
        return "border-orange-100 bg-orange-50 text-orange-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const formatCurrency = (
    value = 0
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(value);
  };

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const filteredShipments = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return shipments.filter(
      (shipment) => {
        const status =
          getShipmentStatus(shipment);

        const order =
          shipment.orderId ||
          shipment.order?._id ||
          "";

        const awbValue =
          shipment.awb ||
          shipment.trackingNumber ||
          shipment.trackingId ||
          "";

        const courier =
          shipment.courierName ||
          shipment.courier ||
          shipment.courierProvider ||
          shipment.provider ||
          "";

        const matchesSearch =
          !query ||
          order
            .toLowerCase()
            .includes(query) ||
          awbValue
            .toLowerCase()
            .includes(query) ||
          courier
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    shipments,
    search,
    statusFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredShipments.length /
      itemsPerPage
    )
  );

  const paginatedShipments =
    filteredShipments.slice(
      (currentPage - 1) *
      itemsPerPage,
      currentPage *
      itemsPerPage
    );

  const totalShipments =
    shipments.length;

  const deliveredShipments =
    shipments.filter(
      (shipment) =>
        getShipmentStatus(
          shipment
        ) === "delivered"
    ).length;

  const inTransitShipments =
    shipments.filter(
      (shipment) =>
        [
          "picked_up",
          "in_transit",
          "out_for_delivery",
        ].includes(
          getShipmentStatus(
            shipment
          )
        )
    ).length;

  const pendingShipments =
    shipments.filter(
      (shipment) =>
        [
          "shipment_created",
          "courier_assigned",
          "awb_generated",
          "label_generated",
          "pickup_scheduled",
        ].includes(
          getShipmentStatus(
            shipment
          )
        )
    ).length;

  const getNextStatus = (
    currentStatus: string
  ) => {
    const index =
      STATUS_FLOW.indexOf(
        currentStatus
      );

    if (
      index === -1 ||
      index >= STATUS_FLOW.length - 1
    ) {
      return null;
    }

    return STATUS_FLOW[index + 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-4 w-96 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              )
            )}
          </div>

          <div className="h-[500px] animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-black p-2.5">
                  <Truck className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                    Staff Shipping
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage shipments, tracking and delivery status.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() =>
                  fetchShipments(true)
                }
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}

                Refresh
              </button>

              <button
                onClick={() =>
                  setCreateOpen(true)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Create Shipment
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* KPI */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Total Shipments
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {totalShipments}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {pendingShipments}
                  </p>
                </div>

                <div className="rounded-xl bg-yellow-50 p-3">
                  <Clock3 className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    In Transit
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {inTransitShipments}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-3">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Delivered
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {deliveredShipments}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search order ID, AWB or courier..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
              >
                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status.value}
                      value={status.value}
                    >
                      {status.label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Shipment
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Order
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Courier
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      AWB
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedShipments.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-16 text-center"
                      >
                        <Package className="mx-auto h-10 w-10 text-gray-300" />

                        <p className="mt-3 text-sm font-medium text-gray-700">
                          No shipments found
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          Try changing your search or filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedShipments.map(
                      (shipment) => {
                        const status =
                          getShipmentStatus(
                            shipment
                          );

                        const order =
                          shipment.orderId ||
                          shipment.order?._id ||
                          "—";

                        const courier =
                          shipment.courierName ||
                          shipment.courier ||
                          shipment.courierProvider ||
                          shipment.provider ||
                          "—";

                        const awbValue =
                          shipment.awb ||
                          shipment.trackingNumber ||
                          shipment.trackingId ||
                          "Not Generated";

                        return (
                          <tr
                            key={shipment._id}
                            className="transition hover:bg-gray-50/70"
                          >
                            <td className="px-5 py-4">
                              <p className="max-w-[180px] truncate text-sm font-semibold text-gray-900">
                                {shipment._id}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {formatDate(
                                  shipment.createdAt
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-gray-800">
                                {order}
                              </p>

                              {shipment.order
                                ?.totalAmount !==
                                undefined && (
                                  <p className="mt-1 text-xs text-gray-400">
                                    {formatCurrency(
                                      shipment.order
                                        .totalAmount
                                    )}
                                  </p>
                                )}
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-gray-800">
                                {courier}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-gray-800">
                                {awbValue}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                                  status
                                )}`}
                              >
                                {getStatusLabel(
                                  status
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <button
                                onClick={() =>
                                  openShipment(
                                    shipment
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-500">
                Page {currentPage} of{" "}
                {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          page - 1,
                          1
                        )
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          page + 1,
                          totalPages
                        )
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE */}
          <div className="space-y-4 lg:hidden">
            {paginatedShipments.map(
              (shipment) => {
                const status =
                  getShipmentStatus(
                    shipment
                  );

                const order =
                  shipment.orderId ||
                  shipment.order?._id ||
                  "—";

                const courier =
                  shipment.courierName ||
                  shipment.courier ||
                  shipment.courierProvider ||
                  shipment.provider ||
                  "—";

                const awbValue =
                  shipment.awb ||
                  shipment.trackingNumber ||
                  shipment.trackingId ||
                  "Not Generated";

                return (
                  <div
                    key={shipment._id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">
                          Shipment
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                          {shipment._id}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                          status
                        )}`}
                      >
                        {getStatusLabel(
                          status
                        )}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">
                          Order
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-800">
                          {order}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Courier
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {courier}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          AWB
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-800">
                          {awbValue}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {formatDate(
                            shipment.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        openShipment(
                          shipment
                        )
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Eye className="h-4 w-4" />
                      View Shipment
                    </button>
                  </div>
                );
              }
            )}

            <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">
                Page {currentPage} of{" "}
                {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          page - 1,
                          1
                        )
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          page + 1,
                          totalPages
                        )
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHIPMENT DETAILS MODAL */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Shipment
                </p>

                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  Shipment Details
                </h2>
              </div>

              <button
                onClick={closeShipment}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-130px)] overflow-y-auto p-5">
              {detailLoading ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-500" />

                    <p className="mt-3 text-sm text-gray-500">
                      Loading shipment details...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 p-5">
                      <p className="text-xs text-gray-400">
                        Shipment ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {selectedShipment._id}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 p-5">
                      <p className="text-xs text-gray-400">
                        Order ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {selectedShipment.orderId ||
                          selectedShipment.order?._id ||
                          "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 p-5">
                      <p className="text-xs text-gray-400">
                        Courier
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedShipment.courierName ||
                          selectedShipment.courier ||
                          selectedShipment.courierProvider ||
                          selectedShipment.provider ||
                          "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 p-5">
                      <p className="text-xs text-gray-400">
                        Courier Service
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedShipment.courierService ||
                          "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 p-5">
                      <p className="text-xs text-gray-400">
                        AWB
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {selectedShipment.awb ||
                          selectedShipment.trackingNumber ||
                          selectedShipment.trackingId ||
                          "Not Generated"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 p-5">
                      <p className="text-xs text-gray-400">
                        Order Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatCurrency(
                          selectedShipment.order
                            ?.totalAmount || 0
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-500" />

                      <p className="text-sm font-semibold text-gray-900">
                        Delivery Information
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-gray-400">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDate(
                            selectedShipment.createdAt
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Pickup
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDate(
                            selectedShipment.pickupDate ||
                            selectedShipment.pickupScheduledAt
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Estimated Delivery
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDate(
                            selectedShipment.estimatedDeliveryDate ||
                            selectedShipment.estimatedDelivery
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedShipment.shippingAddress && (
                    <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                      <p className="text-sm font-semibold text-gray-900">
                        Shipping Address
                      </p>

                      <div className="mt-3 text-sm leading-6 text-gray-600">
                        {selectedShipment.shippingAddress
                          .name && (
                            <p className="font-medium text-gray-900">
                              {
                                selectedShipment
                                  .shippingAddress
                                  .name
                              }
                            </p>
                          )}

                        {selectedShipment.shippingAddress
                          .phone && (
                            <p>
                              {
                                selectedShipment
                                  .shippingAddress
                                  .phone
                              }
                            </p>
                          )}

                        {selectedShipment.shippingAddress
                          .address && (
                            <p>
                              {
                                selectedShipment
                                  .shippingAddress
                                  .address
                              }
                            </p>
                          )}

                        <p>
                          {[
                            selectedShipment
                              .shippingAddress
                              .city,
                            selectedShipment
                              .shippingAddress
                              .state,
                            selectedShipment
                              .shippingAddress
                              .pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                    <p className="text-sm font-semibold text-gray-900">
                      Shipment Status
                    </p>

                    <div className="mt-3">
                      <select
                        value={getShipmentStatus(
                          selectedShipment
                        )}
                        onChange={(event) =>
                          updateShipmentStatus(
                            event.target.value
                          )
                        }
                        disabled={
                          updatingStatus
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.filter(
                          (item) =>
                            item.value !==
                            "all"
                        ).map(
                          (status) => (
                            <option
                              key={
                                status.value
                              }
                              value={
                                status.value
                              }
                            >
                              {status.label}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {statusMessage && (
                      <div className="mt-4 rounded-xl bg-gray-50 p-4">
                        <div className="flex items-start gap-2">
                          {statusMessage.includes(
                            "successfully"
                          ) ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="mt-0.5 h-4 w-4 text-red-600" />
                          )}

                          <p className="text-sm text-gray-600">
                            {statusMessage}
                          </p>
                        </div>
                      </div>
                    )}

                    {getNextStatus(
                      getShipmentStatus(
                        selectedShipment
                      )
                    ) && (
                        <button
                          onClick={() =>
                            updateShipmentStatus(
                              getNextStatus(
                                getShipmentStatus(
                                  selectedShipment
                                )
                              )!
                            )
                          }
                          disabled={
                            updatingStatus
                          }
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                          {updatingStatus ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ArrowRight className="h-4 w-4" />
                          )}

                          Move to{" "}
                          {getStatusLabel(
                            getNextStatus(
                              getShipmentStatus(
                                selectedShipment
                              )
                            )!
                          )}
                        </button>
                      )}
                  </div>

                  {selectedShipment.notes && (
                    <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                      <p className="text-sm font-semibold text-gray-900">
                        Notes
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {selectedShipment.notes}
                      </p>
                    </div>
                  )}

                  {selectedShipment.labelUrl && (
                    <a
                      href={
                        selectedShipment.labelUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="h-4 w-4" />
                      Open Shipping Label
                    </a>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end border-t border-gray-100 px-5 py-4">
              <button
                onClick={closeShipment}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SHIPMENT MODAL */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Shipping
                </p>

                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  Create Shipment
                </h2>
              </div>

              <button
                onClick={() =>
                  setCreateOpen(false)
                }
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <label className="text-sm font-medium text-gray-800">
                  Order ID
                </label>

                <input
                  type="text"
                  value={orderId}
                  onChange={(event) =>
                    setOrderId(
                      event.target.value
                    )
                  }
                  placeholder="Enter order ID"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">
                  Courier
                </label>

                <input
                  type="text"
                  value={courierName}
                  onChange={(event) =>
                    setCourierName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Delhivery"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">
                  AWB / Tracking Number
                </label>

                <input
                  type="text"
                  value={awb}
                  onChange={(event) =>
                    setAwb(
                      event.target.value
                    )
                  }
                  placeholder="Optional"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  onClick={() => {
                    setCreateOpen(false);
                    setOrderId("");
                    setCourierName("");
                    setAwb("");
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={createShipment}
                  disabled={
                    creatingShipment ||
                    !orderId.trim()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {creatingShipment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}

                  Create Shipment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}