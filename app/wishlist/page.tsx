"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";

const initialWishlist = [
  {
    id: 1,
    name: "Classic Linen Shirt",
    category: "Men",
    price: 1499,
    oldPrice: 1999,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    slug: "classic-linen-shirt",
  },
  {
    id: 2,
    name: "Leather Handbag",
    category: "Women",
    price: 2499,
    oldPrice: 3499,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    slug: "leather-handbag",
  },
  {
    id: 3,
    name: "Ceramic Vase",
    category: "Home & Living",
    price: 1299,
    oldPrice: 1899,
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    slug: "ceramic-vase",
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const removeItem = (id: number) => {
    setWishlist((items) => items.filter((item) => item.id !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#171717]">
      {/* Header */}
      <section className="border-b border-[#e5e1da] bg-[#f5f3ee] px-5 py-12 sm:px-8 sm:py-14">
        <div className="site-container">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a91d4f]">
            Your Collection
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#171717] sm:text-4xl">
            Wishlist
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
            Save the products you love and come back to them anytime.
          </p>
        </div>
      </section>

      {/* Wishlist */}
      <section className="site-container py-8 sm:py-10">
        {wishlist.length > 0 ? (
          <>
            {/* Top row */}
            <div className="mb-6 flex items-center justify-between border-b border-[#e5e1da] pb-4">
              <p className="text-sm font-medium text-neutral-600">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "item" : "items"} saved
              </p>

              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition hover:text-[#a91d4f]"
              >
                <Trash2 size={16} />
                Clear wishlist
              </button>
            </div>

            {/* Products */}
            <div className="overflow-hidden rounded-xl border border-[#e5e1da] bg-white shadow-sm">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col gap-5 border-b border-[#eee9e8] p-4 last:border-b-0 sm:flex-row sm:items-center sm:p-5 lg:p-6"
                >
                  {/* Image */}
                  <div className="relative aspect-4/5 w-full shrink-0 overflow-hidden rounded-lg bg-[#f0eee8] sm:w-36 lg:w-40">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Wishlist button */}
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:text-[#a91d4f]"
                      aria-label="Remove from wishlist"
                    >
                      <Heart
                        size={20}
                        className="fill-[#a91d4f] text-[#a91d4f]"
                      />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                      {product.category}
                    </p>

                    <Link href={`/products/${product.slug}`} className="group/title">
                      <h2 className="line-clamp-2 text-lg font-semibold leading-6 text-[#171717] transition group-hover/title:text-[#a91d4f] sm:text-xl">
                        {product.name}
                      </h2>
                    </Link>

                    <p className="mt-2 text-xs text-neutral-500">Usually delivered in 3-5 days</p>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-base font-bold text-[#171717] sm:text-lg">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      <span className="text-xs text-neutral-400 line-through sm:text-sm">
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center justify-center rounded-lg bg-[#171717] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#a91d4f] sm:text-sm"
                      >
                        View Product
                      </Link>

                      <button
                        onClick={() => removeItem(product.id)}
                        className="inline-flex items-center gap-2 px-1 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition hover:text-[#a91d4f]"
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty wishlist */
          <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-[#e5e1da] bg-white px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7e9ef]">
              <ShoppingBag size={28} className="text-[#a91d4f]" />
            </div>

            <h2 className="text-2xl font-semibold text-[#171717]">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
              Save products you love and they will appear here.
            </p>

            <Link
              href="/products"
              className="mt-6 rounded-lg bg-[#171717] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#a91d4f]"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}