"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

type WishlistButtonProps = {
  productId: number | string;
};

export default function WishlistButton({
  productId,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted((current) => !current);
  };

  return (
    <button
      type="button"
      onClick={handleWishlist}
      aria-label={
        isWishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
        isWishlisted
          ? "border-foreground bg-foreground text-background"
          : "hover:bg-muted"
      }`}
    >
      <Heart
        size={18}
        fill={isWishlisted ? "currentColor" : "none"}
      />
    </button>
  );
}