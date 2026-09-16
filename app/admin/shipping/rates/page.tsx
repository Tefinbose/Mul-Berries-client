"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Edit3,
  IndianRupee,
  MapPin,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

type ShippingRule = {
  id: string;
  zone: string;
  pincodes: string;
  courier: string;
  weightFrom: number;
  weightTo: number;
  prepaidRate: number;
  codRate: number;
  codAvailable: boolean;
  eta: string;
  status: "Active" | "Inactive";
};

const initialRules: ShippingRule[] = [
  {
    id: "SR001",
    zone: "Kerala",
    pincodes: "680001, 682001, 682016",
    courier: "Shiprocket",
    weightFrom: 0,
    weightTo: 0.5,
    prepaidRate: 49,
    codRate: 69,
    codAvailable: true,
    eta: "1–3 days",
    status: "Active",
  },
  {
    id: "SR002",
    zone: "South India",
    pincodes: "560001, 600001, 500001",
    courier: "Shiprocket",
    weightFrom: 0,
    weightTo: 0.5,
    prepaidRate: 59,
    codRate: 79,
    codAvailable: true,
    eta: "2–4 days",
    status: "Active",
  },
  {
    id: "SR003",
    zone: "Rest of India",
    pincodes: "110001, 400001, 700001",
    courier: "Shiprocket",
    weightFrom: 0,
    weightTo: 0.5,
    prepaidRate: 79,
    codRate: 99,
    codAvailable: true,
    eta: "3–6 days",
    status: "Active",
  },
  {
    id: "SR004",
    zone: "North East",
    pincodes: "781001, 791001",
    courier: "Delhivery",
    weightFrom: 0,
    weightTo: 0.5,
    prepaidRate: 109,
    codRate: 129,
    codAvailable: false,
    eta: "5–8 days",
    status: "Active",
  },
];

export default function ShippingRatesPage() {
  const [rules, setRules] =
    useState<ShippingRule[]>(initialRules);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | "Active" | "Inactive">("All");

  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] =
    useState<ShippingRule | null>(null);

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesSearch =
        rule.zone
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        rule.courier
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        rule.pincodes
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        rule.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rules, search, statusFilter]);

  const activeRules = rules.filter(
    (rule) => rule.status === "Active"
  ).length;

  const codRules = rules.filter(
    (rule) => rule.codAvailable
  ).length;

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shipping rule?"
    );

    if (!confirmed) return;

    setRules((previous) =>
      previous.filter((rule) => rule.id !== id)
    );
  };

  const handleToggleStatus = (id: string) => {
    setRules((previous) =>
      previous.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              status:
                rule.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : rule
      )
    );
  };

  const handleSave = (rule: ShippingRule) => {
    if (editingRule) {
      setRules((previous) =>
        previous.map((item) =>
          item.id === rule.id ? rule : item
        )
      );
    } else {
      setRules((previous) => [
        ...previous,
        {
          ...rule,
          id: `SR${String(
            previous.length + 1
          ).padStart(3, "0")}`,
        },
      ]);
    }

    setShowModal(false);
    setEditingRule(null);
  };

  return (
    <div className="min-h-full bg-[#fafafa]">
      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
          <span>Admin</span>

          <ChevronRight size={13} />

          <span>Shipping</span>

          <ChevronRight size={13} />

          <span className="text-neutral-600">
            Rates & Serviceability
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Rates & Serviceability
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Configure shipping charges, delivery zones,
              COD availability and estimated delivery times.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingRule(null);
              setShowModal(true);
            }}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <Plus size={17} />
            Add Shipping Rule
          </button>
        </div>
      </div>

      {/* Summary */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<MapPin size={18} />}
          label="Shipping Rules"
          value={rules.length.toString()}
        />

        <SummaryCard
          icon={<Check size={18} />}
          label="Active Rules"
          value={activeRules.toString()}
        />

        <SummaryCard
          icon={<IndianRupee size={18} />}
          label="Starting Rate"
          value={`₹${Math.min(
            ...rules.map(
              (rule) => rule.prepaidRate
            )
          )}`}
        />

        <SummaryCard
          icon={<Package size={18} />}
          label="COD Enabled"
          value={codRules.toString()}
        />
      </div>

      {/* Main Card */}

      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Toolbar */}

        <div className="flex flex-col gap-4 border-b border-neutral-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-950">
              Shipping Rules
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Rules are applied during checkout based on
              destination and package weight.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Search */}

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search zone, pincode..."
                className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 sm:w-64"
              />
            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "All"
                    | "Active"
                    | "Inactive"
                )
              }
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium text-neutral-600 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70">
                <TableHeader>
                  Zone
                </TableHeader>

                <TableHeader>
                  Courier
                </TableHeader>

                <TableHeader>
                  Weight
                </TableHeader>

                <TableHeader>
                  Prepaid
                </TableHeader>

                <TableHeader>
                  COD
                </TableHeader>

                <TableHeader>
                  ETA
                </TableHeader>

                <TableHeader>
                  Status
                </TableHeader>

                <TableHeader>
                  Actions
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {filteredRules.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50"
                >
                  <td className="px-5 py-5">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {rule.zone}
                      </p>

                      <p className="mt-1 max-w-[180px] truncate text-[11px] text-neutral-400">
                        {rule.pincodes}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <span className="rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs font-medium text-neutral-700">
                      {rule.courier}
                    </span>
                  </td>

                  <td className="px-5 py-5 text-xs text-neutral-600">
                    {rule.weightFrom}–
                    {rule.weightTo} kg
                  </td>

                  <td className="px-5 py-5">
                    <p className="text-sm font-semibold text-neutral-900">
                      ₹{rule.prepaidRate}
                    </p>

                    <p className="mt-1 text-[10px] text-neutral-400">
                      Prepaid
                    </p>
                  </td>

                  <td className="px-5 py-5">
                    {rule.codAvailable ? (
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">
                          ₹{rule.codRate}
                        </p>

                        <span className="text-[10px] text-green-600">
                          Available
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400">
                        Not available
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-5">
                    <span className="text-xs font-medium text-neutral-600">
                      {rule.eta}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <button
                      onClick={() =>
                        handleToggleStatus(
                          rule.id
                        )
                      }
                      className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                        rule.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {rule.status}
                    </button>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingRule(rule);
                          setShowModal(true);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(rule.id)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}

        <div className="divide-y divide-neutral-100 lg:hidden">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-neutral-950">
                      {rule.zone}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                        rule.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {rule.status}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-neutral-400">
                    {rule.pincodes}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingRule(rule);
                      setShowModal(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(rule.id)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <InfoBox
                  label="Courier"
                  value={rule.courier}
                />

                <InfoBox
                  label="Weight"
                  value={`${rule.weightFrom}–${rule.weightTo} kg`}
                />

                <InfoBox
                  label="Prepaid"
                  value={`₹${rule.prepaidRate}`}
                />

                <InfoBox
                  label="COD"
                  value={
                    rule.codAvailable
                      ? `₹${rule.codRate}`
                      : "Unavailable"
                  }
                />

                <InfoBox
                  label="Delivery"
                  value={rule.eta}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Empty */}

        {filteredRules.length === 0 && (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <Search size={18} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-neutral-800">
              No shipping rules found
            </h3>

            <p className="mt-1 text-xs text-neutral-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </section>

      {/* Modal */}

      {showModal && (
        <ShippingRuleModal
          rule={editingRule}
          onClose={() => {
            setShowModal(false);
            setEditingRule(null);
          }}
          onSave={handleSave}
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
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
        {icon}
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
/* TABLE HEADER */
/* ================================================= */

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
      {children}
    </th>
  );
}

/* ================================================= */
/* INFO BOX */
/* ================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3">
      <p className="text-[10px] font-medium text-neutral-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-neutral-800">
        {value}
      </p>
    </div>
  );
}

/* ================================================= */
/* SHIPPING RULE MODAL */
/* ================================================= */

function ShippingRuleModal({
  rule,
  onClose,
  onSave,
}: {
  rule: ShippingRule | null;
  onClose: () => void;
  onSave: (rule: ShippingRule) => void;
}) {
  const [zone, setZone] = useState(
    rule?.zone || ""
  );

  const [pincodes, setPincodes] =
    useState(rule?.pincodes || "");

  const [courier, setCourier] = useState(
    rule?.courier || "Shiprocket"
  );

  const [weightFrom, setWeightFrom] =
    useState(
      rule?.weightFrom.toString() || "0"
    );

  const [weightTo, setWeightTo] =
    useState(
      rule?.weightTo.toString() || "0.5"
    );

  const [prepaidRate, setPrepaidRate] =
    useState(
      rule?.prepaidRate.toString() || "49"
    );

  const [codRate, setCodRate] =
    useState(
      rule?.codRate.toString() || "69"
    );

  const [codAvailable, setCodAvailable] =
    useState(rule?.codAvailable ?? true);

  const [eta, setEta] = useState(
    rule?.eta || "2–4 days"
  );

  const [status, setStatus] =
    useState<"Active" | "Inactive">(
      rule?.status || "Active"
    );

  const submit = () => {
    if (
      !zone.trim() ||
      !pincodes.trim() ||
      !courier.trim()
    ) {
      alert(
        "Please fill in the required fields."
      );
      return;
    }

    onSave({
      id: rule?.id || "",
      zone: zone.trim(),
      pincodes: pincodes.trim(),
      courier: courier.trim(),
      weightFrom:
        Number(weightFrom) || 0,
      weightTo:
        Number(weightTo) || 0,
      prepaidRate:
        Number(prepaidRate) || 0,
      codRate:
        Number(codRate) || 0,
      codAvailable,
      eta,
      status,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) =>
          e.stopPropagation()
        }
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-neutral-200 p-6">
          <div>
            <h2 className="text-base font-semibold text-neutral-950">
              {rule
                ? "Edit Shipping Rule"
                : "Add Shipping Rule"}
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Configure destination, weight and shipping
              charges.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}

        <div className="space-y-6 p-6">
          {/* Destination */}

          <div>
            <h3 className="mb-4 text-sm font-semibold">
              Destination
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Zone"
                value={zone}
                onChange={setZone}
                placeholder="Kerala"
              />

              <Input
                label="Pincodes"
                value={pincodes}
                onChange={setPincodes}
                placeholder="682001, 682016"
              />
            </div>
          </div>

          {/* Courier */}

          <div>
            <h3 className="mb-4 text-sm font-semibold">
              Courier & Weight
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectInput
                label="Courier"
                value={courier}
                onChange={setCourier}
                options={[
                  "Shiprocket",
                  "Delhivery",
                  "Blue Dart",
                  "DTDC",
                  "Ecom Express",
                ]}
              />

              <SelectInput
                label="Delivery ETA"
                value={eta}
                onChange={setEta}
                options={[
                  "1–3 days",
                  "2–4 days",
                  "3–6 days",
                  "5–8 days",
                  "7–10 days",
                ]}
              />

              <Input
                label="Weight From (kg)"
                value={weightFrom}
                onChange={setWeightFrom}
                placeholder="0"
                type="number"
              />

              <Input
                label="Weight To (kg)"
                value={weightTo}
                onChange={setWeightTo}
                placeholder="0.5"
                type="number"
              />
            </div>
          </div>

          {/* Pricing */}

          <div>
            <h3 className="mb-4 text-sm font-semibold">
              Shipping Charges
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Prepaid Rate (₹)"
                value={prepaidRate}
                onChange={setPrepaidRate}
                placeholder="49"
                type="number"
              />

              <Input
                label="COD Rate (₹)"
                value={codRate}
                onChange={setCodRate}
                placeholder="69"
                type="number"
              />
            </div>
          </div>

          {/* COD */}

          <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
            <div>
              <p className="text-sm font-medium">
                Cash on Delivery
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Allow COD for this shipping rule.
              </p>
            </div>

            <Toggle
              enabled={codAvailable}
              onClick={() =>
                setCodAvailable(
                  !codAvailable
                )
              }
            />
          </div>

          {/* Status */}

          <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
            <div>
              <p className="text-sm font-medium">
                Rule Status
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Inactive rules will not be used at checkout.
              </p>
            </div>

            <Toggle
              enabled={status === "Active"}
              onClick={() =>
                setStatus(
                  status === "Active"
                    ? "Inactive"
                    : "Active"
                )
              }
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
            onClick={submit}
            className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            {rule
              ? "Save Changes"
              : "Create Rule"}
          </button>
        </div>
      </div>
    </div>
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
        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100"
      />
    </div>
  );
}

/* ================================================= */
/* SELECT */
/* ================================================= */

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-neutral-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500 focus:ring-4 focus:ring-neutral-100"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
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