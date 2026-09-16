"use client";

import { useMemo, useState } from "react";
import {
  Search,
  AlertTriangle,
  Phone,
  MapPin,
  CalendarDays,
  Package,
  X,
  CheckCircle2,
  Clock,
  RefreshCw,
  MessageCircle,
  RotateCcw,
} from "lucide-react";

type NDRStatus =
  | "Pending Action"
  | "Customer Contacted"
  | "Reattempt Scheduled"
  | "Resolved"
  | "RTO Initiated";

type NDRReason =
  | "Customer Unavailable"
  | "Incorrect Address"
  | "Customer Refused"
  | "Phone Unreachable"
  | "Delivery Delayed";

type NDRRecord = {
  id: string;
  orderId: string;
  awb: string;
  customer: string;
  phone: string;
  courier: string;
  reason: NDRReason;
  attemptNumber: number;
  status: NDRStatus;
  location: string;
  ndrDate: string;
  nextActionDate: string;
  remarks: string;
};

const initialNDRRecords: NDRRecord[] = [
  {
    id: "NDR001",
    orderId: "MB1031",
    awb: "DEL987654321",
    customer: "Anjali Menon",
    phone: "+91 98765 43210",
    courier: "Delhivery",
    reason: "Customer Unavailable",
    attemptNumber: 1,
    status: "Pending Action",
    location: "Bengaluru, Karnataka",
    ndrDate: "17 Sep 2026",
    nextActionDate: "18 Sep 2026",
    remarks: "Customer was not available at delivery address.",
  },
  {
    id: "NDR002",
    orderId: "MB1032",
    awb: "SHP876543210",
    customer: "Rahul Nair",
    phone: "+91 91234 56789",
    courier: "Shiprocket",
    reason: "Phone Unreachable",
    attemptNumber: 2,
    status: "Customer Contacted",
    location: "Chennai, Tamil Nadu",
    ndrDate: "17 Sep 2026",
    nextActionDate: "18 Sep 2026",
    remarks: "Customer phone was unreachable during delivery attempt.",
  },
  {
    id: "NDR003",
    orderId: "MB1033",
    awb: "DEL112233445",
    customer: "Meera Krishnan",
    phone: "+91 99887 66554",
    courier: "Delhivery",
    reason: "Incorrect Address",
    attemptNumber: 1,
    status: "Reattempt Scheduled",
    location: "Mumbai, Maharashtra",
    ndrDate: "16 Sep 2026",
    nextActionDate: "19 Sep 2026",
    remarks: "Customer provided an updated delivery address.",
  },
  {
    id: "NDR004",
    orderId: "MB1034",
    awb: "SHP223344556",
    customer: "Arjun Thomas",
    phone: "+91 93456 78901",
    courier: "Shiprocket",
    reason: "Customer Refused",
    attemptNumber: 1,
    status: "RTO Initiated",
    location: "Hyderabad, Telangana",
    ndrDate: "15 Sep 2026",
    nextActionDate: "18 Sep 2026",
    remarks: "Customer refused the shipment at the doorstep.",
  },
  {
    id: "NDR005",
    orderId: "MB1035",
    awb: "DEL667788990",
    customer: "Neha Joseph",
    phone: "+91 87654 32109",
    courier: "Delhivery",
    reason: "Delivery Delayed",
    attemptNumber: 1,
    status: "Resolved",
    location: "Kochi, Kerala",
    ndrDate: "14 Sep 2026",
    nextActionDate: "16 Sep 2026",
    remarks: "Delivery was delayed due to local operational issues.",
  },
  {
    id: "NDR006",
    orderId: "MB1036",
    awb: "SHP445566778",
    customer: "Vishnu Kumar",
    phone: "+91 90123 45678",
    courier: "Shiprocket",
    reason: "Customer Unavailable",
    attemptNumber: 2,
    status: "Reattempt Scheduled",
    location: "Coimbatore, Tamil Nadu",
    ndrDate: "16 Sep 2026",
    nextActionDate: "18 Sep 2026",
    remarks: "Customer requested another delivery attempt.",
  },
];

export default function NDRPage() {
  const [records, setRecords] = useState(initialNDRRecords);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [reasonFilter, setReasonFilter] = useState("All");

  const [selectedRecord, setSelectedRecord] =
    useState<NDRRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchValue = search.toLowerCase();

      const searchMatch =
        record.orderId.toLowerCase().includes(searchValue) ||
        record.awb.toLowerCase().includes(searchValue) ||
        record.customer.toLowerCase().includes(searchValue) ||
        record.phone.toLowerCase().includes(searchValue);

      const statusMatch =
        statusFilter === "All" || record.status === statusFilter;

      const reasonMatch =
        reasonFilter === "All" || record.reason === reasonFilter;

      return searchMatch && statusMatch && reasonMatch;
    });
  }, [records, search, statusFilter, reasonFilter]);

  const totalNDR = records.length;

  const pendingAction = records.filter(
    (record) => record.status === "Pending Action"
  ).length;

  const reattemptScheduled = records.filter(
    (record) => record.status === "Reattempt Scheduled"
  ).length;

  const resolved = records.filter(
    (record) => record.status === "Resolved"
  ).length;

  const rtoInitiated = records.filter(
    (record) => record.status === "RTO Initiated"
  ).length;

  const updateStatus = (id: string, status: NDRStatus) => {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === id ? { ...record, status } : record
      )
    );

    setSelectedRecord(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            Shipping Management
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            NDR Management
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage failed delivery attempts and customer follow-ups.
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

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <SummaryCard
          title="Total NDR"
          value={totalNDR}
          icon={<AlertTriangle className="h-5 w-5" />}
        />

        <SummaryCard
          title="Pending Action"
          value={pendingAction}
          icon={<Clock className="h-5 w-5" />}
        />

        <SummaryCard
          title="Reattempt Scheduled"
          value={reattemptScheduled}
          icon={<RotateCcw className="h-5 w-5" />}
        />

        <SummaryCard
          title="Resolved"
          value={resolved}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <SummaryCard
          title="RTO Initiated"
          value={rtoInitiated}
          icon={<Package className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

            <input
              type="text"
              placeholder="Search order, AWB, customer or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm outline-none transition focus:border-neutral-400 focus:bg-white"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="All">All Status</option>
            <option value="Pending Action">Pending Action</option>
            <option value="Customer Contacted">
              Customer Contacted
            </option>
            <option value="Reattempt Scheduled">
              Reattempt Scheduled
            </option>
            <option value="Resolved">Resolved</option>
            <option value="RTO Initiated">RTO Initiated</option>
          </select>

          {/* Reason */}
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="All">All Reasons</option>
            <option value="Customer Unavailable">
              Customer Unavailable
            </option>
            <option value="Incorrect Address">
              Incorrect Address
            </option>
            <option value="Customer Refused">
              Customer Refused
            </option>
            <option value="Phone Unreachable">
              Phone Unreachable
            </option>
            <option value="Delivery Delayed">
              Delivery Delayed
            </option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <TableHeader>NDR</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Courier</TableHeader>
                <TableHeader>Reason</TableHeader>
                <TableHeader>Attempts</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Next Action</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="transition hover:bg-neutral-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-neutral-900">
                      {record.awb}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Order #{record.orderId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-neutral-900">
                      {record.customer}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {record.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-neutral-700">
                    {record.courier}
                  </td>

                  <td className="px-5 py-4">
                    <ReasonBadge reason={record.reason} />
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      Attempt {record.attemptNumber}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      {record.location}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <NDRStatusBadge status={record.status} />
                  </td>

                  <td className="px-5 py-4 text-sm text-neutral-700">
                    {record.nextActionDate}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && <EmptyState />}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-neutral-900">
                  {record.awb}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Order #{record.orderId}
                </p>
              </div>

              <NDRStatusBadge status={record.status} />
            </div>

            <div className="mt-4 space-y-3">
              <InfoRow
                icon={<Package className="h-4 w-4" />}
                label="Customer"
                value={record.customer}
              />

              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={record.phone}
              />

              <InfoRow
                icon={<AlertTriangle className="h-4 w-4" />}
                label="Reason"
                value={record.reason}
              />

              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={record.location}
              />

              <InfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Next Action"
                value={record.nextActionDate}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedRecord(record)}
                className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Manage NDR
              </button>

              <a
                href={`tel:${record.phone}`}
                className="flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-3 text-neutral-700 transition hover:bg-neutral-50"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && <EmptyState />}
      </div>

      {/* Manage Modal */}
      {selectedRecord && (
        <NDRModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onUpdateStatus={updateStatus}
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
/* NDR Status Badge */
/* ---------------------------------- */

function NDRStatusBadge({ status }: { status: NDRStatus }) {
  const styles: Record<NDRStatus, string> = {
    "Pending Action": "bg-red-50 text-red-700",
    "Customer Contacted": "bg-blue-50 text-blue-700",
    "Reattempt Scheduled": "bg-amber-50 text-amber-700",
    Resolved: "bg-green-50 text-green-700",
    "RTO Initiated": "bg-purple-50 text-purple-700",
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
/* Reason Badge */
/* ---------------------------------- */

function ReasonBadge({ reason }: { reason: NDRReason }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
      {reason}
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
      <AlertTriangle className="h-10 w-10 text-neutral-300" />

      <h3 className="mt-4 text-base font-semibold text-neutral-800">
        No NDR records found
      </h3>

      <p className="mt-1 text-sm text-neutral-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* NDR Modal */
/* ---------------------------------- */

function NDRModal({
  record,
  onClose,
  onUpdateStatus,
}: {
  record: NDRRecord;
  onClose: () => void;
  onUpdateStatus: (id: string, status: NDRStatus) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-neutral-200 bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              NDR Management
            </p>

            <h2 className="mt-1 text-xl font-semibold text-neutral-900">
              {record.awb}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Order #{record.orderId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Customer */}
        <div className="grid gap-4 border-b border-neutral-200 p-5 sm:grid-cols-2 sm:p-6">
          <DetailBox
            label="Customer"
            value={record.customer}
          />

          <DetailBox
            label="Phone"
            value={record.phone}
          />

          <DetailBox
            label="Courier"
            value={record.courier}
          />

          <DetailBox
            label="Attempt Number"
            value={`Attempt ${record.attemptNumber}`}
          />

          <DetailBox
            label="NDR Reason"
            value={record.reason}
          />

          <DetailBox
            label="NDR Date"
            value={record.ndrDate}
          />

          <DetailBox
            label="Location"
            value={record.location}
          />

          <DetailBox
            label="Next Action"
            value={record.nextActionDate}
          />
        </div>

        {/* Remarks */}
        <div className="border-b border-neutral-200 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-neutral-900">
            Delivery Remarks
          </h3>

          <div className="mt-3 rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
            {record.remarks}
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-neutral-900">
            NDR Actions
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() =>
                onUpdateStatus(record.id, "Customer Contacted")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <Phone className="h-4 w-4" />
              Contact Customer
            </button>

            <button
              onClick={() =>
                onUpdateStatus(record.id, "Reattempt Scheduled")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <RotateCcw className="h-4 w-4" />
              Schedule Reattempt
            </button>

            <button
              onClick={() =>
                onUpdateStatus(record.id, "Resolved")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition hover:bg-green-100"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark Resolved
            </button>

            <button
              onClick={() =>
                onUpdateStatus(record.id, "RTO Initiated")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <Package className="h-4 w-4" />
              Initiate RTO
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:justify-between sm:p-6">
          <a
            href={`tel:${record.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            <Phone className="h-4 w-4" />
            Call Customer
          </a>

          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Detail Box */
/* ---------------------------------- */

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3.5">
      <p className="text-xs text-neutral-500">{label}</p>

      <p className="mt-1 text-sm font-medium text-neutral-800">
        {value}
      </p>
    </div>
  );
}