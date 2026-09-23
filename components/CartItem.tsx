"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/context/CartContext";

type CartItemProps = {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  // Safety check
  if (!item) {
    return null;
  }

  const { product, variant, quantity } = item;

  const itemTotal = variant.price * quantity;

  return (
    <div className="border-b border-stone-200 py-6">
      <div className="flex gap-5">
        {/* Product Image */}
        <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-40 sm:w-32">
          <Image
            src={product.images?.[0] || product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>

        {/* Product Details */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-400">
                {product.category}
              </p>

              <h3 className="mt-1 text-sm font-medium text-stone-900 sm:text-base">
                {product.name}
              </h3>

              <div className="mt-2 space-y-1 text-xs text-stone-500">
                <p>
                  Color:{" "}
                  <span className="text-stone-700">
                    {variant.color}
                  </span>
                </p>

                <p>
                  Size:{" "}
                  <span className="text-stone-700">
                    {variant.size}
                  </span>
                </p>
              </div>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${product.name}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={17} />
            </button>
          </div>

          {/* Quantity + Price */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
            {/* Quantity */}
            <div className="flex h-10 items-center rounded-full border border-stone-300">
              <button
                type="button"
                onClick={onDecrease}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center text-stone-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>

              <span className="w-8 text-center text-sm font-medium text-stone-900">
                {quantity}
              </span>

              <button
                type="button"
                onClick={onIncrease}
                disabled={quantity >= variant.stock}
                className="flex h-10 w-10 items-center justify-center text-stone-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-xs text-stone-400">
                ₹{variant.price.toLocaleString("en-IN")} each
              </p>

              <p className="mt-1 font-semibold text-stone-900">
                ₹{itemTotal.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}