"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import { products } from "@/lib/products";

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState(
    products.slice(0, 4)
  );

  const removeProduct = (slug: string) => {
    setRecentProducts((current) =>
      current.filter((product) => product.slug !== slug)
    );
  };

  const clearAll = () => {
    setRecentProducts([]);
  };

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500">
              Your browsing history
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Recently Viewed
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Products you recently explored.
            </p>
          </div>

          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-neutral-500 underline underline-offset-4 transition hover:text-neutral-900"
          >
            Clear all
          </button>
        </div>

        {/* Products */}
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recentProducts.map((product) => (
            <div
              key={product.slug}
              className="group relative overflow-hidden rounded-[20px] bg-white"
            >
              {/* Remove */}
              <button
                type="button"
                onClick={() => removeProduct(product.slug)}
                aria-label={`Remove ${product.name}`}
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-neutral-950"
              >
                <X size={14} />
              </button>

              {/* Product Link */}
              <Link
                href={`/products/${product.slug}`}
                className="block"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f3ee]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                  <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-sm transition duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={15} />
                  </span>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {product.comparePrice ? (
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{product.comparePrice.toLocaleString("en-IN")}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}