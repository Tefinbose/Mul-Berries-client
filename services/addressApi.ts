import { apiRequest } from "./api";

export const getAddressesApi = (token: string) => {
  return apiRequest("/addresses", {
    method: "GET",
    token,
  });
};

export const getAddressByIdApi = (
  id: string,
  token: string
) => {
  return apiRequest(`/addresses/${id}`, {
    method: "GET",
    token,
  });
};

export const createAddressApi = (
  data: unknown,
  token: string
) => {
  return apiRequest("/addresses", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
};

export const updateAddressApi = (
  id: string,
  data: unknown,
  token: string
) => {
  return apiRequest(`/addresses/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
};

export const setDefaultAddressApi = (
  id: string,
  token: string
) => {
  return apiRequest(`/addresses/${id}/default`, {
    method: "PATCH",
    token,
  });
};

export const deleteAddressApi = (
  id: string,
  token: string
) => {
  return apiRequest(`/addresses/${id}`, {
    method: "DELETE",
    token,
  });
};