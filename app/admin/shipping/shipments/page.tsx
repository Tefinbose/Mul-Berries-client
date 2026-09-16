"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Clock3,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  MapPin,
  Package,
  Plus,
  Search,
  Truck,
  X,
  XCircle,
} from "lucide-react";

type ShipmentStatus =
  | "Pending"
  | "AWB Generated"
  | "Pickup Scheduled"
  | "Picked Up"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

type PaymentStatus = "Paid" | "COD";

type Shipment = {
  id: string;
  orderId: string;
  customer: string;
  courier: string;
  awb: string;
  status: ShipmentStatus;
  payment: PaymentStatus;
  amount: number;
  destination: string;
  createdAt: string;
  eta: string;
  weight: number;
};

const initialShipments: Shipment[] = [
  {
    id: "SH001",
    orderId: "MB1024",
    customer: "Anjali Menon",
    courier: "Shiprocket",
    awb: "SR123456789",
    status: "In Transit",
    payment: "Paid",
    amount: 8999,
    destination: "Kochi, Kerala",
    createdAt: "10 Sep 2026",
    eta: "12 Sep 2026",
    weight: 0.8,
  },
  {
    id: "SH002",
    orderId: "MB1025",
    customer: "Rahul Kumar",
    courier: "Shiprocket",
    awb: "SR123456790",
    status: "Pickup Scheduled",
    payment: "COD",
    amount: 7499,
    destination: "Bengaluru, Karnataka",
    createdAt: "10 Sep 2026",
    eta: "13 Sep 2026",
    weight: 0.7,
  },
  {
    id: "SH003",
    orderId: "MB1026",
    customer: "Meera Joseph",
    courier: "Delhivery",
    awb: "DL987654321",
    status: "AWB Generated",
    payment: "Paid",
    amount: 8299,
    destination: "Chennai, Tamil Nadu",
    createdAt: "11 Sep 2026",
    eta: "15 Sep 2026",
    weight: 0.9,
  },
  {
    id: "SH004",
    orderId: "MB1027",
    customer: "Sneha Nair",
    courier: "Shiprocket",
    awb: "SR123456791",
    status: "Delivered",
    payment: "Paid",
    amount: 9499,
    destination: "Thrissur, Kerala",
    createdAt: "7 Sep 2026",
    eta: "10 Sep 2026",
    weight: 0.75,
  },
  {
    id: "SH005",
    orderId: "MB1028",
    customer: "Arjun Das",
    courier: "Delhivery",
    awb: "DL987654322",
    status: "Pending",
    payment: "COD",
    amount: 3299,
    destination: "Kolkata, West Bengal",
    createdAt: "11 Sep 2026",
    eta: "16 Sep 2026",
    weight: 0.6,
  },
];

const statusOrder: ShipmentStatus[] = [
  "Pending",
  "AWB Generated",
  "Pickup Scheduled",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export default function ShipmentsPage() {
  const [shipments, setShipments] =
    useState<Shipment[]>(initialShipments);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"All" | ShipmentStatus>("All");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [selectedShipment, setSelectedShipment] =
    useState<Shipment | null>(null);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const query = search.toLowerCase();

      const matchesSearch =
        shipment.orderId
          .toLowerCase()
          .includes(query) ||
        shipment.awb
          .toLowerCase()
          .includes(query) ||
        shipment.customer
          .toLowerCase()
          .includes(query) ||
        shipment.courier
          .toLowerCase()
          .includes(query) ||
        shipment.destination
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        shipment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, search, statusFilter]);

  const pending = shipments.filter(
    (shipment) => shipment.status === "Pending"
  ).length;

  const inTransit = shipments.filter(
    (shipment) =>
      shipment.status === "In Transit" ||
      shipment.status === "Out for Delivery"
  ).length;

  const delivered = shipments.filter(
    (shipment) => shipment.status === "Delivered"
  ).length;

  const handleCreateShipment = (
    shipment: Shipment
  ) => {
    setShipments((previous) => [
      shipment,
      ...previous,
    ]);

    setShowCreateModal(false);
  };

  const updateShipmentStatus = (
    id: string,
    status: ShipmentStatus
  ) => {
    setShipments((previous) =>
      previous.map((shipment) =>
        shipment.id === id
          ? {
              ...shipment,
              status,
            }
          : shipment
      )
    );

    setSelectedShipment((previous) =>
      previous
        ? {
            ...previous,
            status,
          }
        : previous
    );
  };

  return (
    <div className="min-h-full bg-[#fafafa]">
      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
          <span>Admin</span>

          <ChevronRight size={13} />

          <span>Shipping</span>

          <ChevronRight size={13} />

          <span className="text-neutral-600">
            Shipments
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Shipments
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Create shipments, manage AWBs, schedule
              pickups and monitor delivery progress.
            </p>
          </div>

          <button
            onClick={() =>
              setShowCreateModal(true)
            }
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <Plus size={17} />
            Create Shipment
          </button>
        </div>
      </div>

      {/* Summary */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<Package size={18} />}
          label="Total Shipments"
          value={shipments.length.toString()}
        />

        <SummaryCard
          icon={<Clock3 size={18} />}
          label="Pending"
          value={pending.toString()}
        />

        <SummaryCard
          icon={<Truck size={18} />}
          label="In Transit"
          value={inTransit.toString()}
        />

        <SummaryCard
          icon={<Check size={18} />}
          label="Delivered"
          value={delivered.toString()}
        />
      </div>

      {/* Main Card */}

      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Toolbar */}

        <div className="flex flex-col gap-4 border-b border-neutral-200 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-950">
              Shipment Management
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Track every shipment from AWB creation to
              delivery.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search shipment, AWB..."
                className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-neutral-400 focus:border-neutral-400 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "All"
                    | ShipmentStatus
                )
              }
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium text-neutral-600 outline-none"
            >
              <option value="All">
                All Status
              </option>

              {statusOrder.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70">
                <TableHeader>
                  Shipment
                </TableHeader>

                <TableHeader>
                  Customer
                </TableHeader>

                <TableHeader>
                  Courier / AWB
                </TableHeader>

                <TableHeader>
                  Destination
                </TableHeader>

                <TableHeader>
                  Payment
                </TableHeader>

                <TableHeader>
                  Status
                </TableHeader>

                <TableHeader>
                  ETA
                </TableHeader>

                <TableHeader>
                  Actions
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {filteredShipments.map(
                (shipment) => (
                  <tr
                    key={shipment.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50"
                  >
                    {/* Shipment */}

                    <td className="px-5 py-5">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">
                          {shipment.id}
                        </p>

                        <p className="mt-1 text-[11px] text-neutral-400">
                          Order #{shipment.orderId}
                        </p>
                      </div>
                    </td>

                    {/* Customer */}

                    <td className="px-5 py-5">
                      <p className="text-sm font-medium text-neutral-800">
                        {shipment.customer}
                      </p>
                    </td>

                    {/* Courier */}

                    <td className="px-5 py-5">
                      <p className="text-xs font-semibold text-neutral-800">
                        {shipment.courier}
                      </p>

                      <p className="mt-1 font-mono text-[10px] text-neutral-400">
                        {shipment.awb}
                      </p>
                    </td>

                    {/* Destination */}

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={13}
                          className="text-neutral-400"
                        />

                        <span className="text-xs text-neutral-600">
                          {shipment.destination}
                        </span>
                      </div>
                    </td>

                    {/* Payment */}

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                          shipment.payment ===
                          "Paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {shipment.payment}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-5">
                      <StatusBadge
                        status={
                          shipment.status
                        }
                      />
                    </td>

                    {/* ETA */}

                    <td className="px-5 py-5">
                      <span className="text-xs font-medium text-neutral-600">
                        {shipment.eta}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setSelectedShipment(
                              shipment
                            )
                          }
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 text-[10px] font-medium text-neutral-600 transition hover:bg-neutral-50"
                        >
                          View
                          <ExternalLink
                            size={12}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}

        <div className="divide-y divide-neutral-100 lg:hidden">
          {filteredShipments.map(
            (shipment) => (
              <div
                key={shipment.id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-950">
                      {shipment.id}
                    </p>

                    <p className="mt-1 text-[11px] text-neutral-400">
                      Order #{shipment.orderId}
                    </p>
                  </div>

                  <StatusBadge
                    status={shipment.status}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <InfoBox
                    label="Customer"
                    value={shipment.customer}
                  />

                  <InfoBox
                    label="Courier"
                    value={shipment.courier}
                  />

                  <InfoBox
                    label="AWB"
                    value={shipment.awb}
                  />

                  <InfoBox
                    label="Payment"
                    value={shipment.payment}
                  />

                  <InfoBox
                    label="Destination"
                    value={shipment.destination}
                  />

                  <InfoBox
                    label="ETA"
                    value={shipment.eta}
                  />
                </div>

                <button
                  onClick={() =>
                    setSelectedShipment(
                      shipment
                    )
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  View Shipment
                  <ExternalLink
                    size={13}
                  />
                </button>
              </div>
            )
          )}
        </div>

        {filteredShipments.length === 0 && (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <Search size={18} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-neutral-800">
              No shipments found
            </h3>

            <p className="mt-1 text-xs text-neutral-500">
              Try changing your search or status
              filter.
            </p>
          </div>
        )}
      </section>

      {/* Shipment Detail Modal */}

      {selectedShipment && (
        <ShipmentDetailModal
          shipment={selectedShipment}
          onClose={() =>
            setSelectedShipment(null)
          }
          onUpdateStatus={
            updateShipmentStatus
          }
        />
      )}

      {/* Create Shipment Modal */}

      {showCreateModal && (
        <CreateShipmentModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreate={handleCreateShipment}
          nextId={`SH${String(
            shipments.length + 1
          ).padStart(3, "0")}`}
        />
      )}
    </div>
  );
}

/* ================================================= */
/* SUMMARY CARD */
/* ================================================= */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
        {icon}
      </div>

      <p className="mt-5 text-xs font-medium text-neutral-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
    </div>
  );
}

/* ================================================= */
/* TABLE HEADER */
/* ================================================= */

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
      {children}
    </th>
  );
}

/* ================================================= */
/* STATUS BADGE */
/* ================================================= */

function StatusBadge({
  status,
}: {
  status: ShipmentStatus;
}) {
  const styles: Record<
    ShipmentStatus,
    string
  > = {
    Pending:
      "bg-neutral-100 text-neutral-600",
    "AWB Generated":
      "bg-blue-50 text-blue-700",
    "Pickup Scheduled":
      "bg-purple-50 text-purple-700",
    "Picked Up":
      "bg-indigo-50 text-indigo-700",
    "In Transit":
      "bg-amber-50 text-amber-700",
    "Out for Delivery":
      "bg-orange-50 text-orange-700",
    Delivered:
      "bg-green-50 text-green-700",
    Cancelled:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ================================================= */
/* INFO BOX */
/* ================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3">
      <p className="text-[10px] font-medium text-neutral-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-neutral-800">
        {value}
      </p>
    </div>
  );
}

/* ================================================= */
/* SHIPMENT DETAIL MODAL */
/* ================================================= */

function ShipmentDetailModal({
  shipment,
  onClose,
  onUpdateStatus,
}: {
  shipment: Shipment;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    status: ShipmentStatus
  ) => void;
}) {
  const currentIndex =
    statusOrder.indexOf(
      shipment.status
    );

  const nextStatus =
    currentIndex >= 0 &&
    currentIndex <
      statusOrder.length - 1
      ? statusOrder[currentIndex + 1]
      : null;

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-start justify-between border-b border-neutral-200 p-6">
          <div>
            <div className="flex items-center gap-2">
              <Package
                size={18}
                className="text-neutral-500"
              />

              <h2 className="text-base font-semibold text-neutral-950">
                Shipment {shipment.id}
              </h2>
            </div>

            <p className="mt-1 text-xs text-neutral-500">
              Order #{shipment.orderId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}

        <div className="space-y-6 p-6">
          {/* Overview */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoBox
              label="Courier"
              value={shipment.courier}
            />

            <InfoBox
              label="AWB"
              value={shipment.awb}
            />

            <InfoBox
              label="Weight"
              value={`${shipment.weight} kg`}
            />

            <InfoBox
              label="Amount"
              value={`₹${shipment.amount.toLocaleString(
                "en-IN"
              )}`}
            />
          </div>

          {/* Progress */}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Shipment Progress
              </h3>

              <StatusBadge
                status={shipment.status}
              />
            </div>

            <div className="space-y-3">
              {statusOrder.map(
                (status, index) => {
                  const completed =
                    currentIndex >=
                    index;

                  const isCurrent =
                    shipment.status ===
                    status;

                  return (
                    <div
                      key={status}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          completed
                            ? "bg-neutral-950 text-white"
                            : "bg-neutral-100 text-neutral-300"
                        }`}
                      >
                        {completed ? (
                          <Check size={13} />
                        ) : (
                          <span className="text-[10px]">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <p
                          className={`text-xs ${
                            isCurrent
                              ? "font-semibold text-neutral-950"
                              : completed
                              ? "font-medium text-neutral-700"
                              : "text-neutral-400"
                          }`}
                        >
                          {status}
                        </p>
                      </div>

                      {isCurrent && (
                        <span className="text-[10px] font-medium text-neutral-400">
                          Current
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Destination */}

          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="flex items-start gap-3">
              <MapPin
                size={17}
                className="mt-0.5 text-neutral-500"
              />

              <div>
                <p className="text-xs font-semibold">
                  Delivery Destination
                </p>

                <p className="mt-1 text-sm text-neutral-600">
                  {shipment.destination}
                </p>

                <p className="mt-1 text-[11px] text-neutral-400">
                  Expected delivery:{" "}
                  {shipment.eta}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}

          <div className="grid gap-2 sm:grid-cols-3">
            <button
              onClick={() =>
                alert(
                  `AWB Label for ${shipment.awb}`
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <Download size={14} />
              Download Label
            </button>

            <button
              onClick={() =>
                alert(
                  `Tracking ${shipment.awb}`
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <ExternalLink size={14} />
              View Tracking
            </button>

            <button
              onClick={() =>
                alert(
                  `Shipment ${shipment.id} cancelled`
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-3 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <XCircle size={14} />
              Cancel Shipment
            </button>
          </div>

          {/* Next Status */}

          {nextStatus && (
            <button
              onClick={() =>
                onUpdateStatus(
                  shipment.id,
                  nextStatus
                )
              }
              className="w-full rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Move to: {nextStatus}
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}

/* ================================================= */
/* CREATE SHIPMENT MODAL */
/* ================================================= */

function CreateShipmentModal({
  onClose,
  onCreate,
  nextId,
}: {
  onClose: () => void;
  onCreate: (
    shipment: Shipment
  ) => void;
  nextId: string;
}) {
  const [orderId, setOrderId] =
    useState("");

  const [customer, setCustomer] =
    useState("");

  const [courier, setCourier] =
    useState("Shiprocket");

  const [destination, setDestination] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [weight, setWeight] =
    useState("0.5");

  const [payment, setPayment] =
    useState<PaymentStatus>("Paid");

  const submit = () => {
    if (
      !orderId.trim() ||
      !customer.trim() ||
      !destination.trim()
    ) {
      alert(
        "Please fill in the required fields."
      );

      return;
    }

    const awbPrefix =
      courier === "Shiprocket"
        ? "SR"
        : courier === "Delhivery"
        ? "DL"
        : "CR";

    const randomAwb =
      `${awbPrefix}${Math.floor(
        100000000 +
          Math.random() * 899999999
      )}`;

    onCreate({
      id: nextId,
      orderId:
        orderId.trim().toUpperCase(),
      customer: customer.trim(),
      courier,
      awb: randomAwb,
      status: "AWB Generated",
      payment,
      amount: Number(amount) || 0,
      destination:
        destination.trim(),
      createdAt:
        new Date().toLocaleDateString(
          "en-IN"
        ),
      eta: "3–5 days",
      weight: Number(weight) || 0.5,
    });
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-neutral-200 p-6">
          <div>
            <h2 className="text-base font-semibold text-neutral-950">
              Create Shipment
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Create a shipment and generate an AWB.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}

        <div className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Order ID *"
              value={orderId}
              onChange={setOrderId}
              placeholder="MB1029"
            />

            <Input
              label="Customer *"
              value={customer}
              onChange={setCustomer}
              placeholder="Customer name"
            />

            <SelectInput
              label="Courier"
              value={courier}
              onChange={setCourier}
              options={[
                "Shiprocket",
                "Delhivery",
                "Blue Dart",
                "DTDC",
              ]}
            />

            <SelectInput
              label="Payment"
              value={payment}
              onChange={(value) =>
                setPayment(
                  value as PaymentStatus
                )
              }
              options={[
                "Paid",
                "COD",
              ]}
            />

            <Input
              label="Order Amount (₹)"
              value={amount}
              onChange={setAmount}
              placeholder="8999"
              type="number"
            />

            <Input
              label="Weight (kg)"
              value={weight}
              onChange={setWeight}
              placeholder="0.5"
              type="number"
            />
          </div>

          <Input
            label="Delivery Destination *"
            value={destination}
            onChange={setDestination}
            placeholder="Kochi, Kerala"
          />

          <div className="rounded-xl bg-neutral-50 p-4">
            <div className="flex items-start gap-3">
              <FileText
                size={17}
                className="mt-0.5 text-neutral-500"
              />

              <div>
                <p className="text-xs font-semibold text-neutral-800">
                  AWB generation
                </p>

                <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                  In the production system, the AWB will
                  be generated through the selected
                  courier API.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={submit}
            className="w-full rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Create Shipment & Generate AWB
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

/* ================================================= */
/* INPUT */
/* ================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-neutral-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100"
      />
    </div>
  );
}

/* ================================================= */
/* SELECT */
/* ================================================= */

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-neutral-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ================================================= */
/* MODAL OVERLAY */
/* ================================================= */

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) =>
          e.stopPropagation()
        }
        className="max-h-[90vh] overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
}