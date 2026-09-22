import type { Product, ProductVariant } from "./products";

export type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category?: {
    name?: string;
    slug?: string;
  } | string;
  images?: string[];
  variants?: Array<{
    sku: string;
    name: string;
    price?: number;
    stock: number;
    attributes?: Record<string, string>;
  }>;
  stock: number;
};

export function mapApiProduct(product: ApiProduct): Product {
  const variants: ProductVariant[] = (product.variants || []).map(
    (variant) => ({
      id: variant.sku,
      sku: variant.sku,
      color: variant.attributes?.color || variant.name,
      size: variant.attributes?.size || "Free Size",
      price: variant.price ?? product.price,
      stock: variant.stock,
    })
  );

  const category =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || product.category?.slug || "Uncategorized";

  return {
    _id: product._id,
    slug: product.slug,
    name: product.name,
    category,
    price: product.price,
    stock: product.stock,
    comparePrice: product.compareAtPrice,
    image: product.images?.[0] || "/products/placeholder.jpg",
    description: product.description,
    variants,
  };
}