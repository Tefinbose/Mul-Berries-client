"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Globe,
  Lock,
  Save,
  Settings,
  Shield,
  Store,
  Truck,
  Users,
  Package,
  ShoppingBag,
  BarChart3,
  TicketPercent,
  RotateCcw,
} from "lucide-react";

type Tab =
  | "general"
  | "notifications"
  | "shipping"
  | "payments"
  | "roles";

type Role = "Super Admin" | "Manager" | "Staff";

type Permission = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const permissions: Permission[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "View dashboard and business KPIs",
    icon: <BarChart3 size={17} />,
  },
  {
    id: "products",
    label: "Products",
    description: "Create, edit and manage products",
    icon: <Package size={17} />,
  },
  {
    id: "orders",
    label: "Orders",
    description: "View and manage customer orders",
    icon: <ShoppingBag size={17} />,
  },
  {
    id: "customers",
    label: "Customers",
    description: "Manage customer accounts",
    icon: <Users size={17} />,
  },
  {
    id: "inventory",
    label: "Inventory",
    description: "Manage stock and inventory",
    icon: <Package size={17} />,
  },
  {
    id: "coupons",
    label: "Coupons & Offers",
    description: "Create and manage promotions",
    icon: <TicketPercent size={17} />,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "View sales and business analytics",
    icon: <BarChart3 size={17} />,
  },
  {
    id: "shipping",
    label: "Shipping",
    description: "Manage shipments and couriers",
    icon: <Truck size={17} />,
  },
  {
    id: "refunds",
    label: "Returns & Refunds",
    description: "Manage returns and refunds",
    icon: <RotateCcw size={17} />,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Manage store configuration",
    icon: <Settings size={17} />,
  },
  {
    id: "staff",
    label: "Staff Management",
    description: "Manage admin users and roles",
    icon: <Users size={17} />,
  },
];

const initialPermissions: Record<Role, string[]> = {
  "Super Admin": permissions.map((permission) => permission.id),

  Manager: [
    "dashboard",
    "products",
    "orders",
    "customers",
    "inventory",
    "coupons",
    "analytics",
    "shipping",
    "refunds",
  ],

  Staff: [
    "dashboard",
    "orders",
    "customers",
    "inventory",
  ],
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] =
    useState<Tab>("general");

  const [selectedRole, setSelectedRole] =
    useState<Role>("Manager");

  const [rolePermissions, setRolePermissions] =
    useState(initialPermissions);

  const [saved, setSaved] = useState(false);

  const [storeName, setStoreName] =
    useState("Mulberries");

  const [storeEmail, setStoreEmail] = useState(
    "support@mulberries.shop"
  );

  const [storePhone, setStorePhone] =
    useState("+91 98765 43210");

  const [currency, setCurrency] =
    useState("INR");

  const togglePermission = (
    permissionId: string
  ) => {
    if (selectedRole === "Super Admin") return;

    setRolePermissions((previous) => {
      const current =
        previous[selectedRole];

      const exists =
        current.includes(permissionId);

      return {
        ...previous,
        [selectedRole]: exists
          ? current.filter(
              (id) => id !== permissionId
            )
          : [...current, permissionId],
      };
    });
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const tabs = [
    {
      id: "general" as Tab,
      label: "General",
      description: "Store information",
      icon: <Store size={18} />,
    },
    {
      id: "notifications" as Tab,
      label: "Notifications",
      description: "Alerts and updates",
      icon: <Bell size={18} />,
    },
    {
      id: "shipping" as Tab,
      label: "Shipping",
      description: "Delivery configuration",
      icon: <Truck size={18} />,
    },
    {
      id: "payments" as Tab,
      label: "Payments",
      description: "Payment methods",
      icon: <CreditCard size={18} />,
    },
    {
      id: "roles" as Tab,
      label: "Roles & Permissions",
      description: "Admin access control",
      icon: <Shield size={18} />,
    },
  ];

  return (
    <div className="min-h-full bg-[#fafafa]">
      {/* Page Header */}

      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
          <span>Admin</span>

          <ChevronRight size={13} />

          <span className="text-neutral-600">
            Settings
          </span>
        </div>

        <div className="mt-4">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Manage your store configuration, operations,
            payments, notifications and admin access.
          </p>
        </div>
      </div>

      {/* Settings Layout */}

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        {/* Settings Navigation */}

        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] xl:sticky xl:top-6">
          <div className="px-4 pb-3 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
              Settings
            </p>
          </div>

          <div className="space-y-1">
            {tabs.map((tab) => {
              const active =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    active
                      ? "bg-neutral-950 text-white"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-white/10"
                        : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
                    }`}
                  >
                    {tab.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        active
                          ? "text-white"
                          : "text-neutral-800"
                      }`}
                    >
                      {tab.label}
                    </p>

                    <p
                      className={`mt-0.5 truncate text-[11px] ${
                        active
                          ? "text-neutral-400"
                          : "text-neutral-400"
                      }`}
                    >
                      {tab.description}
                    </p>
                  </div>

                  {active && (
                    <ChevronRight
                      size={16}
                      className="text-neutral-400"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Security Card */}

          <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-600 shadow-sm">
                <Lock size={15} />
              </div>

              <p className="text-xs font-semibold text-neutral-800">
                Secure configuration
              </p>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-neutral-500">
              Sensitive credentials will be stored
              securely on the backend.
            </p>
          </div>
        </aside>

        {/* Content */}

        <div className="min-w-0">
          {activeTab === "general" && (
            <GeneralSettings
              storeName={storeName}
              setStoreName={setStoreName}
              storeEmail={storeEmail}
              setStoreEmail={setStoreEmail}
              storePhone={storePhone}
              setStorePhone={setStorePhone}
              currency={currency}
              setCurrency={setCurrency}
              saved={saved}
              onSave={handleSave}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationSettings
              saved={saved}
              onSave={handleSave}
            />
          )}

          {activeTab === "shipping" && (
            <ShippingSettings
              saved={saved}
              onSave={handleSave}
            />
          )}

          {activeTab === "payments" && (
            <PaymentSettings
              saved={saved}
              onSave={handleSave}
            />
          )}

          {activeTab === "roles" && (
            <RolePermissionSettings
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              rolePermissions={rolePermissions}
              togglePermission={togglePermission}
              saved={saved}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* GENERAL SETTINGS */
/* ================================================= */

function GeneralSettings({
  storeName,
  setStoreName,
  storeEmail,
  setStoreEmail,
  storePhone,
  setStorePhone,
  currency,
  setCurrency,
  saved,
  onSave,
}: {
  storeName: string;
  setStoreName: (value: string) => void;
  storeEmail: string;
  setStoreEmail: (value: string) => void;
  storePhone: string;
  setStorePhone: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      icon={<Store size={19} />}
      title="General Settings"
      description="Manage your store's basic information."
    >
      {/* Store Profile */}

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-xl font-semibold text-white">
            M
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900">
              Mulberries
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              Premium ecommerce store
            </p>

            <button className="mt-3 text-xs font-semibold text-neutral-900 underline underline-offset-4">
              Change store logo
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Store Name"
          value={storeName}
          onChange={setStoreName}
          placeholder="Mulberries"
        />

        <InputField
          label="Store Email"
          value={storeEmail}
          onChange={setStoreEmail}
          type="email"
          placeholder="support@example.com"
        />

        <InputField
          label="Store Phone"
          value={storePhone}
          onChange={setStorePhone}
          placeholder="+91"
        />

        <div>
          <label className="mb-2 block text-xs font-semibold text-neutral-700">
            Currency
          </label>

          <div className="relative">
            <Globe
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <select
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value)
              }
              className="w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-3 pl-10 text-sm outline-none transition focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100"
            >
              <option value="INR">
                INR — Indian Rupee
              </option>

              <option value="USD">
                USD — US Dollar
              </option>

              <option value="EUR">
                EUR — Euro
              </option>
            </select>
          </div>
        </div>
      </div>

      <SaveBar saved={saved} onSave={onSave} />
    </SettingsCard>
  );
}

/* ================================================= */
/* NOTIFICATIONS */
/* ================================================= */

function NotificationSettings({
  saved,
  onSave,
}: {
  saved: boolean;
  onSave: () => void;
}) {
  const [settings, setSettings] = useState({
    orders: true,
    payments: true,
    inventory: true,
    shipping: true,
    returns: true,
    abandoned: false,
  });

  const items = [
    {
      key: "orders" as const,
      title: "New orders",
      description:
        "Receive an alert whenever a new order is placed.",
      icon: <ShoppingBag size={18} />,
    },
    {
      key: "payments" as const,
      title: "Payment failures",
      description:
        "Get notified when a customer payment fails.",
      icon: <CreditCard size={18} />,
    },
    {
      key: "inventory" as const,
      title: "Low inventory",
      description:
        "Receive alerts when products reach low stock.",
      icon: <Package size={18} />,
    },
    {
      key: "shipping" as const,
      title: "Shipping issues",
      description:
        "Get notified about shipment failures and NDR.",
      icon: <Truck size={18} />,
    },
    {
      key: "returns" as const,
      title: "Returns & refunds",
      description:
        "Receive notifications for return and refund events.",
      icon: <RotateCcw size={18} />,
    },
    {
      key: "abandoned" as const,
      title: "Abandoned carts",
      description:
        "Get alerts when high-value carts are abandoned.",
      icon: <ShoppingBag size={18} />,
    },
  ];

  return (
    <SettingsCard
      icon={<Bell size={19} />}
      title="Notifications"
      description="Choose which business events should notify administrators."
    >
      <div className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-5 bg-white p-5 transition hover:bg-neutral-50/60"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                {item.icon}
              </div>

              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  {item.description}
                </p>
              </div>
            </div>

            <Toggle
              enabled={settings[item.key]}
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  [item.key]:
                    !prev[item.key],
                }))
              }
            />
          </div>
        ))}
      </div>

      <SaveBar saved={saved} onSave={onSave} />
    </SettingsCard>
  );
}

/* ================================================= */
/* SHIPPING */
/* ================================================= */

function ShippingSettings({
  saved,
  onSave,
}: {
  saved: boolean;
  onSave: () => void;
}) {
  const [freeShipping, setFreeShipping] =
    useState(true);

  const [threshold, setThreshold] =
    useState("999");

  const [weight, setWeight] =
    useState("500");

  return (
    <SettingsCard
      icon={<Truck size={19} />}
      title="Shipping"
      description="Configure general shipping and delivery behaviour."
    >
      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between gap-5 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
              <Truck size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Free shipping
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Offer free delivery when customers reach
                a minimum order value.
              </p>
            </div>
          </div>

          <Toggle
            enabled={freeShipping}
            onClick={() =>
              setFreeShipping(!freeShipping)
            }
          />
        </div>

        {freeShipping && (
          <div className="border-t border-neutral-100 bg-neutral-50/60 p-5">
            <InputField
              label="Free Shipping Threshold"
              value={threshold}
              onChange={setThreshold}
              prefix="₹"
            />
          </div>
        )}
      </div>

      <InputField
        label="Default Package Weight"
        value={weight}
        onChange={setWeight}
        suffix="grams"
      />

      <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            <Truck size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Courier providers
            </p>

            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Courier providers, API credentials,
              serviceability, rates and delivery rules
              will be configured in the Shipping module.
            </p>
          </div>
        </div>
      </div>

      <SaveBar saved={saved} onSave={onSave} />
    </SettingsCard>
  );
}

/* ================================================= */
/* PAYMENTS */
/* ================================================= */

function PaymentSettings({
  saved,
  onSave,
}: {
  saved: boolean;
  onSave: () => void;
}) {
  const [razorpay, setRazorpay] =
    useState(true);

  const [cod, setCod] = useState(true);

  const [codLimit, setCodLimit] =
    useState("50000");

  return (
    <SettingsCard
      icon={<CreditCard size={19} />}
      title="Payments"
      description="Configure the payment methods available to customers."
    >
      <PaymentMethod
        title="Razorpay"
        description="Accept secure online payments."
        enabled={razorpay}
        onToggle={() =>
          setRazorpay(!razorpay)
        }
      />

      <PaymentMethod
        title="Cash on Delivery"
        description="Allow customers to pay when the order is delivered."
        enabled={cod}
        onToggle={() => setCod(!cod)}
      />

      {cod && (
        <InputField
          label="Maximum COD Order Value"
          value={codLimit}
          onChange={setCodLimit}
          prefix="₹"
        />
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <Lock
          size={17}
          className="mt-0.5 shrink-0 text-amber-700"
        />

        <div>
          <p className="text-xs font-semibold text-amber-900">
            Security recommendation
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-700">
            Payment API keys and secrets must remain on
            the backend and should never be exposed in
            frontend code.
          </p>
        </div>
      </div>

      <SaveBar saved={saved} onSave={onSave} />
    </SettingsCard>
  );
}

/* ================================================= */
/* ROLES & PERMISSIONS */
/* ================================================= */

function RolePermissionSettings({
  selectedRole,
  setSelectedRole,
  rolePermissions,
  togglePermission,
  saved,
  onSave,
}: {
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
  rolePermissions: Record<Role, string[]>;
  togglePermission: (id: string) => void;
  saved: boolean;
  onSave: () => void;
}) {
  const roles = [
    {
      role: "Super Admin" as Role,
      title: "Super Admin",
      description:
        "Complete access to every module.",
      icon: <Shield size={19} />,
    },
    {
      role: "Manager" as Role,
      title: "Manager",
      description:
        "Manage day-to-day business operations.",
      icon: <Users size={19} />,
    },
    {
      role: "Staff" as Role,
      title: "Staff",
      description:
        "Limited operational access.",
      icon: <Users size={19} />,
    },
  ];

  const enabledCount =
    rolePermissions[selectedRole].length;

  return (
    <SettingsCard
      icon={<Shield size={19} />}
      title="Roles & Permissions"
      description="Control exactly what each admin role can access."
    >
      {/* Role Cards */}

      <div className="grid gap-3 lg:grid-cols-3">
        {roles.map((role) => {
          const active =
            selectedRole === role.role;

          return (
            <button
              key={role.role}
              onClick={() =>
                setSelectedRole(role.role)
              }
              className={`group rounded-2xl border p-5 text-left transition ${
                active
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-lg"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    active
                      ? "bg-white/10 text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {role.icon}
                </div>

                {active && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-950">
                    <Check size={14} />
                  </div>
                )}
              </div>

              <p
                className={`mt-5 text-sm font-semibold ${
                  active
                    ? "text-white"
                    : "text-neutral-900"
                }`}
              >
                {role.title}
              </p>

              <p
                className={`mt-1 text-xs leading-5 ${
                  active
                    ? "text-neutral-400"
                    : "text-neutral-500"
                }`}
              >
                {role.description}
              </p>

              <div
                className={`mt-4 border-t pt-4 text-xs ${
                  active
                    ? "border-white/10 text-neutral-400"
                    : "border-neutral-100 text-neutral-400"
                }`}
              >
                {rolePermissions[role.role].length}{" "}
                of {permissions.length} permissions
              </div>
            </button>
          );
        })}
      </div>

      {/* Permission Header */}

      <div className="mt-8 flex flex-col gap-4 rounded-t-2xl border border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            {selectedRole} access
          </h3>

          <p className="mt-1 text-xs text-neutral-500">
            {enabledCount} of {permissions.length}{" "}
            modules enabled
          </p>
        </div>

        {selectedRole === "Super Admin" && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white">
            <Shield size={13} />
            Full access
          </div>
        )}
      </div>

      {/* Permission List */}

      <div className="overflow-hidden rounded-b-2xl border border-t-0 border-neutral-200">
        {permissions.map((permission, index) => {
          const enabled =
            rolePermissions[
              selectedRole
            ].includes(permission.id);

          return (
            <div
              key={permission.id}
              className={`flex items-center justify-between gap-5 bg-white p-5 transition hover:bg-neutral-50 ${
                index !== permissions.length - 1
                  ? "border-b border-neutral-100"
                  : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    enabled
                      ? "bg-neutral-100 text-neutral-700"
                      : "bg-neutral-50 text-neutral-300"
                  }`}
                >
                  {permission.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    {permission.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    {permission.description}
                  </p>
                </div>
              </div>

              <Toggle
                enabled={enabled}
                disabled={
                  selectedRole === "Super Admin"
                }
                onClick={() =>
                  togglePermission(
                    permission.id
                  )
                }
              />
            </div>
          );
        })}
      </div>

      <SaveBar saved={saved} onSave={onSave} />
    </SettingsCard>
  );
}

/* ================================================= */
/* REUSABLE SETTINGS CARD */
/* ================================================= */

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header */}

      <div className="border-b border-neutral-200 px-6 py-6 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            {icon}
          </div>

          <div>
            <h2 className="text-base font-semibold text-neutral-950">
              {title}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}

      <div className="space-y-6 p-6 sm:p-7">
        {children}
      </div>
    </section>
  );
}

/* ================================================= */
/* INPUT */
/* ================================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-neutral-700">
        {label}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
            {prefix}
          </span>
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className={`w-full rounded-xl border border-neutral-200 bg-white py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-300 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100 ${
            prefix ? "pl-8 pr-4" : "px-4"
          } ${suffix ? "pr-20" : ""}`}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* ================================================= */
/* PAYMENT METHOD */
/* ================================================= */

function PaymentMethod({
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
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-neutral-200 bg-white p-5 transition hover:bg-neutral-50/60">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
          <CreditCard size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold">
            {title}
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            {description}
          </p>
        </div>
      </div>

      <Toggle
        enabled={enabled}
        onClick={onToggle}
      />
    </div>
  );
}

/* ================================================= */
/* TOGGLE */
/* ================================================= */

function Toggle({
  enabled,
  disabled = false,
  onClick,
}: {
  enabled: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={
        enabled ? "Disable" : "Enable"
      }
      className={`relative h-6 w-11 shrink-0 rounded-full p-1 transition ${
        enabled
          ? "bg-neutral-950"
          : "bg-neutral-200"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer"
      }`}
    >
      <span
        className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          enabled
            ? "translate-x-5"
            : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ================================================= */
/* SAVE BAR */
/* ================================================= */

function SaveBar({
  saved,
  onSave,
}: {
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-neutral-400">
        Changes are currently stored locally.
      </p>

      <button
        onClick={onSave}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
          saved
            ? "bg-green-600 text-white"
            : "bg-neutral-950 text-white hover:bg-neutral-800"
        }`}
      >
        {saved ? (
          <>
            <Check size={16} />
            Changes Saved
          </>
        ) : (
          <>
            <Save size={16} />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
}