import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ShoppingBag,
  SlidersHorizontal,
  Star,
} from "lucide-react";

import { products } from "@/lib/products";

const categoryInfo: Record<
  string,
  {
    name: string;
    description: string;
  }
> = {
  sarees: {
    name: "Sarees",
    description:
      "Explore our complete collection of elegant sarees for every occasion.",
  },

  "silk-sarees": {
    name: "Silk Sarees",
    description:
      "Discover rich silk sarees crafted with timeless elegance and traditional beauty.",
  },

  "designer-sarees": {
    name: "Designer Sarees",
    description:
      "Contemporary sarees designed for a modern and sophisticated wardrobe.",
  },

  "bridal-sarees": {
    name: "Bridal Sarees",
    description:
      "Elegant bridal sarees created for weddings and unforgettable celebrations.",
  },

  "festive-sarees": {
    name: "Festive Sarees",
    description:
      "Rich colours and beautiful details made for every celebration.",
  },

  accessories: {
    name: "Accessories",
    description:
      "Complete your look with carefully selected accessories.",
  },
};

const categoryLinks = [
  {
    name: "All Sarees",
    slug: "sarees",
  },
  {
    name: "Silk Sarees",
    slug: "silk-sarees",
  },
  {
    name: "Designer Sarees",
    slug: "designer-sarees",
  },
  {
    name: "Bridal Sarees",
    slug: "bridal-sarees",
  },
  {
    name: "Festive Sarees",
    slug: "festive-sarees",
  },
];

const priceRanges = [
  "Under ₹2,000",
  "₹2,000 - ₹5,000",
  "₹5,000 - ₹10,000",
  "Above ₹10,000",
];

const ratings = [
  "4★ & above",
  "3★ & above",
];

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = categoryInfo[slug];

  if (!category) {
    return (
      <main className="min-h-screen bg-[#f1f3f6] px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#c73572]">
            <ShoppingBag size={22} />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-neutral-950">
            Category not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            The category you are looking for does not exist.
          </p>

          <Link
            href="/categories"
            className="mt-6 inline-flex items-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c73572]"
          >
            <ArrowLeft size={15} />
            Back to categories
          </Link>
        </div>
      </main>
    );
  }

  const categoryProducts =
    slug === "sarees"
      ? products
      : products.filter(
          (product) =>
            product.category.toLowerCase() ===
            category.name.toLowerCase()
        );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f1f3f6] text-neutral-900">
      {/* BREADCRUMB */}

      <div className="border-b border-neutral-200 bg-white">
        <div className="site-container py-3">
          <div className="flex items-center gap-2 overflow-hidden text-[11px] text-neutral-500">
            <Link
              href="/"
              className="shrink-0 hover:text-[#c73572]"
            >
              Home
            </Link>

            <span className="text-neutral-300">›</span>

            <Link
              href="/categories"
              className="shrink-0 hover:text-[#c73572]"
            >
              Categories
            </Link>

            <span className="text-neutral-300">›</span>

            <span className="truncate font-medium text-neutral-800">
              {category.name}
            </span>
          </div>
        </div>
      </div>

      {/* CATEGORY HEADER */}

      <section className="site-container pt-5">
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="px-4 py-5 sm:px-5 sm:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 transition hover:text-[#c73572]"
                >
                  <ArrowLeft size={13} />
                  All categories
                </Link>

                <div className="mt-3">
                  <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                    {category.name}
                  </h1>

                  <p className="mt-1.5 max-w-2xl text-xs leading-5 text-neutral-500 sm:text-sm">
                    {category.description}
                  </p>

                  <p className="mt-2 text-[11px] font-medium text-neutral-500">
                    {categoryProducts.length}{" "}
                    {categoryProducts.length === 1
                      ? "Product"
                      : "Products"}
                  </p>
                </div>
              </div>

              {categoryProducts.length > 0 && (
                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden text-xs text-neutral-500 sm:block">
                    Sort by
                  </span>

                  <button
                    type="button"
                    className="flex h-9 items-center gap-6 border border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-800"
                  >
                    Popularity
                    <ChevronDown size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY NAVIGATION */}

      <section className="site-container pt-4">
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <div className="flex min-w-max">
            {categoryLinks.map((item) => {
              const active = item.slug === slug;

              return (
                <Link
                  key={item.slug}
                  href={`/categories/${item.slug}`}
                  className={`border-r border-neutral-200 px-4 py-3 text-xs font-medium transition last:border-r-0 sm:px-6 ${
                    active
                      ? "border-b-2 border-b-[#c73572] bg-[#fff7fa] text-[#c73572]"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN */}

      <section className="site-container py-5 pb-20 sm:py-6">
        {categoryProducts.length === 0 ? (
          <div className="border border-neutral-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f6] text-[#c73572]">
              <ShoppingBag size={22} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-neutral-950">
              Coming soon
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              We&apos;re preparing beautiful pieces for this collection.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c73572]"
            >
              Browse all products
              <ArrowUpRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[256px_minmax(0,1fr)] xl:grid-cols-[272px_minmax(0,1fr)]">
            {/* FILTER SIDEBAR */}

            <aside className="hidden min-w-0 lg:block">
              <div className="sticky top-24 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={15} />

                    <h2 className="text-sm font-semibold">
                      Filters
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="text-[11px] font-medium text-[#c73572]"
                  >
                    Clear
                  </button>
                </div>

                {/* CATEGORY FILTER */}

                <div className="border-b border-neutral-200 p-4">
                  <h3 className="text-xs font-semibold">
                    Category
                  </h3>

                  <div className="mt-3 space-y-3">
                    {categoryLinks.map((item) => (
                      <label
                        key={item.slug}
                        className="flex cursor-pointer items-center gap-2 text-xs text-neutral-600"
                      >
                        <input
                          type="checkbox"
                          checked={item.slug === slug}
                          readOnly
                          className="h-3.5 w-3.5 accent-[#c73572]"
                        />

                        <span>{item.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* PRICE FILTER */}

                <div className="border-b border-neutral-200 p-4">
                  <h3 className="text-xs font-semibold">
                    Price
                  </h3>

                  <div className="mt-3 space-y-3">
                    {priceRanges.map((range) => (
                      <label
                        key={range}
                        className="flex cursor-pointer items-center gap-2 text-xs text-neutral-600"
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 accent-[#c73572]"
                        />

                        <span>{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* RATING FILTER */}

                <div className="border-b border-neutral-200 p-4">
                  <h3 className="text-xs font-semibold">
                    Customer Rating
                  </h3>

                  <div className="mt-3 space-y-3">
                    {ratings.map((rating) => (
                      <label
                        key={rating}
                        className="flex cursor-pointer items-center gap-2 text-xs text-neutral-600"
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 accent-[#c73572]"
                        />

                        <span>{rating}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* AVAILABILITY */}

                <div className="p-4">
                  <h3 className="text-xs font-semibold">
                    Availability
                  </h3>

                  <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-neutral-600">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 accent-[#c73572]"
                    />

                    <span>In Stock</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* PRODUCT RESULTS */}

            <div className="min-w-0">
              {/* TOOLBAR */}

              <div className="mb-5 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3.5 shadow-sm">
                <div>
                  <p className="text-xs font-semibold text-neutral-950">
                    {categoryProducts.length} Products
                  </p>

                  <p className="mt-0.5 text-[10px] text-neutral-500">
                    Showing products from {category.name}
                  </p>
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 border border-neutral-300 px-3 py-2 text-[11px] font-medium"
                  >
                    <SlidersHorizontal size={13} />
                    Filter
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 border border-neutral-300 px-3 py-2 text-[11px] font-medium"
                  >
                    Sort
                    <ChevronDown size={13} />
                  </button>
                </div>
              </div>

              {/* PRODUCT GRID */}

              <div className="grid min-w-0 grid-cols-2 items-stretch gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
                {categoryProducts.map((product, index) => (
                  <Link
                    key={product.slug}
                    href={`/products/${product.slug}`}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-[#d6b7c4] hover:shadow-[0_12px_30px_rgba(23,23,23,0.09)]"
                    style={{
                      animation:
                        "productFadeUp 0.45s ease-out forwards",
                      animationDelay: `${index * 50}ms`,
                      opacity: 0,
                    }}
                  >
                    {/* IMAGE */}

                    <div className="relative aspect-3/4 overflow-hidden bg-[#f5f3ee]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />

                      {product.comparePrice &&
                        product.comparePrice >
                          product.price && (
                            <div className="absolute left-3 top-3 rounded-full bg-[#c73572] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-white">
                            SALE
                          </div>
                        )}

                      <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
                        <ArrowUpRight size={14} />
                      </div>
                    </div>

                    {/* PRODUCT INFO */}

                    <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4">
                      <h2 className="line-clamp-2 min-h-10 text-xs font-semibold leading-5 text-neutral-900 transition-colors group-hover:text-[#c73572] sm:text-sm">
                        {product.name}
                      </h2>

                      {/* RATING */}

                      <div className="mt-3 flex min-h-5 items-center gap-1">
                        <span className="inline-flex items-center gap-0.5 bg-[#388e3c] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                          4.5
                          <Star
                            size={8}
                            fill="currentColor"
                          />
                        </span>

                        <span className="text-[9px] text-neutral-400">
                          Ratings
                        </span>
                      </div>

                      {/* PRICE */}

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-semibold text-neutral-950 sm:text-base">
                          ₹
                          {product.price.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {product.comparePrice &&
                          product.comparePrice >
                            product.price && (
                            <>
                              <span className="text-[10px] text-neutral-400 line-through sm:text-xs">
                                ₹
                                {product.comparePrice.toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                              <span className="text-[9px] font-medium text-[#388e3c] sm:text-[10px]">
                                {Math.round(
                                  ((product.comparePrice -
                                    product.price) /
                                    product.comparePrice) *
                                    100
                                )}
                                % off
                              </span>
                            </>
                          )}
                      </div>

                      <p className="mt-1 text-[9px] text-neutral-500 sm:text-[10px]">
                        Free delivery
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ANIMATION */}

      <style>{`
        @keyframes productFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}