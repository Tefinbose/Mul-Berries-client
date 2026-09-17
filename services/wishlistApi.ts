import { apiRequest } from "./api";

export const getWishlistApi = (token: string) => {
  return apiRequest("/wishlist", {
    method: "GET",
    token,
  });
};

export const addToWishlistApi = (
  productId: string,
  token: string
) => {
  return apiRequest(`/wishlist/${productId}`, {
    method: "POST",
    token,
  });
};

export const removeFromWishlistApi = (
  productId: string,
  token: string
) => {
  return apiRequest(`/wishlist/${productId}`, {
    method: "DELETE",
    token,
  });
};

export const checkWishlistApi = (
  productId: string,
  token: string
) => {
  return apiRequest(`/wishlist/check/${productId}`, {
    method: "GET",
    token,
  });
};