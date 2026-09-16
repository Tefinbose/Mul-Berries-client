"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";

type NotificationType =
  | "Order"
  | "Payment"
  | "Shipping"
  | "Return"
  | "Offer";

type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "Order",
    title: "Order confirmed",
    message:
      "Your order MB-2026-00125 has been successfully confirmed.",
    date: "Today, 10:30 AM",
    read: false,
  },
  {
    id: 2,
    type: "Shipping",
    title: "Your order is on the way",
    message:
      "Your shipment has been picked up and is currently in transit.",
    date: "Yesterday, 4:20 PM",
    read: false,
  },
  {
    id: 3,
    type: "Payment",
    title: "Payment successful",
    message:
      "Your payment for order MB-2026-00124 was successfully received.",
    date: "Sep 10, 2026",
    read: true,
  },
  {
    id: 4,
    type: "Return",
    title: "Return pickup scheduled",
    message:
      "Your return request RET-2026-001 has been approved and pickup is scheduled.",
    date: "Sep 9, 2026",
    read: true,
  },
  {
    id: 5,
    type: "Offer",
    title: "New offer available",
    message:
      "A new offer is available on selected Mulberries products.",
    date: "Sep 8, 2026",
    read: true,
  },
];

const filters = [
  "All",
  "Order",
  "Payment",
  "Shipping",
  "Return",
  "Offer",
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [activeFilter, setActiveFilter] = useState("All");

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "All") {
      return notifications;
    }

    return notifications.filter(
      (notification) => notification.type === activeFilter
    );
  }, [notifications, activeFilter]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "Order":
        return <Package size={20} />;

      case "Payment":
        return <CreditCard size={20} />;

      case "Shipping":
        return <Truck size={20} />;

      case "Return":
        return <RotateCcw size={20} />;

      case "Offer":
        return <Tag size={20} />;

      default:
        return <Bell size={20} />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Bell size={28} />

              <h1 className="text-3xl font-semibold tracking-tight">
                Notifications
              </h1>
            </div>

            <p className="mt-2 text-sm text-neutral-500">
              Stay updated with your orders, payments, shipping and
              returns.
            </p>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium transition hover:bg-neutral-100"
              >
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium transition hover:bg-neutral-100"
              >
                <Trash2 size={16} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Unread count */}
        <div className="mt-8 rounded-2xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">
                Unread notifications
              </p>

              <p className="mt-1 text-3xl font-semibold">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <Bell size={22} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 overflow-x-auto">
          <div className="flex w-max gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm transition ${
                  activeFilter === filter
                    ? "bg-neutral-950 text-white"
                    : "border bg-white text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-6 space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border bg-white p-5 transition hover:shadow-sm ${
                  !notification.read
                    ? "border-neutral-300"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex gap-4">

                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      notification.read
                        ? "bg-neutral-100 text-neutral-500"
                        : "bg-neutral-950 text-white"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-medium">
                            {notification.title}
                          </h2>

                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-neutral-950" />
                          )}
                        </div>

                        <p className="mt-1 text-sm leading-6 text-neutral-500">
                          {notification.message}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-neutral-400">
                        {notification.date}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">

                      {!notification.read && (
                        <button
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                          className="rounded-full border px-4 py-2 text-xs font-medium transition hover:bg-neutral-100"
                        >
                          Mark as read
                        </button>
                      )}

                      {notification.type === "Order" && (
                        <Link
                          href="/account/orders"
                          className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
                        >
                          View orders
                        </Link>
                      )}

                      {notification.type === "Shipping" && (
                        <Link
                          href="/account/orders/MB-2026-00125"
                          className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
                        >
                          Track order
                        </Link>
                      )}

                      {notification.type === "Return" && (
                        <Link
                          href="/account/returns/RET-2026-001"
                          className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
                        >
                          View return
                        </Link>
                      )}

                      <button
                        onClick={() =>
                          deleteNotification(notification.id)
                        }
                        className="rounded-full px-4 py-2 text-xs text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="rounded-2xl border bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                <Bell size={28} className="text-neutral-400" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No notifications
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
                You&apos;re all caught up. New order, payment,
                shipping and return updates will appear here.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Continue shopping
              </Link>
            </div>
          )}
        </div>

        {/* Demo notice */}
        <div className="mt-8 rounded-xl border border-dashed bg-white p-4 text-xs leading-5 text-neutral-500">
          Demo notification data is used for the frontend.
          Notifications will later come from the backend and can
          be generated automatically for orders, payments, shipping,
          returns, inventory events and other account activity.
        </div>
      </div>
    </main>
  );
}