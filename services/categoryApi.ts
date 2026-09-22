import { apiRequest } from "./api";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export interface CategoriesResponse {
  success: boolean;
  count: number;
  categories: Category[];
}

export const getCategoriesApi = () => {
  return apiRequest<CategoriesResponse>("/categories");
};

export const getActiveCategoriesApi = () => {
  return apiRequest<CategoriesResponse>("/categories/active");
};

export const getCategoryByIdApi = (id: string) => {
  return apiRequest<{ success: boolean; category: Category }>(
    `/categories/id/${id}`
  );
};

export const getCategoryBySlugApi = (slug: string) => {
  return apiRequest<{ success: boolean; category: Category }>(
    `/categories/${slug}`
  );
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