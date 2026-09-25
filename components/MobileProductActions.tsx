"use client";

import {
  type RefObject,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ShoppingBag, Zap } from "lucide-react";

interface MobileProductActionsProps {
  boundaryRef: RefObject<HTMLElement | null>;
  price: number;
  disabled?: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function MobileProductActions({
  boundaryRef,
  price,
  disabled = false,
  onAddToCart,
  onBuyNow,
}: MobileProductActionsProps) {
  const [isProductVisible, setIsProductVisible] =
    useState(false);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  useEffect(() => {
    const productDetails = boundaryRef.current;

    if (!productDetails) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsProductVisible(entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    observer.observe(productDetails);

    return () => observer.disconnect();
  }, [boundaryRef]);

  const buttonClass =
    "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

  const buttons = (
    <div className="flex w-full gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onAddToCart}
        className={`${buttonClass} bg-[#f45149] uppercase tracking-wider text-white shadow-xs hover:bg-[#e03d35]`}
      >
        <ShoppingBag size={16} />
        <span>Add to Cart</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={onBuyNow}
        className={`${buttonClass} bg-[#f45149] uppercase tracking-wider text-white shadow-xs hover:bg-[#e03d35]`}
      >
        <Zap size={16} />
        <span>Buy Now ({formattedPrice})</span>
      </button>
    </div>
  );

  return (
    <>
      {isProductVisible
        ? createPortal(
            <div className="fixed inset-x-0 bottom-0 z-60 border-t border-neutral-200 bg-white/95 px-3 pt-2 shadow-[0_-6px_20px_rgba(0,0,0,0.15)] backdrop-blur-md lg:hidden">
              <div className="mx-auto w-full max-w-3xl pb-[max(8px,env(safe-area-inset-bottom))]">
                {buttons}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
