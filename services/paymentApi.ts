import { apiRequest } from "./api";

export const createRazorpayOrderApi = (
  orderId: string,
  token: string
) => {
  return apiRequest("/payments/create-order", {
    method: "POST",
    token,
    body: JSON.stringify({
      orderId,
    }),
  });
};