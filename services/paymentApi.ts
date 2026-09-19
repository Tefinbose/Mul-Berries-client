const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export interface CreateRazorpayOrderResponse {
  success: boolean;
  message: string;

  payment: {
    _id: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    status: string;
  };

  order: {
    _id: string;
    totalAmount: number;
  };

  keyId: string;
}

export interface VerifyRazorpayPaymentResponse {
  success: boolean;
  message: string;

  payment?: {
    _id: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    status: string;
    amount: number;
    currency: string;
  };

  order?: {
    _id: string;
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
  };
}

export const createRazorpayOrderApi =
  async (
    orderId: string,
    token: string
  ): Promise<CreateRazorpayOrderResponse> => {
    const response = await fetch(
      `${API_URL}/payments/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to create Razorpay order"
      );
    }

    return data;
  };

export const verifyRazorpayPaymentApi =
  async (
    paymentData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ): Promise<VerifyRazorpayPaymentResponse> => {
    const response = await fetch(
      `${API_URL}/payments/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          paymentData
        ),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Payment verification failed"
      );
    }

    return data;
  };