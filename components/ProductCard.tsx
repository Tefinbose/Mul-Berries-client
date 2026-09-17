import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  tallImage?: boolean;
};

export default function ProductCard({
  product,
  tallImage = false,
}: ProductCardProps) {
  const discount =
    product.comparePrice &&
    product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) /
            product.comparePrice) *
            100
        )
      : 0;

  const totalStock = product.variants.reduce(
    (total, variant) => total + variant.stock,
    0
  );

  return (
    <article className="group">
      {/* Product Image */}
      <div
        className={`relative overflow-hidden rounded-xl bg-neutral-100 ${
          tallImage ? "aspect-[3/4]" : "aspect-[4/5]"
        }`}
      >
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          aria-label="View wishlist"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm transition hover:scale-105"
        >
          ♡
        </Link>

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="pt-4">
        <Link href={`/products/${product.slug}`}>
          <p className="text-xs uppercase tracking-wider text-neutral-400">
            {product.category}
          </p>

          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-neutral-900 transition group-hover:text-neutral-600">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-neutral-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.comparePrice &&
            product.comparePrice > product.price && (
              <span className="text-sm text-neutral-400 line-through">
                ₹
                {product.comparePrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}
        </div>

        {/* Stock */}
        <div className="mt-2">
          {totalStock === 0 ? (
            <p className="text-xs font-medium text-red-600">
              Out of stock
            </p>
          ) : totalStock <= 5 ? (
            <p className="text-xs font-medium text-orange-600">
              Only {totalStock} left
            </p>
          ) : (
            <p className="text-xs text-neutral-500">
              In stock
            </p>
          )}
        </div>
      </div>
    </article>
  );
}