"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  X,
} from "lucide-react";

import { products } from "@/lib/products";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.category))];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const totalStock = product.variants.reduce(
        (total, variant) => total + variant.stock,
        0
      );

      let matchesStock = true;

      if (stockFilter === "In Stock") {
        matchesStock = totalStock > 5;
      }

      if (stockFilter === "Low Stock") {
        matchesStock = totalStock > 0 && totalStock <= 5;
      }

      if (stockFilter === "Out of Stock") {
        matchesStock = totalStock === 0;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [search, category, stockFilter]);

  const totalProducts = products.length;

  const totalStock = products.reduce((total, product) => {
    return (
      total +
      product.variants.reduce(
        (variantTotal, variant) => variantTotal + variant.stock,
        0
      )
    );
  }, 0);

  const lowStockProducts = products.filter((product) => {
    const stock = product.variants.reduce(
      (total, variant) => total + variant.stock,
      0
    );

    return stock > 0 && stock <= 5;
  }).length;

  const outOfStockProducts = products.filter((product) => {
    const stock = product.variants.reduce(
      (total, variant) => total + variant.stock,
      0
    );

    return stock === 0;
  }).length;

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setStockFilter("All");
  };

  const hasFilters =
    search !== "" || category !== "All" || stockFilter !== "All";

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
                Products
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Manage your product catalog and inventory.
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 lg:px-8">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Products"
            value={totalProducts}
            icon={<Package size={19} />}
          />

          <SummaryCard
            title="Total Stock"
            value={totalStock}
            icon={<Package size={19} />}
          />

          <SummaryCard
            title="Low Stock"
            value={lowStockProducts}
            icon={<AlertTriangle size={19} />}
          />

          <SummaryCard
            title="Out of Stock"
            value={outOfStockProducts}
            icon={<X size={19} />}
          />
        </div>

        {/* Filters */}
        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:border-neutral-950"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              ))}
            </select>

            {/* Stock */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:border-neutral-950"
            >
              <option value="All">All Stock</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {/* Clear */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-lg border border-neutral-200 px-4 text-sm font-medium text-neutral-600 transition hover:border-neutral-950 hover:text-neutral-950"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Products table */}
        <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-neutral-950">
                Product Catalog
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Product
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Category
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Price
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Stock
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const stock = product.variants.reduce(
                    (total, variant) => total + variant.stock,
                    0
                  );

                  return (
                    <tr
                      key={product.slug}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>

                          <div>
                            <p className="max-w-xs font-medium text-neutral-950">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-neutral-400">
                              {product.variants.length} variant
                              {product.variants.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-neutral-600">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-950">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>

                          {product.comparePrice &&
                            product.comparePrice > product.price && (
                              <p className="mt-1 text-xs text-neutral-400 line-through">
                                ₹
                                {product.comparePrice.toLocaleString("en-IN")}
                              </p>
                            )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <StockBadge stock={stock} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === product.slug
                                  ? null
                                  : product.slug
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
                            aria-label={`Actions for ${product.name}`}
                          >
                            <MoreHorizontal size={19} />
                          </button>

                          {openMenu === product.slug && (
                            <ActionMenu
                              productSlug={product.slug}
                              onClose={() => setOpenMenu(null)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-neutral-100 md:hidden">
            {filteredProducts.map((product) => {
              const stock = product.variants.reduce(
                (total, variant) => total + variant.stock,
                0
              );

              return (
                <div key={product.slug} className="p-5">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-neutral-950">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {product.category}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === product.slug
                                ? null
                                : product.slug
                            )
                          }
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
                          aria-label={`Actions for ${product.name}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-neutral-950">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>

                          <p className="mt-1 text-xs text-neutral-400">
                            {product.variants.length} variant
                            {product.variants.length !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <StockBadge stock={stock} />
                      </div>
                    </div>
                  </div>

                  {openMenu === product.slug && (
                    <div className="mt-4">
                      <ActionMenu
                        productSlug={product.slug}
                        onClose={() => setOpenMenu(null)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                <Search size={20} className="text-neutral-500" />
              </div>

              <h3 className="mt-4 font-medium text-neutral-950">
                No products found
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                Try changing your search or filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sm font-medium text-neutral-950 underline underline-offset-4"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ---------------------------------- */
/* Summary Card                       */
/* ---------------------------------- */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{title}</p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-neutral-950">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* Stock Badge                        */
/* ---------------------------------- */

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
        Out of stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
        {stock} left
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
      {stock} in stock
    </span>
  );
}

/* ---------------------------------- */
/* Action Menu                        */
/* ---------------------------------- */

function ActionMenu({
  productSlug,
  onClose,
}: {
  productSlug: string;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 top-10 z-20 w-40 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-lg md:w-44">
      <Link
        href={`/admin/products/${productSlug}/edit`}
        onClick={onClose}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
      >
        <Pencil size={15} />
        Edit product
      </Link>

      <button
        type="button"
        onClick={() => {
          onClose();
          alert("Delete functionality will be connected to the backend later.");
        }}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
      >
        <Trash2 size={15} />
        Delete product
      </button>
    </div>
  );
}