"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  TicketPercent,
  BarChart3,
  Settings,
  Truck,
  RotateCcw,
  Store,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Warehouse,
  },
  {
    label: "Coupons & Offers",
    href: "/admin/coupons",
    icon: TicketPercent,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Shipping",
    href: "/admin/shipping/shipments",
    icon: Truck,
  },
  {
    label: "Returns & Refunds",
    href: "/admin/returns",
    icon: RotateCcw,
  },

  // ⭐ STAFF ADDED HERE
  {
    label: "Staff",
    href: "/admin/staff",
    icon: Users,
  },

  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    try {
      setLoggingOut(true);

      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      router.push("/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-neutral-950">
      {/* =====================================================
          MOBILE HEADER
      ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
            <Store size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold leading-none">
              Mulberries
            </p>

            <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Admin
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileOpen((current) => !current)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </header>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[302px] flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* =================================================
            BRAND
        ================================================= */}

        <div className="flex h-[87px] shrink-0 items-center border-b border-neutral-200 px-7">
          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-sm">
              <Store size={21} />
            </div>

            <div>
              <p className="text-base font-semibold tracking-tight text-neutral-950">
                Mulberries
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                Admin
              </p>
            </div>
          </Link>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 overflow-y-auto px-5 py-7">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-medium transition ${
                    active
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                    className={
                      active
                        ? "text-white"
                        : "text-neutral-500 group-hover:text-neutral-800"
                    }
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div className="shrink-0 border-t border-neutral-200 p-5">
          {/* View Store */}

          <Link
            href="/"
            className="group mb-2 flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <Store
              size={20}
              strokeWidth={1.8}
              className="text-neutral-500 group-hover:text-neutral-800"
            />

            <span>View Store</span>
          </Link>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-sm font-medium text-neutral-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut
              size={20}
              strokeWidth={1.8}
              className="text-neutral-500 group-hover:text-red-600"
            />

            <span>
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="lg:pl-[302px]">
        <main className="min-h-screen pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}