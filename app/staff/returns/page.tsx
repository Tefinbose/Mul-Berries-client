"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Loader2,
  Package,
  Phone,
  RefreshCw,
  Search,
  Truck,
  User,
  X,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mull-berries-server.onrender.com/api";

/* =========================================================
   TYPES
========================================================= */

type ReturnRecord = {
  _id: string;

  order?: {
    _id?: string;
    totalAmount?: number;
    paymentStatus?: string;
    orderStatus?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;

  shipment?: {
    _id?: string;
    awb?: string;
    awbNumber?: string;
    trackingNumber?: string;
    courierName?: string;
    courierProvider?: string;
    courierService?: string;
    shipmentStatus?: string;
  } | null;

  user?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  } | null;

  customer?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  } | null;

  orderId?: string;

  shipmentId?: string;

  returnStatus?: string;

  status?: string;

  returnReason?: string;

  reason?: string;

  description?: string;

  notes?: string;

  resolution?: string;

  refundStatus?: string;

  refundAmount?: number;

  refundMethod?: string;

  returnType?: string;

  condition?: string;

  pickupStatus?: string;

  pickupDate?: string;

  receivedDate?: string;

  inspectedDate?: string;

  createdAt?: string;

  updatedAt?: string;

  requestedAt?: string;

  shippingAddress?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
};

type ReturnListResponse = {
  success: boolean;
  returns?: ReturnRecord[];
  data?: ReturnRecord[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  message?: string;
};

type ReturnDetailsResponse = {
  success: boolean;
  return?: ReturnRecord;
  data?: ReturnRecord;
  message?: string;
};

type ReturnUpdateResponse = {
  success: boolean;
  return?: ReturnRecord;
  data?: ReturnRecord;
  message?: string;
};

/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "requested",
    label: "Requested",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "pickup_scheduled",
    label: "Pickup Scheduled",
  },
  {
    value: "picked_up",
    label: "Picked Up",
  },
  {
    value: "in_transit",
    label: "In Transit",
  },
  {
    value: "received",
    label: "Received",
  },
  {
    value: "inspected",
    label: "Inspected",
  },
  {
    value: "refund_pending",
    label: "Refund Pending",
  },
  {
    value: "refunded",
    label: "Refunded",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

const STATUS_FLOW = [
  "requested",
  "approved",
  "pickup_scheduled",
  "picked_up",
  "in_transit",
  "received",
  "inspected",
  "refund_pending",
  "refunded",
];

/* =========================================================
   PAGE
========================================================= */

export default function StaffReturnsPage() {
  const [returns, setReturns] =
    useState<ReturnRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const returnsPerPage = 10;

  const [selectedReturn, setSelectedReturn] =
    useState<ReturnRecord | null>(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [statusMessage, setStatusMessage] =
    useState("");

  /* =========================================================
     TOKEN
  ========================================================= */

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token");
  };

  /* =========================================================
     JSON PARSER
  ========================================================= */

  const parseJsonResponse = async <T,>(
    response: Response
  ): Promise<T> => {
    const text =
      await response.text();

    const contentType =
      response.headers.get(
        "content-type"
      );

    if (
      !contentType?.includes(
        "application/json"
      )
    ) {
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

  /* =========================================================
     FETCH RETURNS
  ========================================================= */

  const fetchReturns = async (
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
        setError(
          "Authentication token not found."
        );
        return;
      }

      const endpoint =
        `${API_URL}/staff/returns`;

      console.log(
        "FETCHING RETURNS:",
        endpoint
      );

      const response =
        await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        });

      const data =
        await parseJsonResponse<ReturnListResponse>(
          response
        );

      console.log(
        "STAFF RETURNS RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to load returns. Status: ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load returns."
        );
      }

      setReturns(
        Array.isArray(data.returns)
          ? data.returns
          : Array.isArray(data.data)
            ? data.data
            : []
      );
    } catch (error) {
      console.error(
        "STAFF RETURNS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load returns."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchReturns();
  }, []);

  /* =========================================================
     FETCH RETURN DETAILS
  ========================================================= */

  const fetchReturnDetails = async (
    returnId: string
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

      const endpoint =
        `${API_URL}/staff/returns/${returnId}`;

      console.log(
        "FETCHING RETURN DETAILS:",
        endpoint
      );

      const response =
        await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        });

      const data =
        await parseJsonResponse<ReturnDetailsResponse>(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to load return details. Status: ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Return details not found."
        );
      }

      const returnRecord =
        data.return ||
        data.data;

      if (!returnRecord) {
        throw new Error(
          "Return details not found."
        );
      }

      setSelectedReturn(
        returnRecord
      );
    } catch (error) {
      console.error(
        "RETURN DETAILS ERROR:",
        error
      );

      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to load return details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  /* =========================================================
     OPEN RETURN
  ========================================================= */

  const openReturn = async (
    returnRecord: ReturnRecord
  ) => {
    setSelectedReturn(
      returnRecord
    );

    await fetchReturnDetails(
      returnRecord._id
    );
  };

  /* =========================================================
     CLOSE
  ========================================================= */

  const closeReturn = () => {
    setSelectedReturn(null);
    setStatusMessage("");
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getReturnStatus = (
    returnRecord: ReturnRecord
  ) => {
    return (
      returnRecord.returnStatus ||
      returnRecord.status ||
      "requested"
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
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  };

  const getStatusClasses = (
    status: string
  ) => {
    switch (status) {
      case "requested":
        return "border-yellow-100 bg-yellow-50 text-yellow-700";

      case "approved":
        return "border-blue-100 bg-blue-50 text-blue-700";

      case "pickup_scheduled":
        return "border-purple-100 bg-purple-50 text-purple-700";

      case "picked_up":
        return "border-indigo-100 bg-indigo-50 text-indigo-700";

      case "in_transit":
        return "border-cyan-100 bg-cyan-50 text-cyan-700";

      case "received":
        return "border-teal-100 bg-teal-50 text-teal-700";

      case "inspected":
        return "border-violet-100 bg-violet-50 text-violet-700";

      case "refund_pending":
        return "border-orange-100 bg-orange-50 text-orange-700";

      case "refunded":
        return "border-green-100 bg-green-50 text-green-700";

      case "rejected":
      case "cancelled":
        return "border-red-100 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const updateReturnStatus = async (
    status: string
  ) => {
    if (!selectedReturn) {
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

      const endpoint =
        `${API_URL}/staff/returns/${selectedReturn._id}/status`;

      console.log(
        "UPDATING RETURN STATUS:",
        endpoint,
        status
      );

      const response =
        await fetch(endpoint, {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        });

      const data =
        await parseJsonResponse<ReturnUpdateResponse>(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to update return status. Status: ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to update return status."
        );
      }

      const updatedReturn =
        data.return ||
        data.data;

      if (updatedReturn) {
        setSelectedReturn(
          updatedReturn
        );

        setReturns((current) =>
          current.map((item) =>
            item._id ===
            selectedReturn._id
              ? updatedReturn
              : item
          )
        );
      } else {
        setSelectedReturn(
          (current) =>
            current
              ? {
                  ...current,
                  status,
                  returnStatus: status,
                }
              : current
        );

        setReturns((current) =>
          current.map((item) =>
            item._id ===
            selectedReturn._id
              ? {
                  ...item,
                  status,
                  returnStatus: status,
                }
              : item
          )
        );
      }

      setStatusMessage(
        "Return status updated successfully."
      );
    } catch (error) {
      console.error(
        "UPDATE RETURN STATUS ERROR:",
        error
      );

      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to update return status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

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

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
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

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
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

  const getOrderId = (
    returnRecord: ReturnRecord
  ) => {
    return (
      returnRecord.orderId ||
      returnRecord.order?._id ||
      "—"
    );
  };

  const getReason = (
    returnRecord: ReturnRecord
  ) => {
    return (
      returnRecord.returnReason ||
      returnRecord.reason ||
      "No reason provided"
    );
  };

  const getCustomerName = (
    returnRecord: ReturnRecord
  ) => {
    return (
      returnRecord.customer?.name ||
      returnRecord.user?.name ||
      returnRecord.shippingAddress?.name ||
      "Unknown Customer"
    );
  };

  const getCustomerPhone = (
    returnRecord: ReturnRecord
  ) => {
    return (
      returnRecord.customer?.phone ||
      returnRecord.user?.phone ||
      returnRecord.shippingAddress?.phone ||
      "—"
    );
  };

  const getCustomerEmail = (
    returnRecord: ReturnRecord
  ) => {
    return (
      returnRecord.customer?.email ||
      returnRecord.user?.email ||
      "—"
    );
  };

  const getAwb = (
    returnRecord: ReturnRecord
  ) => {
    return (
      returnRecord.shipment?.awb ||
      returnRecord.shipment?.awbNumber ||
      returnRecord.shipment?.trackingNumber ||
      "Not Generated"
    );
  };

  const getCourier = (
    returnRecord: ReturnRecord
  ) => {
    return (
      returnRecord.shipment
        ?.courierName ||
      returnRecord.shipment
        ?.courierProvider ||
      "Not Assigned"
    );
  };

  /* =========================================================
     SEARCH + FILTER
  ========================================================= */

  const filteredReturns =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return returns.filter(
        (returnRecord) => {
          const status =
            getReturnStatus(
              returnRecord
            );

          const orderId =
            getOrderId(
              returnRecord
            );

          const customer =
            getCustomerName(
              returnRecord
            );

          const reason =
            getReason(
              returnRecord
            );

          const awb =
            getAwb(
              returnRecord
            );

          const matchesSearch =
            !query ||
            orderId
              .toLowerCase()
              .includes(query) ||
            customer
              .toLowerCase()
              .includes(query) ||
            reason
              .toLowerCase()
              .includes(query) ||
            awb
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter ===
              "all" ||
            status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      returns,
      search,
      statusFilter,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
  ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredReturns.length /
          returnsPerPage
      )
    );

  const paginatedReturns =
    filteredReturns.slice(
      (currentPage - 1) *
        returnsPerPage,
      currentPage *
        returnsPerPage
    );

  /* =========================================================
     KPI
  ========================================================= */

  const totalReturns =
    returns.length;

  const requestedReturns =
    returns.filter(
      (item) =>
        getReturnStatus(
          item
        ) === "requested"
    ).length;

  const processingReturns =
    returns.filter(
      (item) =>
        [
          "approved",
          "pickup_scheduled",
          "picked_up",
          "in_transit",
          "received",
          "inspected",
          "refund_pending",
        ].includes(
          getReturnStatus(item)
        )
    ).length;

  const refundedReturns =
    returns.filter(
      (item) =>
        getReturnStatus(
          item
        ) === "refunded"
    ).length;

  /* =========================================================
     NEXT STATUS
  ========================================================= */

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

    return STATUS_FLOW[
      index + 1
    ];
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
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
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Unable to load returns
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              fetchReturns()
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <>
      <main className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-black p-2.5">
                  <Package className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                    Staff Returns
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage customer return requests and refund processing.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                fetchReturns(true)
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
          </div>

          {/* KPI */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Returns
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {totalReturns}
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
                    Requested
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {requestedReturns}
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
                    Processing
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {processingReturns}
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
                    Refunded
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {refundedReturns}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

          </div>

          {/* FILTERS */}

          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search order, customer, AWB or reason..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-gray-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400 lg:w-60"
              >
                {STATUS_OPTIONS.map(
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
          </div>

          {/* TABLE */}

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Order
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Reason
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Refund
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedReturns.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-16 text-center"
                      >
                        <Package className="mx-auto h-10 w-10 text-gray-300" />

                        <p className="mt-4 text-sm font-medium text-gray-700">
                          No returns found
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          Try changing your search or status filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedReturns.map(
                      (returnRecord) => {
                        const status =
                          getReturnStatus(
                            returnRecord
                          );

                        return (
                          <tr
                            key={
                              returnRecord._id
                            }
                            className="border-b border-gray-100 transition hover:bg-gray-50/60"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold text-gray-900">
                                {getOrderId(
                                  returnRecord
                                )}
                              </p>

                              {returnRecord
                                .order
                                ?.totalAmount !==
                                undefined && (
                                <p className="mt-1 text-xs text-gray-400">
                                  {formatCurrency(
                                    returnRecord
                                      .order
                                      .totalAmount
                                  )}
                                </p>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-gray-800">
                                {getCustomerName(
                                  returnRecord
                                )}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {getCustomerPhone(
                                  returnRecord
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="max-w-[250px] truncate text-sm text-gray-700">
                                {getReason(
                                  returnRecord
                                )}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {formatDate(
                                  returnRecord
                                    .createdAt ||
                                    returnRecord
                                      .requestedAt
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold text-gray-800">
                                {returnRecord.refundAmount !==
                                undefined
                                  ? formatCurrency(
                                      returnRecord.refundAmount
                                    )
                                  : "—"}
                              </p>

                              {returnRecord.refundStatus && (
                                <p className="mt-1 text-xs text-gray-400">
                                  {
                                    returnRecord.refundStatus
                                  }
                                </p>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
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
                                type="button"
                                onClick={() =>
                                  openReturn(
                                    returnRecord
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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

            {/* MOBILE */}

            <div className="grid gap-3 p-3 md:hidden">
              {paginatedReturns.map(
                (returnRecord) => {
                  const status =
                    getReturnStatus(
                      returnRecord
                    );

                  return (
                    <div
                      key={
                        returnRecord._id
                      }
                      className="rounded-2xl border border-gray-100 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {getOrderId(
                              returnRecord
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {formatDate(
                              returnRecord.createdAt ||
                                returnRecord.requestedAt
                            )}
                          </p>
                        </div>

                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                            status
                          )}`}
                        >
                          {getStatusLabel(
                            status
                          )}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400">
                            Customer
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {getCustomerName(
                              returnRecord
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Refund
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {returnRecord.refundAmount !==
                            undefined
                              ? formatCurrency(
                                  returnRecord.refundAmount
                                )
                              : "—"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-gray-50 p-3">
                        <p className="text-xs font-medium text-gray-500">
                          Reason
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {getReason(
                            returnRecord
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openReturn(
                            returnRecord
                          )
                        }
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white"
                      >
                        <Eye className="h-4 w-4" />
                        View Return
                      </button>
                    </div>
                  );
                }
              )}

              {paginatedReturns.length ===
                0 && (
                <div className="py-10 text-center">
                  <Package className="mx-auto h-9 w-9 text-gray-300" />

                  <p className="mt-3 text-sm text-gray-500">
                    No returns found.
                  </p>
                </div>
              )}
            </div>

            {/* PAGINATION */}

            {filteredReturns.length >
              0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {(currentPage -
                      1) *
                      returnsPerPage +
                      1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(
                      currentPage *
                        returnsPerPage,
                      filteredReturns.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {filteredReturns.length}
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="px-2 text-sm text-gray-500">
                    Page{" "}
                    <span className="font-medium text-gray-800">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-800">
                      {totalPages}
                    </span>
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Return Management
                </p>

                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  Return #
                  {selectedReturn._id.slice(
                    -8
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeReturn}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}

            <div className="overflow-y-auto p-5">
              {detailsLoading ? (
                <div className="flex min-h-[350px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-500" />

                    <p className="mt-3 text-sm text-gray-500">
                      Loading return details...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* STATUS */}

                  <div className="rounded-2xl bg-gray-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Current Status
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusClasses(
                            getReturnStatus(
                              selectedReturn
                            )
                          )}`}
                        >
                          {getStatusLabel(
                            getReturnStatus(
                              selectedReturn
                            )
                          )}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Requested
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDateTime(
                            selectedReturn.requestedAt ||
                              selectedReturn.createdAt
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ORDER */}

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />

                        <p className="text-xs text-gray-400">
                          Order
                        </p>
                      </div>

                      <p className="mt-2 break-all text-sm font-semibold text-gray-900">
                        {getOrderId(
                          selectedReturn
                        )}
                      </p>

                      {selectedReturn
                        .order
                        ?.totalAmount !==
                        undefined && (
                        <p className="mt-1 text-xs text-gray-500">
                          Order Value:{" "}
                          {formatCurrency(
                            selectedReturn
                              .order
                              .totalAmount
                          )}
                        </p>
                      )}

                      {selectedReturn
                        .order
                        ?.orderStatus && (
                        <p className="mt-2 text-xs text-gray-500">
                          Order Status:{" "}
                          <span className="font-medium text-gray-700">
                            {
                              selectedReturn
                                .order
                                .orderStatus
                            }
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-500" />

                        <p className="text-xs text-gray-400">
                          Courier
                        </p>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {getCourier(
                          selectedReturn
                        )}
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-500">
                        AWB:{" "}
                        {getAwb(
                          selectedReturn
                        )}
                      </p>
                    </div>
                  </div>

                  {/* CUSTOMER */}

                  <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />

                      <p className="text-sm font-semibold text-gray-900">
                        Customer
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-400">
                          Name
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {getCustomerName(
                            selectedReturn
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        {getCustomerPhone(
                          selectedReturn
                        ) !== "—" ? (
                          <a
                            href={`tel:${getCustomerPhone(
                              selectedReturn
                            )}`}
                            className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-gray-700"
                          >
                            <Phone className="h-3.5 w-3.5" />

                            {getCustomerPhone(
                              selectedReturn
                            )}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-gray-700">
                            —
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-700">
                          {getCustomerEmail(
                            selectedReturn
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Return Type
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {selectedReturn.returnType ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* REASON */}

                  <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

                      <div>
                        <p className="text-sm font-semibold text-orange-900">
                          Return Reason
                        </p>

                        <p className="mt-2 text-sm leading-6 text-orange-700">
                          {getReason(
                            selectedReturn
                          )}
                        </p>

                        {selectedReturn.description && (
                          <p className="mt-3 text-sm leading-6 text-orange-700">
                            {
                              selectedReturn.description
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* REFUND */}

                  <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-5">
                    <p className="text-sm font-semibold text-green-900">
                      Refund Information
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-green-600">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-semibold text-green-900">
                          {selectedReturn.refundAmount !==
                          undefined
                            ? formatCurrency(
                                selectedReturn.refundAmount
                              )
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-green-600">
                          Status
                        </p>

                        <p className="mt-1 text-sm font-medium text-green-900">
                          {selectedReturn.refundStatus ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-green-600">
                          Method
                        </p>

                        <p className="mt-1 text-sm font-medium text-green-900">
                          {selectedReturn.refundMethod ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DATES */}

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-400">
                        Pickup
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-700">
                        {formatDate(
                          selectedReturn.pickupDate
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-400">
                        Received
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-700">
                        {formatDate(
                          selectedReturn.receivedDate
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-400">
                        Inspected
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-700">
                        {formatDate(
                          selectedReturn.inspectedDate
                        )}
                      </p>
                    </div>
                  </div>

                  {/* CONDITION */}

                  {selectedReturn.condition && (
                    <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                      <p className="text-sm font-semibold text-gray-900">
                        Product Condition
                      </p>

                      <p className="mt-2 text-sm text-gray-600">
                        {
                          selectedReturn.condition
                        }
                      </p>
                    </div>
                  )}

                  {/* RESOLUTION */}

                  {selectedReturn.resolution && (
                    <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-5">
                      <p className="text-sm font-semibold text-green-900">
                        Resolution
                      </p>

                      <p className="mt-2 text-sm text-green-700">
                        {
                          selectedReturn.resolution
                        }
                      </p>
                    </div>
                  )}

                  {/* STATUS UPDATE */}

                  <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                    <p className="text-sm font-semibold text-gray-900">
                      Update Return Status
                    </p>

                    <select
                      value={getReturnStatus(
                        selectedReturn
                      )}
                      onChange={(event) =>
                        updateReturnStatus(
                          event.target.value
                        )
                      }
                      disabled={
                        updatingStatus
                      }
                      className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400 disabled:opacity-60"
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
                      getReturnStatus(
                        selectedReturn
                      )
                    ) && (
                      <button
                        type="button"
                        onClick={() =>
                          updateReturnStatus(
                            getNextStatus(
                              getReturnStatus(
                                selectedReturn
                              )
                            )!
                          )
                        }
                        disabled={
                          updatingStatus
                        }
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                      >
                        {updatingStatus ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}

                        Move to{" "}
                        {getStatusLabel(
                          getNextStatus(
                            getReturnStatus(
                              selectedReturn
                            )
                          )!
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}

            <div className="flex justify-end border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={closeReturn}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}