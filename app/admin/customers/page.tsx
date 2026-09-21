"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  User,
  Mail,
  Phone,
  ShoppingBag,
  IndianRupee,
  UserCheck,
  UserX,
  RefreshCw,
  Loader2,
  Eye,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type Customer = {
  _id: string;
  name: string;
  email: string;
  phone?: string;

  role: string;

  isActive: boolean;

  createdAt: string;
  updatedAt?: string;

  orderCount: number;
  totalSpent: number;
  lastOrder?: string | null;
};

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken")
  );
}

function formatPrice(amount: number) {
  return `₹${Number(amount || 0).toLocaleString(
    "en-IN"
  )}`;
}

function formatDate(date?: string | null) {
  if (!date) {
    return "No orders";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [updatingCustomerId, setUpdatingCustomerId] =
    useState<string | null>(null);

  async function fetchCustomers() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/admin/customers`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch customers"
        );
      }

      setCustomers(
        Array.isArray(data?.customers)
          ? data.customers
          : []
      );
    } catch (err: any) {
      console.error(
        "FETCH CUSTOMERS ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function toggleCustomerStatus(
    customer: Customer
  ) {
    try {
      setUpdatingCustomerId(
        customer._id
      );

      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const newStatus =
        !customer.isActive;

      const response = await fetch(
        `${API_URL}/admin/customers/${customer._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update customer status"
        );
      }

      setCustomers((currentCustomers) =>
        currentCustomers.map((item) =>
          item._id === customer._id
            ? {
                ...item,
                isActive: newStatus,
              }
            : item
        )
      );
    } catch (err: any) {
      console.error(
        "UPDATE CUSTOMER STATUS ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to update customer status."
      );
    } finally {
      setUpdatingCustomerId(null);
    }
  }

  const filteredCustomers =
    customers.filter((customer) => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        customer.name
          ?.toLowerCase()
          .includes(query) ||
        customer.email
          ?.toLowerCase()
          .includes(query) ||
        customer.phone
          ?.toLowerCase()
          .includes(query)
      );
    });

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.filter(
      (customer) => customer.isActive
    ).length;

  const blockedCustomers =
    customers.filter(
      (customer) => !customer.isActive
    ).length;

  const totalOrders =
    customers.reduce(
      (total, customer) =>
        total +
        Number(customer.orderCount || 0),
      0
    );

  const totalRevenue =
    customers.reduce(
      (total, customer) =>
        total +
        Number(customer.totalSpent || 0),
      0
    );

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage your customers and view
            their purchase activity.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">
                Total Customers
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {totalCustomers}
              </p>
            </div>

            <div className="rounded-xl bg-neutral-100 p-3">
              <User className="h-5 w-5 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">
                Active Customers
              </p>

              <p className="mt-2 text-2xl font-semibold text-green-600">
                {activeCustomers}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">
                Total Orders
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {totalOrders}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">
                Customer Revenue
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {formatPrice(
                  totalRevenue
                )}
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-3">
              <IndianRupee className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customers by name, email or phone..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-neutral-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading customers...
          </div>
        </div>
      ) : filteredCustomers.length ===
        0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 text-center">
          <User className="mb-4 h-10 w-10 text-neutral-300" />

          <h2 className="text-lg font-semibold text-neutral-900">
            No customers found
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {search
              ? "Try a different search term."
              : "No customer accounts are available yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
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
                      Spent
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Last Order
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {filteredCustomers.map(
                    (customer) => {
                      const updating =
                        updatingCustomerId ===
                        customer._id;

                      return (
                        <tr
                          key={
                            customer._id
                          }
                          className="transition hover:bg-neutral-50"
                        >
                          {/* Customer */}
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                                {customer.name
                                  ?.charAt(
                                    0
                                  )
                                  .toUpperCase() ||
                                  "U"}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-medium text-neutral-900">
                                  {
                                    customer.name
                                  }
                                </p>

                                <p className="mt-0.5 text-xs text-neutral-500">
                                  Joined{" "}
                                  {formatDate(
                                    customer.createdAt
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-5 py-5">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <Mail className="h-3.5 w-3.5" />
                                <span>
                                  {
                                    customer.email
                                  }
                                </span>
                              </div>

                              {customer.phone && (
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                  <Phone className="h-3.5 w-3.5" />
                                  <span>
                                    {
                                      customer.phone
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Orders */}
                          <td className="px-5 py-5">
                            <span className="font-medium text-neutral-900">
                              {
                                customer.orderCount
                              }
                            </span>
                          </td>

                          {/* Spent */}
                          <td className="px-5 py-5">
                            <span className="font-medium text-neutral-900">
                              {formatPrice(
                                customer.totalSpent
                              )}
                            </span>
                          </td>

                          {/* Last order */}
                          <td className="px-5 py-5">
                            <span className="text-sm text-neutral-600">
                              {formatDate(
                                customer.lastOrder
                              )}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                customer.isActive
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {customer.isActive
                                ? "Active"
                                : "Blocked"}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-5 py-5">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/admin/customers/${customer._id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleCustomerStatus(
                                    customer
                                  )
                                }
                                disabled={
                                  updating
                                }
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium disabled:opacity-50 ${
                                  customer.isActive
                                    ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                    : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                }`}
                              >
                                {updating ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : customer.isActive ? (
                                  <UserX className="h-3.5 w-3.5" />
                                ) : (
                                  <UserCheck className="h-3.5 w-3.5" />
                                )}

                                {customer.isActive
                                  ? "Block"
                                  : "Unblock"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-4 lg:hidden">
            {filteredCustomers.map(
              (customer) => {
                const updating =
                  updatingCustomerId ===
                  customer._id;

                return (
                  <div
                    key={customer._id}
                    className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                          {customer.name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "U"}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-neutral-900">
                            {
                              customer.name
                            }
                          </h3>

                          <p className="truncate text-xs text-neutral-500">
                            {
                              customer.email
                            }
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          customer.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {customer.isActive
                          ? "Active"
                          : "Blocked"}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-neutral-50 p-3">
                        <p className="text-xs text-neutral-500">
                          Orders
                        </p>

                        <p className="mt-1 font-semibold text-neutral-900">
                          {
                            customer.orderCount
                          }
                        </p>
                      </div>

                      <div className="rounded-xl bg-neutral-50 p-3">
                        <p className="text-xs text-neutral-500">
                          Spent
                        </p>

                        <p className="mt-1 font-semibold text-neutral-900">
                          {formatPrice(
                            customer.totalSpent
                          )}
                        </p>
                      </div>
                    </div>

                    {customer.phone && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                        <Phone className="h-4 w-4" />
                        {
                          customer.phone
                        }
                      </div>
                    )}

                    <p className="mt-2 text-xs text-neutral-400">
                      Last order:{" "}
                      {formatDate(
                        customer.lastOrder
                      )}
                    </p>

                    <div className="mt-5 flex gap-2">
                      <Link
                        href={`/admin/customers/${customer._id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          toggleCustomerStatus(
                            customer
                          )
                        }
                        disabled={
                          updating
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50 ${
                          customer.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {updating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : customer.isActive ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}

                        {customer.isActive
                          ? "Block"
                          : "Unblock"}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
    </div>
  );
}