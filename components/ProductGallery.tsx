"use client";

import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const currentImage = images[selectedIndex];

  const previousImage = () => {
    setSelectedIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setSelectedIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <>
      <div>
        {/* Main Image */}
        <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
          <img
            src={currentImage}
            alt={productName}
            className="h-full w-full object-cover"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousImage}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
          >
            <ZoomIn size={18} />
          </button>

          <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedIndex === index
                    ? "border-neutral-950"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom */}
      {zoomOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6">
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
          >
            <X size={20} />
          </button>

          <img
            src={currentImage}
            alt={productName}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </>
  );
}