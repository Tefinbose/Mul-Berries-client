import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";

import { products } from "@/lib/products";
import { mapApiProduct } from "@/lib/productMapper";
import { getProductsApi } from "@/services/productApi";
import ProductSearch from "@/components/ProductSearch";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
};

const categories = [
  { name: "All", slug: "" },
  { name: "Sarees", slug: "sarees" },
  { name: "Silk Sarees", slug: "silk-sarees" },
  { name: "Designer Sarees", slug: "designer-sarees" },
  { name: "Bridal Sarees", slug: "bridal-sarees" },
  { name: "Festive Sarees", slug: "festive-sarees" },
];

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const searchQuery = params.search?.trim() || "";
  const categoryQuery = params.category?.trim() || "";
  const sortQuery = params.sort?.trim() || "";

  let filteredProducts = [...products];

  try {
    const response = await getProductsApi();

    if (response.success && response.products.length > 0) {
      filteredProducts = response.products.map(mapApiProduct);
    }
  } catch (error) {
    console.error("LOAD PRODUCTS ERROR:", error);
  }

  // Search
  if (searchQuery) {
    const search = searchQuery.toLowerCase();

    filteredProducts = filteredProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search)
      );
    });
  }

  // Category
  if (categoryQuery) {
    if (categoryQuery === "sarees") {
      filteredProducts = filteredProducts.filter((product) =>
        product.category.toLowerCase().includes("saree")
      );
    } else {
      const categoryMap: Record<string, string> = {
        "silk-sarees": "silk sarees",
        "designer-sarees": "designer sarees",
        "bridal-sarees": "bridal sarees",
        "festive-sarees": "festive sarees",
      };

      const categoryName = categoryMap[categoryQuery];

      if (categoryName) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.category.toLowerCase() === categoryName.toLowerCase()
        );
      }
    }
  }

  // Sorting
  switch (sortQuery) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;

    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "discount":
      filteredProducts.sort((a, b) => {
        const discountA = a.comparePrice
          ? ((a.comparePrice - a.price) / a.comparePrice) * 100
          : 0;

        const discountB = b.comparePrice
          ? ((b.comparePrice - b.price) / b.comparePrice) * 100
          : 0;

        return discountB - discountA;
      });

      break;

    default:
      break;
  }

  const createUrl = (
    newCategory?: string,
    newSort?: string
  ) => {
    const searchParams = new URLSearchParams();

    if (searchQuery) {
      searchParams.set("search", searchQuery);
    }

    const category = newCategory ?? categoryQuery;

    if (category) {
      searchParams.set("category", category);
    }

    const sort = newSort ?? sortQuery;

    if (sort) {
      searchParams.set("sort", sort);
    }

    const queryString = searchParams.toString();

    return queryString
      ? `/products?${queryString}`
      : "/products";
  };

  return (
    <main className="min-h-screen bg-[#f1f3f6] text-[#171717]">
      {/* Search Header */}
      <section className="border-b border-[#dedad2] bg-white">
        <div className="site-container py-4">
          <div className="flex items-center gap-4">
            <div className="hidden shrink-0 lg:block">
              <Link href="/">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#a91d4f] text-white">
                    <span className="text-sm font-bold">M</span>
                  </div>

                  <div>
                    <p className="font-serif text-lg font-semibold">
                      Mulberries
                    </p>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
                      Curated with care
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="min-w-0 flex-1">
              <ProductSearch initialValue={searchQuery} />
            </div>

            <Link
              href="/"
              className="hidden shrink-0 text-xs font-semibold text-neutral-600 transition hover:text-[#a91d4f] sm:block"
            >
              Home
            </Link>
          </div>
        </div>
      </section>

      {/* Category Strip */}
      <section className="border-b border-[#dedad2] bg-white">
        <div className="site-container overflow-x-auto">
          <div className="flex min-w-max items-center gap-1">
            {categories.map((category) => {
              const active =
                category.slug === categoryQuery ||
                (!category.slug && !categoryQuery);

              return (
                <Link
                  key={category.slug || "all"}
                  href={createUrl(category.slug)}
                  className={`relative px-4 py-4 text-xs font-medium transition ${
                    active
                      ? "text-[#a91d4f]"
                      : "text-neutral-600 hover:text-[#a91d4f]"
                  }`}
                >
                  {category.name}

                  {active && (
                    <span className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-[#a91d4f]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="site-container pt-5">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/"
            className="text-neutral-400 transition hover:text-[#a91d4f]"
          >
            Home
          </Link>

          <ChevronRight size={13} className="text-neutral-300" />

          <span className="font-medium text-neutral-700">
            Products
          </span>

          {searchQuery && (
            <>
              <ChevronRight size={13} className="text-neutral-300" />
              <span className="max-w-[180px] truncate text-[#a91d4f]">
                Search: {searchQuery}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <section className="site-container py-5 sm:py-6">
        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[256px_minmax(0,1fr)] xl:grid-cols-[272px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="sticky top-24 hidden h-fit overflow-hidden rounded-xl border border-[#e2e2e2] bg-white lg:block">
            <div className="flex items-center justify-between border-b border-[#eeeeee] px-4 py-4">
              <div className="flex items-center gap-2">
                <Filter size={15} />
                <h2 className="text-xs font-bold uppercase tracking-wide">
                  Filters
                </h2>
              </div>

              {(categoryQuery || searchQuery || sortQuery) && (
                <Link
                  href="/products"
                  className="text-[10px] font-semibold text-[#a91d4f]"
                >
                  CLEAR
                </Link>
              )}
            </div>

            {/* Category Filter */}
            <div className="border-b border-[#eeeeee] px-4 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide">
                  Category
                </h3>

                <ChevronDown size={14} className="text-neutral-400" />
              </div>

              <div className="mt-4 space-y-3">
                {categories.slice(1).map((category) => (
                  <Link
                    key={category.slug}
                    href={createUrl(
                      categoryQuery === category.slug
                        ? ""
                        : category.slug
                    )}
                    className="flex items-center gap-3 text-xs"
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center border ${
                        categoryQuery === category.slug
                          ? "border-[#a91d4f] bg-[#a91d4f]"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {categoryQuery === category.slug && (
                        <span className="h-1.5 w-1.5 bg-white" />
                      )}
                    </span>

                    <span
                      className={
                        categoryQuery === category.slug
                          ? "font-semibold text-[#a91d4f]"
                          : "text-neutral-600"
                      }
                    >
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-[#eeeeee] px-4 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide">
                  Price
                </h3>

                <ChevronDown size={14} className="text-neutral-400" />
              </div>

              <div className="mt-4 space-y-3">
                {[
                  ["Under ₹5,000", "price-low"],
                  ["₹5,000 – ₹10,000", "mid"],
                  ["Above ₹10,000", "price-high"],
                ].map(([label, value]) => (
                  <Link
                    key={value}
                    href={
                      value === "price-low"
                        ? createUrl(undefined, "price-low")
                        : value === "price-high"
                        ? createUrl(undefined, "price-high")
                        : "/products"
                    }
                    className="flex items-center gap-3 text-xs text-neutral-600 transition hover:text-[#a91d4f]"
                  >
                    <span className="h-4 w-4 border border-neutral-300" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="px-4 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide">
                  Availability
                </h3>

                <ChevronDown size={14} className="text-neutral-400" />
              </div>

              <div className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 text-xs text-neutral-600">
                  <span className="h-4 w-4 border border-neutral-300" />
                  In Stock
                </label>

                <label className="flex cursor-pointer items-center gap-3 text-xs text-neutral-600">
                  <span className="h-4 w-4 border border-neutral-300" />
                  On Sale
                </label>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="min-w-0">
            {/* Results Toolbar */}
            <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#e2e2e2] bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-sm font-semibold">
                  {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : categoryQuery
                    ? categories.find(
                        (category) =>
                          category.slug === categoryQuery
                      )?.name || "Products"
                    : "All Products"}
                </h1>

                <p className="mt-1 text-[11px] text-neutral-500">
                  {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/products"
                  className="flex h-9 items-center gap-2 rounded border border-[#dedad2] px-3 text-xs text-neutral-600 lg:hidden"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                </Link>

                <div className="flex h-9 items-center border border-[#dedad2] bg-white">
                  <span className="hidden px-3 text-[10px] text-neutral-400 sm:block">
                    SORT BY
                  </span>

                  <Link
                    href={createUrl(undefined, "name")}
                    className="flex h-full items-center gap-2 px-3 text-xs font-medium text-neutral-700"
                  >
                    {sortQuery === "price-low"
                      ? "Price: Low to High"
                      : sortQuery === "price-high"
                      ? "Price: High to Low"
                      : sortQuery === "discount"
                      ? "Discount"
                      : "Relevance"}

                    <ChevronDown size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:gap-5 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const discount = product.comparePrice
                    ? Math.round(
                        ((product.comparePrice - product.price) /
                          product.comparePrice) *
                          100
                      )
                    : 0;

                  return (
                    <Link
                      key={product.slug}
                      href={`/products/${product.slug}`}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#e2e2e2] bg-white transition duration-300 hover:-translate-y-0.5 hover:border-[#c9b2bd] hover:shadow-[0_12px_30px_rgba(23,23,23,0.09)]"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3ee]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        {discount > 0 && (
                          <span className="absolute left-2 top-2 bg-[#a91d4f] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      <div className="p-3">
                        <h2 className="line-clamp-2 min-h-[40px] text-xs font-semibold leading-5 text-neutral-900 sm:text-sm">
                          {product.name}
                        </h2>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-900">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>

                          {product.comparePrice && (
                            <span className="text-[11px] text-neutral-400 line-through">
                              ₹
                              {product.comparePrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex min-h-5 items-center gap-1">
                          <span className="flex items-center gap-1 bg-[#388e3c] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            4.5
                            <Star
                              size={9}
                              fill="currentColor"
                            />
                          </span>

                          <span className="text-[10px] text-neutral-400">
                            • Free Delivery
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[450px] items-center justify-center border border-[#e2e2e2] bg-white px-5 text-center">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7e9ef] text-[#a91d4f]">
                    <Search size={24} />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">
                    No products found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                    We couldn&apos;t find any products matching your
                    search. Try a different keyword or browse all
                    products.
                  </p>

                  <Link
                    href="/products"
                    className="mt-6 inline-flex h-10 items-center rounded-full bg-[#171717] px-5 text-xs font-semibold text-white transition hover:bg-[#a91d4f]"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}