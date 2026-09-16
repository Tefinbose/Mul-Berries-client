"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  Trash2,
  User,
} from "lucide-react";

export default function SettingsPage() {
  // =========================
  // PERSONAL INFORMATION
  // =========================

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
  });

  // =========================
  // PASSWORD
  // =========================

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================
  // NOTIFICATIONS
  // =========================

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: true,
    emailNotifications: true,
  });

  // =========================
  // SUCCESS MESSAGE
  // =========================

  const [saved, setSaved] = useState(false);

  // =========================
  // PERSONAL INFO CHANGE
  // =========================

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PASSWORD CHANGE
  // =========================

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SAVE PERSONAL INFO
  // =========================

  const handleSavePersonalInfo = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      alert("New password must contain at least 8 characters.");
      return;
    }

    if (
      passwords.newPassword !== passwords.confirmPassword
    ) {
      alert("New password and confirm password do not match.");
      return;
    }

    alert("Password changed successfully.");

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // =========================
  // DELETE ACCOUNT
  // =========================

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    alert(
      "Account deletion will be connected to the backend later."
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

          <div>
            <p className="mb-2 text-sm text-gray-500">
              Account
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Account Settings
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your personal information, password, and
              notification preferences.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* =========================================
              PERSONAL INFORMATION
          ========================================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="rounded-full bg-gray-100 p-3">
                <User size={21} className="text-gray-700" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your basic account information.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSavePersonalInfo}
              className="grid gap-5 sm:grid-cols-2"
            >
              {/* First Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={personalInfo.firstName}
                  onChange={handlePersonalInfoChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={personalInfo.lastName}
                  onChange={handlePersonalInfoChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail size={15} />
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone size={15} />
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4 pt-2 sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Save size={17} />
                  Save Changes
                </button>

                {saved && (
                  <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <Check size={17} />
                    Changes saved
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* =========================================
              CHANGE PASSWORD
          ========================================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="rounded-full bg-gray-100 p-3">
                <Lock size={21} className="text-gray-700" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="space-y-5"
            >
              {/* Current Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-gray-900"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-900"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* New Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-gray-900"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-900"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-gray-900"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-900"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <Shield size={17} />
                Update Password
              </button>
            </form>
          </div>

          {/* =========================================
              NOTIFICATION PREFERENCES
          ========================================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="rounded-full bg-gray-100 p-3">
                <Bell size={21} className="text-gray-700" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Notification Preferences
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose which notifications you want to
                  receive.
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {/* Order Updates */}
              <div className="flex items-center justify-between gap-6 py-5 first:pt-0">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Order Updates
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Receive updates about your orders and
                    deliveries.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      orderUpdates:
                        !prev.orderUpdates,
                    }))
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    notifications.orderUpdates
                      ? "bg-gray-900"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      notifications.orderUpdates
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Promotions */}
              <div className="flex items-center justify-between gap-6 py-5">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Promotions & Offers
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Get notified about discounts and special
                    offers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      promotions:
                        !prev.promotions,
                    }))
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    notifications.promotions
                      ? "bg-gray-900"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      notifications.promotions
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* New Arrivals */}
              <div className="flex items-center justify-between gap-6 py-5">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    New Arrivals
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Be the first to know about new products.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      newArrivals:
                        !prev.newArrivals,
                    }))
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    notifications.newArrivals
                      ? "bg-gray-900"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      notifications.newArrivals
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between gap-6 py-5 last:pb-0">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Email Notifications
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Receive important account notifications
                    by email.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      emailNotifications:
                        !prev.emailNotifications,
                    }))
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    notifications.emailNotifications
                      ? "bg-gray-900"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      notifications.emailNotifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* =========================================
              DANGER ZONE
          ========================================= */}

          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-50 p-3">
                  <Trash2
                    size={21}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delete Account
                  </h2>

                  <p className="mt-1 max-w-xl text-sm text-gray-500">
                    Permanently delete your account and
                    associated data. This action cannot be
                    undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={17} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}