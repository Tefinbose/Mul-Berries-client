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
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Categories", href: "/categories" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
];

const categories = [
  { name: "Sarees", href: "/categories/sarees" },
  { name: "Silk Sarees", href: "/categories/silk-sarees" },
  { name: "Designer Sarees", href: "/categories/designer-sarees" },
  { name: "Bridal Sarees", href: "/categories/bridal-sarees" },
  { name: "Festive Sarees", href: "/categories/festive-sarees" },
  { name: "Accessories", href: "/categories/accessories" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-[#171717] text-white">
        <div className="mx-auto flex min-h-10 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
          <p className="text-[11px] font-medium tracking-[0.18em] text-white/70">
            PREMIUM COLLECTIONS • THOUGHTFULLY CURATED
          </p>

          <div className="hidden items-center gap-5 text-[11px] text-white/70 sm:flex">
            <a
              href="#"
              className="transition hover:text-white"
            >
              Facebook
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Instagram
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
        <div className="relative flex h-[68px] w-full items-center justify-between px-4 sm:px-6 lg:h-[74px] lg:px-8">
          
          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#171717] transition hover:bg-neutral-100 lg:hidden"
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

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-[#171717] transition-colors duration-200 hover:text-[#c73572]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-label="Mul-Berries Home"
            className="absolute left-1/2 z-20 flex -translate-x-1/2 items-center justify-center"
          >
            <img
              src="/logo.png"
              alt="Mul-Berries"
              className="h-9 w-auto object-contain sm:h-11"
            />
          </Link>

          {/* RIGHT ACTIONS */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            
            {/* SEARCH */}
            <Link
              href="/products"
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#171717] transition hover:bg-neutral-100 hover:text-[#c73572]"
            >
              <Search
                size={21}
                strokeWidth={1.7}
              />
            </Link>

            {/* WISHLIST */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-[#171717] transition hover:bg-neutral-100 hover:text-[#c73572] sm:flex"
            >
              <Heart
                size={21}
                strokeWidth={1.7}
              />
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#171717] transition hover:bg-neutral-100 hover:text-[#c73572]"
            >
              <ShoppingBag
                size={21}
                strokeWidth={1.7}
              />
            </Link>

            {/* ACCOUNT */}
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-[#171717] transition hover:bg-neutral-100 hover:text-[#c73572] sm:flex"
            >
              <UserRound
                size={20}
                strokeWidth={1.7}
              />
            </Link>
          </div>
        </div>

        {/* DESKTOP CATEGORY NAVIGATION */}
        <div className="hidden w-full border-t border-neutral-100 lg:block">
          <div className="flex w-full items-center justify-center gap-8 px-8 py-3">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500 transition-colors duration-200 hover:text-[#c73572]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[106px] z-40 border-b border-neutral-200 bg-white shadow-lg lg:hidden">
          <nav className="flex flex-col px-5 py-5">
            
            {/* MAIN LINKS */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="flex items-center justify-between border-b border-neutral-100 py-4 text-sm font-medium text-[#171717] transition-colors hover:text-[#c73572]"
              >
                <span>{link.name}</span>

                <ChevronRight
                  size={16}
                  className="text-neutral-400"
                />
              </Link>
            ))}

            {/* COLLECTIONS */}
            <div className="pt-5">
              <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Collections
              </p>

              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-[#f7f5f1] px-3 py-3 text-xs font-medium text-neutral-700 transition hover:bg-[#fbf0f5] hover:text-[#c73572]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* MOBILE ACTIONS */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link
                href="/wishlist"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 py-3 text-xs font-medium text-[#171717] transition hover:bg-neutral-50"
              >
                <Heart size={15} />
                Wishlist
              </Link>

              <Link
                href="/account"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 py-3 text-xs font-medium text-[#171717] transition hover:bg-neutral-50"
              >
                <UserRound size={15} />
                Account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}