"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  FileText,
  Heart,
  Mail,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  Share2,
  ShoppingBag,
  Smile,
  Star,
  Truck,
  Zap,
} from "lucide-react";

import type { Product } from "@/lib/products";

import MobileColorSelector from "@/components/MobileColorSelector";
import MobileSizeSelector from "@/components/MobileSizeSelector";
import MobileProductActions from "@/components/MobileProductActions";
import { useCart } from "@/context/CartContext";
import {
  addToWishlistApi,
  checkWishlistApi,
  removeFromWishlistApi,
} from "@/services/wishlistApi";

interface ProductDetailsProps {
  product: Product;
}

interface ExtendedProduct extends Product {
  _id?: string;
  stock?: number;
  brand?: string;
  comparePrice?: number;
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
  const productDetailsRef = useRef<HTMLDivElement>(null);
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

  const [justAdded, setJustAdded] =
    useState(false);

  const [shareUrl, setShareUrl] =
    useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Urgency & conversion stats (deterministic per product)
  const urgencyStats = useMemo(() => {
    let hash = 0;
    const str = product.slug || product.name || "mulberries";
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    const sold = (absHash % 7) + 14; // e.g. 16
    const hours = (absHash % 5) + 14; // e.g. 16
    const stockLeft = (absHash % 48) + 20; // e.g. 63
    const viewers = (absHash % 10) + 9; // e.g. 13
    return { sold, hours, stockLeft, viewers };
  }, [product.slug, product.name]);

  useEffect(() => {
    const token =
      typeof window === "undefined"
        ? null
        : localStorage.getItem("token");

    if (!token || !extendedProduct._id) {
      return;
    }

    checkWishlistApi(
      extendedProduct._id,
      token
    )
      .then((response) => {
        if (response.success) {
          setWishlist(response.inWishlist);
        }
      })
      .catch((error) => {
        console.error("CHECK WISHLIST ERROR:", error);
      });
  }, [extendedProduct._id]);

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
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
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

  const handleWishlist = async () => {
    const token =
      typeof window === "undefined"
        ? null
        : localStorage.getItem("token");

    if (!token || !extendedProduct._id) {
      setWishlist((current) => !current);
      return;
    }

    try {
      if (wishlist) {
        await removeFromWishlistApi(
          extendedProduct._id,
          token
        );
      } else {
        await addToWishlistApi(
          extendedProduct._id,
          token
        );
      }

      setWishlist((current) => !current);
    } catch (error) {
      console.error("UPDATE WISHLIST ERROR:", error);
    }
  };

  return (
    <div ref={productDetailsRef} className="w-full">

      {/* =====================================================
          RATING
      {/* =====================================================
          RATING
      ===================================================== */}

      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
        <div className="flex items-center gap-1">
          <Star
            size={13}
            className="fill-yellow-400 text-yellow-400"
          />
          <span className="font-semibold text-neutral-800">
            4.8
          </span>
        </div>
        <span>•</span>
        <span>124 reviews</span>
      </div>

      {/* =====================================================
          PRODUCT NAME
      ===================================================== */}

      <h1 className="mt-1 text-lg font-bold leading-snug tracking-tight text-neutral-950 sm:text-xl lg:text-[22px]">
        {product.name}
      </h1>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      {product.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
          {product.description}
        </p>
      )}

      {/* =====================================================
          PRICE & URGENCY (LIQUID SOCIAL PROOF)
      ===================================================== */}

      <div className="mt-2.5">
        <div className="flex flex-wrap items-baseline gap-2">
          {comparePrice > finalPrice && (
            <span className="text-base font-normal text-neutral-400 line-through sm:text-lg">
              {formattedComparePrice}
            </span>
          )}

          <span className="text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">
            {formattedPrice}
          </span>

          {discount > 0 && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* LIQUID FEATURE: SOLD IN LAST X HOURS & BRAND */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-800">
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="select-none">🔥</span>
            <span>
              <strong>{urgencyStats.sold} sold</strong> in last {urgencyStats.hours} hours
            </span>
          </span>

          <span className="text-neutral-300">•</span>

          <span className="text-neutral-700">
            Brand: <strong className="font-semibold text-[#f45149]">{extendedProduct.brand || "pennpatt"}</strong>
          </span>
        </div>

        {/* STOCK SCARCITY METER */}
        <div className="mt-1.5">
          <p className="text-xs text-neutral-800">
            Only <strong className="font-semibold text-[#f45149]">{availableStock > 0 ? availableStock : urgencyStats.stockLeft}</strong> item(s) left in stock.
          </p>

          <div className="mt-1 h-1 w-full max-w-[260px] overflow-hidden rounded-full bg-neutral-200/80">
            <div
              className="h-full rounded-full bg-[#f45149] transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    18,
                    availableStock > 0
                      ? Math.min(100, (availableStock / 40) * 100)
                      : (urgencyStats.stockLeft / 70) * 100
                  )
                )}%`,
              }}
            />
          </div>
        </div>

        <p className="mt-1 text-[10px] text-neutral-400">
          Inclusive of all taxes
        </p>
      </div>

      {/* =====================================================
          MOBILE COLOR
      ===================================================== */}

      <div className="mt-4 lg:hidden">
        <MobileColorSelector
          colors={availableColors}
          selectedColor={selectedColor}
          onChange={handleColorChange}
        />
      </div>

      {/* =====================================================
          DESKTOP COLOR
      ===================================================== */}

      <section className="mt-2.5 hidden lg:block">
        <div className="mb-1 flex items-center justify-between text-xs">
          <h2 className="font-semibold text-neutral-900">
            Color: <span className="font-normal text-neutral-500">{selectedColor}</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {availableColors.map((color, index) => {
            const selected = selectedColor === color.name;

            return (
              <button
                key={`${color.name}-${color.value}-${index}`}
                type="button"
                onClick={() => handleColorChange(color.name)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                  selected
                    ? "border-neutral-900 bg-neutral-50 font-medium text-neutral-900"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                }`}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/10"
                  style={{
                    backgroundColor: color.value,
                  }}
                />
                <span>{color.name}</span>
                {selected && <Check size={12} />}
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          MOBILE SIZE
      ===================================================== */}

      <div className="mt-4 lg:hidden">
        <MobileSizeSelector
          sizes={sizes}
          selectedSize={selectedSize}
          onChange={handleSizeChange}
        />
      </div>

      {/* =====================================================
          DESKTOP SIZE
      ===================================================== */}

      <section className="mt-2 hidden lg:block">
        <div className="mb-1 flex items-center justify-between text-xs">
          <h2 className="font-semibold text-neutral-900">
            Size
          </h2>

          <button
            type="button"
            className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-900"
          >
            <Ruler size={12} />
            Size guide
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {sizes.map((size, index) => {
            const variant = variants.find((item) => item.size === size);
            const sizeStock = Number(variant?.stock ?? productStock);
            const sizeOutOfStock = sizeStock <= 0;

            return (
              <button
                key={`${size}-${index}`}
                type="button"
                disabled={sizeOutOfStock}
                onClick={() => handleSizeChange(size)}
                className={`min-w-14 rounded-md border px-3 py-1 text-xs font-medium transition ${
                  selectedSize === size
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900"
                } ${
                  sizeOutOfStock
                    ? "cursor-not-allowed opacity-40 line-through"
                    : ""
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          MOBILE QUANTITY
      ===================================================== */}

      <section className="mt-5 lg:hidden">

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
        boundaryRef={productDetailsRef}
        price={finalPrice}
        disabled={isOutOfStock}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* =====================================================
          DESKTOP PURCHASE
      ===================================================== */}

      <section className="mt-5 hidden lg:block">

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
            onClick={handleAddToCart}
            className={`
              flex
              h-10
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-lg
              px-3
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-white
              shadow-2xs
              transition
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-40
              ${
                justAdded
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#f45149] hover:bg-[#e03d35]"
              }
            `}
          >
            {justAdded ? (
              <>
                <Check size={15} />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                Add to Cart
              </>
            )}
          </button>

          {/* BUY NOW */}

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="
              flex
              h-10
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-[#f45149]
              px-3
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-white
              shadow-2xs
              transition
              hover:bg-[#e03d35]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Zap size={15} />
            Buy Now
          </button>

          {/* WISHLIST */}

          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className={`
              flex
              h-10
              w-10
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
              size={17}
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
          PERKS ROW (FREE DELIVERY, RETURN, COD)
      ===================================================== */}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-neutral-200/80 pt-2 text-[11px] text-neutral-600 sm:text-xs">
        <div className="flex items-center gap-1.5">
          <Truck size={14} className="shrink-0 text-neutral-500" />
          <span>Free Delivery</span>
        </div>

        <div className="flex items-center gap-1.5">
          <RotateCcw size={13} className="shrink-0 text-neutral-500" />
          <span>Delivery & Return</span>
        </div>

        <div className="flex items-center gap-1.5">
          <FileText size={13} className="shrink-0 text-neutral-500" />
          <span>Cash on Delivery</span>
        </div>
      </div>

      {/* =====================================================
          LIVE VIEWERS & SHARE (COMPACT FLEX ROW)
      ===================================================== */}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-600 sm:text-xs">
        <div className="flex items-center gap-1.5">
          <Smile size={14} className="shrink-0 text-neutral-500" />
          <span>
            <strong className="font-semibold text-neutral-800">
              {urgencyStats.viewers} people
            </strong>{" "}
            viewing now
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-neutral-600">
            <Share2 size={12} />
            Share:
          </span>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              product.name
            )}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className="text-neutral-500 transition hover:text-neutral-950"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="text-neutral-500 transition hover:text-[#1877F2]"
          >
            <FacebookIcon size={12} />
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="text-neutral-500 transition hover:text-[#0A66C2]"
          >
            <LinkedInIcon size={12} />
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `${product.name} - ${shareUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="text-neutral-500 transition hover:text-[#25D366]"
          >
            <WhatsAppIcon size={12} />
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(
              product.name
            )}&body=${encodeURIComponent(shareUrl)}`}
            aria-label="Share via Email"
            className="text-neutral-500 transition hover:text-neutral-900"
          >
            <Mail size={12} />
          </a>
        </div>
      </div>

      {/* =====================================================
          WHATSAPP SUPPORT CTA
      ===================================================== */}

      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          `Hello Mulberries! I'm interested in ${product.name} (₹${finalPrice}).`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-800 transition hover:text-[#128C7E] sm:text-xs"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#25D366] text-white">
          <WhatsAppIcon size={10} />
        </span>
        <span>Chat with us on WhatsApp for orders & support</span>
      </a>

      {/* =====================================================
          GUARANTEED SAFE CHECKOUT BADGES
      ===================================================== */}

      <div className="mt-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50/60 px-3 py-1.5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
          Guaranteed Safe Checkout
        </p>

        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <UpiBadge />
          <CodBadge />
          <MastercardBadge />
          <VisaBadge />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAYMENT & TRUST BADGES
============================================================ */

function UpiBadge() {
  return (
    <div className="flex h-6.5 items-center gap-1 rounded border border-neutral-200 bg-white px-2 shadow-2xs">
      <span className="text-[11px] font-black tracking-tight text-[#097939]">U</span>
      <span className="text-[11px] font-black tracking-tight text-[#ed7524]">P</span>
      <span className="text-[11px] font-black tracking-tight text-[#0c4273]">I</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="ml-0.5">
        <path d="M12 2L4 12h7v8l8-10h-7z" fill="#097939" />
      </svg>
    </div>
  );
}

function CodBadge() {
  return (
    <div className="flex h-6.5 items-center gap-1 rounded border border-neutral-200 bg-white px-2 shadow-2xs">
      <span className="rounded bg-red-50 px-1 py-0.5 text-[8px] font-extrabold text-red-600">
        COD
      </span>
      <span className="text-[9px] font-semibold text-neutral-700">
        Cash on Delivery
      </span>
    </div>
  );
}

function MastercardBadge() {
  return (
    <div className="flex h-6.5 items-center gap-1 rounded border border-neutral-200 bg-white px-2 shadow-2xs">
      <div className="flex items-center -space-x-1.5">
        <span className="h-3.5 w-3.5 rounded-full bg-[#eb001b] opacity-95" />
        <span className="h-3.5 w-3.5 rounded-full bg-[#f79e1b] opacity-95" />
      </div>
      <span className="text-[9px] font-bold tracking-tight text-neutral-800">
        mastercard
      </span>
    </div>
  );
}

function VisaBadge() {
  return (
    <div className="flex h-6.5 items-center rounded border border-neutral-200 bg-white px-2.5 shadow-2xs">
      <span className="text-[11px] font-black italic tracking-widest text-[#1a1f71]">
        VISA
      </span>
    </div>
  );
}

function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}