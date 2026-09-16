"use client";

import Link from "next/link";
import {
  Home,
  LayoutGrid,
  Search,
  Heart,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Categories",
      href: "/categories",
      icon: LayoutGrid,
    },
    {
      name: "Search",
      href: "/search",
      icon: Search,
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
    },
    {
      name: "Account",
      href: "/account",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[58px] flex-col items-center justify-center gap-1 transition ${
                isActive
                  ? "text-neutral-950"
                  : "text-neutral-400"
              }`}
            >
              <Icon
                size={21}
                strokeWidth={isActive ? 2.4 : 1.8}
              />

              <span
                className={`text-[10px] ${
                  isActive
                    ? "font-semibold"
                    : "font-medium"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}