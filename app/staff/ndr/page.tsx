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

type NdrStatus =
  | "open"
  | "contacted"
  | "reattempt_scheduled"
  | "reattempted"
  | "resolved"
  | "rto_initiated"
  | "closed"
  | string;

type NdrRecord = {
  _id: string;

  shipment?: {
    _id?: string;
    awb?: string;
    trackingNumber?: string;
    courier?: string;
    courierName?: string;
    courierProvider?: string;
    courierService?: string;
    shipmentStatus?: string;
    status?: string;
  } | null;

  order?: {
    _id?: string;
    totalAmount?: number;
    paymentStatus?: string;
    orderStatus?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;

  user?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  } | null;

  orderId?: string;

  shipmentId?: string;

  awb?: string;

  trackingNumber?: string;

  courier?: string;

  courierName?: string;

  provider?: string;

  status?: NdrStatus;

  ndrStatus?: NdrStatus;

  reason?: string;

  ndrReason?: string;

  description?: string;

  remarks?: string;

  note?: string;

  notes?: string;

  attemptNumber?: number;

  attemptCount?: number;

  attempts?: number;

  customerContacted?: boolean;

  customerResponse?: string;

  customer?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  } | null;

  customerName?: string;

  customerPhone?: string;

  customerEmail?: string;

  phone?: string;

  shippingAddress?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  resolution?: string;

  createdAt?: string;

  updatedAt?: string;

  nextAttemptDate?: string;

  lastAttemptDate?: string;
};

type NdrListResponse = {
  success: boolean;
  ndrs?: NdrRecord[];
  data?: NdrRecord[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  total?: number;
  message?: string;
};

type NdrDetailsResponse = {
  success: boolean;
  ndr?: NdrRecord;
  data?: NdrRecord;
  message?: string;
};

type NdrUpdateResponse = {
  success: boolean;
  ndr?: NdrRecord;
  data?: NdrRecord;
  message?: string;
};

/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "open",
    label: "Open",
  },
  {
    value: "contacted",
    label: "Contacted",
  },
  {
    value: "reattempt_scheduled",
    label: "Reattempt Scheduled",
  },
  {
    value: "reattempted",
    label: "Reattempted",
  },
  {
    value: "resolved",
    label: "Resolved",
  },
  {
    value: "rto_initiated",
    label: "RTO Initiated",
  },
  {
    value: "closed",
    label: "Closed",
  },
];

const STATUS_FLOW = [
  "open",
  "contacted",
  "reattempt_scheduled",
  "reattempted",
  "resolved",
];

/* =========================================================
   PAGE
========================================================= */

export default function StaffNdrPage() {
  const [ndrs, setNdrs] = useState<NdrRecord[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const ndrsPerPage = 10;

  const [selectedNdr, setSelectedNdr] =
    useState<NdrRecord | null>(null);

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
     JSON RESPONSE
  ========================================================= */

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

  /* =========================================================
     FETCH NDR LIST
  ========================================================= */

  const fetchNdrs = async (
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

      const endpoint = `${API_URL}/staff/ndr`;

      console.log(
        "FETCHING NDR LIST:",
        endpoint
      );

      const response = await fetch(
        endpoint,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        }
      );

      const data =
        await parseJsonResponse<NdrListResponse>(
          response
        );

      console.log(
        "NDR API RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to load NDR records. Status: ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load NDR records."
        );
      }

      setNdrs(
        Array.isArray(data.ndrs)
          ? data.ndrs
          : Array.isArray(data.data)
            ? data.data
            : []
      );
    } catch (error) {
      console.error(
        "STAFF NDR ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load NDR records."
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
    fetchNdrs();
  }, []);

  /* =========================================================
     FETCH SINGLE NDR
  ========================================================= */

  const fetchNdrDetails = async (
    ndrId: string
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
        `${API_URL}/staff/ndr/${ndrId}`;

      console.log(
        "FETCHING NDR DETAILS:",
        endpoint
      );

      const response = await fetch(
        endpoint,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        }
      );

      const data =
        await parseJsonResponse<NdrDetailsResponse>(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to load NDR details. Status: ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "NDR details not found."
        );
      }

      const ndr =
        data.ndr || data.data;

      if (!ndr) {
        throw new Error(
          "NDR details not found."
        );
      }

      setSelectedNdr(ndr);
    } catch (error) {
      console.error(
        "NDR DETAILS ERROR:",
        error
      );

      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to load NDR details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  /* =========================================================
     OPEN NDR
  ========================================================= */

  const openNdr = async (
    ndr: NdrRecord
  ) => {
    setSelectedNdr(ndr);

    await fetchNdrDetails(
      ndr._id
    );
  };

  /* =========================================================
     CLOSE NDR
  ========================================================= */

  const closeNdr = () => {
    setSelectedNdr(null);
    setStatusMessage("");
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getNdrStatus = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.status ||
      ndr.ndrStatus ||
      "open"
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
      case "open":
        return "border-red-100 bg-red-50 text-red-700";

      case "contacted":
        return "border-blue-100 bg-blue-50 text-blue-700";

      case "reattempt_scheduled":
        return "border-purple-100 bg-purple-50 text-purple-700";

      case "reattempted":
        return "border-indigo-100 bg-indigo-50 text-indigo-700";

      case "resolved":
        return "border-green-100 bg-green-50 text-green-700";

      case "rto_initiated":
        return "border-orange-100 bg-orange-50 text-orange-700";

      case "closed":
        return "border-gray-200 bg-gray-100 text-gray-600";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  /* =========================================================
     UPDATE NDR STATUS
  ========================================================= */

  const updateNdrStatus = async (
    status: string
  ) => {
    if (!selectedNdr) {
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
        `${API_URL}/staff/ndr/${selectedNdr._id}/status`;

      console.log(
        "UPDATING NDR STATUS:",
        endpoint,
        status
      );

      const response = await fetch(
        endpoint,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await parseJsonResponse<NdrUpdateResponse>(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to update NDR status. Status: ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to update NDR status."
        );
      }

      const updatedNdr =
        data.ndr || data.data;

      if (updatedNdr) {
        setSelectedNdr(updatedNdr);
      } else {
        setSelectedNdr((current) =>
          current
            ? {
                ...current,
                status,
              }
            : current
        );
      }

      setNdrs((current) =>
        current.map((item) =>
          item._id === selectedNdr._id
            ? updatedNdr || {
                ...item,
                status,
              }
            : item
        )
      );

      setStatusMessage(
        "NDR status updated successfully."
      );
    } catch (error) {
      console.error(
        "UPDATE NDR STATUS ERROR:",
        error
      );

      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to update NDR status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =========================================================
     FORMATTING
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

  /* =========================================================
     HELPERS
  ========================================================= */

  const getOrderId = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.orderId ||
      ndr.order?._id ||
      "—"
    );
  };

  const getAwb = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.awb ||
      ndr.trackingNumber ||
      ndr.shipment?.awb ||
      ndr.shipment?.trackingNumber ||
      "Not Generated"
    );
  };

  const getCourier = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.courierName ||
      ndr.courier ||
      ndr.provider ||
      ndr.shipment?.courierName ||
      ndr.shipment?.courier ||
      ndr.shipment?.courierProvider ||
      "Not Assigned"
    );
  };

  const getCourierService = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.shipment?.courierService ||
      "—"
    );
  };

  const getReason = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.reason ||
      ndr.ndrReason ||
      ndr.remarks ||
      ndr.note ||
      "No reason provided"
    );
  };

  const getDescription = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.description ||
      ndr.notes ||
      "—"
    );
  };

  const getCustomerName = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.customerName ||
      ndr.customer?.name ||
      ndr.user?.name ||
      ndr.shippingAddress?.name ||
      "Unknown Customer"
    );
  };

  const getCustomerPhone = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.customerPhone ||
      ndr.customer?.phone ||
      ndr.user?.phone ||
      ndr.shippingAddress?.phone ||
      ndr.phone ||
      "—"
    );
  };

  const getCustomerEmail = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.customerEmail ||
      ndr.customer?.email ||
      ndr.user?.email ||
      "—"
    );
  };

  const getAttemptCount = (
    ndr: NdrRecord
  ) => {
    return (
      ndr.attemptNumber ??
      ndr.attemptCount ??
      ndr.attempts ??
      0
    );
  };

  /* =========================================================
     SEARCH + FILTER
  ========================================================= */

  const filteredNdrs =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return ndrs.filter(
        (ndr) => {
          const status =
            getNdrStatus(ndr);

          const orderId =
            getOrderId(ndr);

          const awb =
            getAwb(ndr);

          const courier =
            getCourier(ndr);

          const customer =
            getCustomerName(ndr);

          const reason =
            getReason(ndr);

          const matchesSearch =
            !query ||
            orderId
              .toLowerCase()
              .includes(query) ||
            awb
              .toLowerCase()
              .includes(query) ||
            courier
              .toLowerCase()
              .includes(query) ||
            customer
              .toLowerCase()
              .includes(query) ||
            reason
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
      ndrs,
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
        filteredNdrs.length /
          ndrsPerPage
      )
    );

  const paginatedNdrs =
    filteredNdrs.slice(
      (currentPage - 1) *
        ndrsPerPage,
      currentPage *
        ndrsPerPage
    );

  /* =========================================================
     KPI
  ========================================================= */

  const totalNdrs =
    ndrs.length;

  const openNdrs =
    ndrs.filter(
      (ndr) =>
        getNdrStatus(ndr) ===
        "open"
    ).length;

  const reattemptNdrs =
    ndrs.filter(
      (ndr) =>
        getNdrStatus(ndr) ===
          "reattempt_scheduled" ||
        getNdrStatus(ndr) ===
          "reattempted"
    ).length;

  const resolvedNdrs =
    ndrs.filter(
      (ndr) =>
        getNdrStatus(ndr) ===
        "resolved"
    ).length;

  const rtoNdrs =
    ndrs.filter(
      (ndr) =>
        getNdrStatus(ndr) ===
        "rto_initiated"
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
            Unable to load NDR
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              fetchNdrs()
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
     MAIN PAGE
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
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                    Staff NDR
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage non-delivery reports and delivery exceptions.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                fetchNdrs(true)
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
                    Total NDR
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {totalNdrs}
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Open
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {openNdrs}
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
                    Reattempt
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {reattemptNdrs}
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
                    Resolved
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {resolvedNdrs}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

          </div>

          {/* RTO SUMMARY */}

          {rtoNdrs > 0 && (
            <div className="mb-6 rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-orange-600" />

                <div>
                  <p className="text-sm font-semibold text-orange-900">
                    RTO shipments
                  </p>

                  <p className="text-sm text-orange-700">
                    {rtoNdrs} NDR record
                    {rtoNdrs !== 1
                      ? "s"
                      : ""}{" "}
                    marked for return to origin.
                  </p>
                </div>
              </div>
            </div>
          )}

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
                  placeholder="Search order, AWB, courier, customer or reason..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-gray-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400 lg:w-56"
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
                      Courier
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Reason
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Attempts
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
                  {paginatedNdrs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >
                        <AlertCircle className="mx-auto h-10 w-10 text-gray-300" />

                        <p className="mt-4 text-sm font-medium text-gray-700">
                          No NDR records found
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          Try changing your search or status filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedNdrs.map(
                      (ndr) => {
                        const status =
                          getNdrStatus(
                            ndr
                          );

                        return (
                          <tr
                            key={ndr._id}
                            className="border-b border-gray-100 transition hover:bg-gray-50/60"
                          >
                            <td className="px-5 py-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {getOrderId(
                                    ndr
                                  )}
                                </p>

                                {ndr.order
                                  ?.totalAmount !==
                                  undefined && (
                                  <p className="mt-1 text-xs text-gray-400">
                                    {formatCurrency(
                                      ndr
                                        .order
                                        .totalAmount
                                    )}
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-gray-800">
                                {getCustomerName(
                                  ndr
                                )}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {getCustomerPhone(
                                  ndr
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-gray-800">
                                {getCourier(
                                  ndr
                                )}
                              </p>

                              <p className="mt-1 max-w-[180px] truncate text-xs text-gray-400">
                                {getAwb(
                                  ndr
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="max-w-[230px] truncate text-sm text-gray-700">
                                {getReason(
                                  ndr
                                )}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {formatDate(
                                  ndr.createdAt
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                {getAttemptCount(
                                  ndr
                                )}
                              </span>
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
                                  openNdr(
                                    ndr
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
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

            {/* MOBILE CARDS */}

            <div className="grid gap-3 p-3 md:hidden">
              {paginatedNdrs.length === 0 ? (
                <div className="rounded-xl border border-gray-100 p-8 text-center">
                  <AlertCircle className="mx-auto h-9 w-9 text-gray-300" />

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No NDR records found
                  </p>
                </div>
              ) : (
                paginatedNdrs.map(
                  (ndr) => {
                    const status =
                      getNdrStatus(
                        ndr
                      );

                    return (
                      <div
                        key={ndr._id}
                        className="rounded-2xl border border-gray-100 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {getOrderId(
                                ndr
                              )}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {formatDate(
                                ndr.createdAt
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
                                ndr
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400">
                              Courier
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {getCourier(
                                ndr
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400">
                              AWB
                            </p>

                            <p className="mt-1 break-all text-sm font-medium text-gray-700">
                              {getAwb(
                                ndr
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400">
                              Attempts
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {getAttemptCount(
                                ndr
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl bg-red-50 p-3">
                          <p className="text-xs font-medium text-red-500">
                            Reason
                          </p>

                          <p className="mt-1 text-sm text-red-700">
                            {getReason(
                              ndr
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            openNdr(
                              ndr
                            )
                          }
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                          <Eye className="h-4 w-4" />
                          View NDR
                        </button>
                      </div>
                    );
                  }
                )
              )}
            </div>

            {/* PAGINATION */}

            {filteredNdrs.length >
              0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {(currentPage -
                      1) *
                      ndrsPerPage +
                      1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(
                      currentPage *
                        ndrsPerPage,
                      filteredNdrs.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {filteredNdrs.length}
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
          NDR DETAILS MODAL
      ===================================================== */}

      {selectedNdr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  NDR Management
                </p>

                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  NDR #
                  {selectedNdr._id.slice(
                    -8
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeNdr}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
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
                      Loading NDR details...
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
                            getNdrStatus(
                              selectedNdr
                            )
                          )}`}
                        >
                          {getStatusLabel(
                            getNdrStatus(
                              selectedNdr
                            )
                          )}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-400">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDateTime(
                            selectedNdr.createdAt
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ORDER + SHIPMENT */}

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />

                        <p className="text-xs text-gray-400">
                          Order ID
                        </p>
                      </div>

                      <p className="mt-2 break-all text-sm font-semibold text-gray-900">
                        {getOrderId(
                          selectedNdr
                        )}
                      </p>

                      {selectedNdr.order
                        ?.totalAmount !==
                        undefined && (
                        <p className="mt-1 text-xs text-gray-500">
                          {formatCurrency(
                            selectedNdr
                              .order
                              .totalAmount
                          )}
                        </p>
                      )}

                      {selectedNdr.order
                        ?.orderStatus && (
                        <p className="mt-2 text-xs text-gray-500">
                          Order status:{" "}
                          <span className="font-medium text-gray-700">
                            {
                              selectedNdr
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
                          selectedNdr
                        )}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Service:{" "}
                        {getCourierService(
                          selectedNdr
                        )}
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-500">
                        AWB:{" "}
                        {getAwb(
                          selectedNdr
                        )}
                      </p>

                      {selectedNdr
                        .shipment
                        ?.shipmentStatus && (
                        <p className="mt-2 text-xs text-gray-500">
                          Shipment status:{" "}
                          <span className="font-medium text-gray-700">
                            {
                              selectedNdr
                                .shipment
                                .shipmentStatus
                            }
                          </span>
                        </p>
                      )}
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
                            selectedNdr
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        {getCustomerPhone(
                          selectedNdr
                        ) !== "—" ? (
                          <a
                            href={`tel:${getCustomerPhone(
                              selectedNdr
                            )}`}
                            className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
                          >
                            <Phone className="h-3.5 w-3.5" />

                            {getCustomerPhone(
                              selectedNdr
                            )}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm font-medium text-gray-700">
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
                            selectedNdr
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Customer Contacted
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {selectedNdr.customerContacted
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* ADDRESS */}

                  {selectedNdr.shippingAddress && (
                    <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                      <p className="text-sm font-semibold text-gray-900">
                        Delivery Address
                      </p>

                      <div className="mt-3 text-sm leading-6 text-gray-600">

                        {selectedNdr.shippingAddress.name && (
                          <p className="font-medium text-gray-900">
                            {
                              selectedNdr
                                .shippingAddress
                                .name
                            }
                          </p>
                        )}

                        {selectedNdr.shippingAddress.address && (
                          <p>
                            {
                              selectedNdr
                                .shippingAddress
                                .address
                            }
                          </p>
                        )}

                        <p>
                          {[
                            selectedNdr
                              .shippingAddress
                              .city,

                            selectedNdr
                              .shippingAddress
                              .state,

                            selectedNdr
                              .shippingAddress
                              .pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* NDR REASON */}

                  <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                      <div>
                        <p className="text-sm font-semibold text-red-900">
                          NDR Reason
                        </p>

                        <p className="mt-2 text-sm leading-6 text-red-700">
                          {getReason(
                            selectedNdr
                          )}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-red-700">
                          {getDescription(
                            selectedNdr
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMER RESPONSE */}

                  {selectedNdr.customerResponse && (
                    <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                      <p className="text-sm font-semibold text-blue-900">
                        Customer Response
                      </p>

                      <p className="mt-2 text-sm leading-6 text-blue-700">
                        {
                          selectedNdr.customerResponse
                        }
                      </p>
                    </div>
                  )}

                  {/* ATTEMPTS */}

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-400">
                        Delivery Attempts
                      </p>

                      <p className="mt-2 text-xl font-semibold text-gray-900">
                        {getAttemptCount(
                          selectedNdr
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-400">
                        Last Attempt
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-700">
                        {formatDate(
                          selectedNdr.lastAttemptDate
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs text-gray-400">
                        Next Attempt
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-700">
                        {formatDate(
                          selectedNdr.nextAttemptDate
                        )}
                      </p>
                    </div>

                  </div>

                  {/* RESOLUTION */}

                  {selectedNdr.resolution && (
                    <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-5">
                      <p className="text-sm font-semibold text-green-900">
                        Resolution
                      </p>

                      <p className="mt-2 text-sm leading-6 text-green-700">
                        {
                          selectedNdr.resolution
                        }
                      </p>
                    </div>
                  )}

                  {/* STATUS UPDATE */}

                  <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                    <p className="text-sm font-semibold text-gray-900">
                      Update NDR Status
                    </p>

                    <select
                      value={getNdrStatus(
                        selectedNdr
                      )}
                      onChange={(event) =>
                        updateNdrStatus(
                          event.target.value
                        )
                      }
                      disabled={
                        updatingStatus
                      }
                      className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
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
                      getNdrStatus(
                        selectedNdr
                      )
                    ) && (
                      <button
                        type="button"
                        onClick={() =>
                          updateNdrStatus(
                            getNextStatus(
                              getNdrStatus(
                                selectedNdr
                              )
                            )!
                          )
                        }
                        disabled={
                          updatingStatus
                        }
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
                            getNdrStatus(
                              selectedNdr
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
                onClick={closeNdr}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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