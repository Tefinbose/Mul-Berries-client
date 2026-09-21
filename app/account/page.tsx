"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";

/* =========================================================
   DATA
========================================================= */

// Placeholder order. Replace with your orders API when it is ready.
const recentOrders = [
  {
    id: "#MB1024",
    date: "12 Sep 2026",
    status: "Delivered",
    total: 3998,
    items: [
      {
        name: "Classic Linen Shirt",
        image:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Leather Handbag",
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
];

const accountLinks = [
  {
    title: "My Orders",
    description: "Track and manage your orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    title: "Wishlist",
    description: "View your saved products",
    href: "/wishlist",
    icon: Heart,
  },
  {
    title: "Addresses",
    description: "Manage your delivery addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    title: "Account Settings",
    description: "Update your account information",
    href: "/account/settings",
    icon: Settings,
  },
];

const navItems = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

/* =========================================================
   PAGE
========================================================= */

export default function AccountPage() {
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
  } | null>(null);

  // Read the user saved by the login / register pages
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");

      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {
      // ignore storage errors
    }

    window.dispatchEvent(new Event("auth-change"));

    window.location.href = "/";
  };

  const fullName = user?.name?.trim() || "";
  const displayName = fullName || "Your Account";
  const firstName = fullName.split(/\s+/)[0] || "";

  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    /*
      The navbar (announcement bar + header) sits above this page,
      so the height is offset by it: 117px on mobile, 125px on desktop.
    */
    <main className="min-h-[calc(100dvh-117px)] bg-[#ebece4] lg:min-h-[calc(100dvh-125px)]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <header>
          <p className="text-sm font-medium text-neutral-500">
            My account
          </p>

          <h1 className="mt-1 break-words text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Welcome back{firstName ? `, ${firstName}` : ""}.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
            Manage your orders, wishlist, addresses and account
            preferences from one place.
          </p>
        </header>

        {/* =================================================
            MOBILE / TABLET TAB NAVIGATION
        ================================================= */}

        <nav
          aria-label="Account"
          className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/account";

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-300/70 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                }`}
              >
                <Icon size={16} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-300/70 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Logout
          </button>
        </nav>

        {/* =================================================
            LAYOUT
        ================================================= */}

        <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">

          {/* ===============================================
              SIDEBAR (desktop)
          =============================================== */}

          <aside className="hidden h-fit rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-[0_1px_2px_rgba(23,23,23,0.04)] lg:sticky lg:top-28 lg:block">

            {/* Profile */}

            <div className="flex items-center gap-4 border-b border-neutral-100 pb-5">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
                {initials || <User size={18} />}
              </div>

              <div className="min-w-0">

                <h2 className="truncate text-sm font-semibold text-neutral-950">
                  {displayName}
                </h2>

                {user?.email && (
                  <p className="mt-0.5 truncate text-xs text-neutral-500">
                    {user.email}
                  </p>
                )}

              </div>

            </div>

            {/* Navigation */}

            <nav aria-label="Account" className="mt-4 space-y-1">

              {navItems.map((item) => (
                <AccountNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={item.href === "/account"}
                />
              ))}

            </nav>

            {/* Logout */}

            <div className="mt-4 border-t border-neutral-100 pt-4">

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} strokeWidth={1.7} />
                Logout
              </button>

            </div>

          </aside>

          {/* ===============================================
              MAIN CONTENT
          =============================================== */}

          <div className="min-w-0 space-y-5 lg:space-y-6">

            {/* -------------------------------------------
                QUICK LINKS
            ------------------------------------------- */}

            <section aria-labelledby="manage-account">

              <h2
                id="manage-account"
                className="mb-3 text-base font-semibold tracking-tight text-neutral-950 sm:mb-4 sm:text-lg"
              >
                Manage your account
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

                {accountLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex flex-col rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-[0_1px_2px_rgba(23,23,23,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                    >

                      <div className="flex items-start justify-between">

                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 transition duration-300 group-hover:bg-neutral-950">
                          <Icon
                            size={19}
                            strokeWidth={1.7}
                            className="text-neutral-800 transition duration-300 group-hover:text-white"
                          />
                        </span>

                        <ArrowRight
                          size={17}
                          className="text-neutral-300 transition duration-300 group-hover:translate-x-1 group-hover:text-[#c73572]"
                        />

                      </div>

                      <h3 className="mt-6 text-base font-semibold text-neutral-950">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-neutral-500">
                        {item.description}
                      </p>

                    </Link>
                  );
                })}

              </div>

            </section>

            {/* -------------------------------------------
                RECENT ORDERS
            ------------------------------------------- */}

            <section
              aria-labelledby="recent-orders"
              className="rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-[0_1px_2px_rgba(23,23,23,0.04)] sm:p-7"
            >

              <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">

                <div>

                  <h2
                    id="recent-orders"
                    className="text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl"
                  >
                    Recent order
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Your latest purchase
                  </p>

                </div>

                <Link
                  href="/account/orders"
                  className="group inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 text-sm font-semibold text-neutral-950 transition hover:text-[#c73572]"
                >
                  View all
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-0.5"
                  />
                </Link>

              </div>

              {recentOrders.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-neutral-200 px-6 py-12 text-center">

                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
                    <Package
                      size={22}
                      className="text-neutral-400"
                    />
                  </span>

                  <p className="mt-4 text-sm font-medium text-neutral-950">
                    No orders yet
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    When you place an order it will show up here.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {recentOrders.map((order) => (

                    <article
                      key={order.id}
                      className="rounded-2xl border border-neutral-200/80 p-4 sm:p-5"
                    >

                      {/* Order Header */}

                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <div>

                          <p className="text-sm font-semibold text-neutral-950">
                            Order {order.id}
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500">
                            Placed on {order.date}
                          </p>

                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              order.status === "Delivered"
                                ? "bg-emerald-500"
                                : "bg-neutral-400"
                            }`}
                          />
                          {order.status}
                        </span>

                      </div>

                      {/* Products */}

                      <div className="mt-4 flex flex-wrap gap-3">

                        {order.items.map((item) => (

                          <div
                            key={item.name}
                            className="flex min-w-0 items-center gap-3 rounded-xl bg-neutral-50 p-2 pr-4"
                          >

                            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">

                              <img
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />

                            </div>

                            <p className="min-w-0 text-sm font-medium text-neutral-800">
                              {item.name}
                            </p>

                          </div>

                        ))}

                      </div>

                      {/* Order Bottom */}

                      <div className="mt-5 flex flex-col gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <p className="text-xs text-neutral-500">
                            Order total
                          </p>

                          <p className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-neutral-950">
                            ₹{order.total.toLocaleString("en-IN")}
                          </p>

                        </div>

                        <Link
                          href="/account/orders"
                          className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                        >
                          View order
                          <ArrowRight
                            size={15}
                            className="transition group-hover:translate-x-0.5"
                          />
                        </Link>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </section>

            {/* -------------------------------------------
                CONTINUE SHOPPING
            ------------------------------------------- */}

            <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#3a1856_0%,#57277d_48%,#a72d6c_100%)] p-6 text-white sm:p-10">

              {/* Decorative glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-[#c73572]/40 blur-3xl"
              />

              <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <ShoppingBag size={19} />
                  </span>

                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Continue shopping.
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/70 sm:text-base">
                    Explore our latest collections and discover
                    something you&apos;ll love.
                  </p>

                </div>

                <Link
                  href="/products"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#57277d]"
                >
                  Shop now
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-0.5"
                  />
                </Link>

              </div>

            </section>

          </div>

        </div>

      </div>
    </main>
  );
}

/* =========================================================
   ACCOUNT NAV ITEM (desktop sidebar)
========================================================= */

function AccountNavItem({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-sm
        transition
        ${
          active
            ? "bg-neutral-950 font-medium text-white"
            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"
        }
      `}
    >
      <Icon size={17} strokeWidth={1.7} />
      {label}
    </Link>
  );
}