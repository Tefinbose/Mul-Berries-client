"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Edit3,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Address = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Work";
  isDefault: boolean;
};

const initialAddresses: Address[] = [
  {
    id: 1,
    name: "John Doe",
    phone: "+91 98765 43210",
    address: "24 MG Road",
    city: "Kochi",
    state: "Kerala",
    pincode: "682016",
    type: "Home",
    isDefault: true,
  },
  {
    id: 2,
    name: "John Doe",
    phone: "+91 98765 43210",
    address: "12 Infopark Road",
    city: "Kakkanad",
    state: "Kerala",
    pincode: "682030",
    type: "Work",
    isDefault: false,
  },
];

const emptyForm = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  type: "Home" as "Home" | "Work",
};

export default function AddressesPage() {
  const [addresses, setAddresses] =
    useState<Address[]>(initialAddresses);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState(emptyForm);

  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const handleAddAddress = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const handleEdit = (address: Address) => {
    setEditingId(address.id);

    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      type: address.type,
    });

    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // =========================
  // SAVE ADDRESS
  // =========================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingId !== null) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((address) =>
          address.id === editingId
            ? {
                ...address,
                ...formData,
              }
            : address
        )
      );
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0,
      };

      setAddresses((prev) => [...prev, newAddress]);
    }

    handleCloseForm();
  };

  // =========================
  // DELETE ADDRESS
  // =========================

  const handleDelete = (id: number) => {
    const addressToDelete = addresses.find(
      (address) => address.id === id
    );

    if (addressToDelete?.isDefault) {
      alert(
        "You cannot delete your default address. Please select another default address first."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    setAddresses((prev) =>
      prev.filter((address) => address.id !== id)
    );
  };

  // =========================
  // SET DEFAULT
  // =========================

  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* =========================================
          HEADER
      ========================================= */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/account"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-black"
          >
            <ArrowLeft size={18} />
            Back to Account
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm text-gray-500">
                Account Settings
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                My Addresses
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage your saved delivery addresses.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddAddress}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <Plus size={18} />
              Add New Address
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =========================================
            ADDRESS FORM
        ========================================= */}

        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId !== null
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your delivery details below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="House number, street, area"
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* State */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="682016"
                  maxLength={6}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* Address Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  {editingId !== null
                    ? "Update Address"
                    : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================
            ADDRESS LIST
        ========================================= */}

        {addresses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="relative rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Default Badge */}

                {address.isDefault && (
                  <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    <Check size={13} />
                    Default
                  </div>
                )}

                {/* Address Header */}

                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full bg-gray-100 p-3">
                    <MapPin
                      size={20}
                      className="text-gray-700"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {address.type}
                    </h2>

                    <p className="text-xs text-gray-500">
                      Delivery Address
                    </p>
                  </div>
                </div>

                {/* Address Details */}

                <div className="space-y-1 text-sm leading-6 text-gray-600">
                  <p className="font-medium text-gray-900">
                    {address.name}
                  </p>

                  <p>{address.address}</p>

                  <p>
                    {address.city}, {address.state}
                  </p>

                  <p>PIN: {address.pincode}</p>

                  <p className="pt-2">
                    Phone: {address.phone}
                  </p>
                </div>

                {/* Divider */}

                <div className="my-5 border-t border-gray-100" />

                {/* Actions */}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(address)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                  >
                    <Edit3 size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSetDefault(address.id)
                      }
                      className="ml-auto text-sm font-medium text-gray-600 underline underline-offset-4 transition hover:text-black"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* =========================================
              EMPTY STATE
          ========================================= */

          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <MapPin size={28} className="text-gray-500" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No saved addresses
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Add an address to make your checkout process
              faster and easier.
            </p>

            <button
              type="button"
              onClick={handleAddAddress}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <Plus size={18} />
              Add Address
            </button>
          </div>
        )}
      </section>
    </main>
  );
}