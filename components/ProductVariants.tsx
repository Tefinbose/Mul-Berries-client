"use client";

import { useMemo } from "react";

import type {
  Product,
  ProductVariant,
} from "@/lib/products";

type ProductVariantsProps = {
  product: Product;
  selectedVariant: ProductVariant;
  onVariantChange: (
    variant: ProductVariant
  ) => void;
};

export default function ProductVariants({
  product,
  selectedVariant,
  onVariantChange,
}: ProductVariantsProps) {
  const colors = useMemo(() => {
    return Array.from(
      new Set(
        product.variants.map(
          (variant) => variant.color
        )
      )
    );
  }, [product.variants]);

  const sizes = useMemo(() => {
    return Array.from(
      new Set(
        product.variants.map(
          (variant) => variant.size
        )
      )
    );
  }, [product.variants]);

  const handleColorChange = (
    color: string
  ) => {
    const matchingVariant =
      product.variants.find(
        (variant) =>
          variant.color === color &&
          variant.size ===
            selectedVariant.size
      );

    if (matchingVariant) {
      onVariantChange(matchingVariant);
      return;
    }

    const firstVariantWithColor =
      product.variants.find(
        (variant) =>
          variant.color === color
      );

    if (firstVariantWithColor) {
      onVariantChange(
        firstVariantWithColor
      );
    }
  };

  const handleSizeChange = (
    size: string
  ) => {
    const matchingVariant =
      product.variants.find(
        (variant) =>
          variant.color ===
            selectedVariant.color &&
          variant.size === size
      );

    if (matchingVariant) {
      onVariantChange(matchingVariant);
      return;
    }

    const firstVariantWithSize =
      product.variants.find(
        (variant) =>
          variant.size === size
      );

    if (firstVariantWithSize) {
      onVariantChange(
        firstVariantWithSize
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Color */}
      {colors.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-900">
              Color
            </p>

            <p className="text-sm text-neutral-500">
              {selectedVariant.color}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected =
                selectedVariant.color ===
                color;

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    handleColorChange(color)
                  }
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isSelected
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-950"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size */}
      {sizes.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-900">
              Size
            </p>

            <p className="text-sm text-neutral-500">
              {selectedVariant.size}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => {
              const isSelected =
                selectedVariant.size ===
                size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    handleSizeChange(size)
                  }
                  className={`min-w-16 rounded-lg border px-4 py-2 text-sm transition ${
                    isSelected
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-950"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Information */}
      <div className="rounded-xl bg-neutral-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            Price
          </span>

          <span className="font-semibold text-neutral-900">
            ₹
            {selectedVariant.price.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            Availability
          </span>

          {selectedVariant.stock > 0 ? (
            <span className="text-sm font-medium text-green-600">
              {selectedVariant.stock} available
            </span>
          ) : (
            <span className="text-sm font-medium text-red-600">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}