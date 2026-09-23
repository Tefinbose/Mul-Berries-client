"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { products } from "@/lib/products";

type CrossSellProductsProps = {
  currentSlug?: string;
};

export default function CrossSellProducts({
  currentSlug,
}: CrossSellProductsProps) {
  const items = products
    .filter((product) => product.slug !== currentSlug)
    .slice(0, 3);

  const [selected, setSelected] = useState<string[]>([]);

  const toggleProduct = (slug: string) => {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  };

  const selectedProducts = items.filter((item) =>
    selected.includes(item.slug)
  );

  const total = selectedProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const addAllToCart = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    alert(
      `${selectedProducts.length} products added to cart.\nTotal: ₹${total.toLocaleString(
        "en-IN"
      )}`
    );
  };

  return (
    <section className="border-t border-neutral-200 pt-12">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          Complete the look
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
          You May Also Like
        </h2>
      </div>

      {/* Products */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {items.map((product) => {
          const isSelected = selected.includes(product.slug);

          return (
            <button
              key={product.slug}
              type="button"
              onClick={() => toggleProduct(product.slug)}
              className={`text-left ${
                isSelected
                  ? "rounded-2xl ring-2 ring-neutral-950"
                  : ""
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
                {product.images?.[0] || product.image ? (
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                    Image unavailable
                  </div>
                )}

                {/* Selection indicator */}
                <div
                  className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-neutral-950 text-white"
                      : "bg-white text-neutral-900"
                  }`}
                >
                  {isSelected && <Check size={16} />}
                </div>
              </div>

              {/* Product Information */}
              <div className="mt-3 px-1">
                <p className="text-xs uppercase tracking-wider text-neutral-400">
                  {product.category}
                </p>

                <h3 className="mt-1 text-sm font-medium text-neutral-900">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Products */}
      {selected.length > 0 && (
        <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl bg-neutral-50 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-neutral-500">
              Selected products
            </p>

            <p className="mt-1 text-lg font-semibold text-neutral-900">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>

          <button
            type="button"
            onClick={addAllToCart}
            className="flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <ShoppingBag size={17} />

            Add All to Cart
          </button>
        </div>
      )}
    </section>
  );
}