"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const safeImages =
    images && images.length > 0
      ? images
      : ["/placeholder-product.jpg"];

  const [activeIndex, setActiveIndex] = useState(0);

  const currentImage =
    safeImages[activeIndex] ?? safeImages[0];

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0
        ? safeImages.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === safeImages.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <div className="w-full">
      {/* =========================
          DESKTOP GALLERY
      ========================== */}
      <div className="hidden lg:flex lg:gap-3">
        {/* Thumbnails */}
        <div className="flex w-[72px] shrink-0 flex-col gap-2">
          {safeImages.slice(0, 5).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative aspect-[4/5] w-full overflow-hidden rounded-lg border bg-neutral-100 transition ${
                activeIndex === index
                  ? "border-[#c73572] ring-1 ring-[#c73572]"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} image ${index + 1}`}
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="relative min-w-0 flex-1">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src={currentImage}
              alt={productName}
              fill
              preload
              sizes="(min-width: 1536px) 560px, (min-width: 1280px) 500px, (min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />

            {/* Previous */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm transition hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {/* Next */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm transition hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
            )}

            {/* Zoom */}
            <button
              type="button"
              aria-label="Zoom image"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          MOBILE + TABLET GALLERY
      ========================== */}
      <div className="lg:hidden">
        {/* Main image */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={currentImage}
            alt={productName}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />

          {/* Previous */}
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Next */}
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {/* Zoom */}
          <button
            type="button"
            aria-label="Zoom image"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm"
          >
            <Maximize2 size={15} />
          </button>

          {/* Image counter */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-medium text-white">
              {activeIndex + 1}/{safeImages.length}
            </div>
          )}
        </div>

        {/* Mobile thumbnails */}
        {safeImages.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {safeImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View thumbnail ${index + 1}`}
                className={`relative h-14 w-12 shrink-0 overflow-hidden rounded-md border ${
                  activeIndex === index
                    ? "border-[#c73572] ring-1 ring-[#c73572]"
                    : "border-neutral-200"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}