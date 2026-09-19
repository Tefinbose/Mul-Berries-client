import { apiRequest } from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  permissions?: string[];
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export const registerApi = (data: RegisterData) => {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginApi = (data: {
  email: string;
  password: string;
}) => {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getMeApi = (token: string) => {
  return apiRequest<{
    success: boolean;
    user: AuthUser;
  }>("/auth/me", {
    method: "GET",
    token,
  });
};