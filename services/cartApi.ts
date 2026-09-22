import { apiRequest } from "./api";

export interface ApiCartItem {
  product:
    | string
    | {
        _id: string;
      };
  variantId?: string;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  cart?: {
    items: ApiCartItem[];
  };
}

export const getCartApi = (token: string) => {
  return apiRequest<CartResponse>("/cart", {
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
  return apiRequest<CartResponse>("/cart", {
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
  return apiRequest<CartResponse>(`/cart/${productId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
};

export const removeFromCartApi = (
  productId: string,
  token: string,
  variantId?: string
) => {
  const query = variantId
    ? `?variantId=${encodeURIComponent(variantId)}`
    : "";

  return apiRequest<CartResponse>(`/cart/${productId}${query}`, {
    method: "DELETE",
    token,
  });
};

export const clearCartApi = (token: string) => {
  return apiRequest<CartResponse>("/cart", {
    method: "DELETE",
    token,
  });
};