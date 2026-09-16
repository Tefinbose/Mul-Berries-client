"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";

import { getProductBySlug } from "@/lib/products";

type Variant = {
  id: string;
  color: string;
  size: string;
  price: string;
  stock: string;
};

export default function EditProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-neutral-50 p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-neutral-950">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            The product you are trying to edit does not exist.
          </p>

          <Link
            href="/admin/products"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return <EditProductForm product={product} />;
}

function EditProductForm({
  product,
}: {
  product: NonNullable<ReturnType<typeof getProductBySlug>>;
}) {
  const [productName, setProductName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);
  const [basePrice, setBasePrice] = useState(
    product.price.toString()
  );
  const [comparePrice, setComparePrice] = useState(
    product.comparePrice?.toString() ?? ""
  );

  const [variants, setVariants] = useState<Variant[]>(
    product.variants.map((variant) => ({
      id: variant.id,
      color: variant.color,
      size: variant.size,
      price: variant.price.toString(),
      stock: variant.stock.toString(),
    }))
  );

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      {
        id: `variant-${Date.now()}`,
        color: "",
        size: "Free Size",
        price: basePrice,
        stock: "",
      },
    ]);
  };

  const removeVariant = (id: string) => {
    if (variants.length === 1) return;

    setVariants((current) =>
      current.filter((variant) => variant.id !== id)
    );
  };

  const updateVariant = (
    id: string,
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

    const updatedProduct = {
      slug: product.slug,
      name: productName,
      category,
      description,
      price: Number(basePrice),
      comparePrice: comparePrice
        ? Number(comparePrice)
        : undefined,
      image: product.image,
      variants: variants.map((variant) => ({
        id: variant.id,
        color: variant.color,
        size: variant.size,
        price: Number(variant.price),
        stock: Number(variant.stock),
      })),
    };

    console.log("Updated product:", updatedProduct);

    alert(
      "Product updated successfully. Backend connection will be added later."
    );
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
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

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
                    setProductName(e.target.value)
                  }
                  required
                  className="h-11 w-full rounded-lg border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-950"
                />
              </div>

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
                    setCategory(e.target.value)
                  }
                  required
                  className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-neutral-950"
                >
                  <option value="Silk Sarees">
                    Silk Sarees
                  </option>

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
                    setDescription(e.target.value)
                  }
                  rows={5}
                  required
                  className="w-full resize-none rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-950"
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
                Update product pricing.
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
                    onChange={(e) =>
                      setBasePrice(e.target.value)
                    }
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
                    className="h-11 w-full rounded-lg border border-neutral-200 pl-9 pr-4 text-sm outline-none focus:border-neutral-950"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Current Image */}
          <section className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">
                Product Image
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Replace the current product image when image
                upload is connected.
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-5 rounded-xl border border-neutral-200 p-4">
                <div className="relative h-28 w-24 overflow-hidden rounded-lg bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    Current product image
                  </p>

                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-700 transition hover:border-neutral-950"
                  >
                    <ImagePlus size={15} />
                    Replace Image
                  </button>
                </div>
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
                  Update colors, sizes, prices and stock.
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
                        onClick={() =>
                          removeVariant(variant.id)
                        }
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
                        required
                        className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Actions */}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}