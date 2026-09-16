"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Check,
} from "lucide-react";

import type {
  Product,
  ProductVariant,
} from "@/lib/products";

import ProductVariants from "@/components/ProductVariants";

import { useCart } from "@/context/CartContext";

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const { addToCart } = useCart();

  const firstVariant =
    product.variants[0];

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(
      firstVariant
    );

  const [quantity, setQuantity] =
    useState(1);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [addedToCart, setAddedToCart] =
    useState(false);

  const increaseQuantity = () => {
    if (
      quantity <
      selectedVariant.stock
    ) {
      setQuantity((current) =>
        current + 1
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) =>
        current - 1
      );
    }
  };

  const handleVariantChange = (
    variant: ProductVariant
  ) => {
    setSelectedVariant(variant);

    // Reset quantity when variant changes
    setQuantity(1);

    // Reset success message
    setAddedToCart(false);
  };

  const handleAddToCart = () => {
    if (selectedVariant.stock <= 0) {
      return;
    }

    if (
      quantity >
      selectedVariant.stock
    ) {
      return;
    }

    addToCart(
      product,
      selectedVariant,
      quantity
    );

    setAddedToCart(true);

    // Remove success message after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col">
      {/* Category */}
      <Link
        href={`/categories/${product.category
          .toLowerCase()
          .replaceAll(" ", "-")}`}
        className="text-sm font-medium uppercase tracking-widest text-neutral-500 hover:text-neutral-900"
      >
        {product.category}
      </Link>

      {/* Product Name */}
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
        {product.name}
      </h1>

      {/* Price */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-2xl font-semibold text-neutral-950">
          ₹
          {selectedVariant.price.toLocaleString(
            "en-IN"
          )}
        </span>

        {product.comparePrice &&
          product.comparePrice >
            selectedVariant.price && (
            <span className="text-base text-neutral-400 line-through">
              ₹
              {product.comparePrice.toLocaleString(
                "en-IN"
              )}
            </span>
          )}
      </div>

      {/* Description */}
      <p className="mt-6 leading-7 text-neutral-600">
        {product.description}
      </p>

      {/* Divider */}
      <div className="my-8 h-px bg-neutral-200" />

      {/* Variants */}
      <ProductVariants
        product={product}
        selectedVariant={
          selectedVariant
        }
        onVariantChange={
          handleVariantChange
        }
      />

      {/* Product Benefits */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-sm font-medium">
            Premium Quality
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Carefully selected materials
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-sm font-medium">
            Secure Packaging
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Packed safely for delivery
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-sm font-medium">
            Easy Returns
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Simple return process
          </p>
        </div>
      </div>

      {/* Quantity + Wishlist */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {/* Quantity */}
        <div className="flex h-12 items-center rounded-full border border-neutral-300">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="flex h-12 w-12 items-center justify-center text-neutral-600 transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>

          <span className="w-10 text-center text-sm font-medium">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={
              quantity >=
              selectedVariant.stock
            }
            className="flex h-12 w-12 items-center justify-center text-neutral-600 transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() =>
            setIsWishlisted(
              (current) => !current
            )
          }
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
            isWishlisted
              ? "border-neutral-950 bg-neutral-950 text-white"
              : "border-neutral-300 text-neutral-700 hover:border-neutral-950"
          }`}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={18}
            fill={
              isWishlisted
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      {/* Add to Cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={
          selectedVariant.stock <= 0
        }
        className={`mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition ${
          selectedVariant.stock <= 0
            ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
            : addedToCart
            ? "bg-green-600 text-white"
            : "bg-neutral-950 text-white hover:bg-neutral-800"
        }`}
      >
        {selectedVariant.stock <= 0 ? (
          "Out of Stock"
        ) : addedToCart ? (
          <>
            <Check size={18} />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag size={18} />
            Add to Cart
          </>
        )}
      </button>

      {/* Stock message */}
      {selectedVariant.stock > 0 &&
        selectedVariant.stock <= 5 && (
          <p className="mt-3 text-center text-sm font-medium text-orange-600">
            Only {selectedVariant.stock} left
          </p>
        )}
    </div>
  );
}