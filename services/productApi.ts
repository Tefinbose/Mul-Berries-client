import { apiRequest } from "./api";

export const getProductsApi = (query = "") => {
  return apiRequest(`/products${query}`);
};

export const getProductBySlugApi = (slug: string) => {
  return apiRequest(`/products/${slug}`);
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