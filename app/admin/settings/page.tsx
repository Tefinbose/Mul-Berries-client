"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Settings,
  Bell,
  Truck,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Tab =
  | "general"
  | "notifications"
  | "shipping"
  | "payments"
  | "roles";

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

interface SettingsData {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;

  notifications: {
    orders: boolean;
    payments: boolean;
    inventory: boolean;
    shipping: boolean;
    returns: boolean;
    abandoned: boolean;
  };

  shipping: {
    freeShipping: boolean;
    threshold: number;
    defaultPackageWeight: number;
  };

  payments: {
    razorpay: boolean;
    cod: boolean;
    codLimit: number;
  };

  rolePermissions: {
    "Super Admin": Permission[];
    Manager: Permission[];
    Staff: Permission[];
  };
}

const defaultSettings: SettingsData = {
  storeName: "Mulberries",
  storeEmail: "support@mulberries.shop",
  storePhone: "+91 98765 43210",
  currency: "INR",

  notifications: {
    orders: true,
    payments: true,
    inventory: true,
    shipping: true,
    returns: true,
    abandoned: false,
  },

  shipping: {
    freeShipping: true,
    threshold: 999,
    defaultPackageWeight: 500,
  },

  payments: {
    razorpay: true,
    cod: true,
    codLimit: 50000,
  },

  rolePermissions: {
    "Super Admin": [
      "orders.view",
      "orders.process",
      "orders.update_status",
      "orders.prepare",
      "inventory.view",
      "inventory.update",
      "shipping.view",
      "shipping.prepare",
      "shipping.print_labels",
      "customers.view",
    ],
    Manager: [
      "orders.view",
      "orders.process",
      "orders.update_status",
      "orders.prepare",
      "inventory.view",
      "inventory.update",
      "shipping.view",
      "shipping.prepare",
      "customers.view",
    ],
    Staff: [
      "orders.view",
      "orders.process",
      "orders.prepare",
      "inventory.view",
      "inventory.update",
      "shipping.view",
      "shipping.prepare",
      "customers.view",
    ],
  },
};

const permissionLabels: Record<Permission, string> = {
  "orders.view": "View orders",
  "orders.process": "Process orders",
  "orders.update_status": "Update order status",
  "orders.prepare": "Prepare orders",
  "inventory.view": "View inventory",
  "inventory.update": "Update inventory",
  "shipping.view": "View shipping",
  "shipping.prepare": "Prepare shipments",
  "shipping.print_labels": "Print shipping labels",
  "customers.view": "View customers",
};

const tabs = [
  {
    id: "general" as Tab,
    label: "General",
    icon: Settings,
  },
  {
    id: "notifications" as Tab,
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "shipping" as Tab,
    label: "Shipping",
    icon: Truck,
  },
  {
    id: "payments" as Tab,
    label: "Payments",
    icon: CreditCard,
  },
  {
    id: "roles" as Tab,
    label: "Roles & Permissions",
    icon: ShieldCheck,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings);

  const [selectedRole, setSelectedRole] =
    useState<"Super Admin" | "Manager" | "Staff">("Staff");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => {
    if (typeof window === "undefined") return null;

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken")
    );
  };

  const fetchSettings = async () => {
    try {
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/settings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load settings"
        );
      }

      setSettings({
        ...defaultSettings,
        ...data.settings,
        notifications: {
          ...defaultSettings.notifications,
          ...(data.settings?.notifications || {}),
        },
        shipping: {
          ...defaultSettings.shipping,
          ...(data.settings?.shipping || {}),
        },
        payments: {
          ...defaultSettings.payments,
          ...(data.settings?.payments || {}),
        },
        rolePermissions: {
          ...defaultSettings.rolePermissions,
          ...(data.settings?.rolePermissions || {}),
        },
      });
    } catch (err) {
      console.error("FETCH SETTINGS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load settings"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save settings"
        );
      }

      setSettings(data.settings);

      setSuccess("Settings saved successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("SAVE SETTINGS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (
    updates: Partial<SettingsData>
  ) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const toggleNotification = (
    key: keyof SettingsData["notifications"]
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const togglePermission = (
    permission: Permission
  ) => {
    setSettings((prev) => {
      const current =
        prev.rolePermissions[selectedRole];

      const exists = current.includes(permission);

      return {
        ...prev,
        rolePermissions: {
          ...prev.rolePermissions,
          [selectedRole]: exists
            ? current.filter((item) => item !== permission)
            : [...current, permission],
        },
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="h-7 w-7 animate-spin text-gray-500" />
              <p className="text-sm text-gray-500">
                Loading settings...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your store configuration and permissions.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setRefreshing(true);
                fetchSettings();
              }}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">

          {/* Sidebar */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
            <div className="flex gap-1 overflow-x-auto lg:block">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                const active =
                  activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    className={`flex min-w-fit w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />

                    {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content */}
          <main className="rounded-xl border border-gray-200 bg-white shadow-sm">

            {activeTab === "general" && (
              <GeneralSettings
                settings={settings}
                updateSettings={updateSettings}
              />
            )}

            {activeTab === "notifications" && (
              <NotificationSettings
                settings={settings}
                toggleNotification={
                  toggleNotification
                }
              />
            )}

            {activeTab === "shipping" && (
              <ShippingSettings
                settings={settings}
                setSettings={setSettings}
              />
            )}

            {activeTab === "payments" && (
              <PaymentSettings
                settings={settings}
                setSettings={setSettings}
              />
            )}

            {activeTab === "roles" && (
              <RolePermissionSettings
                settings={settings}
                selectedRole={selectedRole}
                setSelectedRole={
                  setSelectedRole
                }
                togglePermission={
                  togglePermission
                }
              />
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   GENERAL SETTINGS
========================================================= */

function GeneralSettings({
  settings,
  updateSettings,
}: {
  settings: SettingsData;
  updateSettings: (
    updates: Partial<SettingsData>
  ) => void;
}) {
  return (
    <section>
      <SectionHeader
        title="General Settings"
        description="Basic information about your store."
      />

      <div className="grid gap-6 p-6 md:grid-cols-2">

        <InputField
          label="Store name"
          value={settings.storeName}
          onChange={(value) =>
            updateSettings({
              storeName: value,
            })
          }
        />

        <InputField
          label="Store email"
          type="email"
          value={settings.storeEmail}
          onChange={(value) =>
            updateSettings({
              storeEmail: value,
            })
          }
        />

        <InputField
          label="Store phone"
          value={settings.storePhone}
          onChange={(value) =>
            updateSettings({
              storePhone: value,
            })
          }
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Currency
          </label>

          <select
            value={settings.currency}
            onChange={(e) =>
              updateSettings({
                currency: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
          >
            <option value="INR">
              INR - Indian Rupee
            </option>

            <option value="USD">
              USD - US Dollar
            </option>

            <option value="EUR">
              EUR - Euro
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationSettings({
  settings,
  toggleNotification,
}: {
  settings: SettingsData;
  toggleNotification: (
    key: keyof SettingsData["notifications"]
  ) => void;
}) {
  const notifications = [
    {
      key: "orders" as const,
      title: "New orders",
      description:
        "Receive notifications when a new order is placed.",
    },
    {
      key: "payments" as const,
      title: "Payments",
      description:
        "Receive notifications about payment updates.",
    },
    {
      key: "inventory" as const,
      title: "Inventory",
      description:
        "Receive alerts when inventory is low.",
    },
    {
      key: "shipping" as const,
      title: "Shipping",
      description:
        "Receive shipment and delivery updates.",
    },
    {
      key: "returns" as const,
      title: "Returns",
      description:
        "Receive notifications about customer returns.",
    },
    {
      key: "abandoned" as const,
      title: "Abandoned carts",
      description:
        "Receive alerts about abandoned shopping carts.",
    },
  ];

  return (
    <section>
      <SectionHeader
        title="Notifications"
        description="Choose which notifications your team receives."
      />

      <div className="divide-y divide-gray-100">
        {notifications.map((item) => (
          <ToggleRow
            key={item.key}
            title={item.title}
            description={item.description}
            enabled={
              settings.notifications[item.key]
            }
            onToggle={() =>
              toggleNotification(item.key)
            }
          />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   SHIPPING
========================================================= */

function ShippingSettings({
  settings,
  setSettings,
}: {
  settings: SettingsData;
  setSettings: React.Dispatch<
    React.SetStateAction<SettingsData>
  >;
}) {
  return (
    <section>
      <SectionHeader
        title="Shipping Settings"
        description="Configure your store shipping rules."
      />

      <div className="p-6">

        <ToggleRow
          title="Free shipping"
          description="Enable free shipping above a minimum order value."
          enabled={
            settings.shipping.freeShipping
          }
          onToggle={() =>
            setSettings((prev) => ({
              ...prev,
              shipping: {
                ...prev.shipping,
                freeShipping:
                  !prev.shipping.freeShipping,
              },
            }))
          }
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <NumberField
            label="Free shipping threshold"
            value={settings.shipping.threshold}
            onChange={(value) =>
              setSettings((prev) => ({
                ...prev,
                shipping: {
                  ...prev.shipping,
                  threshold: value,
                },
              }))
            }
          />

          <NumberField
            label="Default package weight (grams)"
            value={
              settings.shipping
                .defaultPackageWeight
            }
            onChange={(value) =>
              setSettings((prev) => ({
                ...prev,
                shipping: {
                  ...prev.shipping,
                  defaultPackageWeight: value,
                },
              }))
            }
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PAYMENTS
========================================================= */

function PaymentSettings({
  settings,
  setSettings,
}: {
  settings: SettingsData;
  setSettings: React.Dispatch<
    React.SetStateAction<SettingsData>
  >;
}) {
  return (
    <section>
      <SectionHeader
        title="Payment Settings"
        description="Configure the payment methods available to customers."
      />

      <div className="divide-y divide-gray-100">

        <ToggleRow
          title="Razorpay"
          description="Accept online payments through Razorpay."
          enabled={
            settings.payments.razorpay
          }
          onToggle={() =>
            setSettings((prev) => ({
              ...prev,
              payments: {
                ...prev.payments,
                razorpay:
                  !prev.payments.razorpay,
              },
            }))
          }
        />

        <ToggleRow
          title="Cash on Delivery"
          description="Allow customers to pay when their order is delivered."
          enabled={settings.payments.cod}
          onToggle={() =>
            setSettings((prev) => ({
              ...prev,
              payments: {
                ...prev.payments,
                cod: !prev.payments.cod,
              },
            }))
          }
        />

        <div className="p-6">
          <NumberField
            label="COD order limit"
            value={settings.payments.codLimit}
            onChange={(value) =>
              setSettings((prev) => ({
                ...prev,
                payments: {
                  ...prev.payments,
                  codLimit: value,
                },
              }))
            }
          />
        </div>

      </div>
    </section>
  );
}

/* =========================================================
   ROLES & PERMISSIONS
========================================================= */

function RolePermissionSettings({
  settings,
  selectedRole,
  setSelectedRole,
  togglePermission,
}: {
  settings: SettingsData;
  selectedRole:
    | "Super Admin"
    | "Manager"
    | "Staff";
  setSelectedRole: React.Dispatch<
    React.SetStateAction<
      "Super Admin" | "Manager" | "Staff"
    >
  >;
  togglePermission: (
    permission: Permission
  ) => void;
}) {
  const roles = [
    "Super Admin",
    "Manager",
    "Staff",
  ] as const;

  const permissions = Object.keys(
    permissionLabels
  ) as Permission[];

  const selectedPermissions =
    settings.rolePermissions[selectedRole];

  return (
    <section>
      <SectionHeader
        title="Roles & Permissions"
        description="Configure the permissions assigned to each staff role."
      />

      <div className="p-6">

        <div className="mb-6 flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() =>
                setSelectedRole(role)
              }
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedRole === role
                  ? "bg-black text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">

          {permissions.map((permission) => {
            const enabled =
              selectedPermissions.includes(
                permission
              );

            return (
              <div
                key={permission}
                className="flex items-center justify-between border-b border-gray-100 px-4 py-4 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {permissionLabels[
                      permission
                    ]}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {permission}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    togglePermission(
                      permission
                    )
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    enabled
                      ? "bg-black"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                      enabled
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-gray-200 px-6 py-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-black"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) =>
          onChange(
            Number(e.target.value) || 0
          )
        }
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-black"
      />
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-5">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-black"
            : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}