"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  ShoppingCart,
} from "lucide-react";

import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function BestSellers() {
  const { addToCart } = useCart();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  // Temporary selection
  const bestSellers = products.slice(4, 8);

  const handleQuickAdd = (product: (typeof products)[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants?.[0] || {
      size: "Free Size",
      color: "Default",
      price: product.price,
      stock: product.stock ?? 10,
    };
    addToCart(product, defaultVariant, 1);
    setAddedSlug(product.slug);
    setTimeout(() => {
      setAddedSlug(null);
    }, 1800);
  };

  return (
    <section className="w-full px-3 py-3 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div
        className="
          w-full
          overflow-hidden
          rounded-[20px]
          bg-[#f5f3ee]
          px-3
          py-6

          sm:rounded-[24px]
          sm:px-5
          sm:py-7

          lg:px-6
          lg:py-8
        "
      >
        {/* ================================
            HEADER
        ================================= */}

        <div
          className="
            mb-5
            flex
            items-end
            justify-between
            gap-4

            sm:mb-7
          "
        >
          <div>
            <h2
              className="
                text-[25px]
                font-normal
                uppercase
                leading-none
                tracking-[-0.02em]
                text-[#292929]

                sm:text-3xl
                lg:text-[36px]
              "
            >
              Explore our{" "}
              <span className="font-bold text-[#c73572]">
                Bestsellers
              </span>
            </h2>

            <p
              className="
                mt-2
                text-xs
                text-neutral-500
                sm:text-sm
              "
            >
              Loved by many. Worn everywhere.
            </p>
          </div>

          {/* Desktop View All */}

          <Link
            href="/products"
            className="
              hidden
              items-center
              gap-1.5
              text-sm
              font-medium
              text-[#c73572]
              transition
              hover:text-[#a8275c]
              sm:flex
            "
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* ================================
            PRODUCTS
        ================================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-x-2
            gap-y-6

            sm:grid-cols-3
            sm:gap-x-3
            sm:gap-y-8

            lg:grid-cols-4
            lg:gap-x-4
            lg:gap-y-9
          "
        >
          {bestSellers.map((product) => (
            <div
              key={product.slug}
              className="
                group
                min-w-0
                max-w-full
              "
            >
              {/* ================================
                  PRODUCT IMAGE
              ================================= */}

              <div
                className="
                  relative
                  mx-auto
                  aspect-[5/6]
                  w-full
                  max-w-[280px]
                  overflow-hidden
                  rounded-[6px]
                  bg-[#f1e5eb]

                  lg:max-w-[270px]
                  xl:max-w-[290px]
                "
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="block h-full w-full"
                >
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="
                      h-full
                      w-full
                      object-cover

                      transition-transform
                      duration-700
                      ease-out

                      group-hover:scale-105
                    "
                  />
                </Link>

                {/* Wishlist */}

                <button
                  type="button"
                  aria-label={`Add ${product.name} to wishlist`}
                  className="
                    absolute
                    right-2
                    top-2
                    z-10

                    flex
                    h-8
                    w-8
                    items-center
                    justify-center

                    rounded-full
                    bg-white/90

                    text-neutral-700
                    shadow-sm
                    backdrop-blur-sm

                    transition-all
                    duration-300

                    hover:scale-105
                    hover:text-[#c73572]

                    sm:right-3
                    sm:top-3
                    sm:h-9
                    sm:w-9
                  "
                >
                  <Heart
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>

                {/* Add To Cart */}

                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(product, e)}
                  aria-label={`Add ${product.name} to cart`}
                  className={`
                    absolute
                    bottom-2
                    right-2
                    z-10

                    flex
                    h-9
                    w-9
                    items-center
                    justify-center

                    rounded-full
                    text-white

                    shadow-sm

                    transition-all
                    duration-300

                    hover:scale-110
                    active:scale-95

                    sm:bottom-3
                    sm:right-3
                    sm:h-10
                    sm:w-10
                    ${
                      addedSlug === product.slug
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-[#f45149] hover:bg-[#e03d35]"
                    }
                  `}
                >
                  {addedSlug === product.slug ? (
                    <Check
                      size={16}
                      strokeWidth={2.5}
                      className="animate-scale-in"
                    />
                  ) : (
                    <ShoppingCart
                      size={15}
                      strokeWidth={1.8}
                    />
                  )}
                </button>
              </div>

              {/* ================================
                  PRODUCT INFORMATION
              ================================= */}

              <Link
                href={`/products/${product.slug}`}
                className="block"
              >
                <div
                  className="
                    mx-auto
                    max-w-[280px]
                    px-0.5
                    pt-2.5

                    sm:pt-3

                    lg:max-w-[270px]
                    xl:max-w-[290px]
                  "
                >
                  <h3
                    className="
                      line-clamp-2
                      text-[13px]
                      font-medium
                      leading-[18px]
                      text-neutral-950

                      transition-colors

                      group-hover:text-[#c73572]

                      sm:text-sm
                      sm:leading-5
                    "
                  >
                    {product.name}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-medium
                      text-neutral-600

                      sm:text-sm
                    "
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* ================================
            MOBILE VIEW ALL
        ================================= */}

        <Link
          href="/products"
          className="
            mt-7
            flex
            items-center
            justify-center
            gap-2

            rounded-full
            border
            border-[#c73572]

            px-5
            py-3

            text-sm
            font-medium
            text-[#c73572]

            transition

            hover:bg-[#c73572]
            hover:text-white

            sm:hidden
          "
        >
          Shop best sellers

          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}