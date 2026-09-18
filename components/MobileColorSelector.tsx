"use client";

import { Check } from "lucide-react";

interface ColorOption {
  name: string;
  value: string;
}

interface MobileColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string;
  onChange: (color: string) => void;
}

export default function MobileColorSelector({
  colors,
  selectedColor,
  onChange,
}: MobileColorSelectorProps) {
  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">
          Color
        </h2>

        <span className="text-xs font-medium text-neutral-500">
          {selectedColor}
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {colors.map((color, index) => {
          const selected = selectedColor === color.name;

          return (
            <button
              key={`${color.name}-${color.value}-${index}`}
              type="button"
              onClick={() => onChange(color.name)}
              aria-label={`Select ${color.name}`}
              aria-pressed={selected}
              className={`
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-2
                text-xs
                font-medium
                transition

                ${
                  selected
                    ? "border-neutral-900 bg-neutral-50 text-neutral-900"
                    : "border-neutral-200 bg-white text-neutral-700"
                }
              `}
            >
              <span
                className="h-5 w-5 shrink-0 rounded-full border border-black/10"
                style={{
                  backgroundColor: color.value,
                }}
              />

              <span>{color.name}</span>

              {selected && (
                <Check
                  size={14}
                  className="shrink-0"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}