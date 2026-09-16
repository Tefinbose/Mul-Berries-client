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
    <div className="border-b border-stone-200 py-6">
      <div className="flex gap-5">
        {/* Product Image */}
        <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-40 sm:w-32">
          <Image
            src={product.image}
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-500"
              aria-label={`Remove ${product.name}`}
            >
              <Trash2 size={17} />
            </button>
          </div>

          {/* Quantity + Price */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
            <div className="flex h-10 items-center rounded-full border border-stone-300">
              <button
                type="button"
                onClick={onDecrease}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center text-stone-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={15} />
              </button>

              <span className="w-8 text-center text-sm font-medium">
                {quantity}
              </span>

              <button
                type="button"
                onClick={onIncrease}
                disabled={quantity >= variant.stock}
                className="flex h-10 w-10 items-center justify-center text-stone-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={15} />
              </button>
            </div>

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
    subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_CHARGE;

  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b bg-stone-50 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-stone-500">
            Your Shopping Bag
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
            Cart
          </h1>

          <p className="mt-4 max-w-xl text-stone-600">
            Review your items before moving to checkout.
          </p>
        </div>
      </section>

      {/* Cart */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {items.length > 0 ? (
          <>
            {/* Free Shipping */}
            <div className="mb-10 rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <div className="flex items-center gap-3">
                <Truck size={20} />

                {remainingForFreeShipping > 0 ? (
                  <p className="text-sm text-stone-700">
                    Add{" "}
                    <span className="font-semibold">
                      ₹
                      {remainingForFreeShipping.toLocaleString(
                        "en-IN"
                      )}
                    </span>{" "}
                    more to get free shipping.
                  </p>
                ) : (
                  <p className="text-sm font-medium text-stone-800">
                    🎉 You unlocked free shipping!
                  </p>
                )}
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-stone-900 transition-all duration-500"
                  style={{
                    width: `${shippingProgress}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              {/* Items */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Your Items
                  </h2>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm text-stone-500 hover:text-red-500"
                  >
                    Clear cart
                  </button>
                </div>

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

                <Link
                  href="/products"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-black"
                >
                  <ArrowLeft size={17} />
                  Continue Shopping
                </Link>
              </div>

              {/* Summary */}
              <div className="h-fit rounded-2xl border border-stone-200 bg-stone-50 p-6">
                <h2 className="text-xl font-semibold text-stone-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">
                      Shipping
                    </span>

                    <span className="font-medium">
                      {shipping === 0
                        ? "FREE"
                        : `₹${shipping.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <div className="border-t border-stone-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-lg font-semibold">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center rounded-full bg-stone-900 px-6 py-4 text-sm font-medium text-white hover:bg-stone-700"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-stone-500">
                  <Lock size={14} />
                  Secure checkout
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <ShoppingBag
                size={32}
                className="text-stone-500"
              />
            </div>

            <h2 className="text-2xl font-semibold text-stone-900">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-md text-stone-500">
              Looks like you haven't added anything to your
              cart yet.
            </p>

            <Link
              href="/products"
              className="mt-7 rounded-full bg-stone-900 px-7 py-3 text-sm font-medium text-white hover:bg-stone-700"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}