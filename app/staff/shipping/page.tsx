"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createStaffShipmentApi,
  getStaffShipmentByIdApi,
  getStaffShipmentsApi,
  ShipmentStatus,
  StaffShipment,
  updateStaffShipmentStatusApi,
} from "@/services/staffApi";

const shipmentStatuses: ShipmentStatus[] = [
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

const statusLabels: Record<ShipmentStatus, string> = {
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

function formatStatus(status: ShipmentStatus) {
  return statusLabels[status] || status;
}

function formatDate(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderId(shipment: StaffShipment) {
  if (typeof shipment.order === "string") {
    return shipment.order;
  }

  return shipment.order?._id || "—";
}

function getCustomerName(shipment: StaffShipment) {
  if (!shipment.user || typeof shipment.user === "string") {
    return "—";
  }

  return shipment.user.name || "—";
}

function getCustomerEmail(shipment: StaffShipment) {
  if (!shipment.user || typeof shipment.user === "string") {
    return "—";
  }

  return shipment.user.email || "—";
}

function statusClass(status: ShipmentStatus) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";

    case "cancelled":
    case "rto":
    case "returned":
      return "bg-red-100 text-red-700";

    case "ndr":
      return "bg-orange-100 text-orange-700";

    case "in_transit":
    case "picked_up":
    case "out_for_delivery":
      return "bg-blue-100 text-blue-700";

    case "courier_assigned":
    case "awb_generated":
    case "label_generated":
    case "pickup_scheduled":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function StaffShippingPage() {
  const [token, setToken] = useState("");

  const [shipments, setShipments] = useState<StaffShipment[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<ShipmentStatus | "all">("all");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [selectedShipment, setSelectedShipment] =
    useState<StaffShipment | null>(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [creatingShipment, setCreatingShipment] =
    useState(false);

  const [createForm, setCreateForm] = useState({
    orderId: "",
    courierName: "",
    courierProvider: "",
    courierService: "",
    estimatedDeliveryDate: "",
    notes: "",
  });

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token");

    if (!storedToken) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    setToken(storedToken);
  }, []);

  const loadShipments = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const response =
        await getStaffShipmentsApi(
          token,
          {
            status:
              statusFilter === "all"
                ? undefined
                : statusFilter,

            search: search.trim() || undefined,

            page,

            limit: 10,
          }
        );

      setShipments(response.shipments);

      setTotalPages(
        response.pagination.totalPages || 1
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load shipments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    const timer = setTimeout(() => {
      loadShipments();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    token,
    page,
    statusFilter,
    search,
  ]);

  const summary = useMemo(() => {
    const total = shipments.length;

    const active = shipments.filter(
      (shipment) =>
        ![
          "delivered",
          "cancelled",
          "returned",
          "rto",
        ].includes(shipment.shipmentStatus)
    ).length;

    const delivered = shipments.filter(
      (shipment) =>
        shipment.shipmentStatus === "delivered"
    ).length;

    const exceptions = shipments.filter(
      (shipment) =>
        shipment.shipmentStatus === "ndr" ||
        shipment.shipmentStatus === "rto"
    ).length;

    return {
      total,
      active,
      delivered,
      exceptions,
    };
  }, [shipments]);

  const handleViewShipment = async (
    id: string
  ) => {
    if (!token) return;

    try {
      setDetailsLoading(true);
      setError("");

      const response =
        await getStaffShipmentByIdApi(
          token,
          id
        );

      setSelectedShipment(
        response.shipment
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load shipment"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: ShipmentStatus
  ) => {
    if (!token) return;

    try {
      setUpdatingStatus(true);
      setError("");
      setSuccessMessage("");

      const response =
        await updateStaffShipmentStatusApi(
          token,
          id,
          newStatus
        );

      setSuccessMessage(
        response.message
      );

      setSelectedShipment(
        response.shipment
      );

      await loadShipments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update shipment status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCreateShipment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!token) return;

    if (!createForm.orderId.trim()) {
      setError("Order ID is required");
      return;
    }

    try {
      setCreatingShipment(true);
      setError("");
      setSuccessMessage("");

      const response =
        await createStaffShipmentApi(
          token,
          {
            orderId:
              createForm.orderId.trim(),

            courierName:
              createForm.courierName.trim() ||
              undefined,

            courierProvider:
              createForm.courierProvider.trim() ||
              undefined,

            courierService:
              createForm.courierService.trim() ||
              undefined,

            estimatedDeliveryDate:
              createForm.estimatedDeliveryDate ||
              undefined,

            notes:
              createForm.notes.trim() ||
              undefined,
          }
        );

      setSuccessMessage(
        response.message
      );

      setShowCreateModal(false);

      setCreateForm({
        orderId: "",
        courierName: "",
        courierProvider: "",
        courierService: "",
        estimatedDeliveryDate: "",
        notes: "",
      });

      setPage(1);

      await loadShipments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create shipment"
      );
    } finally {
      setCreatingShipment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Shipping
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage shipments, couriers and delivery status.
            </p>
          </div>

          <button
            onClick={() =>
              setShowCreateModal(true)
            }
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Create Shipment
          </button>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Total Shipments
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {summary.total}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Active
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {summary.active}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="mt-2 text-2xl font-semibold text-green-600">
              {summary.delivered}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Exceptions
            </p>

            <p className="mt-2 text-2xl font-semibold text-orange-600">
              {summary.exceptions}
            </p>
          </div>

        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row">

            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search AWB, tracking number or courier..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  e.target.value as
                    | ShipmentStatus
                    | "all"
                );
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              <option value="all">
                All Statuses
              </option>

              {shipmentStatuses.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(status)}
                  </option>
                )
              )}
            </select>

            <button
              onClick={loadShipments}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Refresh
            </button>

          </div>
        </div>

        {/* SHIPMENT LIST */}
        <div className="overflow-hidden rounded-2xl border bg-white">

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading shipments...
            </div>
          ) : shipments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🚚
              </div>

              <h3 className="font-medium text-gray-900">
                No shipments found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create a shipment or change your filters.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Shipment
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Order
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Courier
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Created
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {shipments.map(
                      (shipment) => (
                        <tr
                          key={shipment._id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-900">
                              {shipment.awbNumber ||
                                shipment.trackingNumber ||
                                "Not assigned"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              ID:{" "}
                              {shipment._id.slice(
                                -8
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            {getOrderId(
                              shipment
                            ).slice(-8)}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-gray-900">
                              {getCustomerName(
                                shipment
                              )}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {getCustomerEmail(
                                shipment
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-900">
                              {shipment.courierName ||
                                "Not assigned"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {shipment.courierService ||
                                "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                                shipment.shipmentStatus
                              )}`}
                            >
                              {formatStatus(
                                shipment.shipmentStatus
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {formatDate(
                              shipment.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() =>
                                handleViewShipment(
                                  shipment._id
                                )
                              }
                              className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y lg:hidden">
                {shipments.map(
                  (shipment) => (
                    <div
                      key={shipment._id}
                      className="p-5"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {shipment.awbNumber ||
                              shipment.trackingNumber ||
                              "Not assigned"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Order #
                            {getOrderId(
                              shipment
                            ).slice(-8)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                            shipment.shipmentStatus
                          )}`}
                        >
                          {formatStatus(
                            shipment.shipmentStatus
                          )}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">
                            Customer
                          </span>

                          <span className="text-right font-medium text-gray-900">
                            {getCustomerName(
                              shipment
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">
                            Courier
                          </span>

                          <span className="text-right text-gray-900">
                            {shipment.courierName ||
                              "Not assigned"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">
                            Created
                          </span>

                          <span className="text-gray-900">
                            {formatDate(
                              shipment.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleViewShipment(
                            shipment._id
                          )
                        }
                        className="mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        View Shipment
                      </button>
                    </div>
                  )
                )}
              </div>
            </>
          )}

        </div>

        {/* PAGINATION */}
        {!loading &&
          shipments.length > 0 && (
            <div className="mt-5 flex items-center justify-between">

              <button
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(current - 1, 1)
                  )
                }
                className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-gray-500">
                Page {page} of{" "}
                {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      current + 1,
                      totalPages
                    )
                  )
                }
                className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>
          )}

      </div>

      {/* SHIPMENT DETAILS MODAL */}
      {(selectedShipment ||
        detailsLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {detailsLoading ? (
              <div className="p-10 text-center text-sm text-gray-500">
                Loading shipment...
              </div>
            ) : selectedShipment ? (
              <>
                <div className="flex items-center justify-between border-b p-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Shipment Details
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {selectedShipment._id}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedShipment(
                        null
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6 p-5">

                  {/* STATUS */}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Current Status
                    </p>

                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${statusClass(
                        selectedShipment.shipmentStatus
                      )}`}
                    >
                      {formatStatus(
                        selectedShipment.shipmentStatus
                      )}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-gray-900">
                        {getOrderId(
                          selectedShipment
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Customer
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {getCustomerName(
                          selectedShipment
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Courier
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {selectedShipment.courierName ||
                          "Not assigned"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Provider
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {selectedShipment.courierProvider ||
                          "Not assigned"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        AWB Number
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {selectedShipment.awbNumber ||
                          "Not generated"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Tracking Number
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {selectedShipment.trackingNumber ||
                          "Not available"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Pickup Scheduled
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(
                          selectedShipment.pickupScheduledAt
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Estimated Delivery
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(
                          selectedShipment.estimatedDeliveryDate
                        )}
                      </p>
                    </div>

                  </div>

                  {/* STATUS UPDATE */}
                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-900">
                      Update Shipment Status
                    </p>

                    <select
                      disabled={
                        updatingStatus
                      }
                      value={
                        selectedShipment.shipmentStatus
                      }
                      onChange={(e) =>
                        handleUpdateStatus(
                          selectedShipment._id,
                          e.target.value as ShipmentStatus
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black disabled:opacity-50"
                    >
                      {shipmentStatuses.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {formatStatus(
                              status
                            )}
                          </option>
                        )
                      )}
                    </select>

                    {updatingStatus && (
                      <p className="mt-2 text-xs text-gray-500">
                        Updating status...
                      </p>
                    )}
                  </div>

                  {/* TIMELINE */}
                  <div>
                    <p className="mb-3 text-sm font-semibold text-gray-900">
                      Shipment Timeline
                    </p>

                    <div className="space-y-3">

                      {shipmentStatuses
                        .slice(0, 9)
                        .map(
                          (status, index) => {
                            const currentIndex =
                              shipmentStatuses.indexOf(
                                selectedShipment.shipmentStatus
                              );

                            const isCompleted =
                              index <=
                              currentIndex;

                            return (
                              <div
                                key={status}
                                className="flex items-center gap-3"
                              >
                                <div
                                  className={`h-3 w-3 rounded-full ${
                                    isCompleted
                                      ? "bg-black"
                                      : "bg-gray-200"
                                  }`}
                                />

                                <span
                                  className={`text-sm ${
                                    isCompleted
                                      ? "font-medium text-gray-900"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {formatStatus(
                                    status
                                  )}
                                </span>
                              </div>
                            );
                          }
                        )}

                    </div>
                  </div>

                  {selectedShipment.notes && (
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Notes
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                        {selectedShipment.notes}
                      </p>
                    </div>
                  )}

                </div>
              </>
            ) : null}

          </div>
        </div>
      )}

      {/* CREATE SHIPMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white">

            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Create Shipment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Prepare an order for shipping.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateShipment}
              className="space-y-4 p-5"
            >

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Order ID *
                </label>

                <input
                  value={createForm.orderId}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      orderId:
                        e.target.value,
                    })
                  }
                  placeholder="Enter order ID"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Courier Name
                </label>

                <input
                  value={
                    createForm.courierName
                  }
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      courierName:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. Delhivery"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Courier Provider
                </label>

                <input
                  value={
                    createForm.courierProvider
                  }
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      courierProvider:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. delhivery"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Courier Service
                </label>

                <input
                  value={
                    createForm.courierService
                  }
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      courierService:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. Surface"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Estimated Delivery
                </label>

                <input
                  type="date"
                  value={
                    createForm.estimatedDeliveryDate
                  }
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      estimatedDeliveryDate:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Notes
                </label>

                <textarea
                  value={createForm.notes}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Optional shipment notes"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="flex-1 rounded-xl border px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    creatingShipment
                  }
                  className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingShipment
                    ? "Creating..."
                    : "Create Shipment"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

