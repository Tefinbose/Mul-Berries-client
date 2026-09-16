"use client";

import ProductCard from "./ProductCard";
import { products } from "@/lib/products";

type ProductRecommendationsProps = {
  currentSlug?: string;
};

export default function ProductRecommendations({
  currentSlug,
}: ProductRecommendationsProps) {
  const recommendedProducts = products
    .filter((product) => product.slug !== currentSlug)
    .slice(0, 4);

  return (
    <section className="border-t border-neutral-200 pt-12">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          You may also like
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Recommended Products
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {recommendedProducts.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}