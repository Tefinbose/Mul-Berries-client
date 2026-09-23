"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

import {
  Search,
  Package,
  AlertTriangle,
  XCircle,
  IndianRupee,
  Plus,
  Minus,
  X,
  RefreshCw,
} from "lucide-react";

import { API_URL } from "@/services/api";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

type InventoryProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
};

type BackendProduct = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images?: string[];
  category?:
    | {
        _id?: string;
        name?: string;
        slug?: string;
      }
    | string
    | null;
  isActive?: boolean;
};

function getStockStatus(
  stock: number,
  threshold: number
): StockStatus {
  if (stock === 0) {
    return "Out of Stock";
  }

  if (stock <= threshold) {
    return "Low Stock";
  }

  return "In Stock";
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken")
  );
}

function mapBackendProduct(
  product: BackendProduct
): InventoryProduct {
  let category = "Uncategorized";

  if (typeof product.category === "string") {
    category = product.category;
  } else if (product.category?.name) {
    category = product.category.name;
  }

  return {
    id: product._id,
    slug: product.slug,
    name: product.name,
    category,
    image:
      product.images?.[0] ||
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
    price: Number(product.price) || 0,
    stock: Math.max(0, Number(product.stock) || 0),
    lowStockThreshold: 10,
    isActive: product.isActive !== false,
  };
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<
    InventoryProduct[]
  >([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | StockStatus
  >("All");

  const [selectedProduct, setSelectedProduct] =
    useState<InventoryProduct | null>(null);

  const [adjustmentAmount, setAdjustmentAmount] =
    useState(1);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  /*
   * --------------------------------
   * Fetch Inventory
   * --------------------------------
   */

  const fetchInventory = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          `${API_URL}/products`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch inventory"
          );
        }

        const products: BackendProduct[] =
          data?.products || data?.data || [];

        setInventory(
          products.map(mapBackendProduct)
        );
      } catch (err) {
        console.error("Inventory fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load inventory"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  /*
   * --------------------------------
   * Update Stock
   * --------------------------------
   */

  const updateStock = async (
    productId: string,
    amount: number
  ) => {
    const currentProduct = inventory.find(
      (product) => product.id === productId
    );

    if (!currentProduct) {
      return;
    }

    const newStock = Math.max(
      0,
      currentProduct.stock + amount
    );

    if (newStock === currentProduct.stock) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication required. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stock: newStock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update stock"
        );
      }

      const updatedProduct =
        data?.product || data?.data;

      if (updatedProduct) {
        setInventory((currentInventory) =>
          currentInventory.map((product) =>
            product.id === productId
              ? mapBackendProduct(updatedProduct)
              : product
          )
        );
      } else {
        /*
         * Fallback in case backend doesn't return
         * the updated product.
         */
        setInventory((currentInventory) =>
          currentInventory.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  stock: newStock,
                }
              : product
          )
        );
      }

      /*
       * Also update the selected product used
       * by the adjustment modal.
       */
      setSelectedProduct((current) => {
        if (!current || current.id !== productId) {
          return current;
        }

        return {
          ...current,
          stock: newStock,
        };
      });
    } catch (err) {
      console.error("Stock update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update stock"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * --------------------------------
   * Filters
   * --------------------------------
   */

  const filteredInventory = useMemo(() => {
    return inventory.filter((product) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.category
          .toLowerCase()
          .includes(searchText) ||
        product.slug
          .toLowerCase()
          .includes(searchText);

      const status = getStockStatus(
        product.stock,
        product.lowStockThreshold
      );

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inventory, search, statusFilter]);

  /*
   * --------------------------------
   * Statistics
   * --------------------------------
   */

  const totalProducts = inventory.length;

  const totalStock = inventory.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStockProducts = inventory.filter(
    (product) =>
      getStockStatus(
        product.stock,
        product.lowStockThreshold
      ) === "Low Stock"
  ).length;

  const outOfStockProducts = inventory.filter(
    (product) =>
      getStockStatus(
        product.stock,
        product.lowStockThreshold
      ) === "Out of Stock"
  ).length;

  const inventoryValue = inventory.reduce(
    (total, product) =>
      total + product.price * product.stock,
    0
  );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  /*
   * --------------------------------
   * Loading State
   * --------------------------------
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Monitor stock levels and manage product inventory.
          </p>
        </div>

        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-neutral-200 bg-white">
          <div className="text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-neutral-400" />

            <p className="mt-3 text-sm text-neutral-500">
              Loading inventory...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Monitor stock levels and manage product inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchInventory(true)}
          disabled={refreshing || saving}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Summary Cards */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          icon={Package}
        />

        <SummaryCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          icon={Package}
        />

        <SummaryCard
          title="Low Stock"
          value={lowStockProducts.toLocaleString()}
          icon={AlertTriangle}
        />

        <SummaryCard
          title="Out of Stock"
          value={outOfStockProducts.toLocaleString()}
          icon={XCircle}
        />
      </div>

      {/* Inventory Value */}

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
            <IndianRupee className="h-5 w-5 text-neutral-600" />
          </div>

          <div>
            <p className="text-sm text-neutral-500">
              Estimated Inventory Value
            </p>

            <p className="mt-1 text-xl font-semibold text-neutral-900">
              {formatPrice(inventoryValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
            />
          </div>

          {/* Status Filter */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "All"
                  | StockStatus
              )
            }
            className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">
              Out of Stock
            </option>
          </select>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}

      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-neutral-100 bg-neutral-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Stock
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Adjustment
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {filteredInventory.map((product) => {
                const status = getStockStatus(
                  product.stock,
                  product.lowStockThreshold
                );

                return (
                  <tr
                    key={product.id}
                    className="transition hover:bg-neutral-50"
                  >
                    {/* Product */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-11 overflow-hidden rounded-lg bg-neutral-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <p className="max-w-xs font-medium text-neutral-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}

                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {product.category}
                    </td>

                    {/* Price */}

                    <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                      {formatPrice(product.price)}
                    </td>

                    {/* Stock */}

                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          status === "Out of Stock"
                            ? "text-red-600"
                            : status === "Low Stock"
                            ? "text-yellow-600"
                            : "text-neutral-900"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <StockBadge status={status} />
                    </td>

                    {/* Adjustment */}

                    <td className="px-5 py-4">
                      <StockAdjustment
                        stock={product.stock}
                        disabled={saving}
                        onDecrease={() =>
                          updateStock(product.id, -1)
                        }
                        onIncrease={() =>
                          updateStock(product.id, 1)
                        }
                        onOpen={() => {
                          setSelectedProduct(product);
                          setAdjustmentAmount(1);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <EmptyState />
        )}
      </div>

      {/* Mobile Cards */}

      <div className="mt-6 space-y-4 lg:hidden">
        {filteredInventory.map((product) => {
          const status = getStockStatus(
            product.stock,
            product.lowStockThreshold
          );

          return (
            <div
              key={product.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-neutral-900">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    {product.category}
                  </p>

                  <p className="mt-2 font-semibold text-neutral-900">
                    {formatPrice(product.price)}
                  </p>

                  <div className="mt-2">
                    <StockBadge status={status} />
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-neutral-100 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500">
                      Current Stock
                    </p>

                    <p className="mt-1 text-lg font-semibold text-neutral-900">
                      {product.stock}
                    </p>
                  </div>

                  <StockAdjustment
                    stock={product.stock}
                    disabled={saving}
                    onDecrease={() =>
                      updateStock(product.id, -1)
                    }
                    onIncrease={() =>
                      updateStock(product.id, 1)
                    }
                    onOpen={() => {
                      setSelectedProduct(product);
                      setAdjustmentAmount(1);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filteredInventory.length === 0 && (
          <EmptyState />
        )}
      </div>

      {/* Stock Adjustment Modal */}

      {selectedProduct && (
        <StockAdjustmentModal
          product={selectedProduct}
          amount={adjustmentAmount}
          setAmount={setAdjustmentAmount}
          saving={saving}
          onClose={() => {
            if (!saving) {
              setSelectedProduct(null);
            }
          }}
          onSave={async (amount) => {
            await updateStock(
              selectedProduct.id,
              amount
            );

            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

/*
 * --------------------------------
 * Summary Card
 * --------------------------------
 */

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {title}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
          <Icon className="h-4 w-4 text-neutral-600" />
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
        {value}
      </p>
    </div>
  );
}

/*
 * --------------------------------
 * Stock Badge
 * --------------------------------
 */

function StockBadge({
  status,
}: {
  status: StockStatus;
}) {
  const styles = {
    "In Stock": "bg-green-50 text-green-700",
    "Low Stock": "bg-yellow-50 text-yellow-700",
    "Out of Stock": "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/*
 * --------------------------------
 * Stock Adjustment
 * --------------------------------
 */

function StockAdjustment({
  stock,
  disabled,
  onDecrease,
  onIncrease,
  onOpen,
}: {
  stock: number;
  disabled?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onDecrease}
        disabled={stock === 0 || disabled}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span className="min-w-8 text-center text-sm font-medium text-neutral-900">
        {stock}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onOpen}
        disabled={disabled}
        className="ml-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Adjust
      </button>
    </div>
  );
}

/*
 * --------------------------------
 * Stock Adjustment Modal
 * --------------------------------
 */

function StockAdjustmentModal({
  product,
  amount,
  setAmount,
  saving,
  onClose,
  onSave,
}: {
  product: InventoryProduct;
  amount: number;
  setAmount: (value: number) => void;
  saving: boolean;
  onClose: () => void;
  onSave: (amount: number) => void | Promise<void>;
}) {
  const [type, setType] = useState<"add" | "remove">(
    "add"
  );

  const finalAmount =
    type === "add" ? amount : -amount;

  const newStock = Math.max(
    0,
    product.stock + finalAmount
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-neutral-900">
              Adjust Stock
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {product.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100 disabled:opacity-50"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-5">
          {/* Current Stock */}

          <div className="rounded-xl bg-neutral-50 p-4">
            <p className="text-xs text-neutral-500">
              Current Stock
            </p>

            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              {product.stock}
            </p>
          </div>

          {/* Type */}

          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-neutral-700">
              Adjustment Type
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("add")}
                disabled={saving}
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  type === "add"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                Add Stock
              </button>

              <button
                type="button"
                onClick={() => setType("remove")}
                disabled={saving}
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  type === "remove"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                Remove Stock
              </button>
            </div>
          </div>

          {/* Quantity */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={amount}
              disabled={saving}
              onChange={(event) =>
                setAmount(
                  Math.max(
                    1,
                    Number(event.target.value) || 1
                  )
                )
              }
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 disabled:bg-neutral-50"
            />
          </div>

          {/* New Stock */}

          <div className="mt-5 rounded-xl border border-neutral-200 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">
                New Stock
              </span>

              <span className="font-semibold text-neutral-900">
                {newStock}
              </span>
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onSave(finalAmount)}
              disabled={saving}
              className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Adjustment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * --------------------------------
 * Empty State
 * --------------------------------
 */

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <Package className="mx-auto h-10 w-10 text-neutral-300" />

      <h3 className="mt-4 font-medium text-neutral-900">
        No products found
      </h3>

      <p className="mt-1 text-sm text-neutral-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}