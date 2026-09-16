"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  TicketPercent,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: Warehouse,
  },
  {
    name: "Coupons & Offers",
    href: "/admin/coupons",
    icon: TicketPercent,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Authentication will be connected later.
    console.log("Admin logout");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-stone-200 bg-white lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-stone-200 px-6">
          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-white">
              <Store size={18} />
            </div>

            <div>
              <p className="font-semibold tracking-tight text-stone-900">
                Mulberries
              </p>

              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <Icon size={18} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-stone-200 p-4">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
          >
            <Store size={18} />
            View Store
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-stone-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-5 lg:hidden">
        <Link
          href="/admin"
          className="font-semibold text-stone-900"
        >
          Mulberries Admin
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
          className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100"
          aria-label={
            mobileMenuOpen ? "Close menu" : "Open menu"
          }
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white pt-16 lg:hidden">
          <nav className="space-y-1 px-5 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-4 text-sm font-medium ${
                    isActive
                      ? "bg-stone-900 text-white"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-6 flex items-center gap-3 rounded-xl px-4 py-4 text-sm text-stone-600 hover:bg-stone-100"
            >
              <Store size={19} />
              View Store
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {children}
      </div>
    </div>
  );
}