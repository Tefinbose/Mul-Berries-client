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

type ShipmentStatus =
  | "created"
  | "assigned"
  | "awb_generated"
  | "label_generated"
  | "pickup_scheduled"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed";

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
  provider?: string;

  awb?: string;
  trackingNumber?: string;
  trackingId?: string;

  labelUrl?: string;

  status?: ShipmentStatus | string;
  shipmentStatus?: ShipmentStatus | string;
  trackingStatus?: string;

  pickupDate?: string;
  estimatedDelivery?: string;
  deliveryDate?: string;

  createdAt?: string;
  updatedAt?: string;

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
  data?: Shipment[];
  total?: number;
  message?: string;
};

type ShipmentDetailsResponse = {
  success: boolean;
  shipment?: Shipment;
  data?: Shipment;
  message?: string;
};

type CreateShipmentResponse = {
  success: boolean;
  shipment?: Shipment;
  data?: Shipment;
  message?: string;
};

type UpdateShipmentResponse = {
  success: boolean;
  shipment?: Shipment;
  data?: Shipment;
  message?: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "created", label: "Created" },
  { value: "assigned", label: "Assigned" },
  { value: "awb_generated", label: "AWB Generated" },
  { value: "label_generated", label: "Label Generated" },
  {
    value: "pickup_scheduled",
    label: "Pickup Scheduled",
  },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  {
    value: "out_for_delivery",
    label: "Out for Delivery",
  },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "failed", label: "Failed" },
];

const STATUS_FLOW = [
  "created",
  "assigned",
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
  const shipmentsPerPage = 10;

  const [selectedShipment, setSelectedShipment] =
    useState<Shipment | null>(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

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

  const parseJsonResponse = async <T,>(
    response: Response
  ): Promise<T> => {
    const text = await response.text();

    const contentType =
      response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      throw new Error(
        "Server returned an invalid response."
      );
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(
        "Server returned invalid JSON."
      );
    }
  };

  // --------------------------------------------------
  // GET ALL SHIPMENTS
  // --------------------------------------------------

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
        `${API_URL}/api/staff/shipments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load shipments. Status: ${response.status}`
        );
      }

      const data =
        await parseJsonResponse<ShipmentListResponse>(
          response
        );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load shipments."
        );
      }

      setShipments(
        data.shipments ||
          data.data ||
          []
      );
    } catch (err) {
      console.error(
        "STAFF SHIPPING ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
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

  // --------------------------------------------------
  // GET SINGLE SHIPMENT
  // --------------------------------------------------

  const fetchShipmentDetails = async (
    shipmentId: string
  ) => {
    try {
      setDetailsLoading(true);
      setStatusMessage("");

      const token = getToken();

      if (!token) {
        setStatusMessage(
          "Authentication token not found."
        );
        return;
      }

      console.log(
        "FETCHING SHIPMENT DETAILS:",
        `${API_URL}/api/staff/shipments/${shipmentId}`
      );

      const response = await fetch(
        `${API_URL}/api/staff/shipments/${shipmentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load shipment details. Status: ${response.status}`
        );
      }

      const data =
        await parseJsonResponse<ShipmentDetailsResponse>(
          response
        );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Shipment details not found."
        );
      }

      const shipment =
        data.shipment || data.data;

      if (!shipment) {
        throw new Error(
          "Shipment details not found."
        );
      }

      setSelectedShipment(shipment);
    } catch (err) {
      console.error(
        "SHIPMENT DETAILS ERROR:",
        err
      );

      setStatusMessage(
        err instanceof Error
          ? err.message
          : "Failed to load shipment details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // --------------------------------------------------
  // OPEN SHIPMENT MODAL
  // IMPORTANT:
  // DO NOT router.push("/staff/shipments/:id")
  // --------------------------------------------------

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

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const getShipmentStatus = (
    shipment: Shipment
  ) => {
    return (
      shipment.status ||
      shipment.shipmentStatus ||
      shipment.trackingStatus ||
      "created"
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
      case "failed":
        return "border-red-100 bg-red-50 text-red-700";

      case "awb_generated":
      case "label_generated":
        return "border-cyan-100 bg-cyan-50 text-cyan-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  // --------------------------------------------------
  // UPDATE SHIPMENT STATUS
  // --------------------------------------------------

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
        `${API_URL}/api/staff/shipments/${selectedShipment._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update shipment status. Status: ${response.status}`
        );
      }

      const data =
        await parseJsonResponse<UpdateShipmentResponse>(
          response
        );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to update shipment status."
        );
      }

      const updatedShipment =
        data.shipment || data.data;

      if (updatedShipment) {
        setSelectedShipment(
          updatedShipment
        );
      }

      setStatusMessage(
        "Shipment status updated successfully."
      );

      await fetchShipments(true);
    } catch (err) {
      console.error(
        "UPDATE SHIPMENT STATUS ERROR:",
        err
      );

      setStatusMessage(
        err instanceof Error
          ? err.message
          : "Failed to update shipment status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // --------------------------------------------------
  // CREATE SHIPMENT
  // --------------------------------------------------

  const createShipment = async () => {
    if (!orderId.trim()) {
      setError("Order ID is required.");
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

      const body: {
        orderId: string;
        courier?: string;
        courierName?: string;
        awb?: string;
      } = {
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
        `${API_URL}/api/staff/shipments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to create shipment. Status: ${response.status}`
        );
      }

      const data =
        await parseJsonResponse<CreateShipmentResponse>(
          response
        );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to create shipment."
        );
      }

      setCreateOpen(false);
      setOrderId("");
      setCourierName("");
      setAwb("");

      await fetchShipments(true);
    } catch (err) {
      console.error(
        "CREATE SHIPMENT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create shipment."
      );
    } finally {
      setCreatingShipment(false);
    }
  };

  // --------------------------------------------------
  // FORMATTING
  // --------------------------------------------------

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

    if (
      Number.isNaN(parsed.getTime())
    ) {
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

  const formatDateTime = (
    date?: string
  ) => {
    if (!date) {
      return "—";
    }

    const parsed = new Date(date);

    if (
      Number.isNaN(parsed.getTime())
    ) {
      return "—";
    }

    return parsed.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const filteredShipments = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return shipments.filter(
      (shipment) => {
        const status =
          getShipmentStatus(
            shipment
          );

        const order =
          shipment.orderId ||
          shipment.order?._id ||
          "";

        const shipmentAwb =
          shipment.awb ||
          shipment.trackingNumber ||
          shipment.trackingId ||
          "";

        const courier =
          shipment.courierName ||
          shipment.courier ||
          shipment.provider ||
          "";

        const matchesSearch =
          !query ||
          order
            .toLowerCase()
            .includes(query) ||
          shipmentAwb
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
        shipmentsPerPage
    )
  );

  const paginatedShipments =
    filteredShipments.slice(
      (currentPage - 1) *
        shipmentsPerPage,
      currentPage *
        shipmentsPerPage
    );

  // --------------------------------------------------
  // KPI
  // --------------------------------------------------

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
      (shipment) => {
        const status =
          getShipmentStatus(
            shipment
          );

        return [
          "picked_up",
          "in_transit",
          "out_for_delivery",
        ].includes(status);
      }
    ).length;

  const pendingShipments =
    shipments.filter(
      (shipment) => {
        const status =
          getShipmentStatus(
            shipment
          );

        return [
          "created",
          "assigned",
          "awb_generated",
          "label_generated",
          "pickup_scheduled",
        ].includes(status);
      }
    ).length;

  // --------------------------------------------------
  // NEXT STATUS
  // --------------------------------------------------

  const getNextStatus = (
    currentStatus: string
  ) => {
    const index =
      STATUS_FLOW.indexOf(
        currentStatus
      );

    if (
      index === -1 ||
      index >=
        STATUS_FLOW.length - 1
    ) {
      return null;
    }

    return STATUS_FLOW[index + 1];
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

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

          <div className="h-[600px] animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-red-900">
                  Unable to load shipments
                </h2>

                <p className="mt-2 text-sm text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fetchShipments()
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <>
      <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}

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
                type="button"
                onClick={() =>
                  fetchShipments(true)
                }
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}

                Refresh
              </button>

              <button
                type="button"
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

          {/* KPI Cards */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
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
                  <p className="text-sm font-medium text-gray-500">
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
                  <p className="text-sm font-medium text-gray-500">
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
                  <p className="text-sm font-medium text-gray-500">
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

          {/* Filters */}

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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
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

          {/* Shipment Table */}

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            <div className="border-b border-gray-100 px-5 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Shipments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredShipments.length} shipment
                {filteredShipments.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

            {paginatedShipments.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <Truck className="h-6 w-6 text-gray-400" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  No shipments found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or status filter.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">

                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70 text-left">

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Shipment
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Order
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Courier
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          AWB / Tracking
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Action
                        </th>

                      </tr>
                    </thead>

                    <tbody>
                      {paginatedShipments.map(
                        (shipment) => {
                          const status =
                            getShipmentStatus(
                              shipment
                            );

                          const orderId =
                            shipment.orderId ||
                            shipment.order?._id ||
                            "—";

                          const courier =
                            shipment.courierName ||
                            shipment.courier ||
                            shipment.provider ||
                            "Not Assigned";

                          const shipmentAwb =
                            shipment.awb ||
                            shipment.trackingNumber ||
                            shipment.trackingId ||
                            "Not Generated";

                          return (
                            <tr
                              key={shipment._id}
                              className="border-b border-gray-50 transition hover:bg-gray-50/70"
                            >

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">

                                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                                    <Truck className="h-5 w-5 text-gray-500" />
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      Shipment #
                                      {shipment._id.slice(-8)}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                      {formatDate(
                                        shipment.createdAt
                                      )}
                                    </p>
                                  </div>

                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {orderId}
                                </p>

                                {shipment.order
                                  ?.totalAmount !==
                                  undefined && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    {formatCurrency(
                                      shipment.order.totalAmount
                                    )}
                                  </p>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {courier}
                                </p>
                              </td>

                              <td className="px-5 py-4">
                                <p className="max-w-[180px] truncate text-sm font-medium text-gray-900">
                                  {shipmentAwb}
                                </p>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                                    status
                                  )}`}
                                >
                                  {getStatusLabel(
                                    status
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-right">

                                {/* IMPORTANT:
                                    This opens the modal.
                                    It does NOT navigate to
                                    /staff/shipments/:id
                                */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    openShipment(
                                      shipment
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                  <Eye className="h-4 w-4" />
                                  Manage
                                </button>

                              </td>

                            </tr>
                          );
                        }
                      )}
                    </tbody>

                  </table>
                </div>

                {/* Pagination */}

                <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium text-gray-700">
                      {filteredShipments.length ===
                      0
                        ? 0
                        : (currentPage - 1) *
                            shipmentsPerPage +
                          1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-700">
                      {Math.min(
                        currentPage *
                          shipmentsPerPage,
                        filteredShipments.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">
                      {filteredShipments.length}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <span className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white">
                      {currentPage} /{" "}
                      {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1
                            )
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>

                  </div>

                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          SHIPMENT DETAILS MODAL
          ===================================================== */}

      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Shipment Management
                </p>

                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  Shipment #
                  {selectedShipment._id.slice(
                    -8
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeShipment}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Modal Body */}

            <div className="overflow-y-auto p-5">

              {detailsLoading ? (
                <div className="flex min-h-[350px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-500" />

                    <p className="mt-3 text-sm text-gray-500">
                      Loading shipment details...
                    </p>
                  </div>
                </div>
              ) : (
                <>

                  {/* Status */}

                  <div className="rounded-2xl bg-gray-50 p-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-sm text-gray-500">
                          Current Status
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusClasses(
                            getShipmentStatus(
                              selectedShipment
                            )
                          )}`}
                        >
                          {getStatusLabel(
                            getShipmentStatus(
                              selectedShipment
                            )
                          )}
                        </span>
                      </div>

                      <div>
                        <p className="text-right text-xs text-gray-400">
                          Last Updated
                        </p>

                        <p className="mt-1 text-right text-sm font-medium text-gray-700">
                          {formatDateTime(
                            selectedShipment.updatedAt
                          )}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Shipment Info */}

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-400">
                        Order ID
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedShipment.orderId ||
                          selectedShipment.order?._id ||
                          "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
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

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-400">
                        Courier
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedShipment.courierName ||
                          selectedShipment.courier ||
                          selectedShipment.provider ||
                          "Not Assigned"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-400">
                        AWB / Tracking
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {selectedShipment.awb ||
                          selectedShipment.trackingNumber ||
                          selectedShipment.trackingId ||
                          "Not Generated"}
                      </p>
                    </div>

                  </div>

                  {/* Delivery Information */}

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
                          Pickup
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDate(
                            selectedShipment.pickupDate
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Estimated Delivery
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDate(
                            selectedShipment.estimatedDelivery
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Delivered
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDate(
                            selectedShipment.deliveryDate
                          )}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Shipping Address */}

                  {selectedShipment.shippingAddress && (
                    <div className="mt-5 rounded-2xl border border-gray-100 p-5">

                      <p className="text-sm font-semibold text-gray-900">
                        Shipping Address
                      </p>

                      <div className="mt-3 text-sm leading-6 text-gray-600">

                        {selectedShipment.shippingAddress.name && (
                          <p className="font-medium text-gray-900">
                            {
                              selectedShipment
                                .shippingAddress
                                .name
                            }
                          </p>
                        )}

                        {selectedShipment.shippingAddress.phone && (
                          <p>
                            {
                              selectedShipment
                                .shippingAddress
                                .phone
                            }
                          </p>
                        )}

                        {selectedShipment.shippingAddress.address && (
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

                  {/* Status Update */}

                  <div className="mt-5 rounded-2xl border border-gray-100 p-5">

                    <p className="text-sm font-semibold text-gray-900">
                      Update Shipment Status
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
                        disabled={updatingStatus}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.filter(
                          (item) =>
                            item.value !==
                            "all"
                        ).map(
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

                    {statusMessage && (
                      <div className="mt-4 rounded-xl bg-gray-50 p-4">
                        <div className="flex items-start gap-2">

                          {statusMessage.includes(
                            "successfully"
                          ) ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                          ) : (
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
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
                        type="button"
                        onClick={() =>
                          updateShipmentStatus(
                            getNextStatus(
                              getShipmentStatus(
                                selectedShipment
                              )
                            )!
                          )
                        }
                        disabled={updatingStatus}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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

                  {/* Shipping Label */}

                  {selectedShipment.labelUrl && (
                    <a
                      href={
                        selectedShipment.labelUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Package className="h-4 w-4" />
                      Open Shipping Label
                    </a>
                  )}

                </>
              )}

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={closeShipment}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          CREATE SHIPMENT MODAL
          ===================================================== */}

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Shipping
                </p>

                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  Create Shipment
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCreateOpen(false);
                  setOrderId("");
                  setCourierName("");
                  setAwb("");
                }}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
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
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
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
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
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
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => {
                    setCreateOpen(false);
                    setOrderId("");
                    setCourierName("");
                    setAwb("");
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createShipment}
                  disabled={
                    creatingShipment ||
                    !orderId.trim()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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