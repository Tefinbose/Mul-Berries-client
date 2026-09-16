"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  UserCheck,
  Users,
  ShoppingBag,
  IndianRupee,
  X,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

type CustomerStatus = "Active" | "Blocked";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrder: string;
};

const initialCustomers: Customer[] = [
  {
    id: "CUS001",
    name: "Anjali Menon",
    email: "anjali@example.com",
    phone: "+91 98765 43210",
    status: "Active",
    orders: 8,
    totalSpent: 58490,
    joinedAt: "12 Jan 2026",
    lastOrder: "10 Sep 2026",
  },
  {
    id: "CUS002",
    name: "Rahul Nair",
    email: "rahul@example.com",
    phone: "+91 91234 56789",
    status: "Active",
    orders: 5,
    totalSpent: 32450,
    joinedAt: "25 Feb 2026",
    lastOrder: "9 Sep 2026",
  },
  {
    id: "CUS003",
    name: "Meera Krishnan",
    email: "meera@example.com",
    phone: "+91 99887 66554",
    status: "Active",
    orders: 12,
    totalSpent: 92600,
    joinedAt: "5 Nov 2025",
    lastOrder: "8 Sep 2026",
  },
  {
    id: "CUS004",
    name: "Arjun Kumar",
    email: "arjun@example.com",
    phone: "+91 90000 11223",
    status: "Blocked",
    orders: 2,
    totalSpent: 11998,
    joinedAt: "18 Mar 2026",
    lastOrder: "22 Jul 2026",
  },
  {
    id: "CUS005",
    name: "Diya Thomas",
    email: "diya@example.com",
    phone: "+91 94444 55667",
    status: "Active",
    orders: 6,
    totalSpent: 41890,
    joinedAt: "2 Apr 2026",
    lastOrder: "6 Sep 2026",
  },
  {
    id: "CUS006",
    name: "Vishnu Raj",
    email: "vishnu@example.com",
    phone: "+91 87777 88990",
    status: "Active",
    orders: 3,
    totalSpent: 21497,
    joinedAt: "14 May 2026",
    lastOrder: "1 Sep 2026",
  },
  {
    id: "CUS007",
    name: "Sneha Joseph",
    email: "sneha@example.com",
    phone: "+91 96666 77889",
    status: "Active",
    orders: 9,
    totalSpent: 67340,
    joinedAt: "20 Jun 2025",
    lastOrder: "30 Aug 2026",
  },
  {
    id: "CUS008",
    name: "Adithya Menon",
    email: "adithya@example.com",
    phone: "+91 95555 44332",
    status: "Active",
    orders: 4,
    totalSpent: 28796,
    joinedAt: "11 Jul 2026",
    lastOrder: "28 Aug 2026",
  },
];

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] =
    useState<Customer[]>(initialCustomers);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | CustomerStatus
  >("All");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText) ||
        customer.phone.toLowerCase().includes(searchText) ||
        customer.id.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const blockedCustomers = customers.filter(
    (customer) => customer.status === "Blocked"
  ).length;

  const totalOrders = customers.reduce(
    (total, customer) => total + customer.orders,
    0
  );

  const totalRevenue = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0
  );

  const handleBlockToggle = (customerId: string) => {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              status:
                customer.status === "Active"
                  ? "Blocked"
                  : "Active",
            }
          : customer
      )
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage customers, orders and customer activity.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          icon={Users}
        />

        <SummaryCard
          title="Active Customers"
          value={activeCustomers.toLocaleString()}
          icon={UserCheck}
        />

        <SummaryCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={ShoppingBag}
        />

        <SummaryCard
          title="Customer Revenue"
          value={formatPrice(totalRevenue)}
          icon={IndianRupee}
        />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone or customer ID..."
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "All" | CustomerStatus
              )
            }
            className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="All">All Customers</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-neutral-100 bg-neutral-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Orders
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Total Spent
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Joined
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-neutral-50"
                >
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={customer.name} />

                      <div>
                        <p className="font-medium text-neutral-900">
                          {customer.name}
                        </p>

                        <p className="text-xs text-neutral-500">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-neutral-700">
                      {customer.email}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {customer.phone}
                    </p>
                  </td>

                  {/* Orders */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-neutral-900">
                      {customer.orders}
                    </span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-neutral-900">
                      {formatPrice(customer.totalSpent)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={customer.status} />
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-neutral-600">
                      {customer.joinedAt}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <CustomerActionMenu
                      customer={customer}
                      onView={() =>
                        setSelectedCustomer(customer)
                      }
                      onBlock={() =>
                        handleBlockToggle(customer.id)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <EmptyState />
        )}
      </div>

      {/* Mobile Cards */}
      <div className="mt-6 space-y-4 lg:hidden">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <CustomerAvatar name={customer.name} />

                <div>
                  <h3 className="font-medium text-neutral-900">
                    {customer.name}
                  </h3>

                  <p className="text-xs text-neutral-500">
                    {customer.id}
                  </p>
                </div>
              </div>

              <CustomerActionMenu
                customer={customer}
                onView={() => setSelectedCustomer(customer)}
                onBlock={() =>
                  handleBlockToggle(customer.id)
                }
              />
            </div>

            <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <Mail className="h-4 w-4 text-neutral-400" />
                <span className="break-all">
                  {customer.email}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <Phone className="h-4 w-4 text-neutral-400" />
                <span>{customer.phone}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500">
                    Orders
                  </p>

                  <p className="mt-1 font-medium text-neutral-900">
                    {customer.orders}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Total Spent
                  </p>

                  <p className="mt-1 font-medium text-neutral-900">
                    {formatPrice(customer.totalSpent)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <StatusBadge status={customer.status} />

                <span className="text-xs text-neutral-500">
                  Joined {customer.joinedAt}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && <EmptyState />}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------- */
/* Summary Card */
/* -------------------------------- */

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{title}</p>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
          <Icon className="h-4 w-4 text-neutral-600" />
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------- */
/* Customer Avatar */
/* -------------------------------- */

function CustomerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700">
      {initials}
    </div>
  );
}

/* -------------------------------- */
/* Status Badge */
/* -------------------------------- */

function StatusBadge({
  status,
}: {
  status: CustomerStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        status === "Active"
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

/* -------------------------------- */
/* Action Menu */
/* -------------------------------- */

function CustomerActionMenu({
  customer,
  onView,
  onBlock,
}: {
  customer: Customer;
  onView: () => void;
  onBlock: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100"
      >
        <MoreHorizontal className="h-5 w-5 text-neutral-500" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onView();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              <Eye className="h-4 w-4" />
              View Customer
            </button>

            <Link
              href={`/admin/orders?customer=${customer.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              <ShoppingBag className="h-4 w-4" />
              View Orders
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onBlock();
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                customer.status === "Active"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-green-600 hover:bg-green-50"
              }`}
            >
              {customer.status === "Active" ? (
                <>
                  <Ban className="h-4 w-4" />
                  Block Customer
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  Unblock Customer
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------- */
/* Customer Details Modal */
/* -------------------------------- */

function CustomerDetailsModal({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-neutral-900">
              Customer Details
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {customer.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Customer */}
        <div className="p-5">
          <div className="flex items-center gap-4">
            <CustomerAvatar name={customer.name} />

            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {customer.name}
              </h3>

              <StatusBadge status={customer.status} />
            </div>
          </div>

          {/* Contact */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-neutral-400" />

              <div>
                <p className="text-xs text-neutral-500">
                  Email
                </p>

                <p className="text-sm text-neutral-900">
                  {customer.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-neutral-400" />

              <div>
                <p className="text-xs text-neutral-500">
                  Phone
                </p>

                <p className="text-sm text-neutral-900">
                  {customer.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-neutral-400" />

              <div>
                <p className="text-xs text-neutral-500">
                  Joined
                </p>

                <p className="text-sm text-neutral-900">
                  {customer.joinedAt}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">
                Total Orders
              </p>

              <p className="mt-2 text-xl font-semibold text-neutral-900">
                {customer.orders}
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">
                Total Spent
              </p>

              <p className="mt-2 text-xl font-semibold text-neutral-900">
                {formatPrice(customer.totalSpent)}
              </p>
            </div>
          </div>

          {/* Last Order */}
          <div className="mt-4 rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">
              Last Order
            </p>

            <p className="mt-1 text-sm font-medium text-neutral-900">
              {customer.lastOrder}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Link
              href={`/admin/orders?customer=${customer.id}`}
              className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-white hover:bg-neutral-800"
            >
              View Orders
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Empty State */
/* -------------------------------- */

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <Users className="mx-auto h-10 w-10 text-neutral-300" />

      <h3 className="mt-4 font-medium text-neutral-900">
        No customers found
      </h3>

      <p className="mt-1 text-sm text-neutral-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}