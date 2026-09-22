import { apiRequest } from "./api";
import type { ApiProduct } from "@/lib/productMapper";

export interface ProductsResponse {
  success: boolean;
  count: number;
  products: ApiProduct[];
}

export interface ProductResponse {
  success: boolean;
  product: ApiProduct;
}

export const getProductsApi = (query = "") => {
  return apiRequest<ProductsResponse>(`/products${query}`);
};

export const getProductBySlugApi = (slug: string) => {
  return apiRequest<ProductResponse>(`/products/${slug}`);
};

export const createProductApi = (
  data: unknown,
  token: string
) => {
  return apiRequest("/products", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
};

export const updateProductApi = (
  id: string,
  data: unknown,
  token: string
) => {
  return apiRequest(`/products/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
};

export const deleteProductApi = (
  id: string,
  token: string
) => {
  return apiRequest(`/products/${id}`, {
    method: "DELETE",
    token,
  });
};