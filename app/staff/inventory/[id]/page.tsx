"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  Boxes,
  Tag,
  Palette,
  Ruler,
} from "lucide-react";

import { API_URL } from "@/services/api";

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

interface ProductResponse {
  success: boolean;
  product: InventoryProduct;
  message?: string;
}

export default function StaffInventoryProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id as string;

  const [product, setProduct] = useState<InventoryProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [stockValue, setStockValue] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const token = getToken();

      if (!token) {
        router.push("/staff/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/staff/inventory/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: ProductResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load inventory product"
        );
      }

      setProduct(data.product);
      setStockValue(String(data.product.stock));
    } catch (err) {
      console.error("LOAD INVENTORY PRODUCT ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load inventory product"
      );
    } finally {
      setLoading(false);
    }
  }, [productId, router]);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId, loadProduct]);

  const handleStockUpdate = async () => {
    if (!product) return;

    setError("");
    setSuccessMessage("");

    const newStock = Number(stockValue);

    if (!Number.isInteger(newStock)) {
      setError("Stock must be a whole number.");
      return;
    }

    if (newStock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    if (newStock === product.stock) {
      setError("The stock value has not changed.");
      return;
    }

    try {
      setUpdating(true);

      const token = getToken();

      if (!token) {
        router.push("/staff/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/staff/inventory/${product._id}/stock`,
        {
          method: "PATCH",
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

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update stock"
        );
      }

      setSuccessMessage(
        data.message || "Stock updated successfully."
      );

      /*
       * Reload the product from the backend so the UI always
       * displays the actual database value.
       */
      await loadProduct();
    } catch (err) {
      console.error("UPDATE INVENTORY STOCK ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update stock"
      );
    } finally {
      setUpdating(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0) {
      return {
        label: "Out of stock",
        className:
          "bg-red-50 text-red-700 border-red-200",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low stock",
        className:
          "bg-amber-50 text-amber-700 border-amber-200",
      };
    }

    return {
      label: "In stock",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-80 rounded-2xl bg-white" />
            <div className="h-80 rounded-2xl bg-white lg:col-span-2" />
          </div>

          <div className="h-64 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => router.push("/staff/inventory")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </button>

          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Unable to load product
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={loadProduct}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => router.push("/staff/inventory")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Inventory
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Inventory Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View product inventory and update stock.
            </p>
          </div>

          <button
            onClick={loadProduct}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Stock updated
              </p>

              <p className="mt-1 text-sm text-emerald-700">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {error && product && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Update failed
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Product overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product image */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-square bg-slate-100">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-16 w-16 text-slate-300" />
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${stockStatus.className}`}
                >
                  {stockStatus.label}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {product.name}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                {product.slug}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">
                  Product price
                </span>

                <span className="text-lg font-bold text-slate-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Inventory summary */}
          <div className="space-y-6 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Stock */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <Boxes className="h-5 w-5 text-blue-600" />
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    Current
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {product.stock}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Product Stock
                </p>
              </div>

              {/* Variants */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                  <Tag className="h-5 w-5 text-purple-600" />
                </div>

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {product.variants?.length || 0}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Variants
                </p>
              </div>

              {/* Status */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <p className="mt-5 text-lg font-bold text-slate-900">
                  {stockStatus.label}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Inventory Status
                </p>
              </div>
            </div>

            {/* Update stock */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Update Stock
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the product stock value stored by the backend.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label
                    htmlFor="stock"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    New stock quantity
                  </label>

                  <input
                    id="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={stockValue}
                    onChange={(e) =>
                      setStockValue(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    placeholder="Enter stock quantity"
                  />
                </div>

                <button
                  onClick={handleStockUpdate}
                  disabled={updating}
                  className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update Stock
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs leading-5 text-slate-500">
                  Current backend stock:{" "}
                  <span className="font-semibold text-slate-800">
                    {product.stock}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Product Variants
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Variant-level SKU, pricing and stock information.
            </p>
          </div>

          {product.variants?.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Variant
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        SKU
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Price
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Attributes
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {product.variants.map((variant, index) => {
                      const variantStatus = getStockStatus(
                        variant.stock
                      );

                      return (
                        <tr
                          key={`${variant.sku}-${index}`}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-6 py-5">
                            <p className="font-semibold text-slate-900">
                              {variant.name}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700">
                              {variant.sku}
                            </span>
                          </td>

                          <td className="px-6 py-5 font-medium text-slate-900">
                            ₹
                            {variant.price.toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              {variant.attributes?.color && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                  <Palette className="h-3.5 w-3.5" />
                                  {variant.attributes.color}
                                </span>
                              )}

                              {variant.attributes?.size && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                  <Ruler className="h-3.5 w-3.5" />
                                  {variant.attributes.size}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="text-lg font-bold text-slate-900">
                              {variant.stock}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${variantStatus.className}`}
                            >
                              {variantStatus.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {product.variants.map((variant, index) => {
                  const variantStatus = getStockStatus(
                    variant.stock
                  );

                  return (
                    <div
                      key={`${variant.sku}-${index}`}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {variant.name}
                          </h3>

                          <p className="mt-1 font-mono text-xs text-slate-500">
                            {variant.sku}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${variantStatus.className}`}
                        >
                          {variantStatus.label}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">
                            Price
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            ₹
                            {variant.price.toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">
                            Stock
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {variant.stock}
                          </p>
                        </div>
                      </div>

                      {(variant.attributes?.color ||
                        variant.attributes?.size) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {variant.attributes?.color && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                              <Palette className="h-3.5 w-3.5" />
                              {variant.attributes.color}
                            </span>
                          )}

                          {variant.attributes?.size && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                              <Ruler className="h-3.5 w-3.5" />
                              {variant.attributes.size}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="p-10 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                No variants available
              </p>

              <p className="mt-1 text-sm text-slate-500">
                This product does not have any variants.
              </p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Product Information
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Product ID
              </p>

              <p className="mt-1 break-all font-mono text-xs text-slate-700">
                {product._id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Slug
              </p>

              <p className="mt-1 break-all text-sm text-slate-700">
                {product.slug}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Active Status
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {product.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDate(product.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}