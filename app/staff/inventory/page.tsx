"use client";

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Boxes,
  CheckCircle2,
  Eye,
  Package,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Product = {
  _id: string;
  name?: string;
  slug?: string;
  sku?: string;
  stock?: number;
  price?: number;
  isActive?: boolean;
  images?: string[];
  image?: string;
  category?: {
    _id?: string;
    name?: string;
  } | null;
  brand?: {
    _id?: string;
    name?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
};

type InventoryListResponse = {
  success: boolean;
  products?: Product[];
  inventory?: Product[];
  data?: Product[];
  total?: number;
  message?: string;
};

type InventoryDetailsResponse = {
  success: boolean;
  product?: Product;
  inventory?: Product;
  data?: Product;
  message?: string;
};

type InventoryUpdateResponse = {
  success: boolean;
  product?: Product;
  inventory?: Product;
  data?: Product;
  message?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const LOW_STOCK_LIMIT = 10;

const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};

const parseJsonResponse = async <T,>(
  response: Response
): Promise<T> => {
  const text = await response.text();

  if (!text) {
    throw new Error(
      `Empty server response. Status: ${response.status}`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Invalid server response. Status: ${response.status}`
    );
  }
};

export default function StaffInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [stockFilter, setStockFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 10;

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [updatingStock, setUpdatingStock] =
    useState(false);

  const [stockMessage, setStockMessage] =
    useState("");

  const [stockInput, setStockInput] =
    useState("");

  const [stockAdjustment, setStockAdjustment] =
    useState<"increase" | "decrease">(
      "increase"
    );

  /* =========================================================
     FETCH INVENTORY
  ========================================================= */

  const fetchInventory = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/staff/inventory`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load inventory. Status: ${response.status}`
        );
      }

      const data =
        await parseJsonResponse<InventoryListResponse>(
          response
        );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load inventory."
        );
      }

      const inventory =
        data.products ||
        data.inventory ||
        data.data ||
        [];

      setProducts(inventory);
    } catch (error) {
      console.error(
        "STAFF INVENTORY ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load inventory."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  /* =========================================================
     FETCH PRODUCT DETAILS
  ========================================================= */

  const fetchProductDetails = async (
    productId: string
  ) => {
    try {
      setDetailsLoading(true);
      setStockMessage("");

      const token = getToken();

      if (!token) {
        setStockMessage(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/staff/inventory/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load product details. Status: ${response.status}`
        );
      }

      const data =
        await parseJsonResponse<InventoryDetailsResponse>(
          response
        );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load product details."
        );
      }

      const product =
        data.product ||
        data.inventory ||
        data.data;

      if (!product) {
        throw new Error(
          "Product details not found."
        );
      }

      setSelectedProduct(product);

      setStockInput(
        String(product.stock ?? 0)
      );
    } catch (error) {
      console.error(
        "INVENTORY DETAILS ERROR:",
        error
      );

      setStockMessage(
        error instanceof Error
          ? error.message
          : "Failed to load product details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  /* =========================================================
     OPEN PRODUCT
  ========================================================= */

  const openProduct = async (
    product: Product
  ) => {
    setSelectedProduct(product);

    setStockInput(
      String(product.stock ?? 0)
    );

    setStockMessage("");

    await fetchProductDetails(
      product._id
    );
  };

  /* =========================================================
     CLOSE PRODUCT
  ========================================================= */

  const closeProduct = () => {
    setSelectedProduct(null);
    setStockMessage("");
    setStockInput("");
  };

  /* =========================================================
     UPDATE STOCK
  ========================================================= */

  const updateStock = async () => {
    if (!selectedProduct) {
      return;
    }

    const amount = Number(stockInput);

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      setStockMessage(
        "Enter a valid stock quantity."
      );
      return;
    }

    try {
      setUpdatingStock(true);
      setStockMessage("");

      const token = getToken();

      if (!token) {
        setStockMessage(
          "Authentication token not found."
        );
        return;
      }

      /*
       * The backend endpoint is:
       *
       * PATCH /api/staff/inventory/:id/stock
       *
       * We send the requested stock quantity.
       */

      const response = await fetch(
        `${API_URL}/staff/inventory/${selectedProduct._id}/stock`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock: amount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update stock. Status: ${response.status}`
        );
      }

      const data =
        await parseJsonResponse<InventoryUpdateResponse>(
          response
        );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to update stock."
        );
      }

      const updatedProduct =
        data.product ||
        data.inventory ||
        data.data;

      if (updatedProduct) {
        setSelectedProduct(
          updatedProduct
        );

        setStockInput(
          String(
            updatedProduct.stock ?? 0
          )
        );
      }

      setStockMessage(
        "Stock updated successfully."
      );

      await fetchInventory(true);
    } catch (error) {
      console.error(
        "UPDATE INVENTORY STOCK ERROR:",
        error
      );

      setStockMessage(
        error instanceof Error
          ? error.message
          : "Failed to update stock."
      );
    } finally {
      setUpdatingStock(false);
    }
  };

  /* =========================================================
     STOCK HELPERS
  ========================================================= */

  const getStock = (product: Product) => {
    const stock = Number(product.stock);

    return Number.isFinite(stock)
      ? stock
      : 0;
  };

  const getStockStatus = (
    product: Product
  ) => {
    const stock = getStock(product);

    if (stock <= 0) {
      return "out";
    }

    if (stock <= LOW_STOCK_LIMIT) {
      return "low";
    }

    return "healthy";
  };

  const getStockLabel = (
    product: Product
  ) => {
    const status =
      getStockStatus(product);

    if (status === "out") {
      return "Out of Stock";
    }

    if (status === "low") {
      return "Low Stock";
    }

    return "In Stock";
  };

  const getStockClasses = (
    product: Product
  ) => {
    const status =
      getStockStatus(product);

    switch (status) {
      case "out":
        return "border-red-100 bg-red-50 text-red-700";

      case "low":
        return "border-amber-100 bg-amber-50 text-amber-700";

      default:
        return "border-emerald-100 bg-emerald-50 text-emerald-700";
    }
  };

  /* =========================================================
     SEARCH + FILTER
  ========================================================= */

  const filteredProducts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return products.filter(
      (product) => {
        const name =
          product.name
            ?.toLowerCase() || "";

        const sku =
          product.sku
            ?.toLowerCase() || "";

        const category =
          product.category?.name
            ?.toLowerCase() || "";

        const matchesSearch =
          !query ||
          name.includes(query) ||
          sku.includes(query) ||
          category.includes(query);

        const stockStatus =
          getStockStatus(product);

        const matchesStock =
          stockFilter === "all" ||
          stockStatus === stockFilter;

        return (
          matchesSearch &&
          matchesStock
        );
      }
    );
  }, [
    products,
    search,
    stockFilter,
  ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    Math.ceil(
      filteredProducts.length /
        productsPerPage
    ),
    1
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    productsPerPage;

  const paginatedProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stockFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalProducts =
    products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + getStock(product),
    0
  );

  const lowStockProducts =
    products.filter(
      (product) =>
        getStockStatus(product) ===
        "low"
    ).length;

  const outOfStockProducts =
    products.filter(
      (product) =>
        getStockStatus(product) ===
        "out"
    ).length;

  /* =========================================================
     FORMATTERS
  ========================================================= */

  const formatCurrency = (
    value = 0
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(value);
  };

  const getProductImage = (
    product: Product
  ) => {
    return (
      product.images?.[0] ||
      product.image ||
      ""
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded bg-gray-200" />

            <div className="mt-2 h-4 w-72 rounded bg-gray-200" />

            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-2xl bg-gray-200"
                />
              ))}
            </div>

            <div className="mt-6 h-96 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Staff Operations
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Inventory
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Monitor stock levels and update
              product inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchInventory(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Failed to load inventory
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-gray-100 p-2.5">
                <Package className="h-5 w-5 text-gray-700" />
              </div>

              <span className="text-xs font-medium text-gray-400">
                Products
              </span>
            </div>

            <p className="mt-5 text-2xl font-semibold text-gray-900">
              {totalProducts}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Total products
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-2.5">
                <Boxes className="h-5 w-5 text-blue-600" />
              </div>

              <span className="text-xs font-medium text-gray-400">
                Units
              </span>
            </div>

            <p className="mt-5 text-2xl font-semibold text-gray-900">
              {totalStock}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Total stock units
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-2.5">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>

              <span className="text-xs font-medium text-gray-400">
                Attention
              </span>
            </div>

            <p className="mt-5 text-2xl font-semibold text-gray-900">
              {lowStockProducts}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Low stock products
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-red-50 p-2.5">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>

              <span className="text-xs font-medium text-gray-400">
                Critical
              </span>
            </div>

            <p className="mt-5 text-2xl font-semibold text-gray-900">
              {outOfStockProducts}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Out of stock
            </p>
          </div>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search product, SKU or category..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-gray-400"
              />
            </div>

            <select
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400"
            >
              <option value="all">
                All Stock
              </option>

              <option value="healthy">
                In Stock
              </option>

              <option value="low">
                Low Stock
              </option>

              <option value="out">
                Out of Stock
              </option>
            </select>
          </div>
        </div>

        {/* =================================================
            INVENTORY TABLE
        ================================================= */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* Desktop */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
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

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.length >
                0 ? (
                  paginatedProducts.map(
                    (product) => {
                      const stock =
                        getStock(product);

                      return (
                        <tr
                          key={product._id}
                          className="border-b border-gray-50 transition hover:bg-gray-50/50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                {getProductImage(
                                  product
                                ) ? (
                                  <img
                                    src={getProductImage(
                                      product
                                    )}
                                    alt={
                                      product.name ||
                                      "Product"
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                  {product.name ||
                                    "Unnamed Product"}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  {product.sku ||
                                    product._id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-600">
                              {product.category
                                ?.name ||
                                "Uncategorized"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-gray-800">
                              {formatCurrency(
                                product.price ||
                                  0
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-gray-900">
                              {stock}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStockClasses(
                                product
                              )}`}
                            >
                              {getStockLabel(
                                product
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                openProduct(
                                  product
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4" />
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-16 text-center"
                    >
                      <Boxes className="mx-auto h-10 w-10 text-gray-300" />

                      <p className="mt-4 text-sm font-semibold text-gray-700">
                        No inventory found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search
                        or stock filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}

          <div className="divide-y divide-gray-100 md:hidden">
            {paginatedProducts.length >
            0 ? (
              paginatedProducts.map(
                (product) => {
                  const stock =
                    getStock(product);

                  return (
                    <div
                      key={product._id}
                      className="p-5"
                    >
                      <div className="flex gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          {getProductImage(
                            product
                          ) ? (
                            <img
                              src={getProductImage(
                                product
                              )}
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {product.name ||
                                  "Unnamed Product"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {product.sku ||
                                  product._id}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStockClasses(
                                product
                              )}`}
                            >
                              {getStockLabel(
                                product
                              )}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-[11px] text-gray-400">
                                Stock
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {stock}
                              </p>
                            </div>

                            <div>
                              <p className="text-[11px] text-gray-400">
                                Price
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {formatCurrency(
                                  product.price ||
                                    0
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-[11px] text-gray-400">
                                Category
                              </p>

                              <p className="mt-1 truncate text-sm font-medium text-gray-700">
                                {product.category
                                  ?.name ||
                                  "—"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              openProduct(
                                product
                              )
                            }
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                            Manage Inventory
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="px-5 py-16 text-center">
                <Boxes className="mx-auto h-10 w-10 text-gray-300" />

                <p className="mt-4 text-sm font-semibold text-gray-700">
                  No inventory found
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search
                  or stock filter.
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {filteredProducts.length >
            0 && (
            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-700">
                  {Math.min(
                    startIndex +
                      productsPerPage,
                    filteredProducts.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {filteredProducts.length}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={
                    safeCurrentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          page - 1,
                          1
                        )
                    )
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="px-2 text-xs font-medium text-gray-500">
                  {safeCurrentPage} /{" "}
                  {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    safeCurrentPage >=
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          page + 1,
                          totalPages
                        )
                    )
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          INVENTORY DETAILS MODAL
      ===================================================== */}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">

            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Inventory Management
                </p>

                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  Product Stock
                </h2>
              </div>

              <button
                type="button"
                onClick={closeProduct}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6">

              {/* Product */}

              <div className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                  {getProductImage(
                    selectedProduct
                  ) ? (
                    <img
                      src={getProductImage(
                        selectedProduct
                      )}
                      alt={
                        selectedProduct.name ||
                        "Product"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-7 w-7 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900">
                    {selectedProduct.name ||
                      "Unnamed Product"}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    SKU:{" "}
                    {selectedProduct.sku ||
                      selectedProduct._id}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Category:{" "}
                    {selectedProduct
                      .category?.name ||
                      "Uncategorized"}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {formatCurrency(
                      selectedProduct.price ||
                        0
                    )}
                  </p>
                </div>
              </div>

              {/* Current Stock */}

              <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">
                      Current Stock
                    </p>

                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {getStock(
                        selectedProduct
                      )}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${getStockClasses(
                      selectedProduct
                    )}`}
                  >
                    {getStockLabel(
                      selectedProduct
                    )}
                  </span>
                </div>
              </div>

              {/* Update Stock */}

              <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                <p className="text-sm font-semibold text-gray-900">
                  Update Stock
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Set the new available stock quantity
                  for this product.
                </p>

                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-600">
                    New Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stockInput}
                    onChange={(event) =>
                      setStockInput(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setStockAdjustment(
                        "increase"
                      )
                    }
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      stockAdjustment ===
                      "increase"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <ArrowUp className="h-4 w-4" />
                    Increase
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStockAdjustment(
                        "decrease"
                      )
                    }
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      stockAdjustment ===
                      "decrease"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <ArrowDown className="h-4 w-4" />
                    Decrease
                  </button>
                </div>

                <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
                  The backend will save the quantity
                  entered above as the product's
                  current stock.
                </div>

                <button
                  type="button"
                  onClick={updateStock}
                  disabled={updatingStock}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updatingStock ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Update Stock
                    </>
                  )}
                </button>

                {stockMessage && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <div className="flex items-start gap-2">
                      {stockMessage.includes(
                        "successfully"
                      ) ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      )}

                      <p
                        className={`text-sm ${
                          stockMessage.includes(
                            "successfully"
                          )
                            ? "text-emerald-700"
                            : "text-red-700"
                        }`}
                      >
                        {stockMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Details Loading */}

              {detailsLoading && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading latest inventory...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}