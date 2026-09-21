"use client";

import { useEffect, useMemo, useState } from "react";
import {
  UserPlus,
  Search,
  RefreshCw,
  Pencil,
  Shield,
  UserCheck,
  UserX,
  X,
  Save,
  Users,
  Check,
  Lock,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type Role =
  | "staff"
  | "manager"
  | "admin"
  | "superadmin";

type Permission =
  | "orders.view"
  | "orders.process"
  | "orders.update_status"
  | "orders.prepare"
  | "inventory.view"
  | "inventory.update"
  | "shipping.view"
  | "shipping.prepare"
  | "shipping.print_labels"
  | "customers.view";

type Staff = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const permissions: {
  value: Permission;
  label: string;
  description: string;
}[] = [
  {
    value: "orders.view",
    label: "View Orders",
    description: "View customer orders",
  },
  {
    value: "orders.process",
    label: "Process Orders",
    description: "Process and prepare orders",
  },
  {
    value: "orders.update_status",
    label: "Update Order Status",
    description: "Change order status",
  },
  {
    value: "orders.prepare",
    label: "Prepare Orders",
    description: "Prepare orders for shipment",
  },
  {
    value: "inventory.view",
    label: "View Inventory",
    description: "View inventory information",
  },
  {
    value: "inventory.update",
    label: "Update Inventory",
    description: "Change stock quantities",
  },
  {
    value: "shipping.view",
    label: "View Shipping",
    description: "View shipments",
  },
  {
    value: "shipping.prepare",
    label: "Prepare Shipping",
    description: "Prepare shipments",
  },
  {
    value: "shipping.print_labels",
    label: "Print Labels",
    description: "Generate and print shipping labels",
  },
  {
    value: "customers.view",
    label: "View Customers",
    description: "View customer information",
  },
];

const roleLabels: Record<Role, string> = {
  staff: "Staff",
  manager: "Manager",
  admin: "Admin",
  superadmin: "Super Admin",
};

const roleDescriptions: Record<Role, string> = {
  staff: "Operational access",
  manager: "Management access",
  admin: "Administrative access",
  superadmin: "Full system access",
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState<"all" | Role>("all");

  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "inactive">("all");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingStaff, setEditingStaff] =
    useState<Staff | null>(null);

  const [saving, setSaving] = useState(false);

  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff" as Role,
    permissions: [] as Permission[],
  });

  const loadStaff = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/admin/staff`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load staff"
        );
      }

      setStaff(data.staff || []);
    } catch (error) {
      console.error("LOAD STAFF ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load staff"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();

    return staff.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" ||
        member.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          member.isActive) ||
        (statusFilter === "inactive" &&
          !member.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    staff,
    search,
    roleFilter,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    return {
      total: staff.length,

      active: staff.filter(
        (member) => member.isActive
      ).length,

      inactive: staff.filter(
        (member) => !member.isActive
      ).length,

      managers: staff.filter(
        (member) => member.role === "manager"
      ).length,
    };
  }, [staff]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "staff",
      permissions: [],
    });

    setEditingStaff(null);
    setFormError("");
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (member: Staff) => {
    setEditingStaff(member);

    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      password: "",
      role: member.role,
      permissions: member.permissions || [],
    });

    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    resetForm();
  };

  const togglePermission = (
    permission: Permission
  ) => {
    setForm((current) => {
      const exists =
        current.permissions.includes(permission);

      return {
        ...current,
        permissions: exists
          ? current.permissions.filter(
              (item) => item !== permission
            )
          : [
              ...current.permissions,
              permission,
            ],
      };
    });
  };

  const handleRoleChange = (role: Role) => {
    setForm((current) => ({
      ...current,
      role,
      permissions:
        role === "superadmin"
          ? permissions.map(
              (permission) => permission.value
            )
          : current.permissions,
    }));
  };

  const handleSave = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setFormError("");

    if (!form.name.trim()) {
      setFormError("Name is required");
      return;
    }

    if (!form.email.trim()) {
      setFormError("Email is required");
      return;
    }

    if (!editingStaff && !form.password) {
      setFormError("Password is required");
      return;
    }

    if (
      form.password &&
      form.password.length < 6
    ) {
      setFormError(
        "Password must contain at least 6 characters"
      );
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication required"
        );
      }

      const body: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        permissions: form.permissions,
      };

      if (form.password) {
        body.password = form.password;
      }

      const url = editingStaff
        ? `${API_URL}/admin/staff/${editingStaff._id}`
        : `${API_URL}/admin/staff`;

      const response = await fetch(url, {
        method: editingStaff ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save staff member"
        );
      }

      const updatedStaff = data.staff;

      if (editingStaff) {
        setStaff((current) =>
          current.map((member) =>
            member._id === updatedStaff._id
              ? updatedStaff
              : member
          )
        );
      } else {
        setStaff((current) => [
          updatedStaff,
          ...current,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error("SAVE STAFF ERROR:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to save staff member"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (
    member: Staff
  ) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication required"
        );
      }

      const response = await fetch(
        `${API_URL}/admin/staff/${member._id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            isActive: !member.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update status"
        );
      }

      setStaff((current) =>
        current.map((item) =>
          item._id === member._id
            ? data.staff
            : item
        )
      );
    } catch (error) {
      console.error(
        "UPDATE STAFF STATUS ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update status"
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Staff Management
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Manage staff accounts, roles and permissions.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadStaff(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <UserPlus size={16} />
              Add Staff
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Users size={18} />}
            label="Total Staff"
            value={stats.total}
          />

          <StatCard
            icon={<UserCheck size={18} />}
            label="Active"
            value={stats.active}
          />

          <StatCard
            icon={<UserX size={18} />}
            label="Inactive"
            value={stats.inactive}
          />

          <StatCard
            icon={<Shield size={18} />}
            label="Managers"
            value={stats.managers}
          />
        </div>

        {/* FILTERS */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search staff..."
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm outline-none transition focus:border-neutral-400"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value as
                    | "all"
                    | Role
                )
              }
              className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none"
            >
              <option value="all">
                All Roles
              </option>

              <option value="staff">
                Staff
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="admin">
                Admin
              </option>

              <option value="superadmin">
                Super Admin
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | "active"
                    | "inactive"
                )
              }
              className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none"
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="h-11 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <RefreshCw
                size={22}
                className="animate-spin text-neutral-500"
              />
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <Users
                size={32}
                className="text-neutral-300"
              />

              <h3 className="mt-4 text-sm font-semibold text-neutral-900">
                No staff members found
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                Try changing your filters or add a new staff member.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Staff
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Role
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Permissions
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Joined
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStaff.map(
                      (member) => (
                        <tr
                          key={member._id}
                          className="border-b border-neutral-100 last:border-0"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700">
                                {member.name
                                  .slice(0, 1)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-neutral-900">
                                  {member.name}
                                </p>

                                <p className="mt-0.5 text-xs text-neutral-500">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <RoleBadge
                              role={member.role}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm text-neutral-600">
                              {member.role ===
                              "superadmin"
                                ? "Full access"
                                : `${member.permissions.length} permissions`}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              active={
                                member.isActive
                              }
                            />
                          </td>

                          <td className="px-5 py-4 text-sm text-neutral-500">
                            {formatDate(
                              member.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    member
                                  )
                                }
                                className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>

                              <button
                                type="button"
                                disabled={
                                  member.role ===
                                  "superadmin"
                                }
                                onClick={() =>
                                  toggleStatus(
                                    member
                                  )
                                }
                                className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
                                title={
                                  member.isActive
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                {member.isActive ? (
                                  <UserX
                                    size={15}
                                  />
                                ) : (
                                  <UserCheck
                                    size={15}
                                  />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="divide-y divide-neutral-100 md:hidden">
                {filteredStaff.map(
                  (member) => (
                    <div
                      key={member._id}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700">
                            {member.name
                              .slice(0, 1)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {member.name}
                            </p>

                            <p className="text-xs text-neutral-500">
                              {member.email}
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          active={
                            member.isActive
                          }
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <RoleBadge
                          role={member.role}
                        />

                        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600">
                          {member.role ===
                          "superadmin"
                            ? "Full access"
                            : `${member.permissions.length} permissions`}
                        </span>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              member
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            member.role ===
                            "superadmin"
                          }
                          onClick={() =>
                            toggleStatus(
                              member
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 disabled:opacity-30"
                        >
                          {member.isActive ? (
                            <>
                              <UserX size={15} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck
                                size={15}
                              />
                              Activate
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-950">
                  {editingStaff
                    ? "Edit Staff"
                    : "Add Staff"}
                </h2>

                <p className="mt-0.5 text-xs text-neutral-500">
                  Configure account access and permissions.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-5"
            >
              {formError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      name: value,
                    }))
                  }
                  placeholder="Staff name"
                />

                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      phone: value,
                    }))
                  }
                  placeholder="+91..."
                />

                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      email: value,
                    }))
                  }
                  placeholder="staff@mulberries.shop"
                />

                <Input
                  label={
                    editingStaff
                      ? "New Password"
                      : "Password"
                  }
                  type="password"
                  value={form.password}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      password: value,
                    }))
                  }
                  placeholder={
                    editingStaff
                      ? "Leave empty to keep current"
                      : "Minimum 6 characters"
                  }
                />
              </div>

              {/* ROLE */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Role
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(
                    [
                      "staff",
                      "manager",
                      "admin",
                      "superadmin",
                    ] as Role[]
                  ).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() =>
                        handleRoleChange(
                          role
                        )
                      }
                      className={`rounded-xl border p-3 text-left transition ${
                        form.role === role
                          ? "border-neutral-950 bg-neutral-950 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        {roleLabels[role]}
                      </p>

                      <p
                        className={`mt-1 text-[11px] ${
                          form.role === role
                            ? "text-neutral-400"
                            : "text-neutral-500"
                        }`}
                      >
                        {roleDescriptions[
                          role
                        ]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* PERMISSIONS */}
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-neutral-800">
                      Permissions
                    </label>

                    <p className="mt-1 text-xs text-neutral-500">
                      Select the modules this staff member can access.
                    </p>
                  </div>

                  {form.role ===
                    "superadmin" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3 py-1.5 text-xs text-white">
                      <Lock size={12} />
                      Full access
                    </span>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {permissions.map(
                    (permission) => {
                      const enabled =
                        form.role ===
                          "superadmin" ||
                        form.permissions.includes(
                          permission.value
                        );

                      return (
                        <button
                          key={
                            permission.value
                          }
                          type="button"
                          disabled={
                            form.role ===
                            "superadmin"
                          }
                          onClick={() =>
                            togglePermission(
                              permission.value
                            )
                          }
                          className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                            enabled
                              ? "border-neutral-950 bg-neutral-50"
                              : "border-neutral-200 bg-white"
                          } ${
                            form.role ===
                            "superadmin"
                              ? "cursor-default"
                              : "hover:bg-neutral-50"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                              enabled
                                ? "border-neutral-950 bg-neutral-950 text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {enabled && (
                              <Check
                                size={13}
                              />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-neutral-800">
                              {
                                permission.label
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-neutral-500">
                              {
                                permission.description
                              }
                            </p>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-7 flex justify-end gap-3 border-t border-neutral-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={15} />
                  )}

                  {editingStaff
                    ? "Save Changes"
                    : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
        {icon}
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-neutral-950">
        {value}
      </p>
    </div>
  );
}

function RoleBadge({
  role,
}: {
  role: Role;
}) {
  return (
    <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
      {roleLabels[role]}
    </span>
  );
}

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-green-50 text-green-700"
          : "bg-neutral-100 text-neutral-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

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
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400"
      />
    </div>
  );
}