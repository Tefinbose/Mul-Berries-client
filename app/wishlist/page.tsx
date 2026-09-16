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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-stone-500">
            Your Collection
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
            Wishlist
          </h1>

          <p className="mt-4 max-w-xl text-stone-600">
            Save the products you love and come back to them anytime.
          </p>
        </div>
      </section>

      {/* Wishlist */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {wishlist.length > 0 ? (
          <>
            {/* Top row */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-stone-600">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "item" : "items"} saved
              </p>

              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 text-sm text-stone-600 transition hover:text-black"
              >
                <Trash2 size={16} />
                Clear wishlist
              </button>
            </div>

            {/* Products */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-stone-200 bg-white"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Wishlist button */}
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
                      aria-label="Remove from wishlist"
                    >
                      <Heart
                        size={20}
                        className="fill-red-500 text-red-500"
                      />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
                      {product.category}
                    </p>

                    <h2 className="text-xl font-semibold text-stone-900">
                      {product.name}
                    </h2>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-lg font-semibold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      <span className="text-sm text-stone-400 line-through">
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
                      >
                        View Product
                      </Link>

                      <button
                        onClick={() => removeItem(product.id)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 transition hover:bg-stone-200"
                        aria-label="Remove product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty wishlist */
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <ShoppingBag size={32} className="text-stone-500" />
            </div>

            <h2 className="text-2xl font-semibold text-stone-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-stone-500">
              Save products you love and they will appear here.
            </p>

            <Link
              href="/products"
              className="mt-6 rounded-full bg-stone-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}