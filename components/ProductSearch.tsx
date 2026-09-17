"use client";

import { FormEvent, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/products";

type ProductSearchProps = {
  initialValue?: string;
};

export default function ProductSearch({
  initialValue = "",
}: ProductSearchProps) {
  const router = useRouter();

  const [search, setSearch] = useState(initialValue);

  const suggestions = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return [];

    return products
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(value) ||
          product.category.toLowerCase().includes(value) ||
          product.description?.toLowerCase().includes(value)
        );
      })
      .slice(0, 6);
  }, [search]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      router.push("/products");
      return;
    }

    router.push(`/products?search=${encodeURIComponent(value)}`);
  };

  const clearSearch = () => {
    setSearch("");
    router.push("/products");
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex h-12 w-full items-center overflow-hidden rounded-xl border border-[#e3dfe0] bg-white shadow-sm transition focus-within:border-[#a91d4f] focus-within:ring-2 focus-within:ring-[#a91d4f]/10"
      >
        <div className="flex w-full items-center">
          <Search
            size={20}
            className="ml-4 shrink-0 text-neutral-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products, categories and more"
            className="h-full w-full bg-transparent px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}

          <button
            type="submit"
            className="mr-1 flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#a91d4f] px-5 text-sm font-semibold text-white transition hover:bg-[#8f1743] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a91d4f]/40 focus-visible:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>

      {search.trim() && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_16px_40px_rgba(23,23,23,0.12)]">
          <div className="border-b border-neutral-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Products
          </div>

          {suggestions.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              onClick={() => setSearch(product.name)}
              className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3 transition hover:bg-neutral-50"
            >
              <div className="h-12 w-10 shrink-0 overflow-hidden rounded bg-[#f5f3ee]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {product.name}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {product.category}
                </p>
              </div>

              <span className="text-sm font-semibold text-neutral-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => {
              router.push(
                `/products?search=${encodeURIComponent(search.trim())}`
              );
            }}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-[#a91d4f] hover:bg-[#fff7fa]"
          >
            View all results for &quot;{search.trim()}&quot;
          </button>
        </div>
      )}

      {search.trim() && suggestions.length === 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl border border-neutral-200 bg-white px-4 py-5 shadow-[0_16px_40px_rgba(23,23,23,0.12)]">
          <p className="text-sm text-neutral-600">
            No products found for{" "}
            <span className="font-semibold text-neutral-900">
              &quot;{search.trim()}&quot;
            </span>
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              router.push("/products");
            }}
            className="mt-3 text-sm font-semibold text-[#a91d4f]"
          >
            View all products
          </button>
        </div>
      )}
    </div>
  );
}