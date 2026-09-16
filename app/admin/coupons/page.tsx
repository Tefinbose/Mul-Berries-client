"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Tag,
  CalendarDays,
  X,
  Percent,
  IndianRupee,
} from "lucide-react";

type Coupon = {
  id: string;
  code: string;
  type: "Percentage" | "Fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  used: number;
  expiry: string;
  status: "Active" | "Expired" | "Disabled";
};

const initialCoupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    minOrder: 999,
    maxDiscount: 500,
    usageLimit: 500,
    used: 124,
    expiry: "2026-12-31",
    status: "Active",
  },
  {
    id: "2",
    code: "SAVE500",
    type: "Fixed",
    value: 500,
    minOrder: 4999,
    usageLimit: 200,
    used: 76,
    expiry: "2026-10-30",
    status: "Active",
  },
  {
    id: "3",
    code: "FESTIVE20",
    type: "Percentage",
    value: 20,
    minOrder: 2999,
    maxDiscount: 1000,
    usageLimit: 300,
    used: 300,
    expiry: "2026-08-31",
    status: "Expired",
  },
  {
    id: "4",
    code: "NEWUSER15",
    type: "Percentage",
    value: 15,
    minOrder: 1499,
    maxDiscount: 750,
    usageLimit: 100,
    used: 32,
    expiry: "2026-11-15",
    status: "Disabled",
  },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "Percentage" as "Percentage" | "Fixed",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    expiry: "",
  });

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = coupon.code
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || coupon.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  const activeCount = coupons.filter(
    (coupon) => coupon.status === "Active"
  ).length;

  const expiredCount = coupons.filter(
    (coupon) => coupon.status === "Expired"
  ).length;

  const totalUsage = coupons.reduce(
    (total, coupon) => total + coupon.used,
    0
  );

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCoupon.code || !newCoupon.value || !newCoupon.expiry) {
      alert("Please fill in the required fields.");
      return;
    }

    const coupon: Coupon = {
      id: Date.now().toString(),
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: Number(newCoupon.value),
      minOrder: Number(newCoupon.minOrder) || 0,
      maxDiscount:
        newCoupon.type === "Percentage"
          ? Number(newCoupon.maxDiscount) || undefined
          : undefined,
      usageLimit: Number(newCoupon.usageLimit) || 100,
      used: 0,
      expiry: newCoupon.expiry,
      status: "Active",
    };

    setCoupons((prev) => [coupon, ...prev]);

    setNewCoupon({
      code: "",
      type: "Percentage",
      value: "",
      minOrder: "",
      maxDiscount: "",
      usageLimit: "",
      expiry: "",
    });

    setShowCreateModal(false);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id
          ? {
              ...coupon,
              status:
                coupon.status === "Active"
                  ? "Disabled"
                  : "Active",
            }
          : coupon
      )
    );
  };

  const deleteCoupon = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) return;

    setCoupons((prev) =>
      prev.filter((coupon) => coupon.id !== id)
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Coupons & Offers
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage discount coupons and promotional offers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Coupons"
          value={coupons.length}
          icon={<Tag size={20} />}
        />

        <SummaryCard
          title="Active Coupons"
          value={activeCount}
          icon={<Percent size={20} />}
        />

        <SummaryCard
          title="Expired"
          value={expiredCount}
          icon={<CalendarDays size={20} />}
        />

        <SummaryCard
          title="Total Usage"
          value={totalUsage}
          icon={<Tag size={20} />}
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              placeholder="Search coupon code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-neutral-400"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Coupon
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Discount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Minimum Order
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Usage
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Expiry
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {coupon.code}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Coupon ID: {coupon.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-medium text-neutral-900">
                      {coupon.type === "Percentage"
                        ? `${coupon.value}%`
                        : `₹${coupon.value}`}
                    </p>

                    {coupon.maxDiscount && (
                      <p className="mt-1 text-xs text-neutral-500">
                        Max ₹{coupon.maxDiscount}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5 text-sm text-neutral-700">
                    ₹{coupon.minOrder.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-neutral-900">
                      {coupon.used} / {coupon.usageLimit}
                    </p>

                    <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-neutral-900"
                        style={{
                          width: `${Math.min(
                            (coupon.used / coupon.usageLimit) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-neutral-700">
                    {new Date(coupon.expiry).toLocaleDateString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={coupon.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    <ActionMenu
                      coupon={coupon}
                      onToggle={() =>
                        toggleCouponStatus(coupon.id)
                      }
                      onDelete={() => deleteCoupon(coupon.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 lg:hidden">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className="rounded-2xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-neutral-900">
                  {coupon.code}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {coupon.type === "Percentage"
                    ? `${coupon.value}% discount`
                    : `₹${coupon.value} discount`}
                </p>
              </div>

              <StatusBadge status={coupon.status} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-neutral-500">
                  Minimum Order
                </p>
                <p className="mt-1 font-medium">
                  ₹{coupon.minOrder.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">
                  Usage
                </p>
                <p className="mt-1 font-medium">
                  {coupon.used} / {coupon.usageLimit}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">
                  Expiry
                </p>
                <p className="mt-1 font-medium">
                  {new Date(coupon.expiry).toLocaleDateString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">
                  Discount
                </p>
                <p className="mt-1 font-medium">
                  {coupon.type === "Percentage"
                    ? `${coupon.value}%`
                    : `₹${coupon.value}`}
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() =>
                  toggleCouponStatus(coupon.id)
                }
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-50"
              >
                {coupon.status === "Active"
                  ? "Disable"
                  : "Enable"}
              </button>

              <button
                onClick={() => deleteCoupon(coupon.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}

        {filteredCoupons.length === 0 && (
          <div className="rounded-2xl border border-dashed border-neutral-300 py-12 text-center text-sm text-neutral-500">
            No coupons found.
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Create Coupon
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Create a new discount coupon.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreateCoupon}
              className="space-y-6 p-6"
            >
              {/* Coupon Code */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Coupon Code *
                </label>

                <input
                  type="text"
                  placeholder="Example: FESTIVE20"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm uppercase outline-none focus:border-neutral-400"
                />
              </div>

              {/* Discount Type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Discount Type
                  </label>

                  <select
                    value={newCoupon.type}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        type: e.target.value as
                          | "Percentage"
                          | "Fixed",
                      })
                    }
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none"
                  >
                    <option value="Percentage">
                      Percentage
                    </option>
                    <option value="Fixed">
                      Fixed Amount
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Discount Value *
                  </label>

                  <div className="relative">
                    {newCoupon.type === "Percentage" ? (
                      <Percent
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                    ) : (
                      <IndianRupee
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                    )}

                    <input
                      type="number"
                      min="0"
                      value={newCoupon.value}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          value: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-neutral-400"
                    />
                  </div>
                </div>
              </div>

              {/* Minimum + Max Discount */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Minimum Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newCoupon.minOrder}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        minOrder: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                {newCoupon.type === "Percentage" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      Maximum Discount
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="Example: 1000"
                      value={newCoupon.maxDiscount}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          maxDiscount: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                    />
                  </div>
                )}
              </div>

              {/* Usage + Expiry */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Usage Limit
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="Example: 500"
                    value={newCoupon.usageLimit}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        usageLimit: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Expiry Date *
                  </label>

                  <input
                    type="date"
                    value={newCoupon.expiry}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        expiry: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-medium hover:bg-neutral-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* Summary Card */

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
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm text-neutral-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-semibold text-neutral-900">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/* Status Badge */

function StatusBadge({
  status,
}: {
  status: Coupon["status"];
}) {
  const styles = {
    Active: "bg-green-50 text-green-700",
    Expired: "bg-red-50 text-red-700",
    Disabled: "bg-neutral-100 text-neutral-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* Action Menu */

function ActionMenu({
  coupon,
  onToggle,
  onDelete,
}: {
  coupon: Coupon;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 hover:bg-neutral-100"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-neutral-200 bg-white p-1 text-left shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              alert("Edit functionality will be connected to the backend later.");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
          >
            <Pencil size={16} />
            Edit Coupon
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onToggle();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
          >
            <Tag size={16} />

            {coupon.status === "Active"
              ? "Disable"
              : "Enable"}
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}