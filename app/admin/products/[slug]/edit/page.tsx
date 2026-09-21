"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/* =========================================================
   TYPES
========================================================= */

type ProductCategory = {
  _id: string;
  name: string;
  slug: string;
};

type ProductVariant = {
  name: string;
  sku: string;
  price?: number;
  stock: number;
  attributes?: Record<string, string>;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  images: string[];
  variants: ProductVariant[];
  stock: number;
  isActive: boolean;
};

type VariantForm = {
  id: string;
  color: string;
  size: string;
  price: string;
  stock: string;
  sku: string;
};

/* =========================================================
   PAGE
========================================================= */

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : String(params.slug || "");

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =======================================================
     FETCH PRODUCT
  ======================================================= */

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(
            slug
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Product not found"
          );
        }

        setProduct(data.product);
      } catch (err) {
        console.error(
          "FETCH PRODUCT ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
          <div className="text-center">
            <Loader2
              size={32}
              className="mx-auto animate-spin text-neutral-700"
            />

            <p className="mt-4 text-sm text-neutral-500">
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !product) {
    return (
      <main className="min-h-screen bg-neutral-50 p-6">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle
                size={22}
                className="text-red-600"
              />
            </div>

            <h1 className="mt-4 text-xl font-semibold text-neutral-950">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {error ||
                "The product you are trying to edit does not exist."}
            </p>

            <Link
              href="/admin/products"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-medium text-white"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <EditProductForm
      product={product}
      saving={saving}
      setSaving={setSaving}
      success={success}
      setSuccess={setSuccess}
      setError={setError}
      error={error}
      router={router}
    />
  );
}

/* =========================================================
   EDIT FORM
========================================================= */

function EditProductForm({
  product,
  saving,
  setSaving,
  success,
  setSuccess,
  setError,
  error,
  router,
}: {
  product: Product;
  saving: boolean;
  setSaving: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  success: string;
  setSuccess: React.Dispatch<
    React.SetStateAction<string>
  >;
  setError: React.Dispatch<
    React.SetStateAction<string>
  >;
  error: string;
  router: ReturnType<typeof useRouter>;
}) {
  /* =======================================================
     FORM STATE
  ======================================================= */

  const [productName, setProductName] =
    useState(product.name);

  const [description, setDescription] =
    useState(product.description);

  const [basePrice, setBasePrice] =
    useState(product.price.toString());

  const [comparePrice, setComparePrice] =
    useState(
      product.compareAtPrice?.toString() || ""
    );

  /*
   * IMPORTANT:
   * Backend expects category ObjectId.
   *
   * We keep the real category ID here.
   */
  const [categoryId] =
    useState(product.category?._id || "");

  const [variants, setVariants] =
    useState<VariantForm[]>(
      (product.variants || []).map(
        (variant, index) => ({
          id: `variant-${index}-${variant.sku}`,
          color:
            variant.attributes?.color ||
            "",
          size:
            variant.attributes?.size ||
            variant.name ||
            "Free Size",
          price: String(
            variant.price ??
              product.price
          ),
          stock: String(
            variant.stock ?? 0
          ),
          sku:
            variant.sku ||
            `SKU-${index + 1}`,
        })
      )
    );

  /* =======================================================
     IF NO VARIANT EXISTS
  ======================================================= */

  useEffect(() => {
    if (variants.length === 0) {
      setVariants([
        {
          id: `variant-${Date.now()}`,
          color: "",
          size: "Free Size",
          price: basePrice,
          stock: "0",
          sku: "",
        },
      ]);
    }
  }, []);

  /* =======================================================
     ADD VARIANT
  ======================================================= */

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      {
        id: `variant-${Date.now()}`,
        color: "",
        size: "Free Size",
        price: basePrice,
        stock: "0",
        sku: "",
      },
    ]);
  };

  /* =======================================================
     REMOVE VARIANT
  ======================================================= */

  const removeVariant = (
    id: string
  ) => {
    if (variants.length === 1) {
      return;
    }

    setVariants((current) =>
      current.filter(
        (variant) =>
          variant.id !== id
      )
    );
  };

  /* =======================================================
     UPDATE VARIANT
  ======================================================= */

  const updateVariant = (
    id: string,
    field: keyof VariantForm,
    value: string
  ) => {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === id
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  /* =======================================================
     GET TOKEN
  ======================================================= */

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken")
    );
  };

  /* =======================================================
     SAVE PRODUCT
  ======================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!categoryId) {
      setError(
        "Product category is missing."
      );
      return;
    }

    if (!productName.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Product description is required."
      );
      return;
    }

    const numericBasePrice =
      Number(basePrice);

    if (
      !Number.isFinite(
        numericBasePrice
      ) ||
      numericBasePrice < 0
    ) {
      setError(
        "Please enter a valid product price."
      );
      return;
    }

    const numericComparePrice =
      comparePrice
        ? Number(comparePrice)
        : undefined;

    if (
      numericComparePrice !==
        undefined &&
      (!Number.isFinite(
        numericComparePrice
      ) ||
        numericComparePrice < 0)
    ) {
      setError(
        "Please enter a valid compare-at price."
      );
      return;
    }

    for (const variant of variants) {
      if (!variant.sku.trim()) {
        setError(
          "Every variant needs a SKU."
        );
        return;
      }

      if (
        !Number.isFinite(
          Number(variant.price)
        ) ||
        Number(variant.price) < 0
      ) {
        setError(
          "Every variant needs a valid price."
        );
        return;
      }

      if (
        !Number.isFinite(
          Number(variant.stock)
        ) ||
        Number(variant.stock) < 0
      ) {
        setError(
          "Every variant needs a valid stock quantity."
        );
        return;
      }
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );
        return;
      }

      /*
       * Calculate total stock from variants.
       */
      const totalStock =
        variants.reduce(
          (total, variant) =>
            total +
            Number(variant.stock || 0),
          0
        );

      /*
       * Convert our UI variant structure
       * back to the backend structure.
       */
      const backendVariants =
        variants.map((variant) => ({
          name:
            variant.size ||
            "Free Size",

          sku: variant.sku,

          price: Number(
            variant.price
          ),

          stock: Number(
            variant.stock
          ),

          attributes: {
            color:
              variant.color || "",
            size:
              variant.size ||
              "Free Size",
          },
        }));

      const payload = {
        name: productName.trim(),

        slug: product.slug,

        description:
          description.trim(),

        price:
          numericBasePrice,

        compareAtPrice:
          numericComparePrice,

        category:
          categoryId,

        images:
          product.images || [],

        variants:
          backendVariants,

        stock:
          totalStock,

        isActive:
          product.isActive,
      };

      console.log(
        "UPDATE PRODUCT PAYLOAD:",
        payload
      );

      const response = await fetch(
        `${API_URL}/products/${product._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update product"
        );
      }

      setSuccess(
        "Product updated successfully."
      );

      /*
       * Keep the user on the page briefly,
       * then return to products.
       */
      setTimeout(() => {
        router.push(
          "/admin/products"
        );

        router.refresh();
      }, 1000);
    } catch (err) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:border-neutral-950 hover:text-neutral-950"
              aria-label="Back to products"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
                Edit Product
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Update the details of your product.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-green-600"
            />

            <p className="text-sm font-medium text-green-800">
              {success}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Update the basic product information.
              </p>
            </div>

            <div className="space-y-5 p-6">
              {/* Product Name */}

              <div>
                <label
                  htmlFor="productName"
                  className="mb-2 block text-sm font-medium text-neutral-800"
                >
                  Product Name
                </label>

                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) =>
                    setProductName(
                      e.target.value
                    )
                  }
                  required
                  className="h-11 w-full rounded-lg border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-950"
                />
              </div>

              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Category
                </label>

                <div className="flex h-11 items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4">
                  <span className="text-sm text-neutral-800">
                    {product.category
                      ?.name ||
                      "Uncategorized"}
                  </span>

                  <span className="text-xs text-neutral-400">
                    Existing category
                  </span>
                </div>

                <p className="mt-2 text-xs text-neutral-500">
                  Category ID:{" "}
                  {categoryId}
                </p>
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-neutral-800"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={5}
                  required
                  className="w-full resize-none rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-950"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              PRICING
          ================================================= */}

          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">
                Pricing
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Update product pricing.
              </p>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              {/* Base Price */}

              <div>
                <label
                  htmlFor="basePrice"
                  className="mb-2 block text-sm font-medium text-neutral-800"
                >
                  Base Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                    ₹
                  </span>

                  <input
                    id="basePrice"
                    type="number"
                    min="0"
                    value={basePrice}
                    onChange={(e) =>
                      setBasePrice(
                        e.target.value
                      )
                    }
                    required
                    className="h-11 w-full rounded-lg border border-neutral-200 pl-9 pr-4 text-sm outline-none focus:border-neutral-950"
                  />
                </div>
              </div>

              {/* Compare Price */}

              <div>
                <label
                  htmlFor="comparePrice"
                  className="mb-2 block text-sm font-medium text-neutral-800"
                >
                  Compare-at Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                    ₹
                  </span>

                  <input
                    id="comparePrice"
                    type="number"
                    min="0"
                    value={comparePrice}
                    onChange={(e) =>
                      setComparePrice(
                        e.target.value
                      )
                    }
                    className="h-11 w-full rounded-lg border border-neutral-200 pl-9 pr-4 text-sm outline-none focus:border-neutral-950"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">
                Product Image
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Current product image.
              </p>
            </div>

            <div className="p-6">
              {product.images?.length >
              0 ? (
                <div className="flex items-center gap-5 rounded-xl border border-neutral-200 p-4">
                  <div className="relative h-28 w-24 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={
                        product.images[0]
                      }
                      alt={
                        product.name
                      }
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Current product image
                    </p>

                    <p className="mt-1 max-w-lg break-all text-xs text-neutral-400">
                      {
                        product
                          .images[0]
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center">
                  <ImagePlus
                    size={25}
                    className="mx-auto text-neutral-400"
                  />

                  <p className="mt-2 text-sm text-neutral-500">
                    No product image available.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              VARIANTS
          ================================================= */}

          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-neutral-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-neutral-950">
                  Product Variants
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Update colors, sizes, prices, SKUs and stock.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
              >
                <Plus size={16} />
                Add Variant
              </button>
            </div>

            <div className="space-y-4 p-6">
              {variants.map(
                (variant, index) => (
                  <div
                    key={variant.id}
                    className="rounded-xl border border-neutral-200 bg-neutral-50 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-800">
                        Variant{" "}
                        {index + 1}
                      </p>

                      {variants.length >
                        1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeVariant(
                              variant.id
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Remove variant"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                      {/* SKU */}

                      <div>
                        <label className="mb-2 block text-xs font-medium text-neutral-600">
                          SKU
                        </label>

                        <input
                          type="text"
                          value={
                            variant.sku
                          }
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "sku",
                              e.target.value
                            )
                          }
                          placeholder="RBS-001"
                          required
                          className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-950"
                        />
                      </div>

                      {/* Color */}

                      <div>
                        <label className="mb-2 block text-xs font-medium text-neutral-600">
                          Color
                        </label>

                        <input
                          type="text"
                          value={
                            variant.color
                          }
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "color",
                              e.target.value
                            )
                          }
                          placeholder="Royal Blue"
                          className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-950"
                        />
                      </div>

                      {/* Size */}

                      <div>
                        <label className="mb-2 block text-xs font-medium text-neutral-600">
                          Size
                        </label>

                        <select
                          value={
                            variant.size
                          }
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "size",
                              e.target.value
                            )
                          }
                          className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-950"
                        >
                          <option value="Free Size">
                            Free Size
                          </option>

                          <option value="S">
                            S
                          </option>

                          <option value="M">
                            M
                          </option>

                          <option value="L">
                            L
                          </option>

                          <option value="XL">
                            XL
                          </option>

                          <option value="XXL">
                            XXL
                          </option>
                        </select>
                      </div>

                      {/* Price */}

                      <div>
                        <label className="mb-2 block text-xs font-medium text-neutral-600">
                          Price
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={
                            variant.price
                          }
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "price",
                              e.target.value
                            )
                          }
                          required
                          className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-950"
                        />
                      </div>

                      {/* Stock */}

                      <div>
                        <label className="mb-2 block text-xs font-medium text-neutral-600">
                          Stock
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={
                            variant.stock
                          }
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "stock",
                              e.target.value
                            )
                          }
                          required
                          className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-950"
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* =================================================
              BOTTOM ACTIONS
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-7 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}