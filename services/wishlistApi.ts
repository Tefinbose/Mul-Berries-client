import { apiRequest } from "./api";

export interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  images?: string[];
  category?: {
    name?: string;
    slug?: string;
  } | string;
}

export interface WishlistResponse {
  success: boolean;
  message?: string;
  wishlist?: {
    products: WishlistProduct[];
  };
}

export const getWishlistApi = (token: string) => {
  return apiRequest<WishlistResponse>("/wishlist", {
    method: "GET",
    token,
  });
};

export const addToWishlistApi = (
  productId: string,
  token: string
) => {
  return apiRequest<WishlistResponse>(`/wishlist/${productId}`, {
    method: "POST",
    token,
  });
};

export const removeFromWishlistApi = (
  productId: string,
  token: string
) => {
  return apiRequest<WishlistResponse>(`/wishlist/${productId}`, {
    method: "DELETE",
    token,
  });
};

export const checkWishlistApi = (
  productId: string,
  token: string
) => {
  return apiRequest<{
    success: boolean;
    inWishlist: boolean;
  }>(`/wishlist/check/${productId}`, {
    method: "GET",
    token,
  });
};