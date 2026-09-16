"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Trash2,
} from "lucide-react";

type Variant = {
  id: number;
  color: string;
  size: string;
  price: string;
  stock: string;
};

export default function AddProductPage() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");

  const [variants, setVariants] = useState<Variant[]>([
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
    if (variants.length === 1) return;

    setVariants((current) =>
      current.filter((variant) => variant.id !== id)
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
          ? { ...variant, [field]: value }
          : variant
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      productName,
      category,
      description,
      basePrice,
      comparePrice,
      variants,
    };

    console.log("Product data:", productData);

    alert(
      "Product form submitted. Backend connection will be added later."
    );
  };

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
        <form onSubmit={handleSubmit} className="space-y-6">
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
              {/* Product name */}
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
                  onChange={(e) => setProductName(e.target.value)}
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
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:border-neutral-950"
                >
                  <option value="">Select category</option>
                  <option value="Silk Sarees">Silk Sarees</option>
                  <option value="Kanjivaram Sarees">
                    Kanjivaram Sarees
                  </option>
                  <option value="Banarasi Sarees">
                    Banarasi Sarees
                  </option>
                  <option value="Kerala Sarees">
                    Kerala Sarees
                  </option>
                  <option value="Designer Sarees">
                    Designer Sarees
                  </option>
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
                  onChange={(e) => setDescription(e.target.value)}
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
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="8999"
                    required
                    className="h-11 w-full rounded-lg border border-neutral-200 pl-9 pr-4 text-sm outline-none focus:border-neutral-950"
                  />
                </div>
              </div>

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
                      setComparePrice(e.target.value)
                    }
                    placeholder="10999"
                    className="h-11 w-full rounded-lg border border-neutral-200 pl-9 pr-4 text-sm outline-none focus:border-neutral-950"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Product Image */}
          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">
                Product Images
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Upload product images. Image upload will be connected
                to Cloudinary later.
              </p>
            </div>

            <div className="p-6">
              <div className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition hover:border-neutral-400">
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
                  PNG, JPG or WEBP
                </p>

                <button
                  type="button"
                  className="mt-4 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition hover:border-neutral-950"
                >
                  Choose Images
                </button>
              </div>
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
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-800">
                      Variant {index + 1}
                    </p>

                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove variant"
                      >
                        <Trash2 size={16} />
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
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "color",
                            e.target.value
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
                        value={variant.size}
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
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
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
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "price",
                            e.target.value
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
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "stock",
                            e.target.value
                          )
                        }
                        placeholder="10"
                        required
                        className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-neutral-950 px-7 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}