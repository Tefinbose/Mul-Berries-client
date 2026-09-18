"use client";

import {
  type RefObject,
  useEffect,
  useRef,
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
  const actionsRef = useRef<HTMLDivElement>(null);
  const [isProductVisible, setIsProductVisible] =
    useState(false);
  const [areActionsVisible, setAreActionsVisible] =
    useState(true);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  useEffect(() => {
    const actions = actionsRef.current;
    const productDetails = boundaryRef.current;

    if (!actions || !productDetails) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === productDetails) {
            setIsProductVisible(entry.isIntersecting);
          }

          if (entry.target === actions) {
            setAreActionsVisible(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(productDetails);
    observer.observe(actions);

    return () => observer.disconnect();
  }, [boundaryRef]);

  const showSticky =
    isProductVisible && !areActionsVisible;

  const buttonClass =
    "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

  const buttons = (
    <div className="flex w-full gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onAddToCart}
        className={`${buttonClass} border border-neutral-900 bg-white text-neutral-900`}
      >
        <ShoppingBag size={17} />
        <span>Add to Bag</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={onBuyNow}
        className={`${buttonClass} bg-[#c73572] text-white shadow-sm`}
      >
        <Zap size={17} />
        <span>Buy at {formattedPrice}</span>
      </button>
    </div>
  );

  return (
    <>
      <div ref={actionsRef} className="mt-4 w-full lg:hidden">
        {buttons}
      </div>

      {showSticky
        ? createPortal(
            <div className="fixed inset-x-0 bottom-0 z-60 border-t border-neutral-200 bg-white/95 px-3 pt-2 shadow-[0_-6px_20px_rgba(0,0,0,0.15)] backdrop-blur-md lg:hidden">
              <div className="mx-auto w-full max-w-3xl pb-[calc(8px+env(safe-area-inset-bottom))]">
                {buttons}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
