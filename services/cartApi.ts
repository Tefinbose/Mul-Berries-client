import { apiRequest } from "./api";

export const getCartApi = (token: string) => {
  return apiRequest("/cart", {
    method: "GET",
    token,
  });
};

export const addToCartApi = (
  data: {
    productId: string;
    variantId?: string;
    quantity: number;
  },
  token: string
) => {
  return apiRequest("/cart", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
};

export const updateCartItemApi = (
  productId: string,
  data: {
    quantity: number;
    variantId?: string;
  },
  token: string
) => {
  return apiRequest(`/cart/${productId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
};

export const removeFromCartApi = (
  productId: string,
  token: string
) => {
  return apiRequest(`/cart/${productId}`, {
    method: "DELETE",
    token,
  });
};

export const clearCartApi = (token: string) => {
  return apiRequest("/cart", {
    method: "DELETE",
    token,
  });
};