"use client";

import Link from "next/link";
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  Search,
} from "lucide-react";

type DockItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type DockProps = {
  items?: DockItem[];
};

export default function Dock({ items }: DockProps) {
  const defaultItems: DockItem[] = [
    {
      label: "Home",
      href: "/",
      icon: <Home size={20} />,
    },
    {
      label: "Search",
      href: "/search",
      icon: <Search size={20} />,
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: <Heart size={20} />,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: <ShoppingBag size={20} />,
    },
    {
      label: "Account",
      href: "/account",
      icon: <User size={20} />,
    },
  ];

  const dockItems = items ?? defaultItems;

  return (
    <nav
      className="
        flex
        items-center
        gap-2
        rounded-full
        border
        border-neutral-200
        bg-white/90
        px-3
        py-2
        shadow-lg
        backdrop-blur-md
      "
      aria-label="Quick navigation"
    >
      {dockItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-label={item.label}
          className="
            group
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            text-neutral-600
            transition-all
            duration-200
            hover:-translate-y-1
            hover:bg-neutral-100
            hover:text-neutral-950
          "
        >
          {item.icon}

          {/* Tooltip */}
          <span
            className="
              pointer-events-none
              absolute
              -top-9
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              rounded-md
              bg-neutral-950
              px-2
              py-1
              text-[10px]
              text-white
              opacity-0
              transition-opacity
              group-hover:opacity-100
            "
          >
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}