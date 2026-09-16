"use client";

import Link from "next/link";
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

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#ebece4]">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
        <div className="mx-auto max-w-[1400px]">

          <div className="rounded-[24px] bg-white px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:text-xs">
              My Account
            </p>

            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Welcome back.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
              Manage your orders, wishlist, addresses and account
              preferences from one place.
            </p>

          </div>

        </div>
      </section>


      {/* ================================================= */}
      {/* ACCOUNT CONTENT */}
      {/* ================================================= */}

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">


            {/* ================================================= */}
            {/* ACCOUNT SIDEBAR */}
            {/* ================================================= */}

            <aside className="h-fit rounded-[24px] bg-white p-5 sm:p-6">

              {/* Profile */}

              <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
                  TB
                </div>

                <div className="min-w-0">

                  <h2 className="truncate text-sm font-semibold text-neutral-950">
                    Your Account
                  </h2>

                  <p className="mt-1 truncate text-xs text-neutral-400">
                    customer@example.com
                  </p>

                </div>

              </div>


              {/* Navigation */}

              <nav className="mt-5 space-y-1">

                <AccountNavItem
                  href="/account"
                  icon={User}
                  label="Overview"
                  active
                />

                <AccountNavItem
                  href="/account/orders"
                  icon={Package}
                  label="Orders"
                />

                <AccountNavItem
                  href="/wishlist"
                  icon={Heart}
                  label="Wishlist"
                />

                <AccountNavItem
                  href="/account/addresses"
                  icon={MapPin}
                  label="Addresses"
                />

                <AccountNavItem
                  href="/account/settings"
                  icon={Settings}
                  label="Settings"
                />

              </nav>


              {/* Logout */}

              <button
                type="button"
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  gap-3
                  border-t
                  border-neutral-100
                  px-3
                  pt-5
                  text-sm
                  text-neutral-400
                  transition
                  hover:text-red-500
                "
              >
                <LogOut size={17} />
                Logout
              </button>

            </aside>


            {/* ================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================= */}

            <div className="space-y-5">


              {/* ================================================= */}
              {/* QUICK LINKS */}
              {/* ================================================= */}

              <section className="rounded-[24px] bg-white p-6 sm:p-8">

                <div className="mb-6">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                    Account
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                    Manage your account
                  </h2>

                </div>


                <div className="grid gap-3 sm:grid-cols-2">

                  {accountLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="
                          group
                          rounded-[20px]
                          border
                          border-neutral-100
                          bg-[#f8f8f5]
                          p-5
                          transition
                          duration-300
                          hover:-translate-y-0.5
                          hover:bg-white
                          hover:shadow-sm
                        "
                      >

                        <div className="flex items-start justify-between">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                            <Icon
                              size={18}
                              strokeWidth={1.7}
                              className="text-neutral-800"
                            />
                          </div>

                          <ArrowRight
                            size={17}
                            className="
                              text-neutral-400
                              transition
                              duration-300
                              group-hover:translate-x-1
                              group-hover:text-neutral-950
                            "
                          />

                        </div>

                        <h3 className="mt-5 text-base font-semibold text-neutral-950">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-neutral-500 sm:text-sm">
                          {item.description}
                        </p>

                      </Link>
                    );
                  })}

                </div>

              </section>


              {/* ================================================= */}
              {/* RECENT ORDER */}
              {/* ================================================= */}

              <section className="rounded-[24px] bg-white p-6 sm:p-8">

                <div className="mb-6 flex items-end justify-between gap-4">

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                      Shopping
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                      Recent order
                    </h2>

                    <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                      Your latest purchase
                    </p>

                  </div>

                  <Link
                    href="/account/orders"
                    className="
                      hidden
                      items-center
                      gap-2
                      text-xs
                      font-semibold
                      text-neutral-950
                      sm:flex
                    "
                  >
                    View all
                    <ArrowRight size={15} />
                  </Link>

                </div>


                {recentOrders.map((order) => (

                  <div
                    key={order.id}
                    className="rounded-[20px] border border-neutral-100 bg-[#f8f8f5] p-5 sm:p-6"
                  >

                    {/* Order Header */}

                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">

                      <div>

                        <p className="text-sm font-semibold text-neutral-950">
                          Order {order.id}
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          Placed on {order.date}
                        </p>

                      </div>

                      <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-700">
                        {order.status}
                      </span>

                    </div>


                    {/* Products */}

                    <div className="mt-5 flex gap-3">

                      {order.items.map((item) => (

                        <div
                          key={item.name}
                          className="
                            h-20
                            w-16
                            overflow-hidden
                            rounded-xl
                            bg-neutral-100
                            sm:h-24
                            sm:w-20
                          "
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />

                        </div>

                      ))}

                    </div>


                    {/* Order Bottom */}

                    <div className="mt-6 flex items-end justify-between gap-4">

                      <div>

                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                          Order total
                        </p>

                        <p className="mt-1 text-lg font-semibold text-neutral-950">
                          ₹{order.total.toLocaleString("en-IN")}
                        </p>

                      </div>


                      <Link
                        href="/account/orders"
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-full
                          bg-neutral-950
                          px-5
                          py-2.5
                          text-xs
                          font-semibold
                          text-white
                          transition
                          hover:bg-neutral-800
                        "
                      >
                        View Order
                        <ArrowRight size={14} />
                      </Link>

                    </div>

                  </div>

                ))}


                {/* Mobile View All */}

                <Link
                  href="/account/orders"
                  className="
                    mt-5
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-neutral-200
                    py-3
                    text-xs
                    font-semibold
                    text-neutral-950
                    sm:hidden
                  "
                >
                  View all orders
                  <ArrowRight size={14} />
                </Link>

              </section>


              {/* ================================================= */}
              {/* CONTINUE SHOPPING */}
              {/* ================================================= */}

              <section className="overflow-hidden rounded-[24px] bg-neutral-950 p-7 text-white sm:p-10">

                <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">

                  <div>

                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <ShoppingBag size={18} />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                      Mulberries
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                      Continue shopping.
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-neutral-400">
                      Explore our latest collections and discover
                      something you'll love.
                    </p>

                  </div>


                  <Link
                    href="/products"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      bg-white
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-neutral-950
                      transition
                      hover:bg-neutral-200
                    "
                  >
                    Shop Now
                    <ArrowRight size={16} />
                  </Link>

                </div>

              </section>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}


/* ================================================= */
/* ACCOUNT NAV ITEM */
/* ================================================= */

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