const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mull-berries-server.onrender.com/api";

export interface Address {
  _id: string;
  user: string;

  name: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string;
  landmark?: string;

  city: string;
  state: string;
  pincode: string;
  country: string;

  type: "home" | "work" | "other";
  isDefault: boolean;

  createdAt?: string;
  updatedAt?: string;
}

interface AddressResponse {
  success: boolean;
  message?: string;
  address?: Address;
}

interface AddressesResponse {
  success: boolean;
  message?: string;
  addresses: Address[];
}

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getAddressesApi = async (
  token: string
): Promise<AddressesResponse> => {
  const response = await fetch(
    `${API_URL}/addresses`,
    {
      method: "GET",
      headers: authHeaders(token),
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to load addresses"
    );
  }

  return data;
};

export const createAddressApi = async (
  address: Omit<Address, "_id" | "user" | "createdAt" | "updatedAt">
    ,
  token: string
): Promise<AddressResponse> => {
  const response = await fetch(
    `${API_URL}/addresses`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(address),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to create address"
    );
  }

  return data;
};

export const updateAddressApi = async (
  id: string,
  address: Partial<Address>,
  token: string
): Promise<AddressResponse> => {
  const response = await fetch(
    `${API_URL}/addresses/${id}`,
    {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(address),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to update address"
    );
  }

  return data;
};

export const deleteAddressApi = async (
  id: string,
  token: string
) => {
  const response = await fetch(
    `${API_URL}/addresses/${id}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to delete address"
    );
  }

  return data;
};

export const setDefaultAddressApi = async (
  id: string,
  token: string
) => {
  const response = await fetch(
    `${API_URL}/addresses/${id}/default`,
    {
      method: "PATCH",
      headers: authHeaders(token),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Failed to set default address"
    );
  }

  return data;
};