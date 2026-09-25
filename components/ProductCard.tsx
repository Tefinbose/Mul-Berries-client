"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, ShoppingBag, Star } from "lucide-react";

import type { Product, ProductVariant } from "@/lib/products";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: Product;
  tallImage?: boolean;
};

export default function ProductCard({
  product,
  tallImage = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  const totalStock = (product.variants || []).reduce(
    (total, variant) => total + (variant.stock || 0),
    0
  );

  const defaultVariant: ProductVariant =
    product.variants?.[0] || {
      id: `${product._id || product.slug}-default`,
      sku: `${product.slug}-default`,
      color: "Default",
      size: "Free Size",
      price: product.price,
      stock: totalStock || 10,
    };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, defaultVariant, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#e5b3c8] hover:shadow-[0_14px_30px_rgba(200,53,114,0.08)]">
      {/* Product Image Container */}
      <div
        className={`relative overflow-hidden bg-gradient-to-b from-[#faf6f8] to-[#f4eef2] ${
          tallImage ? "aspect-[3/4]" : "aspect-[4/5]"
        }`}
      >
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images?.[0] || product.image}
            alt={product.name}
            fill
            className="object-cover object-top transition duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#d63372] to-[#b8235e] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            <span>{discount}% OFF</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
            isWishlisted
              ? "bg-[#d63372] text-white shadow-md scale-105"
              : "bg-white/90 text-neutral-700 shadow-sm hover:bg-white hover:text-[#d63372] hover:scale-110"
          }`}
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-current" : ""}
            strokeWidth={2}
          />
        </button>

        {/* Quick Add To Cart Floating Button */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`group/btn flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-300 hover:scale-110 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-neutral-900 text-white hover:bg-[#d63372]"
            }`}
            title="Quick add to cart"
          >
            {isAdded ? (
              <Check size={18} className="animate-in zoom-in-75 duration-200" />
            ) : (
              <ShoppingBag size={17} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px]">
          <p className="font-semibold uppercase tracking-wider text-[#c73572]">
            {product.category || "Luxury Saree"}
          </p>
          <div className="flex items-center gap-1 text-neutral-600">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold">4.8</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="mt-1.5 flex-1">
          <h3 className="line-clamp-2 text-xs font-semibold leading-5 text-neutral-900 transition-colors group-hover:text-[#d63372] sm:text-sm">
            {product.name}
          </h3>
        </Link>

        {/* Price & Stock */}
        <div className="mt-3 flex items-baseline justify-between border-t border-neutral-100 pt-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-neutral-950 sm:text-base">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{product.comparePrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <span
            className={`text-[10px] font-medium ${
              totalStock === 0
                ? "text-rose-600 font-semibold"
                : totalStock <= 5
                ? "text-amber-600"
                : "text-emerald-700"
            }`}
          >
            {totalStock === 0
              ? "Out of stock"
              : totalStock <= 5
              ? `Only ${totalStock} left`
              : "In stock"}
          </span>
        </div>
      </div>
    </article>
  );
}