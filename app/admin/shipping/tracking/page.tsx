"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  X,
  RefreshCw,
  ExternalLink,
  Navigation,
  CalendarDays,
} from "lucide-react";

type TrackingStatus =
  | "Picked Up"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Exception";

type TrackingEvent = {
  id: number;
  status: string;
  location: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
};

type ShipmentTracking = {
  id: string;
  orderId: string;
  awb: string;
  customer: string;
  courier: string;
  status: TrackingStatus;
  origin: string;
  destination: string;
  currentLocation: string;
  estimatedDelivery: string;
  lastUpdated: string;
  events: TrackingEvent[];
};

const initialShipments: ShipmentTracking[] = [
  {
    id: "SHP001",
    orderId: "MB1024",
    awb: "DEL123456789",
    customer: "Anjali Menon",
    courier: "Delhivery",
    status: "In Transit",
    origin: "Kochi, Kerala",
    destination: "Bengaluru, Karnataka",
    currentLocation: "Coimbatore, Tamil Nadu",
    estimatedDelivery: "18 Sep 2026",
    lastUpdated: "17 Sep 2026, 10:45 AM",
    events: [
      {
        id: 1,
        status: "Shipment Created",
        location: "Kochi, Kerala",
        description: "Shipment information received",
        date: "16 Sep 2026",
        time: "09:20 AM",
        completed: true,
      },
      {
        id: 2,
        status: "Picked Up",
        location: "Kochi, Kerala",
        description: "Shipment picked up from seller",
        date: "16 Sep 2026",
        time: "02:15 PM",
        completed: true,
      },
      {
        id: 3,
        status: "In Transit",
        location: "Coimbatore, Tamil Nadu",
        description: "Shipment is moving towards destination",
        date: "17 Sep 2026",
        time: "10:45 AM",
        completed: true,
      },
      {
        id: 4,
        status: "Out for Delivery",
        location: "Bengaluru, Karnataka",
        description: "Shipment will be delivered today",
        date: "",
        time: "",
        completed: false,
      },
      {
        id: 5,
        status: "Delivered",
        location: "Bengaluru, Karnataka",
        description: "Shipment delivered successfully",
        date: "",
        time: "",
        completed: false,
      },
    ],
  },
  {
    id: "SHP002",
    orderId: "MB1025",
    awb: "SHP987654321",
    customer: "Rahul Nair",
    courier: "Shiprocket",
    status: "Out for Delivery",
    origin: "Kochi, Kerala",
    destination: "Chennai, Tamil Nadu",
    currentLocation: "Chennai, Tamil Nadu",
    estimatedDelivery: "17 Sep 2026",
    lastUpdated: "17 Sep 2026, 08:30 AM",
    events: [
      {
        id: 1,
        status: "Shipment Created",
        location: "Kochi, Kerala",
        description: "Shipment information received",
        date: "15 Sep 2026",
        time: "11:10 AM",
        completed: true,
      },
      {
        id: 2,
        status: "Picked Up",
        location: "Kochi, Kerala",
        description: "Shipment picked up from seller",
        date: "15 Sep 2026",
        time: "03:20 PM",
        completed: true,
      },
      {
        id: 3,
        status: "In Transit",
        location: "Chennai, Tamil Nadu",
        description: "Shipment reached destination city",
        date: "16 Sep 2026",
        time: "07:40 PM",
        completed: true,
      },
      {
        id: 4,
        status: "Out for Delivery",
        location: "Chennai, Tamil Nadu",
        description: "Shipment is out for delivery",
        date: "17 Sep 2026",
        time: "08:30 AM",
        completed: true,
      },
      {
        id: 5,
        status: "Delivered",
        location: "Chennai, Tamil Nadu",
        description: "Shipment delivered successfully",
        date: "",
        time: "",
        completed: false,
      },
    ],
  },
  {
    id: "SHP003",
    orderId: "MB1026",
    awb: "DEL555666777",
    customer: "Meera Krishnan",
    courier: "Delhivery",
    status: "Delivered",
    origin: "Kochi, Kerala",
    destination: "Mumbai, Maharashtra",
    currentLocation: "Mumbai, Maharashtra",
    estimatedDelivery: "15 Sep 2026",
    lastUpdated: "15 Sep 2026, 04:50 PM",
    events: [
      {
        id: 1,
        status: "Shipment Created",
        location: "Kochi, Kerala",
        description: "Shipment information received",
        date: "12 Sep 2026",
        time: "10:10 AM",
        completed: true,
      },
      {
        id: 2,
        status: "Picked Up",
        location: "Kochi, Kerala",
        description: "Shipment picked up from seller",
        date: "12 Sep 2026",
        time: "02:30 PM",
        completed: true,
      },
      {
        id: 3,
        status: "In Transit",
        location: "Mumbai, Maharashtra",
        description: "Shipment reached destination city",
        date: "14 Sep 2026",
        time: "06:20 PM",
        completed: true,
      },
      {
        id: 4,
        status: "Out for Delivery",
        location: "Mumbai, Maharashtra",
        description: "Shipment is out for delivery",
        date: "15 Sep 2026",
        time: "09:15 AM",
        completed: true,
      },
      {
        id: 5,
        status: "Delivered",
        location: "Mumbai, Maharashtra",
        description: "Shipment delivered successfully",
        date: "15 Sep 2026",
        time: "04:50 PM",
        completed: true,
      },
    ],
  },
  {
    id: "SHP004",
    orderId: "MB1027",
    awb: "SHP444555666",
    customer: "Arjun Thomas",
    courier: "Shiprocket",
    status: "Exception",
    origin: "Kochi, Kerala",
    destination: "Hyderabad, Telangana",
    currentLocation: "Hyderabad, Telangana",
    estimatedDelivery: "19 Sep 2026",
    lastUpdated: "17 Sep 2026, 02:20 PM",
    events: [
      {
        id: 1,
        status: "Shipment Created",
        location: "Kochi, Kerala",
        description: "Shipment information received",
        date: "16 Sep 2026",
        time: "08:10 AM",
        completed: true,
      },
      {
        id: 2,
        status: "Picked Up",
        location: "Kochi, Kerala",
        description: "Shipment picked up from seller",
        date: "16 Sep 2026",
        time: "01:30 PM",
        completed: true,
      },
      {
        id: 3,
        status: "In Transit",
        location: "Hyderabad, Telangana",
        description: "Shipment reached destination city",
        date: "17 Sep 2026",
        time: "11:00 AM",
        completed: true,
      },
      {
        id: 4,
        status: "Exception",
        location: "Hyderabad, Telangana",
        description: "Delivery delayed due to address issue",
        date: "17 Sep 2026",
        time: "02:20 PM",
        completed: true,
      },
      {
        id: 5,
        status: "Delivered",
        location: "Hyderabad, Telangana",
        description: "Shipment delivered successfully",
        date: "",
        time: "",
        completed: false,
      },
    ],
  },
];

export default function TrackingPage() {
  const [shipments] = useState(initialShipments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentTracking | null>(null);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const searchMatch =
        shipment.awb.toLowerCase().includes(search.toLowerCase()) ||
        shipment.orderId.toLowerCase().includes(search.toLowerCase()) ||
        shipment.customer.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || shipment.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [shipments, search, statusFilter]);

  const totalShipments = shipments.length;

  const inTransit = shipments.filter(
    (shipment) => shipment.status === "In Transit"
  ).length;

  const outForDelivery = shipments.filter(
    (shipment) => shipment.status === "Out for Delivery"
  ).length;

  const delivered = shipments.filter(
    (shipment) => shipment.status === "Delivered"
  ).length;

  const exceptions = shipments.filter(
    (shipment) => shipment.status === "Exception"
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            Shipping Management
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Tracking
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Monitor shipments and track their delivery progress.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <SummaryCard
          title="Total Shipments"
          value={totalShipments}
          icon={<Package className="h-5 w-5" />}
        />

        <SummaryCard
          title="In Transit"
          value={inTransit}
          icon={<Truck className="h-5 w-5" />}
        />

        <SummaryCard
          title="Out for Delivery"
          value={outForDelivery}
          icon={<Navigation className="h-5 w-5" />}
        />

        <SummaryCard
          title="Delivered"
          value={delivered}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <SummaryCard
          title="Exceptions"
          value={exceptions}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Search / Filters */}
      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

            <input
              type="text"
              placeholder="Search AWB, order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm outline-none transition focus:border-neutral-400 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="All">All Status</option>
            <option value="Picked Up">Picked Up</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Exception">Exception</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <TableHeader>Shipment</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Courier</TableHeader>
                <TableHeader>Route</TableHeader>
                <TableHeader>Current Location</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>ETA</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {filteredShipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="transition hover:bg-neutral-50"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">
                        {shipment.awb}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Order #{shipment.orderId}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-neutral-900">
                      {shipment.customer}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-neutral-700">
                      {shipment.courier}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs text-neutral-500">
                      <p>{shipment.origin}</p>
                      <p className="my-1">↓</p>
                      <p className="font-medium text-neutral-700">
                        {shipment.destination}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-400" />

                      <span className="max-w-[160px] text-sm text-neutral-700">
                        {shipment.currentLocation}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={shipment.status} />
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-neutral-700">
                      {shipment.estimatedDelivery}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedShipment(shipment)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                      View Tracking
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredShipments.length === 0 && (
          <EmptyState />
        )}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {filteredShipments.map((shipment) => (
          <div
            key={shipment.id}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-neutral-900">
                  {shipment.awb}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Order #{shipment.orderId}
                </p>
              </div>

              <StatusBadge status={shipment.status} />
            </div>

            <div className="mt-4 space-y-3">
              <InfoRow
                icon={<Package className="h-4 w-4" />}
                label="Customer"
                value={shipment.customer}
              />

              <InfoRow
                icon={<Truck className="h-4 w-4" />}
                label="Courier"
                value={shipment.courier}
              />

              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Current Location"
                value={shipment.currentLocation}
              />

              <InfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Estimated Delivery"
                value={shipment.estimatedDelivery}
              />
            </div>

            <button
              onClick={() => setSelectedShipment(shipment)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              View Tracking
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        ))}

        {filteredShipments.length === 0 && <EmptyState />}
      </div>

      {/* Tracking Modal */}
      {selectedShipment && (
        <TrackingModal
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}
    </div>
  );
}

/* ---------------------------------- */
/* Summary Card */
/* ---------------------------------- */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-700">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm text-neutral-500">{title}</p>

      <p className="mt-1 text-2xl font-semibold text-neutral-900">
        {value}
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* Table Header */
/* ---------------------------------- */

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
      {children}
    </th>
  );
}

/* ---------------------------------- */
/* Status Badge */
/* ---------------------------------- */

function StatusBadge({ status }: { status: TrackingStatus }) {
  const styles: Record<TrackingStatus, string> = {
    "Picked Up": "bg-blue-50 text-blue-700",
    "In Transit": "bg-indigo-50 text-indigo-700",
    "Out for Delivery": "bg-amber-50 text-amber-700",
    Delivered: "bg-green-50 text-green-700",
    Exception: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ---------------------------------- */
/* Info Row */
/* ---------------------------------- */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-neutral-400">{icon}</div>

      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-neutral-800">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Empty State */
/* ---------------------------------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <Package className="h-10 w-10 text-neutral-300" />

      <h3 className="mt-4 text-base font-semibold text-neutral-800">
        No shipments found
      </h3>

      <p className="mt-1 text-sm text-neutral-500">
        Try changing your search or status filter.
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* Tracking Modal */
/* ---------------------------------- */

function TrackingModal({
  shipment,
  onClose,
}: {
  shipment: ShipmentTracking;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-neutral-200 bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Shipment Tracking
            </p>

            <h2 className="mt-1 text-xl font-semibold text-neutral-900">
              {shipment.awb}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Order #{shipment.orderId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shipment Information */}
        <div className="grid gap-4 border-b border-neutral-200 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <TrackingInfo
            icon={<Truck className="h-4 w-4" />}
            label="Courier"
            value={shipment.courier}
          />

          <TrackingInfo
            icon={<MapPin className="h-4 w-4" />}
            label="Current Location"
            value={shipment.currentLocation}
          />

          <TrackingInfo
            icon={<CalendarDays className="h-4 w-4" />}
            label="Estimated Delivery"
            value={shipment.estimatedDelivery}
          />

          <TrackingInfo
            icon={<Clock className="h-4 w-4" />}
            label="Last Updated"
            value={shipment.lastUpdated}
          />
        </div>

        {/* Route */}
        <div className="border-b border-neutral-200 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-neutral-900">
            Delivery Route
          </h3>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">Origin</p>
              <p className="mt-1 font-medium text-neutral-900">
                {shipment.origin}
              </p>
            </div>

            <div className="hidden text-neutral-300 sm:block">→</div>

            <div className="flex-1 rounded-xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">Destination</p>
              <p className="mt-1 font-medium text-neutral-900">
                {shipment.destination}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900">
              Tracking Timeline
            </h3>

            <StatusBadge status={shipment.status} />
          </div>

          <div className="mt-6">
            {shipment.events.map((event, index) => {
              const isLast = index === shipment.events.length - 1;

              return (
                <div key={event.id} className="relative flex gap-4">
                  {!isLast && (
                    <div className="absolute left-[9px] top-6 h-full w-px bg-neutral-200" />
                  )}

                  <div className="relative z-10 mt-1">
                    {event.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-neutral-900" />
                    ) : (
                      <Circle className="h-5 w-5 text-neutral-300" />
                    )}
                  </div>

                  <div className="pb-8">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                      <p
                        className={`text-sm font-semibold ${
                          event.completed
                            ? "text-neutral-900"
                            : "text-neutral-400"
                        }`}
                      >
                        {event.status}
                      </p>

                      {event.date && (
                        <span className="text-xs text-neutral-400">
                          {event.date} • {event.time}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-neutral-600">
                      {event.description}
                    </p>

                    {event.location && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:justify-end sm:p-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            Close
          </button>

          <button
            onClick={() =>
              alert(
                `Opening tracking for ${shipment.awb} on ${shipment.courier}`
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Open Courier Tracking
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Tracking Info */
/* ---------------------------------- */

function TrackingInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3.5">
      <div className="flex items-center gap-2 text-neutral-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-sm font-medium text-neutral-800">
        {value}
      </p>
    </div>
  );
}