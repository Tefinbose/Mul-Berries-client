"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Heart,
  Minus,
  Plus,
  Ruler,
  Star,
  Truck,
  Zap,
} from "lucide-react";

import type { Product } from "@/lib/products";

import MobileColorSelector from "@/components/MobileColorSelector";
import MobileSizeSelector from "@/components/MobileSizeSelector";
import MobileProductActions from "@/components/MobileProductActions";
import { useCart } from "@/context/CartContext";

interface ProductDetailsProps {
  product: Product;
}

interface ExtendedProduct extends Product {
  _id?: string;
  stock?: number;
}

const colors = [
  {
    name: "Emerald Green",
    value: "#087f68",
  },
  {
    name: "Bottle Green",
    value: "#174c3d",
  },
  {
    name: "Rose Pink",
    value: "#d63372",
  },
  {
    name: "Purple",
    value: "#70408d",
  },
];

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const extendedProduct = product as ExtendedProduct;

  const variants = extendedProduct.variants ?? [];

  const availableColors =
    variants.length > 0
      ? Array.from(
          new Map(
            variants.map((variant) => [
              variant.color,
              {
                name: variant.color,
                value:
                  colors.find(
                    (color) =>
                      color.name === variant.color
                  )?.value ?? "#d4d4d4",
              },
            ])
          ).values()
        )
      : colors;

  const productStock = Number(
    extendedProduct.stock ?? 0
  );

  const productPrice = Number(
    product.price ?? 0
  );

  const comparePrice = Number(
    extendedProduct.comparePrice ?? productPrice
  );

  /*
   * ---------------------------------------------------------
   * STATE
   * ---------------------------------------------------------
   */

  const [selectedColor, setSelectedColor] =
    useState(
      variants[0]?.color ??
        availableColors[0]?.name ??
        ""
    );

  const [selectedSize, setSelectedSize] =
    useState(
      variants[0]?.size || "Free Size"
    );

  const [quantity, setQuantity] =
    useState(1);

  const [wishlist, setWishlist] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * SELECTED VARIANT
   * ---------------------------------------------------------
   */

  const selectedVariant = variants.find(
    (variant) =>
      variant.size === selectedSize &&
      variant.color === selectedColor
  ) ??
    variants.find(
      (variant) => variant.size === selectedSize
    );

  const finalPrice = Number(
    selectedVariant?.price ??
      productPrice
  );

  const availableStock = Number(
    selectedVariant?.stock ??
      productStock
  );

  const isOutOfStock =
    availableStock <= 0;

  /*
   * ---------------------------------------------------------
   * DISCOUNT
   * ---------------------------------------------------------
   */

  const discount =
    comparePrice > finalPrice
      ? Math.round(
          ((comparePrice - finalPrice) /
            comparePrice) *
            100
        )
      : 0;

  /*
   * ---------------------------------------------------------
   * SIZES
   * ---------------------------------------------------------
   */

  const sizes =
    variants.length > 0
      ? Array.from(
          new Set(
            variants.map(
              (variant) => variant.size
            )
          )
        )
      : ["Free Size"];

  /*
   * ---------------------------------------------------------
   * FORMAT PRICE
   * ---------------------------------------------------------
   */

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(finalPrice);
  }, [finalPrice]);

  const formattedComparePrice =
    useMemo(() => {
      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      ).format(comparePrice);
    }, [comparePrice]);

  /*
   * ---------------------------------------------------------
   * STOCK
   * ---------------------------------------------------------
   */

  const stockMessage = isOutOfStock
    ? "Currently out of stock"
    : availableStock <= 5
      ? `Only ${availableStock} left in stock`
      : "In stock";

  const stockColor = isOutOfStock
    ? "text-red-600"
    : availableStock <= 5
      ? "text-orange-600"
      : "text-green-600";

  /*
   * ---------------------------------------------------------
   * QUANTITY
   * ---------------------------------------------------------
   */

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      current < availableStock
        ? current + 1
        : current
    );
  };

  /*
   * ---------------------------------------------------------
   * SIZE
   * ---------------------------------------------------------
   */

  const handleSizeChange = (
    size: string
  ) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    const matchingVariant = variants.find(
      (variant) =>
        variant.color === color &&
        variant.size === selectedSize
    );

    if (!matchingVariant) {
      const firstVariantWithColor = variants.find(
        (variant) => variant.color === color
      );

      if (firstVariantWithColor) {
        setSelectedSize(firstVariantWithColor.size);
      }
    }

    setQuantity(1);
  };

  /*
   * ---------------------------------------------------------
   * ADD TO CART
   * ---------------------------------------------------------
   */

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    if (!selectedVariant) {
      return;
    }

    addToCart(product, selectedVariant, quantity);
  };

  /*
   * ---------------------------------------------------------
   * BUY NOW
   * ---------------------------------------------------------
   */

  const handleBuyNow = () => {
    if (isOutOfStock) {
      return;
    }

    if (!selectedVariant) {
      return;
    }

    addToCart(product, selectedVariant, quantity);
    router.push("/cart");
  };

  /*
   * ---------------------------------------------------------
   * WISHLIST
   * ---------------------------------------------------------
   */

  const handleWishlist = () => {
    setWishlist(
      (current) => !current
    );
  };

  return (
    <div className="w-full">

      {/* =====================================================
          RATING
      ===================================================== */}

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star
            size={15}
            className="
              fill-yellow-400
              text-yellow-400
            "
          />

          <span className="text-sm font-semibold text-neutral-800">
            4.8
          </span>
        </div>

        <span className="text-sm text-neutral-300">
          •
        </span>

        <span className="text-sm text-neutral-500">
          124 reviews
        </span>
      </div>

      {/* =====================================================
          PRODUCT NAME
      ===================================================== */}

      <h1
        className="
          mt-2
          text-xl
          font-semibold
          leading-tight
          tracking-tight
          text-neutral-950

          sm:text-2xl

          md:text-2xl

          lg:text-[27px]

          xl:text-3xl
        "
      >
        {product.name}
      </h1>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      {product.description && (
        <p
          className="
            mt-2
            text-xs
            leading-5
            text-neutral-600

            sm:text-sm
            sm:leading-6

            lg:text-sm
          "
        >
          {product.description}
        </p>
      )}

      {/* =====================================================
          PRICE
      ===================================================== */}

      <div className="mt-4 sm:mt-5">
        <div className="flex flex-wrap items-center gap-2.5">

          <span
            className="
              text-2xl
              font-bold
              tracking-tight
              text-neutral-950

              sm:text-3xl

              lg:text-3xl
            "
          >
            {formattedPrice}
          </span>

          {comparePrice >
            finalPrice && (
            <>
              <span
                className="
                  text-sm
                  text-neutral-400
                  line-through

                  sm:text-base
                "
              >
                {formattedComparePrice}
              </span>

              <span
                className="
                  rounded-full
                  bg-green-50
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  text-green-700

                  sm:text-xs
                "
              >
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        <p className="mt-1 text-[10px] text-neutral-500 sm:text-xs">
          Inclusive of all taxes
        </p>
      </div>

      {/* =====================================================
          MOBILE COLOR
      ===================================================== */}

      <div className="mt-5 md:hidden">
        <MobileColorSelector
          colors={availableColors}
          selectedColor={selectedColor}
          onChange={handleColorChange}
        />
      </div>

      {/* =====================================================
          DESKTOP COLOR
      ===================================================== */}

      <section className="mt-6 hidden md:block">
        <div className="mb-3 flex items-center justify-between">

          <h2 className="text-sm font-semibold text-neutral-900">
            Color
          </h2>

          <span className="text-xs text-neutral-500">
            {selectedColor}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">

          {availableColors.map(
            (color, index) => {
              const selected =
                selectedColor ===
                color.name;

              return (
                <button
                  key={`${color.name}-${color.value}-${index}`}
                  type="button"
                  onClick={() =>
                    handleColorChange(
                      color.name
                    )
                  }
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-2
                    text-sm
                    transition

                    ${
                      selected
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 bg-white hover:border-neutral-400"
                    }
                  `}
                >
                  <span
                    className="
                      h-5
                      w-5
                      rounded-full
                      border
                      border-black/10
                    "
                    style={{
                      backgroundColor:
                        color.value,
                    }}
                  />

                  <span>
                    {color.name}
                  </span>

                  {selected && (
                    <Check size={15} />
                  )}
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* =====================================================
          MOBILE SIZE
      ===================================================== */}

      <div className="mt-5 md:hidden">
        <MobileSizeSelector
          sizes={sizes}
          selectedSize={selectedSize}
          onChange={handleSizeChange}
        />
      </div>

      {/* =====================================================
          DESKTOP SIZE
      ===================================================== */}

      <section className="mt-6 hidden md:block">

        <div className="mb-3 flex items-center justify-between">

          <h2 className="text-sm font-semibold text-neutral-900">
            Size
          </h2>

          <button
            type="button"
            className="
              flex
              items-center
              gap-1
              text-xs
              font-medium
              text-neutral-600
              hover:text-neutral-900
            "
          >
            <Ruler size={14} />

            Size guide
          </button>
        </div>

        <div className="flex flex-wrap gap-2">

          {sizes.map(
            (size, index) => {
              const variant =
                variants.find(
                  (item) =>
                      item.size === size
                );

              const sizeStock =
                Number(
                  variant?.stock ??
                    productStock
                );

              const sizeOutOfStock =
                sizeStock <= 0;

              return (
                <button
                  key={`${size}-${index}`}
                  type="button"
                  disabled={
                    sizeOutOfStock
                  }
                  onClick={() =>
                    handleSizeChange(
                      size
                    )
                  }
                  className={`
                    min-w-17
                    rounded-lg
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    transition

                    ${
                      selectedSize ===
                      size
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900"
                    }

                    ${
                      sizeOutOfStock
                        ? "cursor-not-allowed opacity-40 line-through"
                        : ""
                    }
                  `}
                >
                  {size}
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* =====================================================
          STOCK
      ===================================================== */}

      <div className="mt-4">
        <p
          className={`
            text-xs
            font-semibold

            sm:text-sm

            ${stockColor}
          `}
        >
          {stockMessage}
        </p>
      </div>

      {/* =====================================================
          DELIVERY
      ===================================================== */}

      <div
        className="
          mt-4
          rounded-xl
          border
          border-neutral-200
          bg-neutral-50
          p-3.5

          sm:mt-5
          sm:p-4
        "
      >
        <div className="flex gap-3">

          <Truck
            size={19}
            className="
              mt-0.5
              shrink-0
              text-neutral-700
            "
          />

          <div>
            <p className="text-xs font-semibold text-neutral-900 sm:text-sm">
              Delivery available
            </p>

            <p className="mt-1 text-[10px] leading-4 text-neutral-500 sm:text-xs sm:leading-5">
              Enter your pincode at checkout
              to check delivery availability
              and estimated delivery date.
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          MOBILE QUANTITY
      ===================================================== */}

      <section className="mt-5 md:hidden">

        <div className="mb-2.5 flex items-center justify-between">

          <span className="text-sm font-semibold text-neutral-900">
            Quantity
          </span>

          <span className="text-[10px] text-neutral-500">
            {availableStock > 0
              ? `${availableStock} available`
              : "Out of stock"}
          </span>

        </div>

        <div className="flex items-center justify-between">

          <div
            className="
              flex
              h-11
              items-center
              rounded-lg
              border
              border-neutral-300
              bg-white
            "
          >
            <button
              type="button"
              onClick={
                decreaseQuantity
              }
              disabled={
                quantity <= 1
              }
              className="
                flex
                h-full
                w-11
                items-center
                justify-center
                text-neutral-700
                disabled:opacity-30
              "
            >
              <Minus size={16} />
            </button>

            <span className="w-8 text-center text-sm font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              onClick={
                increaseQuantity
              }
              disabled={
                isOutOfStock ||
                quantity >=
                  availableStock
              }
              className="
                flex
                h-full
                w-11
                items-center
                justify-center
                text-neutral-700
                disabled:opacity-30
              "
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={
              handleWishlist
            }
            aria-label="Add to wishlist"
            className={`
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              transition

              ${
                wishlist
                  ? "border-pink-200 bg-pink-50 text-[#c73572]"
                  : "border-neutral-300 bg-white text-neutral-700"
              }
            `}
          >
            <Heart
              size={19}
              className={
                wishlist
                  ? "fill-current"
                  : ""
              }
            />
          </button>

        </div>
      </section>

      {/* =====================================================
          MOBILE PURCHASE BUTTONS
      ===================================================== */}

      <MobileProductActions
        price={finalPrice}
        disabled={isOutOfStock}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* =====================================================
          DESKTOP PURCHASE
      ===================================================== */}

      <section className="mt-5 hidden md:block">

        <div className="flex items-center gap-2.5">

          {/* QUANTITY */}

          <div
            className="
              flex
              h-12
              items-center
              rounded-lg
              border
              border-neutral-300
            "
          >
            <button
              type="button"
              onClick={
                decreaseQuantity
              }
              disabled={
                quantity <= 1
              }
              className="
                flex
                h-full
                w-10
                items-center
                justify-center
                text-neutral-700
                hover:bg-neutral-50
                disabled:opacity-40
              "
            >
              <Minus size={16} />
            </button>

            <span className="w-8 text-center text-sm font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              onClick={
                increaseQuantity
              }
              disabled={
                isOutOfStock ||
                quantity >=
                  availableStock
              }
              className="
                flex
                h-full
                w-10
                items-center
                justify-center
                text-neutral-700
                hover:bg-neutral-50
                disabled:opacity-40
              "
            >
              <Plus size={16} />
            </button>
          </div>

          {/* ADD TO CART */}

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={
              handleAddToCart
            }
            className="
              flex
              h-12
              flex-1
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-neutral-900
              bg-white
              px-4
              text-sm
              font-semibold
              text-neutral-900
              transition
              hover:bg-neutral-900
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ShoppingBagIcon />

            Add to Cart
          </button>

          {/* BUY NOW */}

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={
              handleBuyNow
            }
            className="
              flex
              h-12
              flex-1
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-neutral-900
              px-4
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-neutral-800
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Zap size={17} />

            Buy Now
          </button>

          {/* WISHLIST */}

          <button
            type="button"
            onClick={
              handleWishlist
            }
            aria-label="Add to wishlist"
            className={`
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              transition

              ${
                wishlist
                  ? "border-pink-200 bg-pink-50 text-[#c73572]"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900"
              }
            `}
          >
            <Heart
              size={19}
              className={
                wishlist
                  ? "fill-current"
                  : ""
              }
            />
          </button>

        </div>
      </section>

      {/* =====================================================
          TRUST FEATURES
      ===================================================== */}

      <div
        className="
          mt-5
          grid
          grid-cols-1
          gap-2
          border-t
          border-neutral-200
          pt-4

          sm:grid-cols-3
          sm:gap-3
        "
      >

        <div className="flex items-center gap-2">

          <Check
            size={16}
            className="shrink-0 text-green-600"
          />

          <span className="text-[10px] text-neutral-600 sm:text-xs">
            Authentic products
          </span>

        </div>

        <div className="flex items-center gap-2">

          <Truck
            size={16}
            className="shrink-0 text-neutral-600"
          />

          <span className="text-[10px] text-neutral-600 sm:text-xs">
            Secure delivery
          </span>

        </div>

        <div className="flex items-center gap-2">

          <Check
            size={16}
            className="shrink-0 text-green-600"
          />

          <span className="text-[10px] text-neutral-600 sm:text-xs">
            Easy returns
          </span>

        </div>

      </div>
    </div>
  );
}

/* ============================================================
   SHOPPING BAG ICON
============================================================ */

function ShoppingBagIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}