"use client";

import { Ruler } from "lucide-react";

interface MobileSizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onChange: (size: string) => void;
}

export default function MobileSizeSelector({
  sizes,
  selectedSize,
  onChange,
}: MobileSizeSelectorProps) {
  return (
    <section className="w-full">
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
            text-neutral-500
            transition
            hover:text-neutral-900
          "
        >
          <Ruler size={14} />
          Size guide
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sizes.map((size, index) => {
          const selected = selectedSize === size;

          return (
            <button
              key={`${size}-${index}`}
              type="button"
              onClick={() => onChange(size)}
              aria-label={`Select size ${size}`}
              aria-pressed={selected}
              className={`
                flex
                min-w-[68px]
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                px-4
                py-2.5
                text-xs
                font-semibold
                transition

                ${
                  selected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-900"
                }
              `}
            >
              {size}
            </button>
          );
        })}
      </div>
    </section>
  );
}