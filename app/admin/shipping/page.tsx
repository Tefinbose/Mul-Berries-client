"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  CircleAlert,
  Edit3,
  Globe,
  KeyRound,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Truck,
  X,
  Zap,
} from "lucide-react";

type CourierStatus = "Connected" | "Not Connected";

type Courier = {
  id: string;
  name: string;
  description: string;
  status: CourierStatus;
  priority: number;
  cod: boolean;
  tracking: boolean;
  serviceability: boolean;
  color: string;
};

const initialCouriers: Courier[] = [
  {
    id: "shiprocket",
    name: "Shiprocket",
    description:
      "Multi-carrier shipping and logistics platform.",
    status: "Connected",
    priority: 1,
    cod: true,
    tracking: true,
    serviceability: true,
    color: "SR",
  },
  {
    id: "delhivery",
    name: "Delhivery",
    description:
      "Pan-India express logistics and delivery network.",
    status: "Not Connected",
    priority: 2,
    cod: true,
    tracking: true,
    serviceability: true,
    color: "DL",
  },
];

export default function ShippingPage() {
  const [couriers, setCouriers] =
    useState(initialCouriers);

  const [showAddCourier, setShowAddCourier] =
    useState(false);

  const [selectedCourier, setSelectedCourier] =
    useState<Courier | null>(null);

  const [defaultCourier, setDefaultCourier] =
    useState("shiprocket");

  const [saved, setSaved] = useState(false);

  const connectedCount = couriers.filter(
    (courier) =>
      courier.status === "Connected"
  ).length;

  const handleConnect = (id: string) => {
    setCouriers((previous) =>
      previous.map((courier) =>
        courier.id === id
          ? {
              ...courier,
              status: "Connected",
            }
          : courier
      )
    );
  };

  const handleDisconnect = (id: string) => {
    setCouriers((previous) =>
      previous.map((courier) =>
        courier.id === id
          ? {
              ...courier,
              status: "Not Connected",
            }
          : courier
      )
    );
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-full bg-[#fafafa]">
      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
          <span>Admin</span>

          <ChevronRight size={13} />

          <span className="text-neutral-600">
            Shipping
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Shipping
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Manage courier providers, delivery
              configuration and shipping operations.
            </p>
          </div>

          <button
            onClick={() =>
              setShowAddCourier(true)
            }
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <Plus size={17} />
            Add Courier
          </button>
        </div>
      </div>

      {/* Summary */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<Truck size={18} />}
          label="Courier Providers"
          value={couriers.length.toString()}
        />

        <SummaryCard
          icon={<ShieldCheck size={18} />}
          label="Connected"
          value={connectedCount.toString()}
        />

        <SummaryCard
          icon={<Globe size={18} />}
          label="Serviceability"
          value="Active"
        />

        <SummaryCard
          icon={<Zap size={18} />}
          label="Default Courier"
          value={
            couriers.find(
              (courier) =>
                courier.id === defaultCourier
            )?.name || "None"
          }
        />
      </div>

      {/* Main */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        {/* Courier Providers */}

        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col gap-4 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-neutral-950">
                Courier Providers
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Connect and manage multiple shipping
                providers.
              </p>
            </div>

            <button className="inline-flex w-fit items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50">
              <RefreshCw size={14} />
              Sync Providers
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {couriers.map((courier) => (
              <CourierCard
                key={courier.id}
                courier={courier}
                isDefault={
                  defaultCourier === courier.id
                }
                onSetDefault={() =>
                  setDefaultCourier(courier.id)
                }
                onConnect={() =>
                  handleConnect(courier.id)
                }
                onDisconnect={() =>
                  handleDisconnect(courier.id)
                }
                onConfigure={() =>
                  setSelectedCourier(courier)
                }
              />
            ))}

            {/* Add Provider */}

            <button
              onClick={() =>
                setShowAddCourier(true)
              }
              className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-neutral-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-neutral-400">
                <Plus size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  Add another courier
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Connect another shipping provider.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Configuration */}

        <aside className="space-y-6">
          {/* Default Courier */}

          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                <Truck size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Default Courier
                </h3>

                <p className="mt-1 text-xs text-neutral-500">
                  Used when automatic selection is enabled.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {couriers
                .filter(
                  (courier) =>
                    courier.status === "Connected"
                )
                .map((courier) => {
                  const active =
                    defaultCourier === courier.id;

                  return (
                    <button
                      key={courier.id}
                      onClick={() =>
                        setDefaultCourier(
                          courier.id
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-neutral-950 bg-neutral-950 text-white"
                          : "border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ${
                            active
                              ? "bg-white/10"
                              : "bg-neutral-100"
                          }`}
                        >
                          {courier.color}
                        </div>

                        <span className="text-xs font-medium">
                          {courier.name}
                        </span>
                      </div>

                      {active && (
                        <Check size={15} />
                      )}
                    </button>
                  );
                })}
            </div>
          </section>

          {/* Automation */}

          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                <Zap size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Shipping Automation
                </h3>

                <p className="mt-1 text-xs text-neutral-500">
                  Automated shipment workflow.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <AutomationItem
                title="Automatic courier selection"
                enabled
              />

              <AutomationItem
                title="Automatic AWB generation"
                enabled
              />

              <AutomationItem
                title="Automatic tracking sync"
                enabled
              />

              <AutomationItem
                title="Webhook status updates"
                enabled
              />
            </div>
          </section>

          {/* Save */}

          <button
            onClick={handleSave}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              saved
                ? "bg-green-600 text-white"
                : "bg-neutral-950 text-white hover:bg-neutral-800"
            }`}
          >
            {saved ? (
              <>
                <Check size={16} />
                Settings Saved
              </>
            ) : (
              <>
                <Settings2 size={16} />
                Save Shipping Settings
              </>
            )}
          </button>
        </aside>
      </div>

      {/* Configure Modal */}

      {selectedCourier && (
        <CourierConfigModal
          courier={selectedCourier}
          onClose={() =>
            setSelectedCourier(null)
          }
          onSave={() => {
            setSelectedCourier(null);
            handleSave();
          }}
        />
      )}

      {/* Add Courier Modal */}

      {showAddCourier && (
        <AddCourierModal
          onClose={() =>
            setShowAddCourier(false)
          }
          onAdd={(name) => {
            const newCourier: Courier = {
              id: name
                .toLowerCase()
                .replace(/\s+/g, "-"),
              name,
              description:
                "Shipping provider integration.",
              status: "Not Connected",
              priority:
                couriers.length + 1,
              cod: true,
              tracking: true,
              serviceability: true,
              color: name
                .slice(0, 2)
                .toUpperCase(),
            };

            setCouriers((previous) => [
              ...previous,
              newCourier,
            ]);

            setShowAddCourier(false);
          }}
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
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
          {icon}
        </div>
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
/* COURIER CARD */
/* ================================================= */

function CourierCard({
  courier,
  isDefault,
  onSetDefault,
  onConnect,
  onDisconnect,
  onConfigure,
}: {
  courier: Courier;
  isDefault: boolean;
  onSetDefault: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onConfigure: () => void;
}) {
  const connected =
    courier.status === "Connected";

  return (
    <div className="p-6 transition hover:bg-neutral-50/50">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}

        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-xs font-bold text-white">
            {courier.color}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-neutral-950">
                {courier.name}
              </h3>

              {isDefault && (
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-semibold text-neutral-600">
                  Default
                </span>
              )}
            </div>

            <p className="mt-1 max-w-xl text-xs leading-5 text-neutral-500">
              {courier.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <FeatureBadge
                label="COD"
                enabled={courier.cod}
              />

              <FeatureBadge
                label="Tracking"
                enabled={courier.tracking}
              />

              <FeatureBadge
                label="Serviceability"
                enabled={courier.serviceability}
              />
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium ${
              connected
                ? "bg-green-50 text-green-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected
                  ? "bg-green-500"
                  : "bg-neutral-400"
              }`}
            />

            {courier.status}
          </span>

          {connected && !isDefault && (
            <button
              onClick={onSetDefault}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              Make Default
            </button>
          )}

          <button
            onClick={onConfigure}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            <Settings2 size={14} />
            Configure
          </button>

          <button
            onClick={
              connected
                ? onDisconnect
                : onConnect
            }
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
              connected
                ? "border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                : "bg-neutral-950 text-white hover:bg-neutral-800"
            }`}
          >
            {connected
              ? "Disconnect"
              : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* FEATURE BADGE */
/* ================================================= */

function FeatureBadge({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-medium ${
        enabled
          ? "border-neutral-200 bg-white text-neutral-600"
          : "border-neutral-100 bg-neutral-50 text-neutral-300"
      }`}
    >
      {enabled ? (
        <Check size={11} />
      ) : (
        <X size={11} />
      )}

      {label}
    </span>
  );
}

/* ================================================= */
/* AUTOMATION ITEM */
/* ================================================= */

function AutomationItem({
  title,
  enabled,
}: {
  title: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-neutral-600">
        {title}
      </p>

      <span
        className={`h-2 w-2 rounded-full ${
          enabled
            ? "bg-green-500"
            : "bg-neutral-300"
        }`}
      />
    </div>
  );
}

/* ================================================= */
/* CONFIG MODAL */
/* ================================================= */

function CourierConfigModal({
  courier,
  onClose,
  onSave,
}: {
  courier: Courier;
  onClose: () => void;
  onSave: () => void;
}) {
  const [apiKey, setApiKey] = useState("");

  const [apiSecret, setApiSecret] =
    useState("");

  const [priority, setPriority] =
    useState(courier.priority.toString());

  const [cod, setCod] =
    useState(courier.cod);

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-neutral-200 p-6">
          <div>
            <h2 className="text-base font-semibold">
              Configure {courier.name}
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Configure provider credentials and shipping
              preferences.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}

        <div className="space-y-5 p-6">
          <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-4">
            <KeyRound
              size={17}
              className="mt-0.5 text-neutral-500"
            />

            <div>
              <p className="text-xs font-semibold">
                API credentials
              </p>

              <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                These credentials will eventually be
                securely stored on the backend.
              </p>
            </div>
          </div>

          <Input
            label="API Key"
            value={apiKey}
            onChange={setApiKey}
            placeholder="Enter API key"
          />

          <Input
            label="API Secret"
            value={apiSecret}
            onChange={setApiSecret}
            placeholder="Enter API secret"
            type="password"
          />

          <Input
            label="Priority"
            value={priority}
            onChange={setPriority}
            placeholder="1"
          />

          <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
            <div>
              <p className="text-sm font-medium">
                Cash on Delivery
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Allow this courier to handle COD shipments.
              </p>
            </div>

            <Toggle
              enabled={cod}
              onClick={() => setCod(!cod)}
            />
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-neutral-200 p-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

/* ================================================= */
/* ADD COURIER MODAL */
/* ================================================= */

function AddCourierModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const available = [
    "Delhivery",
    "Blue Dart",
    "DTDC",
    "Ecom Express",
  ];

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 p-6">
          <div>
            <h2 className="text-base font-semibold">
              Add Courier Provider
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Add a shipping provider to your system.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-3 text-xs font-semibold text-neutral-700">
            Available providers
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {available.map((courier) => (
              <button
                key={courier}
                onClick={() => onAdd(courier)}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 text-left transition hover:border-neutral-400 hover:bg-neutral-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-[10px] font-bold text-neutral-600">
                  {courier
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <span className="text-sm font-medium">
                  {courier}
                </span>
              </button>
            ))}
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
              or
            </span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <Input
            label="Custom Provider Name"
            value={name}
            onChange={setName}
            placeholder="Enter provider name"
          />

          <button
            disabled={!name.trim()}
            onClick={() => onAdd(name.trim())}
            className="mt-5 w-full rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add Provider
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
        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100"
      />
    </div>
  );
}

/* ================================================= */
/* TOGGLE */
/* ================================================= */

function Toggle({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full p-1 transition ${
        enabled
          ? "bg-neutral-950"
          : "bg-neutral-200"
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