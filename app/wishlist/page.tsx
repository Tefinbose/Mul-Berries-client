"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getWishlistApi,
  removeFromWishlistApi,
  type WishlistProduct,
} from "@/services/wishlistApi";

type WishlistCard = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  slug: string;
};

function toWishlistCard(product: WishlistProduct): WishlistCard {
  const category =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "Collection";

  return {
    id: product._id,
    name: product.name,
    category,
    price: product.price,
    oldPrice: product.compareAtPrice,
    image: product.images?.[0] || "/products/placeholder.jpg",
    slug: product.slug,
  };
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getWishlistApi(token);
        setWishlist(
          (response.wishlist?.products || []).map(toWishlistCard)
        );
      } catch (loadError) {
        console.error("LOAD WISHLIST ERROR:", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load wishlist"
        );
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const removeItem = async (id: string) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await removeFromWishlistApi(id, token);
      } catch (removeError) {
        console.error("REMOVE WISHLIST ITEM ERROR:", removeError);
        setError(
          removeError instanceof Error
            ? removeError.message
            : "Failed to remove wishlist item"
        );
        return;
      }
    }

    setWishlist((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  const clearWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      await Promise.all(
        wishlist.map((item) =>
          removeFromWishlistApi(item.id, token)
        )
      );
      setWishlist([]);
    } catch (clearError) {
      console.error("CLEAR WISHLIST ERROR:", clearError);
      setError(
        clearError instanceof Error
          ? clearError.message
          : "Failed to clear wishlist"
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#171717]">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <section className="border-b border-[#e5e1da] bg-[#f5f3ee] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
        <div className="site-container">

          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a91d4f]">
            Your Collection
          </p>

          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-3xl">
            Wishlist
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-5 text-neutral-600 sm:text-sm">
            Save the products you love and come back to them anytime.
          </p>

        </div>
      </section>

      {/* ===================================================== */}
      {/* WISHLIST */}
      {/* ===================================================== */}

      <section className="site-container px-3 py-4 sm:px-5 sm:py-5 lg:px-6">

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-[#e5e1da] bg-white text-sm text-neutral-500">
            Loading your wishlist...
          </div>
        ) : error ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 text-center">
            <h2 className="text-xl font-semibold text-red-800">
              Unable to load your wishlist
            </h2>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        ) : wishlist.length > 0 ? (
          <>

            {/* ================================================= */}
            {/* TOP BAR */}
            {/* ================================================= */}

            <div className="mb-3 flex items-center justify-between border-b border-[#e5e1da] pb-3">

              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500 sm:text-xs">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "item" : "items"} saved
              </p>

              <button
                onClick={clearWishlist}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-neutral-500
                  transition
                  hover:text-[#a91d4f]
                  sm:text-xs
                "
              >
                <Trash2 size={13} />
                Clear wishlist
              </button>

            </div>

            {/* ================================================= */}
            {/* PRODUCT GRID */}
            {/* ================================================= */}

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-3
                sm:gap-3
                md:grid-cols-4
                lg:grid-cols-5
                lg:gap-3
                xl:gap-4
              "
            >

              {wishlist.map((product) => (
                <article
                  key={product.id}
                  className="
                    group
                    min-w-0
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#e5e1da]
                    bg-white
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_8px_24px_rgba(23,23,23,0.08)]
                  "
                >

                  {/* ========================================= */}
                  {/* IMAGE */}
                  {/* ========================================= */}

                  <div
                    className="
                      relative
                      aspect-[4/4.3]
                      w-full
                      overflow-hidden
                      bg-[#f0eee8]
                    "
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-[1.03]
                      "
                    />

                    {/* Wishlist */}

                    <button
                      onClick={() => removeItem(product.id)}
                      className="
                        absolute
                        right-2
                        top-2
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-white/95
                        shadow-sm
                        transition
                        hover:scale-105
                      "
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <Heart
                        size={14}
                        className="fill-[#a91d4f] text-[#a91d4f]"
                      />
                    </button>

                  </div>

                  {/* ========================================= */}
                  {/* DETAILS */}
                  {/* ========================================= */}

                  <div className="p-2.5 sm:p-3">

                    {/* Category */}

                    <p className="mb-1.5 truncate text-[8px] font-semibold uppercase tracking-[0.16em] text-[#a91d4f] sm:text-[9px]">
                      {product.category}
                    </p>

                    {/* Name */}

                    <Link
                      href={`/products/${product.slug}`}
                      className="block"
                    >
                      <h2
                        className="
                          line-clamp-2
                          min-h-[32px]
                          text-xs
                          font-semibold
                          leading-4
                          tracking-tight
                          text-[#171717]
                          transition
                          group-hover:text-[#a91d4f]
                          sm:text-sm
                          sm:leading-[18px]
                        "
                      >
                        {product.name}
                      </h2>
                    </Link>

                    {/* Delivery */}

                    <p className="mt-1.5 truncate text-[9px] leading-4 text-neutral-400">
                      Usually delivered in 3–5 days
                    </p>

                    {/* Price */}

                    <div className="mt-2 flex items-center gap-1.5">

                      <span className="text-sm font-semibold text-[#a91d4f] sm:text-base">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      {product.oldPrice && (
                        <span className="text-[9px] text-neutral-400 line-through sm:text-[10px]">
                          ₹{product.oldPrice.toLocaleString("en-IN")}
                        </span>
                      )}

                    </div>

                    {/* Actions */}

                    <div className="mt-3 flex items-center justify-between gap-2">

                      <Link
                        href={`/products/${product.slug}`}
                        className="
                          min-w-0
                          flex-1
                          rounded-md
                          bg-[#171717]
                          px-2
                          py-2
                          text-center
                          text-[9px]
                          font-semibold
                          text-white
                          transition
                          hover:bg-[#a91d4f]
                          sm:text-[10px]
                        "
                      >
                        View Product
                      </Link>

                      <button
                        onClick={() => removeItem(product.id)}
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-[#e5e1da]
                          text-neutral-500
                          transition
                          hover:border-[#a91d4f]
                          hover:text-[#a91d4f]
                        "
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 size={13} />
                      </button>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          </>
        ) : (

          /* =================================================== */
          /* EMPTY WISHLIST */
          /* =================================================== */

          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-[#e5e1da] bg-white px-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7e9ef]">
              <ShoppingBag
                size={24}
                className="text-[#a91d4f]"
              />
            </div>

            <h2 className="text-xl font-semibold text-[#171717]">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-xs leading-5 text-neutral-500 sm:text-sm">
              Save products you love and they will appear here.
            </p>

            <Link
              href="/products"
              className="
                mt-5
                rounded-lg
                bg-[#171717]
                px-6
                py-2.5
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#a91d4f]
              "
            >
              Continue Shopping
            </Link>

          </div>

        )}

      </section>

    </main>
  );
}