import { apiRequest } from "./api";

export const getCategoriesApi = () => {
  return apiRequest("/categories");
};

export const getActiveCategoriesApi = () => {
  return apiRequest("/categories/active");
};

export const getCategoryByIdApi = (id: string) => {
  return apiRequest(`/categories/id/${id}`);
};

export const getCategoryBySlugApi = (slug: string) => {
  return apiRequest(`/categories/${slug}`);
};

export const createCategoryApi = (
  data: unknown,
  token: string
) => {
  return apiRequest("/categories", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
};

export const updateCategoryApi = (
  id: string,
  data: unknown,
  token: string
) => {
  return apiRequest(`/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
};

export const deleteCategoryApi = (
  id: string,
  token: string
) => {
  return apiRequest(`/categories/${id}`, {
    method: "DELETE",
    token,
  });
};