"use client";

import { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  MapPin,
  Phone,
  CalendarDays,
  IndianRupee,
  X,
  RefreshCw,
} from "lucide-react";

type ReturnStatus =
  | "Requested"
  | "Approved"
  | "Pickup Scheduled"
  | "Picked Up"
  | "Received"
  | "Refunded"
  | "Rejected";

type RefundStatus = "Pending" | "Processing" | "Refunded" | "Not Applicable";

type ReturnReason =
  | "Damaged Product"
  | "Wrong Product"
  | "Size Issue"
  | "Quality Issue"
  | "Changed Mind";

type ReturnRecord = {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  product: string;
  quantity: number;
  amount: number;
  reason: ReturnReason;
  status: ReturnStatus;
  refundStatus: RefundStatus;
  courier: string;
  reverseAwb: string;
  pickupAddress: string;
  requestDate: string;
  pickupDate: string;
  remarks: string;
};

const initialReturns: ReturnRecord[] = [
  {
    id: "RET001",
    orderId: "MB1040",
    customer: "Anjali Menon",
    phone: "+91 98765 43210",
    product: "Royal Red Kanjivaram Silk Saree",
    quantity: 1,
    amount: 8999,
    reason: "Damaged Product",
    status: "Requested",
    refundStatus: "Pending",
    courier: "Delhivery",
    reverseAwb: "-",
    pickupAddress: "Kochi, Kerala",
    requestDate: "17 Sep 2026",
    pickupDate: "-",
    remarks: "Customer reported damage on the product border.",
  },
  {
    id: "RET002",
    orderId: "MB1041",
    customer: "Rahul Nair",
    phone: "+91 91234 56789",
    product: "Aqua Gold Silk Saree",
    quantity: 1,
    amount: 7499,
    reason: "Wrong Product",
    status: "Approved",
    refundStatus: "Pending",
    courier: "Shiprocket",
    reverseAwb: "-",
    pickupAddress: "Chennai, Tamil Nadu",
    requestDate: "16 Sep 2026",
    pickupDate: "-",
    remarks: "Customer received a different product from the ordered item.",
  },
  {
    id: "RET003",
    orderId: "MB1042",
    customer: "Meera Krishnan",
    phone: "+91 99887 66554",
    product: "Maroon Pure Silk Saree",
    quantity: 1,
    amount: 8299,
    reason: "Quality Issue",
    status: "Pickup Scheduled",
    refundStatus: "Pending",
    courier: "Delhivery",
    reverseAwb: "REV123456789",
    pickupAddress: "Mumbai, Maharashtra",
    requestDate: "15 Sep 2026",
    pickupDate: "19 Sep 2026",
    remarks: "Customer reported a quality issue with the fabric.",
  },
  {
    id: "RET004",
    orderId: "MB1043",
    customer: "Arjun Thomas",
    phone: "+91 93456 78901",
    product: "Yellow & Pink Bridal Silk Saree",
    quantity: 1,
    amount: 9499,
    reason: "Changed Mind",
    status: "Picked Up",
    refundStatus: "Processing",
    courier: "Shiprocket",
    reverseAwb: "REV987654321",
    pickupAddress: "Hyderabad, Telangana",
    requestDate: "13 Sep 2026",
    pickupDate: "16 Sep 2026",
    remarks: "Reverse shipment picked up and is on the way to warehouse.",
  },
  {
    id: "RET005",
    orderId: "MB1044",
    customer: "Neha Joseph",
    phone: "+91 87654 32109",
    product: "Coral Pink Kanchipuram Silk Saree",
    quantity: 1,
    amount: 7999,
    reason: "Size Issue",
    status: "Received",
    refundStatus: "Processing",
    courier: "Delhivery",
    reverseAwb: "REV555666777",
    pickupAddress: "Kochi, Kerala",
    requestDate: "11 Sep 2026",
    pickupDate: "14 Sep 2026",
    remarks: "Returned product received at warehouse and is under inspection.",
  },
  {
    id: "RET006",
    orderId: "MB1045",
    customer: "Vishnu Kumar",
    phone: "+91 90123 45678",
    product: "Teal Designer Silk Saree",
    quantity: 1,
    amount: 8499,
    reason: "Quality Issue",
    status: "Refunded",
    refundStatus: "Refunded",
    courier: "Shiprocket",
    reverseAwb: "REV222333444",
    pickupAddress: "Coimbatore, Tamil Nadu",
    requestDate: "08 Sep 2026",
    pickupDate: "10 Sep 2026",
    remarks: "Return approved and refund completed successfully.",
  },
  {
    id: "RET007",
    orderId: "MB1046",
    customer: "Sreedevi Nair",
    phone: "+91 88990 11223",
    product: "Kerala Kasavu Saree",
    quantity: 1,
    amount: 3299,
    reason: "Changed Mind",
    status: "Rejected",
    refundStatus: "Not Applicable",
    courier: "Delhivery",
    reverseAwb: "-",
    pickupAddress: "Thrissur, Kerala",
    requestDate: "07 Sep 2026",
    pickupDate: "-",
    remarks: "Return request rejected because the return window had expired.",
  },
];

export default function ReturnsPage() {
  const [returns, setReturns] = useState(initialReturns);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [reasonFilter, setReasonFilter] = useState("All");

  const [selectedReturn, setSelectedReturn] =
    useState<ReturnRecord | null>(null);

  const filteredReturns = useMemo(() => {
    return returns.filter((returnItem) => {
      const searchValue = search.toLowerCase();

      const searchMatch =
        returnItem.id.toLowerCase().includes(searchValue) ||
        returnItem.orderId.toLowerCase().includes(searchValue) ||
        returnItem.customer.toLowerCase().includes(searchValue) ||
        returnItem.product.toLowerCase().includes(searchValue) ||
        returnItem.reverseAwb.toLowerCase().includes(searchValue);

      const statusMatch =
        statusFilter === "All" ||
        returnItem.status === statusFilter;

      const reasonMatch =
        reasonFilter === "All" ||
        returnItem.reason === reasonFilter;

      return searchMatch && statusMatch && reasonMatch;
    });
  }, [returns, search, statusFilter, reasonFilter]);

  const totalReturns = returns.length;

  const requested = returns.filter(
    (item) => item.status === "Requested"
  ).length;

  const pickupScheduled = returns.filter(
    (item) => item.status === "Pickup Scheduled"
  ).length;

  const received = returns.filter(
    (item) => item.status === "Received"
  ).length;

  const refunded = returns.filter(
    (item) => item.status === "Refunded"
  ).length;

  const updateStatus = (
    id: string,
    status: ReturnStatus,
    refundStatus?: RefundStatus
  ) => {
    setReturns((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              ...(refundStatus ? { refundStatus } : {}),
            }
          : item
      )
    );

    setSelectedReturn(null);
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
            Returns & Reverse Pickup
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage customer returns, reverse shipments and refunds.
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
          title="Total Returns"
          value={totalReturns}
          icon={<RotateCcw className="h-5 w-5" />}
        />

        <SummaryCard
          title="Requested"
          value={requested}
          icon={<Clock className="h-5 w-5" />}
        />

        <SummaryCard
          title="Pickup Scheduled"
          value={pickupScheduled}
          icon={<Truck className="h-5 w-5" />}
        />

        <SummaryCard
          title="Received"
          value={received}
          icon={<Package className="h-5 w-5" />}
        />

        <SummaryCard
          title="Refunded"
          value={refunded}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

            <input
              type="text"
              placeholder="Search return, order, customer, product or AWB..."
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
            <option value="Requested">Requested</option>
            <option value="Approved">Approved</option>
            <option value="Pickup Scheduled">
              Pickup Scheduled
            </option>
            <option value="Picked Up">Picked Up</option>
            <option value="Received">Received</option>
            <option value="Refunded">Refunded</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="All">All Reasons</option>
            <option value="Damaged Product">
              Damaged Product
            </option>
            <option value="Wrong Product">Wrong Product</option>
            <option value="Size Issue">Size Issue</option>
            <option value="Quality Issue">Quality Issue</option>
            <option value="Changed Mind">Changed Mind</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <TableHeader>Return</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Product</TableHeader>
                <TableHeader>Reason</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Reverse AWB</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Refund</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {filteredReturns.map((returnItem) => (
                <tr
                  key={returnItem.id}
                  className="transition hover:bg-neutral-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-neutral-900">
                      {returnItem.id}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Order #{returnItem.orderId}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-neutral-900">
                      {returnItem.customer}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {returnItem.phone}
                    </p>
                  </td>

                  <td className="max-w-[220px] px-5 py-4">
                    <p className="truncate text-sm text-neutral-700">
                      {returnItem.product}
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      Qty: {returnItem.quantity}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <ReasonBadge reason={returnItem.reason} />
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-neutral-900">
                      ₹{returnItem.amount.toLocaleString("en-IN")}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs text-neutral-600">
                      {returnItem.reverseAwb}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <ReturnStatusBadge status={returnItem.status} />
                  </td>

                  <td className="px-5 py-4">
                    <RefundBadge status={returnItem.refundStatus} />
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedReturn(returnItem)}
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

        {filteredReturns.length === 0 && <EmptyState />}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {filteredReturns.map((returnItem) => (
          <div
            key={returnItem.id}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-neutral-900">
                  {returnItem.id}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Order #{returnItem.orderId}
                </p>
              </div>

              <ReturnStatusBadge status={returnItem.status} />
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-neutral-900">
                {returnItem.product}
              </p>

              <p className="mt-1 text-sm font-semibold text-neutral-900">
                ₹{returnItem.amount.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <InfoRow
                icon={<Package className="h-4 w-4" />}
                label="Customer"
                value={returnItem.customer}
              />

              <InfoRow
                icon={<RotateCcw className="h-4 w-4" />}
                label="Reason"
                value={returnItem.reason}
              />

              <InfoRow
                icon={<Truck className="h-4 w-4" />}
                label="Courier"
                value={returnItem.courier}
              />

              <InfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Request Date"
                value={returnItem.requestDate}
              />

              <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="text-xs text-neutral-500">
                  Refund
                </span>

                <RefundBadge status={returnItem.refundStatus} />
              </div>
            </div>

            <button
              onClick={() => setSelectedReturn(returnItem)}
              className="mt-4 w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Manage Return
            </button>
          </div>
        ))}

        {filteredReturns.length === 0 && <EmptyState />}
      </div>

      {/* Modal */}
      {selectedReturn && (
        <ReturnModal
          returnItem={selectedReturn}
          onClose={() => setSelectedReturn(null)}
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
/* Return Status Badge */
/* ---------------------------------- */

function ReturnStatusBadge({
  status,
}: {
  status: ReturnStatus;
}) {
  const styles: Record<ReturnStatus, string> = {
    Requested: "bg-amber-50 text-amber-700",
    Approved: "bg-blue-50 text-blue-700",
    "Pickup Scheduled": "bg-indigo-50 text-indigo-700",
    "Picked Up": "bg-purple-50 text-purple-700",
    Received: "bg-cyan-50 text-cyan-700",
    Refunded: "bg-green-50 text-green-700",
    Rejected: "bg-red-50 text-red-700",
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
/* Refund Badge */
/* ---------------------------------- */

function RefundBadge({
  status,
}: {
  status: RefundStatus;
}) {
  const styles: Record<RefundStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Processing: "bg-blue-50 text-blue-700",
    Refunded: "bg-green-50 text-green-700",
    "Not Applicable": "bg-neutral-100 text-neutral-500",
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

function ReasonBadge({
  reason,
}: {
  reason: ReturnReason;
}) {
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
      <RotateCcw className="h-10 w-10 text-neutral-300" />

      <h3 className="mt-4 text-base font-semibold text-neutral-800">
        No returns found
      </h3>

      <p className="mt-1 text-sm text-neutral-500">
        Try changing your search or filters.
      </p>
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

/* ---------------------------------- */
/* Return Modal */
/* ---------------------------------- */

function ReturnModal({
  returnItem,
  onClose,
  onUpdateStatus,
}: {
  returnItem: ReturnRecord;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    status: ReturnStatus,
    refundStatus?: RefundStatus
  ) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-neutral-200 bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Return Management
            </p>

            <h2 className="mt-1 text-xl font-semibold text-neutral-900">
              {returnItem.id}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Order #{returnItem.orderId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 p-5 sm:p-6">
          <ReturnStatusBadge status={returnItem.status} />

          <RefundBadge status={returnItem.refundStatus} />
        </div>

        {/* Return Information */}
        <div className="grid gap-4 border-b border-neutral-200 p-5 sm:grid-cols-2 sm:p-6">
          <DetailBox
            label="Customer"
            value={returnItem.customer}
          />

          <DetailBox
            label="Phone"
            value={returnItem.phone}
          />

          <DetailBox
            label="Product"
            value={returnItem.product}
          />

          <DetailBox
            label="Quantity"
            value={String(returnItem.quantity)}
          />

          <DetailBox
            label="Return Reason"
            value={returnItem.reason}
          />

          <DetailBox
            label="Refund Amount"
            value={`₹${returnItem.amount.toLocaleString("en-IN")}`}
          />

          <DetailBox
            label="Courier"
            value={returnItem.courier}
          />

          <DetailBox
            label="Reverse AWB"
            value={returnItem.reverseAwb}
          />

          <DetailBox
            label="Request Date"
            value={returnItem.requestDate}
          />

          <DetailBox
            label="Pickup Date"
            value={returnItem.pickupDate}
          />

          <DetailBox
            label="Pickup Address"
            value={returnItem.pickupAddress}
          />
        </div>

        {/* Remarks */}
        <div className="border-b border-neutral-200 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-neutral-900">
            Return Remarks
          </h3>

          <div className="mt-3 rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
            {returnItem.remarks}
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-neutral-900">
            Return Actions
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {returnItem.status === "Requested" && (
              <>
                <button
                  onClick={() =>
                    onUpdateStatus(returnItem.id, "Approved")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Return
                </button>

                <button
                  onClick={() =>
                    onUpdateStatus(returnItem.id, "Rejected")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Return
                </button>
              </>
            )}

            {returnItem.status === "Approved" && (
              <button
                onClick={() =>
                  onUpdateStatus(
                    returnItem.id,
                    "Pickup Scheduled"
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                <CalendarDays className="h-4 w-4" />
                Schedule Reverse Pickup
              </button>
            )}

            {returnItem.status === "Pickup Scheduled" && (
              <button
                onClick={() =>
                  onUpdateStatus(returnItem.id, "Picked Up")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                <Truck className="h-4 w-4" />
                Mark Picked Up
              </button>
            )}

            {returnItem.status === "Picked Up" && (
              <button
                onClick={() =>
                  onUpdateStatus(returnItem.id, "Received")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                <Package className="h-4 w-4" />
                Mark Received
              </button>
            )}

            {returnItem.status === "Received" &&
              returnItem.refundStatus === "Processing" && (
                <button
                  onClick={() =>
                    onUpdateStatus(
                      returnItem.id,
                      "Refunded",
                      "Refunded"
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  <IndianRupee className="h-4 w-4" />
                  Process Refund
                </button>
              )}

            {returnItem.status === "Received" &&
              returnItem.refundStatus === "Pending" && (
                <button
                  onClick={() =>
                    onUpdateStatus(
                      returnItem.id,
                      "Received",
                      "Processing"
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  <IndianRupee className="h-4 w-4" />
                  Start Refund
                </button>
              )}
          </div>
        </div>

        {/* Customer Contact */}
        <div className="border-t border-neutral-200 bg-neutral-50 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <a
              href={`tel:${returnItem.phone}`}
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
    </div>
  );
}