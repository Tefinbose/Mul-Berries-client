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