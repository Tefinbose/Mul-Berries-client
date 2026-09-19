"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  RefreshCw,
  Search,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import {
  getStaffInventoryApi,
  updateStaffInventoryStockApi,
  type StaffInventoryProduct,
  type StaffInventorySummary,
} from "@/services/staffApi";

type StockFilter = "all" | "out" | "low" | "in";

export default function StaffInventoryPage() {
  const [products, setProducts] = useState<StaffInventoryProduct[]>([]);
  const [summary, setSummary] = useState<StaffInventorySummary>({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] =
    useState<StockFilter>("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] =
    useState<string | null>(null);

  const [stockValue, setStockValue] = useState("");

  const [updatingStock, setUpdatingStock] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const loadInventory = useCallback(
    async (showRefresh = false) => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await getStaffInventoryApi(
          token,
          {
            search: search.trim(),
            stockStatus: stockFilter,
            page,
            limit: 20,
          }
        );

        setProducts(response.inventory);
        setSummary(response.summary);
        setTotalPages(
          Math.max(response.pagination.totalPages, 1)
        );
      } catch (err) {
        console.error("STAFF INVENTORY ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load inventory."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, stockFilter, page]
  );

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setPage(1);
  };

  const handleFilterChange = (
    filter: StockFilter
  ) => {
    setStockFilter(filter);
    setPage(1);
  };

  const startEditing = (
    product: StaffInventoryProduct
  ) => {
    setEditingProduct(product._id);
    setStockValue(String(product.stock));
    setSuccessMessage("");
    setError("");
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setStockValue("");
  };

  const handleUpdateStock = async (
    productId: string
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required.");
      return;
    }

    const numericStock = Number(stockValue);

    if (!Number.isInteger(numericStock)) {
      setError("Stock must be a whole number.");
      return;
    }

    if (numericStock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    try {
      setUpdatingStock(true);
      setError("");
      setSuccessMessage("");

      const response =
        await updateStaffInventoryStockApi(
          token,
          productId,
          numericStock
        );

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                stock: response.stock.current,
              }
            : product
        )
      );

      setSummary((currentSummary) => {
        const updatedProducts = products.map(
          (product) =>
            product._id === productId
              ? {
                  ...product,
                  stock: response.stock.current,
                }
              : product
        );

        return {
          ...currentSummary,
          inStock: updatedProducts.filter(
            (product) => product.stock > 10
          ).length,
          lowStock: updatedProducts.filter(
            (product) =>
              product.stock > 0 &&
              product.stock <= 10
          ).length,
          outOfStock: updatedProducts.filter(
            (product) => product.stock <= 0
          ).length,
        };
      });

      setEditingProduct(null);
      setStockValue("");

      setSuccessMessage(
        response.message || "Stock updated successfully."
      );

      await loadInventory(true);
    } catch (err) {
      console.error(
        "UPDATE STAFF INVENTORY ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update stock."
      );
    } finally {
      setUpdatingStock(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0) {
      return {
        label: "Out of stock",
        className:
          "border-red-200 bg-red-50 text-red-700",
        icon: XCircle,
      };
    }

    if (stock <= 10) {
      return {
        label: "Low stock",
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
        icon: TriangleAlert,
      };
    }

    return {
      label: "In stock",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    };
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* HEADER */}

      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Boxes
                  size={20}
                  className="text-neutral-700"
                />

                <h1 className="text-xl font-semibold tracking-tight text-neutral-950">
                  Inventory
                </h1>
              </div>

              <p className="mt-1 text-sm text-neutral-500">
                Monitor product stock and update inventory.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadInventory(true)}
              disabled={refreshing}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-neutral-300
                bg-white
                px-4
                text-sm
                font-medium
                text-neutral-800
                transition
                hover:border-neutral-900
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        {/* ALERTS */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>{error}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>{successMessage}</div>
          </div>
        )}

        {/* SUMMARY */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard
            title="Total Products"
            value={summary.totalProducts}
            icon={Package}
          />

          <SummaryCard
            title="In Stock"
            value={summary.inStock}
            icon={CheckCircle2}
          />

          <SummaryCard
            title="Low Stock"
            value={summary.lowStock}
            icon={TriangleAlert}
          />

          <SummaryCard
            title="Out of Stock"
            value={summary.outOfStock}
            icon={XCircle}
          />
        </section>

        {/* SEARCH + FILTER */}

        <section className="mt-5 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-xl"
            >
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-neutral-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search product or SKU..."
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-neutral-300
                    bg-white
                    pl-10
                    pr-3
                    text-sm
                    text-neutral-900
                    outline-none
                    transition
                    focus:border-neutral-900
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  ml-2
                  h-11
                  rounded-lg
                  bg-neutral-950
                  px-5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-neutral-800
                "
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={stockFilter === "all"}
                onClick={() =>
                  handleFilterChange("all")
                }
              >
                All
              </FilterButton>

              <FilterButton
                active={stockFilter === "in"}
                onClick={() =>
                  handleFilterChange("in")
                }
              >
                In Stock
              </FilterButton>

              <FilterButton
                active={stockFilter === "low"}
                onClick={() =>
                  handleFilterChange("low")
                }
              >
                Low Stock
              </FilterButton>

              <FilterButton
                active={stockFilter === "out"}
                onClick={() =>
                  handleFilterChange("out")
                }
              >
                Out of Stock
              </FilterButton>
            </div>
          </div>
        </section>

        {/* INVENTORY TABLE */}

        <section className="mt-5 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Loading inventory...
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
              <Boxes
                size={40}
                className="text-neutral-300"
              />

              <h2 className="mt-4 text-base font-semibold text-neutral-900">
                No products found
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Try changing your search or stock filter.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Product
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        SKU
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
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => {
                      const status =
                        getStockStatus(
                          product.stock
                        );

                      const StatusIcon =
                        status.icon;

                      const isEditing =
                        editingProduct ===
                        product._id;

                      return (
                        <tr
                          key={product._id}
                          className="border-b border-neutral-100 last:border-b-0"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <ProductImage
                                product={product}
                              />

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-neutral-900">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-xs text-neutral-500">
                                  {product.isActive
                                    ? "Active"
                                    : "Inactive"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-neutral-600">
                            {product.sku || "—"}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                            ₹
                            {Number(
                              product.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={stockValue}
                                onChange={(event) =>
                                  setStockValue(
                                    event.target.value
                                  )
                                }
                                className="
                                  h-9
                                  w-24
                                  rounded-md
                                  border
                                  border-neutral-300
                                  px-3
                                  text-sm
                                  outline-none
                                  focus:border-neutral-900
                                "
                              />
                            ) : (
                              <span className="text-sm font-semibold text-neutral-900">
                                {product.stock}
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                ${status.className}
                              `}
                            >
                              <StatusIcon size={13} />

                              {status.label}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateStock(
                                        product._id
                                      )
                                    }
                                    disabled={
                                      updatingStock
                                    }
                                    className="
                                      inline-flex
                                      h-9
                                      items-center
                                      gap-1.5
                                      rounded-md
                                      bg-neutral-950
                                      px-3
                                      text-xs
                                      font-medium
                                      text-white
                                      hover:bg-neutral-800
                                      disabled:opacity-50
                                    "
                                  >
                                    {updatingStock && (
                                      <Loader2
                                        size={13}
                                        className="animate-spin"
                                      />
                                    )}

                                    Save
                                  </button>

                                  <button
                                    type="button"
                                    onClick={
                                      cancelEditing
                                    }
                                    disabled={
                                      updatingStock
                                    }
                                    className="
                                      h-9
                                      rounded-md
                                      border
                                      border-neutral-300
                                      px-3
                                      text-xs
                                      font-medium
                                      text-neutral-700
                                      hover:border-neutral-900
                                    "
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    startEditing(
                                      product
                                    )
                                  }
                                  className="
                                    h-9
                                    rounded-md
                                    border
                                    border-neutral-300
                                    bg-white
                                    px-3
                                    text-xs
                                    font-medium
                                    text-neutral-800
                                    hover:border-neutral-900
                                  "
                                >
                                  Update Stock
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="divide-y divide-neutral-100 lg:hidden">
                {products.map((product) => {
                  const status =
                    getStockStatus(
                      product.stock
                    );

                  const StatusIcon =
                    status.icon;

                  const isEditing =
                    editingProduct ===
                    product._id;

                  return (
                    <div
                      key={product._id}
                      className="p-4"
                    >
                      <div className="flex gap-3">
                        <ProductImage
                          product={product}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-neutral-900">
                                {product.name}
                              </h3>

                              <p className="mt-1 text-xs text-neutral-500">
                                SKU:{" "}
                                {product.sku ||
                                  "—"}
                              </p>
                            </div>

                            <span
                              className={`
                                inline-flex
                                shrink-0
                                items-center
                                gap-1
                                rounded-full
                                border
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                ${status.className}
                              `}
                            >
                              <StatusIcon size={11} />

                              {status.label}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[11px] text-neutral-400">
                                Price
                              </p>

                              <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                                ₹
                                {Number(
                                  product.price
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-[11px] text-neutral-400">
                                Stock
                              </p>

                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={
                                    stockValue
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setStockValue(
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="
                                    mt-1
                                    h-9
                                    w-full
                                    rounded-md
                                    border
                                    border-neutral-300
                                    px-3
                                    text-sm
                                    outline-none
                                    focus:border-neutral-900
                                  "
                                />
                              ) : (
                                <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                                  {product.stock}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateStock(
                                      product._id
                                    )
                                  }
                                  disabled={
                                    updatingStock
                                  }
                                  className="
                                    inline-flex
                                    h-9
                                    items-center
                                    gap-1.5
                                    rounded-md
                                    bg-neutral-950
                                    px-3
                                    text-xs
                                    font-medium
                                    text-white
                                    disabled:opacity-50
                                  "
                                >
                                  {updatingStock && (
                                    <Loader2
                                      size={13}
                                      className="animate-spin"
                                    />
                                  )}

                                  Save
                                </button>

                                <button
                                  type="button"
                                  onClick={
                                    cancelEditing
                                  }
                                  disabled={
                                    updatingStock
                                  }
                                  className="
                                    h-9
                                    rounded-md
                                    border
                                    border-neutral-300
                                    px-3
                                    text-xs
                                    font-medium
                                    text-neutral-700
                                  "
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  startEditing(
                                    product
                                  )
                                }
                                className="
                                  h-9
                                  rounded-md
                                  border
                                  border-neutral-300
                                  px-3
                                  text-xs
                                  font-medium
                                  text-neutral-800
                                "
                              >
                                Update Stock
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* PAGINATION */}

        {!loading &&
          products.length > 0 &&
          totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(current - 1, 1)
                  )
                }
                className="
                  inline-flex
                  h-9
                  items-center
                  gap-1
                  rounded-md
                  border
                  border-neutral-300
                  px-3
                  text-xs
                  font-medium
                  text-neutral-700
                  hover:border-neutral-900
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronLeft size={14} />

                Previous
              </button>

              <span className="text-xs font-medium text-neutral-500">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      current + 1,
                      totalPages
                    )
                  )
                }
                className="
                  inline-flex
                  h-9
                  items-center
                  gap-1
                  rounded-md
                  border
                  border-neutral-300
                  px-3
                  text-xs
                  font-medium
                  text-neutral-700
                  hover:border-neutral-900
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Next

                <ChevronRight size={14} />
              </button>
            </div>
          )}
      </div>
    </main>
  );
}

/* ========================================================= */
/* SUMMARY CARD */
/* ========================================================= */

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-500">
          {title}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
          <Icon
            size={17}
            className="text-neutral-700"
          />
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-neutral-950">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/* ========================================================= */
/* FILTER BUTTON */
/* ========================================================= */

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-9
        rounded-lg
        border
        px-3
        text-xs
        font-medium
        transition
        ${
          active
            ? "border-neutral-950 bg-neutral-950 text-white"
            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900"
        }
      `}
    >
      {children}
    </button>
  );
}

/* ========================================================= */
/* PRODUCT IMAGE */
/* ========================================================= */

function ProductImage({
  product,
}: {
  product: StaffInventoryProduct;
}) {
  const image =
    product.images?.[0];

  if (!image) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
        <Package
          size={18}
          className="text-neutral-400"
        />
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={product.name}
      className="
        h-12
        w-12
        shrink-0
        rounded-lg
        border
        border-neutral-200
        object-cover
      "
    />
  );
}