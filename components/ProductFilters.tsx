"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

type ProductFiltersProps = {
  search: string;
  setSearch: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;

  minPrice: string;
  setMinPrice: (value: string) => void;

  maxPrice: string;
  setMaxPrice: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;

  clearFilters: () => void;
};

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  clearFilters,
}: ProductFiltersProps) {
  return (
    <div className="mb-10 rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        {/* Search */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Search
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-neutral-900"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Sort By
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-a-z">Name: A to Z</option>
            <option value="name-z-a">Name: Z to A</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
          >
            <option value="all">All Categories</option>
            <option value="Kanjivaram Silk Sarees">
              Kanjivaram Silk Sarees
            </option>
            <option value="Silk Sarees">Silk Sarees</option>
            <option value="Pure Silk Sarees">Pure Silk Sarees</option>
            <option value="Bridal Sarees">Bridal Sarees</option>
            <option value="Kanchipuram Silk Sarees">
              Kanchipuram Silk Sarees
            </option>
            <option value="Designer Sarees">Designer Sarees</option>
            <option value="Banarasi Silk Sarees">
              Banarasi Silk Sarees
            </option>
            <option value="Kerala Sarees">Kerala Sarees</option>
          </select>
        </div>

        {/* Minimum price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Minimum Price
          </label>

          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="₹0"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        {/* Maximum price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Maximum Price
          </label>

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="₹50,000"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Clear */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
        >
          <X size={16} />
          Clear Filters
        </button>
      </div>
    </div>
  );
}