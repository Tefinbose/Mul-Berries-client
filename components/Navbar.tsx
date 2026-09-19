"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

/* =========================================================
   NAVIGATION DATA
========================================================= */

const mainLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/products",
  },
  {
    name: "About",
    href: "/about",
  },
];

const categories = [
  {
    name: "Sarees",
    href: "/categories/sarees",
  },
  {
    name: "Silk Sarees",
    href: "/categories/silk-sarees",
  },
  {
    name: "Designer Sarees",
    href: "/categories/designer-sarees",
  },
  {
    name: "Bridal Sarees",
    href: "/categories/bridal-sarees",
  },
  {
    name: "Festive Sarees",
    href: "/categories/festive-sarees",
  },
  {
    name: "Accessories",
    href: "/categories/accessories",
  },
];

/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* =====================================================
          1. ANNOUNCEMENT BAR
      ===================================================== */}

      <div className="bg-[#171717] text-white">
        <div className="mx-auto flex min-h-9 w-full items-center overflow-hidden px-4 sm:px-6 lg:px-10">
          <div className="w-full overflow-hidden">
            <p className="animate-announcement-marquee w-max whitespace-nowrap text-[10px] font-medium tracking-[0.18em] text-white/70 sm:text-[11px]">
              PREMIUM COLLECTIONS
              <span className="mx-3 text-white/30">•</span>
              THOUGHTFULLY CURATED
              <span className="mx-3 text-white/30">•</span>
              ELEVATED EVERYDAY STYLE
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          2. MAIN HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl">
        {/* Header height: 72px mobile / 88px desktop */}
        <div className="site-container relative flex h-[72px] items-center lg:h-[88px]">

          {/* LOGO (sized to fit inside the header without adding height) */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-label="Mulberries Home"
            className="flex shrink-0 items-center"
          >
            <img
              src="/logo.png"
              alt="Mulberries"
              className="
                -ml-3
                h-[76px]
                w-[76px]
                object-contain
                sm:-ml-4
                sm:h-24
                sm:w-24
                lg:-ml-5
                lg:h-28
                lg:w-28
              "
            />
          </Link>

          {/* CENTER NAVIGATION (now truly centered) */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex xl:gap-10">

            <NavLink
              href="/"
              label="Home"
            />

            <NavLink
              href="/products"
              label="Shop"
            />

            {/* COLLECTIONS */}
            <div className="group relative">

              <Link
                href="/categories"
                className="
                  flex
                  items-center
                  gap-1.5
                  py-7
                  text-[14px]
                  font-medium
                  text-[#171717]
                  transition-colors
                  duration-200
                  hover:text-[#c73572]
                "
              >
                Collections

                <ChevronDown
                  size={14}
                  strokeWidth={1.8}
                  className="
                    transition-transform
                    duration-200
                    group-hover:rotate-180
                  "
                />
              </Link>

              {/* MEGA MENU */}
              <div
                className="
                  invisible
                  absolute
                  left-1/2
                  top-full
                  z-50
                  w-[680px]
                  -translate-x-1/2
                  translate-y-2
                  pt-3
                  opacity-0
                  transition-all
                  duration-200
                  group-hover:visible
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                <div
                  className="
                    grid
                    grid-cols-[0.9fr_1.1fr]
                    overflow-hidden
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    p-2
                    shadow-[0_20px_50px_rgba(23,23,23,0.12)]
                  "
                >

                  {/* FEATURE */}
                  <Link
                    href="/products"
                    className="
                      flex
                      min-h-48
                      flex-col
                      justify-between
                      rounded-lg
                      bg-[#f5f3ee]
                      p-6
                      transition-colors
                      hover:bg-[#fbf0f5]
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.2em]
                          text-[#c73572]
                        "
                      >
                        New Collection
                      </p>

                      <p
                        className="
                          mt-3
                          max-w-[200px]
                          text-xl
                          font-semibold
                          leading-tight
                          text-neutral-900
                        "
                      >
                        Find your next signature look.
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-neutral-600">
                      Shop the edit

                      <ChevronRight
                        size={14}
                        className="ml-1 inline"
                      />
                    </span>
                  </Link>

                  {/* CATEGORIES */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-5 py-4">

                    <p
                      className="
                        col-span-2
                        mb-2
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-neutral-400
                      "
                    >
                      Shop by category
                    </p>

                    {categories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="
                          flex
                          items-center
                          justify-between
                          border-b
                          border-neutral-100
                          py-3
                          text-[13px]
                          font-medium
                          text-neutral-700
                          transition-colors
                          hover:border-[#c73572]/30
                          hover:text-[#c73572]
                        "
                      >
                        {category.name}

                        <ChevronRight
                          size={13}
                          className="text-neutral-300"
                        />
                      </Link>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            <NavLink
              href="/about"
              label="About"
            />

          </nav>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-1">

            {/* SEARCH */}
            <Link
              href="/products"
              aria-label="Search"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                text-[#171717]
                transition
                hover:bg-neutral-100
                hover:text-[#c73572]
              "
            >
              <Search
                size={20}
                strokeWidth={1.7}
              />
            </Link>

            {/* WISHLIST */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="
                hidden
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                text-[#171717]
                transition
                hover:bg-neutral-100
                hover:text-[#c73572]
                sm:flex
              "
            >
              <Heart
                size={20}
                strokeWidth={1.7}
              />
            </Link>

            {/* ACCOUNT */}
            <Link
              href="/account"
              aria-label="Account"
              className="
                hidden
                h-11
                items-center
                gap-2
                rounded-full
                px-3
                text-[13px]
                font-medium
                text-[#171717]
                transition
                hover:bg-neutral-100
                hover:text-[#c73572]
                sm:flex
              "
            >
              <UserRound
                size={19}
                strokeWidth={1.7}
              />

              <span className="hidden xl:inline">
                Account
              </span>
            </Link>

            {/* BAG */}
            <Link
              href="/cart"
              aria-label="Shopping Bag"
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-full
                px-3
                text-[13px]
                font-medium
                text-[#171717]
                transition
                hover:bg-neutral-100
                hover:text-[#c73572]
              "
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.7}
              />

              <span className="hidden xl:inline">
                Bag
              </span>
            </Link>

            {/* LOGIN BUTTON (desktop / tablet) */}
            <Link
              href="/auth/login"
              className="
                ml-2
                hidden
                h-10
                items-center
                justify-center
                rounded-full
                bg-[#171717]
                px-5
                text-[13px]
                font-medium
                text-white
                transition-colors
                duration-200
                hover:bg-[#c73572]
                sm:flex
              "
            >
              Login
            </Link>

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((prev) => !prev)
              }
              aria-label={
                mobileMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              className="
                ml-1
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                text-[#171717]
                transition
                hover:bg-neutral-100
                lg:hidden
              "
            >
              {mobileMenuOpen ? (
                <X
                  size={21}
                  strokeWidth={1.7}
                />
              ) : (
                <Menu
                  size={21}
                  strokeWidth={1.7}
                />
              )}
            </button>

          </div>

        </div>
      </header>

      {/* =====================================================
          6. MOBILE MENU
          top offset = announcement bar (36px) + header (72px) + border (1px)
      ===================================================== */}

      {mobileMenuOpen && (
        <div
          className="
            fixed
            inset-x-0
            bottom-0
            top-[109px]
            z-40
            overflow-y-auto
            border-b
            border-neutral-200
            bg-white
            shadow-lg
            lg:hidden
          "
        >
          <nav className="min-h-full px-5 py-5 pb-10">

            {/* =================================================
                MOBILE MAIN LINKS
            ================================================= */}

            <div>
              <MobileLink
                href="/"
                label="Home"
                onClick={closeMobileMenu}
              />

              <MobileLink
                href="/products"
                label="Shop"
                onClick={closeMobileMenu}
              />

              <MobileLink
                href="/categories"
                label="Collections"
                onClick={closeMobileMenu}
              />

              <MobileLink
                href="/about"
                label="About"
                onClick={closeMobileMenu}
              />
            </div>

            {/* =================================================
                MOBILE COLLECTIONS
            ================================================= */}

            <div className="pt-6">

              <div className="mb-3 flex items-center justify-between">

                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-neutral-400
                  "
                >
                  Shop by category
                </p>

                <Link
                  href="/categories"
                  onClick={closeMobileMenu}
                  className="
                    text-[10px]
                    font-medium
                    text-[#c73572]
                  "
                >
                  View all
                </Link>
              </div>

              {/* CATEGORY GRID */}

              <div className="grid grid-cols-2 gap-2">

                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    onClick={closeMobileMenu}
                    className="
                      rounded-lg
                      border
                      border-neutral-100
                      bg-[#faf9f6]
                      px-3
                      py-3
                      text-xs
                      font-medium
                      text-neutral-700
                      transition
                      hover:border-[#c73572]/20
                      hover:bg-[#fbf0f5]
                      hover:text-[#c73572]
                    "
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* =================================================
                MOBILE ACCOUNT / WISHLIST
            ================================================= */}

            <div className="mt-6 grid grid-cols-2 gap-2">

              <Link
                href="/wishlist"
                onClick={closeMobileMenu}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-neutral-200
                  py-3
                  text-xs
                  font-medium
                  text-[#171717]
                  transition
                  hover:bg-neutral-50
                "
              >
                <Heart size={15} />

                Wishlist
              </Link>

              <Link
                href="/account"
                onClick={closeMobileMenu}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-neutral-200
                  py-3
                  text-xs
                  font-medium
                  text-[#171717]
                  transition
                  hover:bg-neutral-50
                "
              >
                <UserRound size={15} />

                Account
              </Link>
            </div>

            {/* =================================================
                MOBILE LOGIN
            ================================================= */}

            <Link
              href="/auth/login"
              onClick={closeMobileMenu}
              className="
                mt-2
                flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-[#c73572]
                py-3
                text-xs
                font-medium
                text-[#c73572]
                transition
                hover:bg-[#fbf0f5]
              "
            >
              Login
            </Link>

            {/* =================================================
                MOBILE BAG
            ================================================= */}

            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="
                mt-2
                flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#171717]
                py-3
                text-xs
                font-medium
                text-white
                transition
                hover:bg-[#c73572]
              "
            >
              <ShoppingBag size={15} />

              Shopping Bag
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

/* =========================================================
   DESKTOP NAV LINK
========================================================= */

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        flex
        items-center
        py-7
        text-[14px]
        font-medium
        text-[#171717]
        transition-colors
        duration-200
        hover:text-[#c73572]
      "
    >
      {label}

      <span
        className="
          absolute
          bottom-5
          left-0
          h-px
          w-0
          bg-[#c73572]
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </Link>
  );
}

/* =========================================================
   MOBILE NAV LINK
========================================================= */

function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex
        items-center
        justify-between
        border-b
        border-neutral-100
        py-4
        text-sm
        font-medium
        text-[#171717]
        transition
        hover:text-[#c73572]
      "
    >
      <span>{label}</span>

      <ChevronRight
        size={16}
        className="text-neutral-400"
      />
    </Link>
  );
}