"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Eye,
} from "lucide-react";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type PaymentStatus = "Paid" | "Pending" | "Failed";

type Order = {
  id: string;
  customer: string;
  email: string;
  items: number;
  amount: number;
  payment: PaymentStatus;
  status: OrderStatus;
  date: string;
};

const initialOrders: Order[] = [
  {
    id: "#MB1024",
    customer: "Anjali Menon",
    email: "anjali@example.com",
    items: 2,
    amount: 18498,
    payment: "Paid",
    status: "Delivered",
    date: "14 Sep 2026",
  },
  {
    id: "#MB1023",
    customer: "Rahul Nair",
    email: "rahul@example.com",
    items: 1,
    amount: 7499,
    payment: "Paid",
    status: "Shipped",
    date: "13 Sep 2026",
  },
  {
    id: "#MB1022",
    customer: "Meera Thomas",
    email: "meera@example.com",
    items: 3,
    amount: 26797,
    payment: "Paid",
    status: "Processing",
    date: "13 Sep 2026",
  },
  {
    id: "#MB1021",
    customer: "Arjun Kumar",
    email: "arjun@example.com",
    items: 1,
    amount: 3299,
    payment: "Pending",
    status: "Pending",
    date: "12 Sep 2026",
  },
  {
    id: "#MB1020",
    customer: "Diya Joseph",
    email: "diya@example.com",
    items: 2,
    amount: 16998,
    payment: "Paid",
    status: "Confirmed",
    date: "12 Sep 2026",
  },
  {
    id: "#MB1019",
    customer: "Neha Krishnan",
    email: "neha@example.com",
    items: 1,
    amount: 9999,
    payment: "Failed",
    status: "Cancelled",
    date: "11 Sep 2026",
  },
];

export default function AdminOrdersPage() {
  const [orders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue) ||
        order.email.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || order.payment === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending" ||
      order.status === "Processing"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.payment === "Paid")
    .reduce((total, order) => total + order.amount, 0);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPaymentFilter("All");
  };

  const hasFilters =
    search !== "" ||
    statusFilter !== "All" ||
    paymentFilter !== "All";

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
                Orders
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Manage customer orders and order status.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 lg:px-8">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingBag size={19} />}
          />

          <SummaryCard
            title="Pending"
            value={pendingOrders}
            icon={<Clock3 size={19} />}
          />

          <SummaryCard
            title="Shipped"
            value={shippedOrders}
            icon={<Truck size={19} />}
          />

          <SummaryCard
            title="Delivered"
            value={deliveredOrders}
            icon={<CheckCircle2 size={19} />}
          />

          <SummaryCard
            title="Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            icon={<ShoppingBag size={19} />}
          />
        </div>

        {/* Filters */}
        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="text"
                placeholder="Search order ID, customer or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border border-neutral-200 pl-10 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:border-neutral-950"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Payment */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:border-neutral-950"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-lg border border-neutral-200 px-4 text-sm font-medium text-neutral-600 transition hover:border-neutral-950 hover:text-neutral-950"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Orders */}
        <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="font-semibold text-neutral-950">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {filteredOrders.length} order
              {filteredOrders.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Order
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Items
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Payment
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                  >
                    {/* Order */}
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id.replace("#", "")}`}
                        className="font-medium text-neutral-950 hover:underline"
                      >
                        {order.id}
                      </Link>

                      <p className="mt-1 text-xs text-neutral-400">
                        {order.date}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-neutral-800">
                        {order.customer}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400">
                        {order.email}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {order.items}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 text-sm font-semibold text-neutral-950">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <PaymentBadge status={order.payment} />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="relative flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === order.id
                                ? null
                                : order.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
                          aria-label={`Actions for ${order.id}`}
                        >
                          <MoreHorizontal size={19} />
                        </button>

                        {openMenu === order.id && (
                          <OrderActionMenu
                            orderId={order.id}
                            onClose={() => setOpenMenu(null)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-neutral-100 md:hidden">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/admin/orders/${order.id.replace("#", "")}`}
                      className="font-semibold text-neutral-950"
                    >
                      {order.id}
                    </Link>

                    <p className="mt-1 text-xs text-neutral-400">
                      {order.date}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === order.id ? null : order.id
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-neutral-900">
                    {order.customer}
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    {order.email}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-400">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-semibold text-neutral-950">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-400">
                      Items
                    </p>

                    <p className="mt-1 text-sm text-neutral-700">
                      {order.items}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <PaymentBadge status={order.payment} />
                  <StatusBadge status={order.status} />
                </div>

                {openMenu === order.id && (
                  <div className="mt-4">
                    <OrderActionMenu
                      orderId={order.id}
                      onClose={() => setOpenMenu(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty */}
          {filteredOrders.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                <Search size={20} className="text-neutral-500" />
              </div>

              <h3 className="mt-4 font-medium text-neutral-950">
                No orders found
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                Try changing your search or filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sm font-medium text-neutral-950 underline underline-offset-4"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ---------------------------------- */
/* Summary Card                       */
/* ---------------------------------- */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{title}</p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xl font-semibold tracking-tight text-neutral-950">
        {typeof value === "number"
          ? value.toLocaleString("en-IN")
          : value}
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* Status Badge                       */
/* ---------------------------------- */

function StatusBadge({ status }: { status: OrderStatus }) {
  const classes: Record<OrderStatus, string> = {
    Pending: "bg-yellow-50 text-yellow-700",
    Confirmed: "bg-blue-50 text-blue-700",
    Processing: "bg-purple-50 text-purple-700",
    Shipped: "bg-indigo-50 text-indigo-700",
    Delivered: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${classes[status]}`}
    >
      {status}
    </span>
  );
}

/* ---------------------------------- */
/* Payment Badge                      */
/* ---------------------------------- */

function PaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const classes: Record<PaymentStatus, string> = {
    Paid: "bg-green-50 text-green-700",
    Pending: "bg-yellow-50 text-yellow-700",
    Failed: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${classes[status]}`}
    >
      {status}
    </span>
  );
}

/* ---------------------------------- */
/* Action Menu                        */
/* ---------------------------------- */

function OrderActionMenu({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const cleanId = orderId.replace("#", "");

  return (
    <div className="absolute right-0 top-10 z-20 w-44 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-lg md:w-48">
      <Link
        href={`/admin/orders/${cleanId}`}
        onClick={onClose}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
      >
        <Eye size={15} />
        View order
      </Link>

      <button
        type="button"
        onClick={() => {
          onClose();
          alert(
            "Order status update will be connected to the backend later."
          );
        }}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100"
      >
        <Truck size={15} />
        Update status
      </button>

      <button
        type="button"
        onClick={() => {
          onClose();
          alert(
            "Order cancellation will be connected to the backend later."
          );
        }}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
      >
        <XCircle size={15} />
        Cancel order
      </button>
    </div>
  );
}