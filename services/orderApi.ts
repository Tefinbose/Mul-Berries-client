import { apiRequest } from "./api";

export const createOrderApi = (
  data: unknown,
  token: string
) => {
  return apiRequest("/orders", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
};

export const createGuestOrderApi = (data: unknown) => {
  return apiRequest("/orders/guest", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getGuestOrderByIdApi = (id: string) => {
  return apiRequest(`/orders/guest/${id}`, {
    method: "GET",
  });
};

export const getMyOrdersApi = (token: string) => {
  return apiRequest("/orders", {
    method: "GET",
    token,
  });
};

export const getMyOrderByIdApi = (
  id: string,
  token: string
) => {
  return apiRequest(`/orders/${id}`, {
    method: "GET",
    token,
  });
};

export const cancelOrderApi = (
  id: string,
  token: string
) => {
  return apiRequest(`/orders/${id}/cancel`, {
    method: "PATCH",
    token,
  });
};