"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import type { CartItem as CartItemType } from "@/context/CartContext";

const FREE_SHIPPING_LIMIT = 3000;
const SHIPPING_CHARGE = 99;

type CartItemProps = {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  if (!item || !item.product || !item.variant) {
    return null;
  }

  const { product, variant, quantity } = item;

  const itemTotal = variant.price * quantity;

  return (
    <div className="border-b border-stone-200 py-4 last:border-b-0 sm:py-5">
      <div className="flex gap-4 sm:gap-5">

        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative h-28 w-21 shrink-0 overflow-hidden rounded-lg bg-stone-100 sm:h-32 sm:w-24"
        >
          <Image
            src={product.images?.[0] || product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-300 hover:scale-105"
            sizes="96px"
          />
        </Link>

        {/* Product Details */}
        <div className="flex min-w-0 flex-1 flex-col">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              {/* Category */}
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-stone-400">
                {product.category}
              </p>

              {/* Product Name */}
              <Link href={`/products/${product.slug}`}>
                <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-stone-900 transition hover:text-[#a91d4f] sm:text-[15px]">
                  {product.name}
                </h3>
              </Link>

              {/* Variant */}
              <div className="mt-2 space-y-0.5 text-[11px] text-stone-500">
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
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                text-stone-400
                transition
                hover:bg-red-50
                hover:text-red-500
              "
              aria-label={`Remove ${product.name}`}
            >
              <Trash2 size={15} />
            </button>

          </div>

          {/* Bottom Row */}
          <div className="mt-3 flex items-center justify-between gap-3">

            {/* Quantity */}
            <div className="flex h-8 items-center rounded-md border border-stone-300">

              <button
                type="button"
                onClick={onDecrease}
                disabled={quantity <= 1}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  text-stone-500
                  transition
                  hover:text-black
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>

              <span className="w-7 text-center text-xs font-medium">
                {quantity}
              </span>

              <button
                type="button"
                onClick={onIncrease}
                disabled={quantity >= variant.stock}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  text-stone-500
                  transition
                  hover:text-black
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>

            </div>

            {/* Price */}
            <div className="text-right">

              <p className="text-[10px] text-stone-400">
                ₹{variant.price.toLocaleString("en-IN")} each
              </p>

              <p className="mt-0.5 text-sm font-semibold text-stone-900">
                ₹{itemTotal.toLocaleString("en-IN")}
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function CartPage() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    subtotal,
  } = useCart();

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_LIMIT - subtotal,
    0
  );

  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_LIMIT) * 100,
    100
  );

  const shipping =
    subtotal >= FREE_SHIPPING_LIMIT
      ? 0
      : SHIPPING_CHARGE;

  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">

      {/* ===================================================== */}
      {/* PAGE HEADER */}
      {/* ===================================================== */}

      <section className="border-b border-stone-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">

          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            Your Shopping Bag
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-stone-900 sm:text-4xl">
            Cart
          </h1>

          <p className="mt-1.5 text-sm text-stone-500">
            Review your items before moving to checkout.
          </p>

        </div>

      </section>

      {/* ===================================================== */}
      {/* CART CONTENT */}
      {/* ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">

        {items.length > 0 ? (
          <>

            {/* ================================================= */}
            {/* FREE SHIPPING BAR */}
            {/* ================================================= */}

            <div className="mb-5 rounded-xl border border-stone-200 bg-white px-4 py-3.5 sm:px-5">

              <div className="flex items-center gap-2.5">

                <Truck
                  size={17}
                  className="shrink-0 text-stone-700"
                />

                {remainingForFreeShipping > 0 ? (
                  <p className="text-xs text-stone-600 sm:text-sm">
                    Add{" "}
                    <span className="font-semibold text-stone-900">
                      ₹
                      {remainingForFreeShipping.toLocaleString(
                        "en-IN"
                      )}
                    </span>{" "}
                    more to get free shipping.
                  </p>
                ) : (
                  <p className="text-xs font-medium text-stone-800 sm:text-sm">
                    🎉 You unlocked free shipping!
                  </p>
                )}

              </div>

              {/* Progress */}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-200">

                <div
                  className="h-full rounded-full bg-stone-900 transition-all duration-500"
                  style={{
                    width: `${shippingProgress}%`,
                  }}
                />

              </div>

            </div>

            {/* ================================================= */}
            {/* MAIN GRID */}
            {/* ================================================= */}

            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_360px]">

              {/* ================================================= */}
              {/* LEFT - ITEMS */}
              {/* ================================================= */}

              <div className="rounded-xl border border-stone-200 bg-white">

                {/* Items Header */}

                <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3.5 sm:px-5">

                  <div>

                    <h2 className="text-base font-semibold text-stone-900">
                      Your Items
                    </h2>

                    <p className="mt-0.5 text-[11px] text-stone-400">
                      {items.length}{" "}
                      {items.length === 1 ? "product" : "products"}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-stone-500
                      transition
                      hover:text-red-500
                    "
                  >
                    <Trash2 size={13} />
                    Clear cart
                  </button>

                </div>

                {/* Cart Items */}

                <div className="px-4 sm:px-5">

                  {items.map((item) => {

                    if (!item?.product || !item?.variant) {
                      return null;
                    }

                    return (
                      <CartItem
                        key={`${item.product.slug}-${item.variant.id}`}
                        item={item}
                        onIncrease={() =>
                          increaseQuantity(
                            item.product.slug,
                            item.variant.id
                          )
                        }
                        onDecrease={() =>
                          decreaseQuantity(
                            item.product.slug,
                            item.variant.id
                          )
                        }
                        onRemove={() =>
                          removeFromCart(
                            item.product.slug,
                            item.variant.id
                          )
                        }
                      />
                    );
                  })}

                </div>

                {/* Continue Shopping */}

                <div className="border-t border-stone-200 px-4 py-3.5 sm:px-5">

                  <Link
                    href="/products"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      text-xs
                      font-medium
                      text-stone-600
                      transition
                      hover:text-[#a91d4f]
                    "
                  >
                    <ArrowLeft size={15} />
                    Continue Shopping
                  </Link>

                </div>

              </div>

              {/* ================================================= */}
              {/* RIGHT - ORDER SUMMARY */}
              {/* ================================================= */}

              <aside className="lg:sticky lg:top-24">

                <div className="rounded-xl border border-stone-200 bg-white">

                  {/* Summary Header */}

                  <div className="border-b border-stone-200 px-5 py-4">

                    <h2 className="text-lg font-semibold text-stone-900">
                      Order Summary
                    </h2>

                  </div>

                  {/* Summary Details */}

                  <div className="px-5 py-4">

                    <div className="space-y-3">

                      {/* Subtotal */}

                      <div className="flex items-center justify-between text-sm">

                        <span className="text-stone-500">
                          Subtotal
                        </span>

                        <span className="font-medium text-stone-900">
                          ₹
                          {subtotal.toLocaleString("en-IN")}
                        </span>

                      </div>

                      {/* Shipping */}

                      <div className="flex items-center justify-between text-sm">

                        <span className="text-stone-500">
                          Shipping
                        </span>

                        <span
                          className={
                            shipping === 0
                              ? "font-medium text-green-600"
                              : "font-medium text-stone-900"
                          }
                        >
                          {shipping === 0
                            ? "FREE"
                            : `₹${shipping.toLocaleString(
                                "en-IN"
                              )}`}
                        </span>

                      </div>

                    </div>

                    {/* Total */}

                    <div className="mt-4 border-t border-stone-200 pt-4">

                      <div className="flex items-center justify-between">

                        <span className="text-base font-semibold text-stone-900">
                          Total
                        </span>

                        <span className="text-lg font-semibold text-stone-900">
                          ₹
                          {total.toLocaleString("en-IN")}
                        </span>

                      </div>

                    </div>

                    {/* Checkout */}

                    <Link
                      href="/checkout"
                      className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        bg-stone-900
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-[#a91d4f]
                      "
                    >
                      Proceed to Checkout
                    </Link>

                    {/* Secure Checkout */}

                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">

                      <Lock size={12} />

                      Secure checkout

                    </div>

                  </div>

                </div>

                {/* Small reassurance box */}

                <div className="mt-3 rounded-lg border border-stone-200 bg-white px-4 py-3">

                  <div className="flex items-center gap-2">

                    <ShoppingBag
                      size={15}
                      className="text-stone-500"
                    />

                    <p className="text-[11px] text-stone-500">
                      Your items are reserved in your bag.
                    </p>

                  </div>

                </div>

              </aside>

            </div>

          </>
        ) : (

          /* =================================================== */
          /* EMPTY CART */
          /* =================================================== */

          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-stone-200 bg-white px-6 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">

              <ShoppingBag
                size={27}
                className="text-stone-500"
              />

            </div>

            <h2 className="text-xl font-semibold text-stone-900">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-5 text-stone-500">
              Looks like you haven't added anything to your
              cart yet.
            </p>

            <Link
              href="/products"
              className="
                mt-6
                rounded-lg
                bg-stone-900
                px-6
                py-3
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#a91d4f]
              "
            >
              Start Shopping
            </Link>

          </div>

        )}

      </section>

    </main>
  );
}