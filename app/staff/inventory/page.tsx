"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  RefreshCw,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ProductVariant {
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes?: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
}

interface InventoryProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  variants: ProductVariant[];
  stock: number;
  isActive: boolean;
  updatedAt: string;
}

interface InventorySummary {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface InventoryResponse {
  success: boolean;
  inventory: InventoryProduct[];
  summary: InventorySummary;
  pagination: Pagination;
  message?: string;
}

type StockFilter =
  | "all"
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getStockStatus(stock: number) {
  if (stock <= 0) {
    return "out_of_stock";
  }

  if (stock <= 5) {
    return "low_stock";
  }

  return "in_stock";
}

function getStockLabel(stock: number) {
  if (stock <= 0) {
    return "Out of Stock";
  }

  if (stock <= 5) {
    return "Low Stock";
  }

  return "In Stock";
}

function getStockClasses(stock: number) {
  if (stock <= 0) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (stock <= 5) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default function StaffInventoryPage() {
  const router = useRouter();

  const [inventory, setInventory] = useState<
    InventoryProduct[]
  >([]);

  const [summary, setSummary] =
    useState<InventorySummary>({
      totalProducts: 0,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
    });

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [search, setSearch] = useState("");

  const [stockFilter, setStockFilter] =
    useState<StockFilter>("all");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const loadInventory = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/staff/login");
          return;
        }

        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", "20");

        const response = await fetch(
          `${API_URL}/staff/inventory?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data: InventoryResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load inventory"
          );
        }

        setInventory(data.inventory || []);

        setSummary(
          data.summary || {
            totalProducts: 0,
            inStock: 0,
            lowStock: 0,
            outOfStock: 0,
          }
        );

        setPagination(data.pagination || null);
      } catch (error) {
        console.error(
          "STAFF INVENTORY ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load inventory"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, router]
  );

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    setPage(1);
  }, [stockFilter]);

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventory.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.variants.some(
          (variant) =>
            variant.sku
              ?.toLowerCase()
              .includes(query) ||
            variant.name
              ?.toLowerCase()
              .includes(query)
        );

      if (!matchesSearch) {
        return false;
      }

      const currentStatus =
        getStockStatus(product.stock);

      if (stockFilter === "all") {
        return true;
      }

      return currentStatus === stockFilter;
    });
  }, [inventory, search, stockFilter]);

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setPage((current) => current - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setPage((current) => current + 1);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-8 w-52 rounded-lg bg-gray-200" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-28 rounded-2xl bg-gray-200" />
            <div className="h-28 rounded-2xl bg-gray-200" />
            <div className="h-28 rounded-2xl bg-gray-200" />
            <div className="h-28 rounded-2xl bg-gray-200" />
          </div>

          <div className="h-16 rounded-2xl bg-gray-200" />

          <div className="h-[500px] rounded-2xl bg-gray-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Boxes className="h-4 w-4" />
              Staff Panel
              <span>/</span>
              <span className="text-gray-800">
                Inventory
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Inventory
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Monitor product stock and inventory levels.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadInventory(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadInventory(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Products
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {summary.totalProducts}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* In stock */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  In Stock
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {summary.inStock}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Low stock */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Low Stock
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {summary.lowStock}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Out of stock */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Out of Stock
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {summary.outOfStock}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-3">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search product or SKU..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
              />
            </div>

            {/* Stock filter */}
            <select
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(
                  event.target.value as StockFilter
                )
              }
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none focus:border-gray-400 focus:bg-white"
            >
              <option value="all">
                All Stock
              </option>

              <option value="in_stock">
                In Stock
              </option>

              <option value="low_stock">
                Low Stock
              </option>

              <option value="out_of_stock">
                Out of Stock
              </option>
            </select>
          </div>
        </div>

        {/* Inventory table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Variants
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Updated
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredInventory.map(
                  (product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-gray-50/70"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>

                            <p className="mt-1 max-w-[220px] truncate text-xs text-gray-500">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Variants */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">
                            {product.variants.length}{" "}
                            {product.variants.length === 1
                              ? "variant"
                              : "variants"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {product.variants
                              .map(
                                (variant) =>
                                  variant.sku
                              )
                              .join(", ")}
                          </p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(
                            product.price
                          )}
                        </p>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <p className="text-lg font-semibold text-gray-900">
                          {product.stock}
                        </p>

                        <p className="text-xs text-gray-500">
                          units
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStockClasses(
                            product.stock
                          )}`}
                        >
                          {getStockLabel(
                            product.stock
                          )}
                        </span>
                      </td>

                      {/* Updated */}
                      <td className="px-5 py-4">
                        <p className="whitespace-nowrap text-sm text-gray-600">
                          {formatDate(
                            product.updatedAt
                          )}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/staff/inventory/${product._id}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-gray-100 md:hidden">
            {filteredInventory.map(
              (product) => (
                <div
                  key={product._id}
                  className="p-4"
                >
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {product.name}
                          </h3>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {product.slug}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${getStockClasses(
                            product.stock
                          )}`}
                        >
                          {getStockLabel(
                            product.stock
                          )}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">
                            Stock
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {product.stock} units
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Price
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {formatCurrency(
                              product.price
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/staff/inventory/${product._id}`
                          )
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                      >
                        <Eye className="h-4 w-4" />
                        View Inventory
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Empty */}
          {!filteredInventory.length && !error && (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-6 w-6 text-gray-400" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900">
                No inventory found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Try changing your search or stock filter.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination &&
            pagination.totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={
                      !pagination.hasNextPage
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </main>
  );
}