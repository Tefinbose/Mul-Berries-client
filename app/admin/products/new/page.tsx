"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Trash2,
} from "lucide-react";

import { API_URL } from "@/services/api";
import { getActiveCategoriesApi } from "@/services/categoryApi";

type Variant = {
  id: number;
  color: string;
  size: string;
  price: string;
  stock: string;
};

type CategoryOption = {
  _id: string;
  name: string;
};

type UploadedImage = {
  url: string;
  publicId: string;
};

export default function AddProductPage() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  useEffect(() => {
    getActiveCategoriesApi()
      .then((response) => {
        setCategories(
          response.categories.map(
            ({ _id, name }) => ({
              _id,
              name,
            })
          )
        );
      })
      .catch((loadError) => {
        console.error(
          "LOAD PRODUCT CATEGORIES ERROR:",
          loadError
        );

        setError(
          "Unable to load categories."
        );
      });
  }, []);

  // =====================================================
  // IMAGE SELECTION
  // =====================================================

  const handleImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    // Maximum 8 images
    if (selectedFiles.length > 8) {
      setError(
        "You can upload a maximum of 8 images."
      );
    } else {
      setError("");
    }

    // Validate images
    const validFiles = selectedFiles.filter(
      (file) => {
        const isImage =
          file.type.startsWith("image/");

        const isWithinSize =
          file.size <= 5 * 1024 * 1024;

        return isImage && isWithinSize;
      }
    );

    // Show error if some files are invalid
    if (
      validFiles.length !==
      selectedFiles.length
    ) {
      setError(
        "Only image files up to 5MB are allowed."
      );
    }

    // Take maximum 8
    const finalFiles =
      validFiles.slice(0, 8);

    // Revoke previous preview URLs
    imagePreviews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    // Store files
    setImageFiles(finalFiles);

    // Create previews
    const previews =
      finalFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setImagePreviews(previews);
  };

  // =====================================================
  // VARIANTS
  // =====================================================

  const [variants, setVariants] =
    useState<Variant[]>([
      {
        id: 1,
        color: "",
        size: "Free Size",
        price: "",
        stock: "",
      },
    ]);

  const addVariant = () => {
    setVariants((current) => [
      ...current,

      {
        id: Date.now(),
        color: "",
        size: "Free Size",
        price: "",
        stock: "",
      },
    ]);
  };

  const removeVariant = (id: number) => {
    if (variants.length === 1) {
      return;
    }

    setVariants((current) =>
      current.filter(
        (variant) => variant.id !== id
      )
    );
  };

  const updateVariant = (
    id: number,
    field: keyof Variant,
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

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // =================================================
      // AUTHENTICATION
      // =================================================

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      // =================================================
      // BASIC VALIDATION
      // =================================================

      if (imageFiles.length === 0) {
        throw new Error(
          "Please select at least one product image."
        );
      }

      if (!productName.trim()) {
        throw new Error(
          "Product name is required."
        );
      }

      if (!category) {
        throw new Error(
          "Please select a category."
        );
      }

      if (!description.trim()) {
        throw new Error(
          "Product description is required."
        );
      }

      if (!basePrice) {
        throw new Error(
          "Base price is required."
        );
      }

      // =================================================
      // CHECK API URL
      // =================================================

      if (!API_URL) {
        throw new Error(
          "API URL is not configured."
        );
      }

      // =================================================
      // STEP 1: CREATE FORMDATA
      // =================================================

      const formData = new FormData();

      imageFiles.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      // =================================================
      // STEP 2: UPLOAD IMAGES
      // =================================================

      /*
       * Your Express server:
       *
       * app.use("/api/uploads", uploadRoutes)
       *
       * uploadRoutes:
       *
       * router.post("/product-images", ...)
       *
       * Therefore:
       *
       * /api/uploads/product-images
       */

      const uploadUrl = API_URL.endsWith(
        "/api"
      )
        ? `${API_URL}/uploads/product-images`
        : `${API_URL}/api/uploads/product-images`;

      const uploadResponse =
        await fetch(uploadUrl, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        });

      // =================================================
      // READ RESPONSE SAFELY
      // =================================================

      let uploadData: {
        success?: boolean;
        message?: string;
        images?: UploadedImage[];
      };

      try {
        uploadData =
          await uploadResponse.json();
      } catch {
        throw new Error(
          `Image upload failed with status ${uploadResponse.status}`
        );
      }

      // =================================================
      // CHECK UPLOAD
      // =================================================

      if (
        !uploadResponse.ok ||
        !uploadData.success
      ) {
        throw new Error(
          uploadData.message ||
            `Failed to upload product images. Status: ${uploadResponse.status}`
        );
      }

      // =================================================
      // CHECK CLOUDINARY IMAGES
      // =================================================

      if (
        !uploadData.images ||
        uploadData.images.length === 0
      ) {
        throw new Error(
          "Cloudinary upload succeeded, but no image URLs were returned."
        );
      }

      // =================================================
      // GET IMAGE URLS
      // =================================================

      const imageUrls =
        uploadData.images.map(
          (image) => image.url
        );

      // =================================================
      // CREATE SLUG
      // =================================================

      const slug = productName
        .trim()
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /(^-|-$)/g,
          ""
        );

      // =================================================
      // PREPARE PRODUCT
      // =================================================

      const productPayload = {
        name: productName.trim(),

        slug,

        description:
          description.trim(),

        price: Number(basePrice),

        compareAtPrice:
          comparePrice
            ? Number(comparePrice)
            : undefined,

        category,

        images: imageUrls,

        variants: variants.map(
          (variant) => ({
            name:
              `${variant.color} ${variant.size}`.trim(),

            sku: `${slug}-${variant.id}`,

            price: Number(
              variant.price
            ),

            stock: Number(
              variant.stock
            ),

            attributes: {
              color:
                variant.color,

              size:
                variant.size,
            },
          })
        ),

        stock: variants.reduce(
          (
            total,
            variant
          ) =>
            total +
            Number(
              variant.stock || 0
            ),
          0
        ),

        isActive: true,
      };

      // =================================================
      // STEP 3: CREATE PRODUCT
      // =================================================

      const productUrl =
        API_URL.endsWith("/api")
          ? `${API_URL}/products`
          : `${API_URL}/api/products`;

      const productResponse =
        await fetch(productUrl, {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            productPayload
          ),
        });

      // =================================================
      // READ PRODUCT RESPONSE
      // =================================================

      let productData: {
        success?: boolean;
        message?: string;
      };

      try {
        productData =
          await productResponse.json();
      } catch {
        throw new Error(
          `Product creation failed with status ${productResponse.status}`
        );
      }

      // =================================================
      // CHECK PRODUCT CREATION
      // =================================================

      if (
        !productResponse.ok ||
        !productData.success
      ) {
        throw new Error(
          productData.message ||
            "Failed to create product"
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      window.location.href =
        "/admin/products";
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}

      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
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
                Add Product
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Create a new product for your store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}

          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Add the basic details of your product.
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
                  placeholder="Example: Royal Red Kanjivaram Silk Saree"
                  required
                  className="h-11 w-full rounded-lg border border-neutral-200 px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
                />
              </div>

              {/* Category */}

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-neutral-800"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  required
                  className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:border-neutral-950"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (option) => (
                      <option
                        key={option._id}
                        value={option._id}
                      >
                        {option.name}
                      </option>
                    )
                  )}
                </select>
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
                  placeholder="Write a detailed description of the product..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
                />
              </div>
            </div>
          </section>

          {/* Pricing */}

          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">
                Pricing
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Set the product pricing.
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
                    placeholder="8999"
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
                    placeholder="10999"
                    className="h-11 w-full rounded-lg border border-neutral-200 pl-9 pr-4 text-sm outline-none focus:border-neutral-950"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Product Images */}

          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">
                Product Images
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Upload product images to Cloudinary.
              </p>
            </div>

            <div className="p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={
                  handleImagesChange
                }
                className="hidden"
              />

              <div
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition hover:border-neutral-400"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <ImagePlus
                    size={22}
                    className="text-neutral-500"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-neutral-800">
                  Upload product images
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  PNG, JPG or WEBP • Maximum 5MB each
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    fileInputRef.current?.click();
                  }}
                  className="mt-4 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition hover:border-neutral-950"
                >
                  Choose Images
                </button>
              </div>

              {/* Image Previews */}

              {imagePreviews.length >
                0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {imagePreviews.map(
                    (
                      preview,
                      index
                    ) => (
                      <img
                        key={preview}
                        src={preview}
                        alt={`Product preview ${
                          index + 1
                        }`}
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Variants */}

          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-neutral-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-neutral-950">
                  Product Variants
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Add colors, sizes, prices and stock.
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

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                              e.target
                                .value
                            )
                          }
                          placeholder="Red"
                          required
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
                              e.target
                                .value
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
                              e.target
                                .value
                            )
                          }
                          placeholder="8999"
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
                              e.target
                                .value
                            )
                          }
                          placeholder="10"
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

          {/* Actions */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            {error && (
              <p className="mr-auto text-sm text-red-600">
                {error}
              </p>
            )}

            <Link
              href="/admin/products"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-neutral-950 px-7 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}